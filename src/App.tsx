import { useState } from 'react';
import { NavTab, SessionConfig, UserProfile, VocabularyCategory, VocabularyItem, WordUserStatus } from './types';
import { StorageService } from './services/storage';
import { audioService } from './utils/audio';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { TopHeader } from './components/layout/TopHeader';
import { Dashboard } from './components/dashboard/Dashboard';
import { LearnPage } from './components/learn/LearnPage';
import { GamesPage } from './components/games/GamesPage';
import { VocabularyPage } from './components/vocabulary/VocabularyPage';
import { AchievementsPage } from './components/achievements/AchievementsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { LearningSession } from './components/session/LearningSession';
import { StreakModal } from './components/common/StreakModal';
import { SessionModal } from './components/learn/SessionModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [wordStatuses, setWordStatuses] = useState<Record<string, WordUserStatus>>(() =>
    StorageService.getWordStatuses()
  );
  const [achievements, setAchievements] = useState(() => StorageService.getAchievements());

  // Active Session state
  const [activeSessionConfig, setActiveSessionConfig] = useState<SessionConfig | null>(null);

  // Modals state
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [sessionModalCategory, setSessionModalCategory] = useState<VocabularyCategory | 'all' | null>(null);
  const [selectedWordDetail, setSelectedWordDetail] = useState<VocabularyItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync state whenever returning to views
  const refreshStorageData = () => {
    setProfile(StorageService.getProfile());
    setWordStatuses(StorageService.getWordStatuses());
    setAchievements(StorageService.getAchievements());
  };

  // Toggle favorite
  const handleToggleFavorite = (wordId: string) => {
    const updated = StorageService.toggleFavorite(wordId);
    setWordStatuses((prev) => ({
      ...prev,
      [wordId]: updated,
    }));
  };

  // Update profile
  const handleUpdateProfile = (newProfile: UserProfile) => {
    StorageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioService.setMuted(!next);
  };

  // Reset entire state
  const handleResetData = () => {
    StorageService.resetAll();
    refreshStorageData();
    setActiveTab('dashboard');
  };

  // Quick session launch from Dashboard
  const handleStartQuickSession = (category?: VocabularyCategory) => {
    if (category) {
      setSessionModalCategory(category);
    } else {
      setActiveSessionConfig({
        category: 'all',
        difficulty: 'all',
        exerciseType: 'mixed',
        questionCount: 10,
      });
    }
  };

  // If in an active learning session, render session full-screen
  if (activeSessionConfig) {
    return (
      <LearningSession
        config={activeSessionConfig}
        onExit={() => {
          setActiveSessionConfig(null);
          refreshStorageData();
        }}
        onGoVocabulary={() => {
          setActiveSessionConfig(null);
          refreshStorageData();
          setActiveTab('vocabulary');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FA] flex text-[#2D2D2D] font-sans antialiased selection:bg-purple-100">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onToggleSound={handleToggleSound}
        soundEnabled={soundEnabled}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header */}
        <TopHeader
          profile={profile}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
          onNavigateProfile={() => setActiveTab('profile')}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {activeTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              wordStatuses={wordStatuses}
              onStartQuickSession={handleStartQuickSession}
              onNavigateLearn={() => setActiveTab('learn')}
              onNavigateVocabulary={() => setActiveTab('vocabulary')}
              onOpenStreakModal={() => setIsStreakModalOpen(true)}
              onSelectWordDetail={(word) => {
                setSelectedWordDetail(word);
                setActiveTab('vocabulary');
              }}
            />
          )}

          {activeTab === 'learn' && (
            <LearnPage
              wordStatuses={wordStatuses}
              onStartSession={(cfg) => setActiveSessionConfig(cfg)}
            />
          )}

          {activeTab === 'games' && (
            <GamesPage
              onStartSession={(cfg) => setActiveSessionConfig(cfg)}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyPage
              wordStatuses={wordStatuses}
              onToggleFavorite={handleToggleFavorite}
              onStartSession={(cfg) => setActiveSessionConfig(cfg)}
              selectedWordFromState={selectedWordDetail}
              onClearSelectedWord={() => setSelectedWordDetail(null)}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsPage
              achievements={achievements}
              profile={profile}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              profile={profile}
              wordStatuses={wordStatuses}
              onUpdateProfile={handleUpdateProfile}
              onOpenStreakModal={() => setIsStreakModalOpen(true)}
              onResetData={handleResetData}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        currentTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Global Modals */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        profile={profile}
      />

      {sessionModalCategory && (
        <SessionModal
          isOpen={Boolean(sessionModalCategory)}
          onClose={() => setSessionModalCategory(null)}
          category={sessionModalCategory}
          onStartSession={(cfg) => {
            setSessionModalCategory(null);
            setActiveSessionConfig(cfg);
          }}
        />
      )}
    </div>
  );
}
