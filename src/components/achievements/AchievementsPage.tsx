import { Trophy, Flame, Zap, BookOpen, GraduationCap, Sparkles, Star, CheckCircle2, Lock } from 'lucide-react';
import { Achievement, UserProfile } from '../../types';

interface AchievementsPageProps {
  achievements: Achievement[];
  profile: UserProfile;
}

const ICON_MAP: Record<string, typeof Trophy> = {
  Trophy,
  Flame,
  Zap,
  BookOpen,
  GraduationCap,
  Sparkles,
  Star,
  CheckCircle2,
};

export function AchievementsPage({ achievements, profile }: AchievementsPageProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = Math.round((unlockedCount / Math.max(1, totalCount)) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12" id="achievements-view">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#ECEBF1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3.5 py-1.5 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] text-xs font-bold tracking-wide mb-3">
            Mural de Honra
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
            Conquistas & Troféus
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7C89] mt-1 max-w-xl">
            Cumpra desafios e metas de vocabulário para desbloquear medalhas exclusivas e bônus de XP.
          </p>
        </div>

        {/* Progress summary box */}
        <div className="p-4.5 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1] min-w-[220px]">
          <div className="flex justify-between items-center text-xs font-bold text-[#1F1F23] mb-2">
            <span>Desbloqueadas</span>
            <span className="text-[#8B5CF6]">{unlockedCount} de {totalCount}</span>
          </div>
          <div className="w-full h-2 bg-[#ECEBF1] rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-[#8B5CF6] rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-[#7E7C89] block text-right">
            {completionPercent}% completo
          </span>
        </div>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4" id="achievements-grid">
        {achievements.map((ach) => {
          const Icon = ICON_MAP[ach.icon] || Trophy;
          const progPercent = Math.min(100, Math.round((ach.progress / Math.max(1, ach.maxProgress)) * 100));

          return (
            <div
              key={ach.id}
              className={`relative rounded-[24px] p-5 sm:p-6 border transition-all flex items-start gap-4 ${
                ach.unlocked
                  ? 'bg-white border-[#ECEBF1] shadow-xs hover:border-[#8B5CF6] hover:shadow-md'
                  : 'bg-[#F8F7FA] border-[#ECEBF1] opacity-75'
              }`}
            >
              {/* Icon / Badge */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  ach.unlocked
                    ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-amber-500/20 ring-4 ring-amber-50'
                    : 'bg-[#ECEBF1] text-[#7E7C89]'
                }`}
              >
                {ach.unlocked ? <Icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={`text-base font-bold font-display truncate ${
                      ach.unlocked ? 'text-[#1F1F23]' : 'text-[#7E7C89]'
                    }`}
                  >
                    {ach.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      ach.unlocked
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-[#ECEBF1] text-[#7E7C89]'
                    }`}
                  >
                    +{ach.xpReward} XP
                  </span>
                </div>

                <p className="text-xs text-[#7E7C89] leading-relaxed">
                  {ach.description}
                </p>

                {/* Progress bar */}
                <div className="mt-3.5 pt-2 border-t border-[#ECEBF1]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#7E7C89] mb-1.5">
                    <span>
                      {ach.unlocked
                        ? 'Concluída!'
                        : `Progresso: ${ach.progress} / ${ach.maxProgress}`}
                    </span>
                    <span className={ach.unlocked ? 'text-emerald-600 font-bold' : 'text-[#7E7C89]'}>
                      {progPercent}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#ECEBF1] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ach.unlocked
                          ? 'bg-emerald-500'
                          : 'bg-[#8B5CF6]'
                      }`}
                      style={{ width: `${progPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
