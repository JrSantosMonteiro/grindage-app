import { Flame, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { UserProfile } from '../../types';
import { getLevelData } from '../../services/storage';

interface TopHeaderProps {
  profile: UserProfile;
  onOpenStreakModal: () => void;
  onNavigateProfile: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function TopHeader({
  profile,
  onOpenStreakModal,
  onNavigateProfile,
  soundEnabled,
  onToggleSound,
}: TopHeaderProps) {
  const levelData = getLevelData(profile.xp);

  return (
    <header
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#ECEBF1] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs"
      id="app-top-header"
    >
      {/* Left: Mobile Brand & Level Badge */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            G
          </div>
          <span className="font-bold text-lg text-[#8B5CF6] tracking-tight font-display">Grindage</span>
        </div>

        {/* Level badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#F3F0FF] border border-purple-100 text-xs font-semibold text-[#8B5CF6]">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <span>Nível {levelData.level} • {levelData.title}</span>
        </div>
      </div>

      {/* Right: Gamified Stats (XP, Streak, Sound, Profile) matching Sleek Interface pills */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Streak Pill */}
        <button
          onClick={onOpenStreakModal}
          id="top-header-streak-btn"
          className="bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-[#ECEBF1] flex items-center gap-2 shadow-sm hover:border-orange-300 transition-all active:scale-95 cursor-pointer"
          title="Ver sequência semanal"
        >
          <span className="text-orange-500 font-bold text-base sm:text-lg">🔥</span>
          <span className="font-bold text-xs sm:text-sm text-[#1F1F23]">{profile.streakDays} Dias</span>
        </button>

        {/* Total XP Pill */}
        <div className="bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-[#ECEBF1] flex items-center gap-2 shadow-sm font-bold text-xs sm:text-sm text-[#1F1F23]">
          <span className="text-[#8B5CF6] font-bold text-base sm:text-lg">✨</span>
          <span>{profile.xp.toLocaleString()} XP</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          id="top-header-sound-btn"
          className="p-2 rounded-2xl text-[#7E7C89] hover:text-[#8B5CF6] hover:bg-[#F8F7FA] border border-transparent hover:border-[#ECEBF1] transition-all"
          title={soundEnabled ? 'Desativar sons' : 'Ativar sons'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#8B5CF6]" /> : <VolumeX className="w-4 h-4 text-[#7E7C89]" />}
        </button>

        {/* User Avatar */}
        <button
          onClick={onNavigateProfile}
          id="top-header-profile-btn"
          className="flex items-center gap-2 p-1 rounded-2xl hover:bg-[#F8F7FA] border border-transparent hover:border-[#ECEBF1] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#E5E4E9] flex items-center justify-center text-sm shadow-2xs border border-[#ECEBF1]">
            {profile.avatar}
          </div>
          <span className="hidden lg:inline text-xs font-bold text-[#1F1F23]">
            {profile.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
