import { useState } from 'react';
import { X, Play, Zap, CheckCircle2, Layers, BookOpen, Shuffle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLanguage, DifficultyLevel, ExerciseType, SessionConfig, StudyLanguage, VocabularyCategory } from '../../types';
import { getCategoryMeta } from '../../data/categories';
import { SUPPORTED_LANGUAGES, t } from '../../i18n/translations';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: VocabularyCategory | 'all';
  onStartSession: (config: SessionConfig) => void;
  studyLang?: StudyLanguage;
  appLang?: AppLanguage;
}

export function SessionModal({
  isOpen,
  onClose,
  category,
  onStartSession,
  studyLang = 'en',
  appLang = 'pt',
}: SessionModalProps) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(10);

  if (!isOpen) return null;

  const categoryMeta = category !== 'all' ? getCategoryMeta(category, appLang) : null;
  const studyLangInfo = SUPPORTED_LANGUAGES[studyLang] || SUPPORTED_LANGUAGES.en;

  const handleStart = () => {
    onStartSession({
      category,
      difficulty,
      exerciseType,
      questionCount,
      studyLanguage: studyLang,
    });
  };

  const exerciseOptions: {
    type: ExerciseType;
    title: string;
    description: string;
    icon: typeof BookOpen;
    badge?: string;
  }[] = [
    {
      type: 'mixed',
      title: t('session.mixed', appLang),
      description: t('session.mixedDesc', appLang),
      icon: Shuffle,
      badge: '★',
    },
    {
      type: 'translation',
      title: t('session.trans', appLang),
      description: t('session.transDesc', appLang),
      icon: BookOpen,
    },
    {
      type: 'fill_expression',
      title: t('session.fill', appLang),
      description: t('session.fillDesc', appLang),
      icon: HelpCircle,
    },
    {
      type: 'match_pairs',
      title: t('session.pairs', appLang),
      description: t('session.pairsDesc', appLang),
      icon: Layers,
    },
    {
      type: 'synonym_antonym',
      title: t('session.synAnt', appLang),
      description: t('session.synAntDesc', appLang),
      icon: Zap,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#ECEBF1] max-h-[90vh] overflow-y-auto"
          id="session-config-modal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#7E7C89] hover:text-[#1F1F23] hover:bg-[#F8F7FA] rounded-full transition-colors cursor-pointer"
            id="session-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#F3F0FF] text-[#7C3AED] font-bold text-xs">
                {categoryMeta ? categoryMeta.name : t('learn.filterAll', appLang)}
              </span>
              <span className="text-xs text-[#7E7C89] font-medium">
                {studyLangInfo.flag} {studyLangInfo.nativeName}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#1F1F23] font-display">
              {categoryMeta
                ? `${t('learn.practice', appLang)}: ${categoryMeta.name}`
                : t('learn.quickSession', appLang)}
            </h2>
            <p className="text-xs sm:text-sm text-[#7E7C89] mt-1">
              {t('learn.subtitle', appLang)}
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. Dificuldade */}
            <div>
              <label className="block text-xs font-bold text-[#7E7C89] uppercase tracking-wider mb-2.5">
                {t('session.diffTitle', appLang)}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'all', label: t('session.diffAll', appLang) },
                  { id: 'basic', label: t('session.diffBasic', appLang) },
                  { id: 'intermediate', label: t('session.diffMedium', appLang) },
                  { id: 'advanced', label: t('session.diffAdvanced', appLang) },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id as DifficultyLevel | 'all')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                      difficulty === item.id
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                        : 'bg-[#F8F7FA] text-[#7E7C89] border-[#ECEBF1] hover:bg-[#F3F0FF] hover:text-[#7C3AED]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Tipo de exercício */}
            <div>
              <label className="block text-xs font-bold text-[#7E7C89] uppercase tracking-wider mb-2.5">
                {t('session.typeTitle', appLang)}
              </label>
              <div className="space-y-2">
                {exerciseOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = exerciseType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setExerciseType(opt.type)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F3F0FF] border-[#7C3AED]'
                          : 'bg-white border-[#ECEBF1] hover:bg-[#F8F7FA]'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#7C3AED] text-white' : 'bg-[#F8F7FA] text-[#7E7C89]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              isSelected ? 'text-[#1F1F23]' : 'text-[#2D2D2D]'
                            }`}
                          >
                            {opt.title}
                          </span>
                          {opt.badge && (
                            <span className="px-2 py-0.5 bg-[#7C3AED] text-white text-[10px] font-bold rounded-full">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7E7C89] mt-0.5">{opt.description}</p>
                      </div>
                      <div className="mt-1">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-[#ECEBF1]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Quantidade de questões */}
            <div>
              <label className="block text-xs font-bold text-[#7E7C89] uppercase tracking-wider mb-2.5">
                {t('session.questionsCountTitle', appLang)}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      questionCount === count
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                        : 'bg-[#F8F7FA] text-[#7E7C89] border-[#ECEBF1] hover:bg-[#F3F0FF] hover:text-[#7C3AED]'
                    }`}
                  >
                    {count} {t('session.questionsLabel', appLang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Start Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStart}
                id="start-session-btn"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-base shadow-lg shadow-purple-200/50 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t('session.startBtn', appLang)}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
