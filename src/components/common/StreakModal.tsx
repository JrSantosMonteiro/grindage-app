import { Flame, X, Check, Calendar, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../../types';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export function StreakModal({ isOpen, onClose, profile }: StreakModalProps) {
  if (!isOpen) return null;

  // Day names for the last 7 days
  const today = new Date();
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 6;
    const isStudied = profile.studiedDates.includes(dateStr);
    return {
      dateStr,
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      isToday,
      isStudied,
    };
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#ECEBF1]"
          id="streak-modal-container"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#7E7C89] hover:text-[#1F1F23] hover:bg-[#F8F7FA] rounded-full transition-colors cursor-pointer"
            id="streak-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Animated Flame Icon */}
            <div className="relative mb-3.5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-400 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Flame className="w-11 h-11 text-white fill-current animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#8B5CF6] text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                x{profile.streakDays}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-[#1F1F23] font-display">
              {profile.streakDays} Dias de Sequência!
            </h3>
            <p className="text-sm text-[#7E7C89] mt-1 max-w-xs">
              Estude todos os dias para memorizar novas palavras com mais facilidade e manter sua chama acesa.
            </p>

            {/* 7-Day Visual Calendar */}
            <div className="w-full mt-6 p-4 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#1F1F23]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Últimos 7 dias
                </span>
                <span className="text-[#8B5CF6] font-bold">
                  {profile.studiedDates.length} dias ativos
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {last7Days.map((item) => (
                  <div
                    key={item.dateStr}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                      item.isStudied
                        ? 'bg-gradient-to-b from-orange-500 to-amber-500 text-white border-orange-400 shadow-xs'
                        : item.isToday
                        ? 'bg-white text-[#8B5CF6] border-dashed border-[#8B5CF6]'
                        : 'bg-white text-[#7E7C89] border-[#ECEBF1]'
                    }`}
                  >
                    <span className="text-[10px] font-medium opacity-90">{item.dayName}</span>
                    <span className="text-sm font-bold mt-0.5">{item.dayNum}</span>
                    <div className="mt-1">
                      {item.isStudied ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="block w-1.5 h-1.5 rounded-full bg-[#ECEBF1]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Motivation Info */}
            <div className="w-full mt-4 flex items-center justify-between p-3.5 bg-[#F8F7FA] rounded-2xl text-xs text-[#7E7C89] border border-[#ECEBF1]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#8B5CF6]" />
                <span>Melhor sequência histórica:</span>
              </div>
              <span className="font-bold text-[#1F1F23]">{profile.bestStreak} dias</span>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3.5 px-6 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-md shadow-purple-200/50 active:scale-[0.98] transition-all cursor-pointer"
              id="streak-modal-confirm-btn"
            >
              Continuar focado
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
