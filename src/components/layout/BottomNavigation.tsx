import { Home, BookOpen, Gamepad2, Bookmark, Trophy, User } from 'lucide-react';
import { AppLanguage, NavigationTab } from '../../types';
import { t } from '../../i18n/translations';

interface BottomNavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  appLang?: AppLanguage;
}

export function BottomNavigation({ currentTab, onSelectTab, appLang = 'pt' }: BottomNavigationProps) {
  const navItems: { tab: NavigationTab; key: string; icon: typeof Home }[] = [
    { tab: 'dashboard', key: 'nav.dashboard', icon: Home },
    { tab: 'learn', key: 'nav.learn', icon: BookOpen },
    { tab: 'games', key: 'nav.games', icon: Gamepad2 },
    { tab: 'vocabulary', key: 'nav.vocabulary', icon: Bookmark },
    { tab: 'achievements', key: 'nav.achievements', icon: Trophy },
    { tab: 'profile', key: 'nav.profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEBF1] px-2 py-2 flex items-center justify-around shadow-lg"
      id="mobile-bottom-navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => onSelectTab(item.tab)}
            id={`bottom-nav-${item.tab}`}
            className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-[#8B5CF6]' : 'text-[#7E7C89] hover:text-[#1F1F23]'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                isActive ? 'bg-[#F3F0FF] text-[#8B5CF6]' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                isActive ? 'font-bold text-[#8B5CF6]' : 'font-medium'
              }`}
            >
              {t(item.key, appLang)}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
