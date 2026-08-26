import {
  Home,
  BookOpen,
  Gamepad2,
  Bookmark,
  Trophy,
  User,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  profile: UserProfile;
  onOpenStreakModal: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  profile,
  onOpenStreakModal,
  onToggleSound,
  soundEnabled,
}: SidebarProps) {
  const navItems: { tab: NavigationTab; label: string; icon: typeof Home }[] = [
    { tab: 'dashboard', label: 'Início', icon: Home },
    { tab: 'learn', label: 'Aprender', icon: BookOpen },
    { tab: 'games', label: 'Jogos', icon: Gamepad2 },
    { tab: 'vocabulary', label: 'Meu Vocabulário', icon: Bookmark },
    { tab: 'achievements', label: 'Conquistas', icon: Trophy },
    { tab: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-64 bg-white border-r border-[#ECEBF1] p-6 h-screen sticky top-0 justify-between shrink-0 select-none"
      id="desktop-sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            G
          </div>
          <span className="text-xl font-bold tracking-tight text-[#8B5CF6]">Grindage</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2" id="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                id={`sidebar-nav-${item.tab}`}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#F3F0FF] text-[#8B5CF6] font-semibold'
                    : 'text-[#7E7C89] hover:bg-[#F8F7FA] font-medium'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-[#8B5CF6]' : 'text-[#7E7C89]'
                  }`}
                />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Status / Quick Streak & Sound Controls */}
        <div className="mt-auto pt-5 border-t border-[#ECEBF1] space-y-3">
          {/* Streak pill button */}
          <button
            onClick={onOpenStreakModal}
            id="sidebar-streak-button"
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FED7AA] transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-base">🔥</span>
              <div>
                <div className="text-xs font-bold text-[#1F1F23]">Sequência</div>
                <div className="text-[11px] text-[#7E7C89] font-medium">{profile.streakDays} dias seguidos</div>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200">
              {profile.streakDays}d
            </span>
          </button>

          {/* User Profile Info at Bottom */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-3 text-left group flex-1 min-w-0"
            >
              <div className="w-10 h-10 rounded-full bg-[#E5E4E9] overflow-hidden flex items-center justify-center text-lg shrink-0 border border-[#ECEBF1]">
                {profile.avatar}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-[#1F1F23] truncate group-hover:text-[#8B5CF6] transition-colors">
                  {profile.name}
                </span>
                <span className="text-xs text-[#8B5CF6] font-semibold">
                  Nível {profile.level} • {profile.levelTitle}
                </span>
              </div>
            </button>

            {/* Sound toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
              id="sidebar-sound-toggle"
              className="p-2 rounded-xl hover:bg-[#F8F7FA] text-[#7E7C89] hover:text-[#8B5CF6] transition-colors shrink-0"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#8B5CF6]" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
