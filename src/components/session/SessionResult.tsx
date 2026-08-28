import { useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, Home, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { AppLanguage, SessionResultStats } from '../../types';
import { audioService } from '../../utils/audio';
import { t } from '../../i18n/translations';

interface SessionResultProps {
  stats: SessionResultStats;
  onRestart: () => void;
  onGoHome: () => void;
  onGoVocabulary: () => void;
  appLang?: AppLanguage;
}

export function SessionResult({
  stats,
  onRestart,
  onGoHome,
  onGoVocabulary,
  appLang = 'pt',
}: SessionResultProps) {
  const accuracy = Math.min(100, Math.max(0, Math.round((stats.correctAnswers / Math.max(1, stats.totalQuestions)) * 100)));

  useEffect(() => {
    // Play celebratory audio fanfare
    audioService.playCompleteFanfare();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#A855F7', '#EC4899', '#3B82F6', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4 flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-xl shadow-purple-200/50 mb-4"
      >
        <Trophy className="w-10 h-10" />
      </motion.div>

      <h2 className="text-3xl font-bold text-[#1F1F23] font-display">
        {t('session.completeTitle', appLang)}
      </h2>
      <p className="text-sm text-[#7E7C89] mt-1 max-w-sm">
        {t('session.completeSub', appLang)}
      </p>

      {/* Main Success Badge */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="my-6 px-6 py-4 rounded-[24px] bg-[#7C3AED] text-white shadow-lg shadow-purple-200/50 flex items-center gap-3.5"
      >
        <div className="p-2.5 rounded-2xl bg-white/20">
          <Sparkles className="w-6 h-6 fill-current" />
        </div>
        <div className="text-left">
          <div className="text-xs font-semibold text-purple-100 uppercase tracking-wider">
            {t('session.practicedWords', appLang)}
          </div>
          <div className="text-2xl font-bold font-display">
            {stats.wordsPracticed.length} {t('dash.words', appLang)}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-[20px] bg-white border border-[#ECEBF1] shadow-xs">
          <div className="text-xs font-semibold text-[#7E7C89]">{t('session.correctRate', appLang)}</div>
          <div className="text-xl font-bold text-[#1F1F23] mt-0.5">
            {stats.correctAnswers} / {stats.totalQuestions}
          </div>
        </div>
        <div className="p-4 rounded-[20px] bg-white border border-[#ECEBF1] shadow-xs">
          <div className="text-xs font-semibold text-[#7E7C89]">{t('session.precision', appLang)}</div>
          <div className="text-xl font-bold text-[#7C3AED] mt-0.5">{accuracy}%</div>
        </div>
        <div className="p-4 rounded-[20px] bg-white border border-[#ECEBF1] shadow-xs">
          <div className="text-xs font-semibold text-[#7E7C89]">{t('session.comboMax', appLang)}</div>
          <div className="text-xl font-bold text-orange-500 mt-0.5 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 fill-current" />
            {stats.maxCombo}x
          </div>
        </div>
      </div>

      {/* Unlocked Achievements Toast if any */}
      {stats.unlockedAchievements && stats.unlockedAchievements.length > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full mb-6 p-4.5 rounded-[24px] bg-amber-50 border border-amber-200 text-left"
        >
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
            <Trophy className="w-4 h-4 text-amber-600" />
            Nova Conquista Desbloqueada!
          </div>
          {stats.unlockedAchievements.map((ach) => (
            <div key={ach.id} className="text-xs text-amber-800 font-semibold">
              🏆 {ach.title}
            </div>
          ))}
        </motion.div>
      )}

      {/* Practiced Words list */}
      <div className="w-full bg-white rounded-[28px] p-5 sm:p-6 border border-[#ECEBF1] shadow-xs text-left mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#7E7C89] uppercase tracking-wider">
            {t('session.practicedWords', appLang)} ({stats.wordsPracticed.length})
          </span>
          <button
            onClick={onGoVocabulary}
            className="text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
          >
            Ver no Vocabulário <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {stats.wordsPracticed.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F3F0FF] text-[#7C3AED] border border-purple-100 text-xs font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED]" />
              {item.word}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-200/50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('session.playAgain', appLang)}</span>
        </button>

        <button
          onClick={onGoHome}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#F8F7FA] hover:bg-[#ECEBF1] text-[#1F1F23] font-bold text-sm border border-[#ECEBF1] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t('session.backHome', appLang)}</span>
        </button>
      </div>
    </div>
  );
}
