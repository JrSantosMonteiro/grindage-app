import { useState } from 'react';
import {
  Home,
  BookOpen,
  Gamepad2,
  Bookmark,
  Trophy,
  User,
  Volume2,
  VolumeX,
  Globe2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { AppLanguage, NavigationTab, StudyLanguage, UserProfile } from '../../types';
import { SUPPORTED_LANGUAGES, t } from '../../i18n/translations';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  profile: UserProfile;
  onOpenStreakModal: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onSwitchStudyLanguage: (lang: StudyLanguage) => void;
  onSwitchAppLanguage: (lang: AppLanguage) => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  profile,
  onOpenStreakModal,
  onToggleSound,
  soundEnabled,
  onSwitchStudyLanguage,
  onSwitchAppLanguage,
}: SidebarProps) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const appLang = profile.appLanguage || 'pt';
  const studyLang = profile.currentStudyLanguage || 'en';
  const currentStudyInfo = SUPPORTED_LANGUAGES[studyLang] || SUPPORTED_LANGUAGES.en;

  const navItems: { tab: NavigationTab; key: string; icon: typeof Home }[] = [
    { tab: 'dashboard', key: 'nav.dashboard', icon: Home },
    { tab: 'learn', key: 'nav.learn', icon: BookOpen },
    { tab: 'games', key: 'nav.games', icon: Gamepad2 },
    { tab: 'vocabulary', key: 'nav.vocabulary', icon: Bookmark },
    { tab: 'achievements', key: 'nav.achievements', icon: Trophy },
    { tab: 'profile', key: 'nav.profile', icon: User },
  ];

  const languagesList: StudyLanguage[] = ['en', 'es', 'fr', 'pt'];

  return (
    <aside
      className="hidden md:flex flex-col w-64 bg-white border-r border-[#ECEBF1] p-5 h-screen sticky top-0 justify-between shrink-0 select-none z-20"
      id="desktop-sidebar"
    >
      <div className="flex flex-col h-full min-h-0">
        {/* Brand Logo & Current Study Lang */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#7C3AED]">Grindage</span>
              <span className="text-[10px] text-[#7E7C89] font-medium tracking-wide">Multi-Language Vocab</span>
            </div>
          </div>
        </div>

        {/* Study Language Selector Card */}
        <div className="relative mb-5">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            id="sidebar-study-lang-selector"
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#F8F7FA] hover:bg-[#F3F0FF] border border-[#ECEBF1] hover:border-[#DDD6FE] transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl leading-none">{currentStudyInfo.flag}</span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider">
                  {t('lang.studying', appLang)}
                </div>
                <div className="text-xs font-bold text-[#1F1F23] truncate group-hover:text-[#7C3AED] transition-colors">
                  {currentStudyInfo.nativeName}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#7E7C89] transition-transform duration-200 ${showLangMenu ? 'rotate-180 text-[#7C3AED]' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showLangMenu && (
            <div
              id="sidebar-lang-dropdown"
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#ECEBF1] shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2.5 py-1 text-[10px] font-bold text-[#7E7C89] uppercase tracking-wider">
                {t('lang.changeStudy', appLang)}
              </div>

              {languagesList.map((langCode) => {
                const info = SUPPORTED_LANGUAGES[langCode];
                const isSelected = langCode === studyLang;
                const langProgress = profile.languagesProgress?.[langCode];

                return (
                  <button
                    key={langCode}
                    onClick={() => {
                      onSwitchStudyLanguage(langCode);
                      setShowLangMenu(false);
                    }}
                    id={`select-lang-${langCode}`}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F3F0FF] text-[#7C3AED] font-bold'
                        : 'hover:bg-[#F8F7FA] text-[#1F1F23] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{info.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-xs">{info.nativeName}</span>
                        <span className="text-[10px] text-[#7E7C89]">
                          Nível {langProgress?.level || 1} • {langProgress?.streakDays || 0}d
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-100 px-1.5 py-0.5 rounded-md">
                        Ativo
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-1.5 mt-1 border-t border-[#ECEBF1] px-2 text-[10px] text-[#7E7C89] leading-tight">
                {t('lang.separatedProgress', appLang)}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1" id="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                id={`sidebar-nav-${item.tab}`}
                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#F3F0FF] text-[#7C3AED] font-semibold shadow-xs'
                    : 'text-[#7E7C89] hover:bg-[#F8F7FA] font-medium'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-[#7C3AED]' : 'text-[#7E7C89]'
                  }`}
                />
                <span className="text-sm">{t(item.key, appLang)}</span>
              </button>
            );
          })}
        </nav>

        {/* User Status / Quick Streak & Sound Controls */}
        <div className="mt-auto pt-4 border-t border-[#ECEBF1] space-y-2.5">
          {/* Streak pill button */}
          <button
            onClick={onOpenStreakModal}
            id="sidebar-streak-button"
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-base">🔥</span>
              <div>
                <div className="text-xs font-bold text-[#1F1F23]">{t('dash.streak', appLang)}</div>
                <div className="text-[11px] text-[#7E7C89] font-medium">
                  {profile.streakDays} {t('dash.streakDays', appLang)} ({currentStudyInfo.nativeName})
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200 shadow-xs">
              {profile.streakDays}d
            </span>
          </button>

          {/* User Profile Info at Bottom */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2.5 text-left group flex-1 min-w-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#E5E4E9] overflow-hidden flex items-center justify-center text-base shrink-0 border border-[#ECEBF1]">
                {profile.avatar}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold tracking-tight text-[#1F1F23] truncate group-hover:text-[#7C3AED] transition-colors">
                  {profile.name}
                </span>
                <span className="text-[11px] text-[#7C3AED] font-semibold truncate">
                  {t('dash.level', appLang)} {profile.level} • {profile.levelTitle}
                </span>
              </div>
            </button>

            {/* Sound toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
              id="sidebar-sound-toggle"
              className="p-2 rounded-xl hover:bg-[#F8F7FA] text-[#7E7C89] hover:text-[#7C3AED] transition-colors shrink-0 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#7C3AED]" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
