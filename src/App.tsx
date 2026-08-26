import { useState } from 'react';
import { AppLanguage, NavTab, SessionConfig, StudyLanguage, UserProfile, VocabularyCategory, VocabularyItem, WordUserStatus } from './types';
import { StorageService } from './services/storage';
import { audioService } from './utils/audio';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
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

  const studyLang = profile.currentStudyLanguage || 'en';
  const appLang = profile.appLanguage || 'pt';

  // Sync state whenever returning to views or switching languages
  const refreshStorageData = () => {
    const updatedProfile = StorageService.getProfile();
    setProfile(updatedProfile);
    setWordStatuses(StorageService.getWordStatuses(updatedProfile.currentStudyLanguage));
    setAchievements(StorageService.getAchievements());
  };

  // Switch study language
  const handleSwitchStudyLanguage = (lang: StudyLanguage) => {
    const updated = StorageService.switchStudyLanguage(lang);
    setProfile(updated);
    setWordStatuses(StorageService.getWordStatuses(lang));
    setAchievements(StorageService.getAchievements());
  };

  // Switch UI app language
  const handleSwitchAppLanguage = (lang: AppLanguage) => {
    const updated = StorageService.switchAppLanguage(lang);
    setProfile(updated);
  };

  // Toggle favorite
  const handleToggleFavorite = (wordId: string) => {
    const updated = StorageService.toggleFavorite(wordId, studyLang);
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
        studyLanguage: studyLang,
      });
    }
  };

  // If in an active learning session, render session full-screen
  if (activeSessionConfig) {
    return (
      <LearningSession
        config={{
          ...activeSessionConfig,
          studyLanguage: activeSessionConfig.studyLanguage || studyLang,
        }}
        appLang={appLang}
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
        onSwitchStudyLanguage={handleSwitchStudyLanguage}
        onSwitchAppLanguage={handleSwitchAppLanguage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto pb-24 md:pb-12">
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
              onSwitchStudyLanguage={handleSwitchStudyLanguage}
              onSwitchAppLanguage={handleSwitchAppLanguage}
            />
          )}

          {activeTab === 'learn' && (
            <LearnPage
              wordStatuses={wordStatuses}
              onStartSession={(cfg) => setActiveSessionConfig(cfg)}
              studyLang={studyLang}
              appLang={appLang}
            />
          )}

          {activeTab === 'games' && (
            <GamesPage
              onStartSession={(cfg) => setActiveSessionConfig(cfg)}
              studyLang={studyLang}
              appLang={appLang}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyPage
              wordStatuses={wordStatuses}
              onToggleFavorite={handleToggleFavorite}
              onStartSession={(cfg) => setActiveSessionConfig(cfg)}
              selectedWordFromState={selectedWordDetail}
              onClearSelectedWord={() => setSelectedWordDetail(null)}
              studyLang={studyLang}
              appLang={appLang}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsPage
              achievements={achievements}
              profile={profile}
              appLang={appLang}
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
              onSwitchStudyLanguage={handleSwitchStudyLanguage}
              onSwitchAppLanguage={handleSwitchAppLanguage}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        appLang={appLang}
      />

      {/* Global Modals */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        profile={profile}
        appLang={appLang}
      />

      {sessionModalCategory && (
        <SessionModal
          isOpen={Boolean(sessionModalCategory)}
          onClose={() => setSessionModalCategory(null)}
          category={sessionModalCategory}
          studyLang={studyLang}
          appLang={appLang}
          onStartSession={(cfg) => {
            setSessionModalCategory(null);
            setActiveSessionConfig(cfg);
          }}
        />
      )}
    </div>
  );
}
