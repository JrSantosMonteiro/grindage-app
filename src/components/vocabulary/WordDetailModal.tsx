import { Volume2, Star, X, Play, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLanguage, SessionConfig, StudyLanguage, VocabularyItem, WordUserStatus } from '../../types';
import { getCategoryMeta } from '../../data/categories';
import {
  getWordExampleTranslation,
  getWordMeaning,
  getWordTranslation,
} from '../../data/vocabulary';
import { audioService } from '../../utils/audio';
import { SUPPORTED_LANGUAGES, t } from '../../i18n/translations';

interface WordDetailModalProps {
  item: VocabularyItem | null;
  userStatus?: WordUserStatus;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (wordId: string) => void;
  onPracticeWord: (config: SessionConfig) => void;
  onSelectRelatedWord?: (word: string) => void;
  studyLang?: StudyLanguage;
  appLang?: AppLanguage;
}

export function WordDetailModal({
  item,
  userStatus,
  isOpen,
  onClose,
  onToggleFavorite,
  onPracticeWord,
  onSelectRelatedWord,
  studyLang = 'en',
  appLang = 'pt',
}: WordDetailModalProps) {
  if (!isOpen || !item) return null;

  const categoryMeta = getCategoryMeta(item.category, appLang);
  const isFav = userStatus?.isFavorite || false;
  const status = userStatus?.status || 'new';
  const studyLangInfo = SUPPORTED_LANGUAGES[studyLang] || SUPPORTED_LANGUAGES.en;

  const translation = getWordTranslation(item, appLang);
  const meaning = getWordMeaning(item, appLang);
  const exampleTrans = getWordExampleTranslation(item, appLang);

  const handleSpeak = () => {
    audioService.speak(item.word, studyLang);
  };

  const handlePractice = () => {
    onClose();
    onPracticeWord({
      category: item.category,
      difficulty: 'all',
      exerciseType: 'mixed',
      questionCount: 5,
      targetWordId: item.id,
      studyLanguage: studyLang,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#ECEBF1] max-h-[90vh] overflow-y-auto"
          id="word-detail-modal"
        >
          {/* Top Actions: Favorite & Close */}
          <div className="flex items-center justify-between mb-4">
            {/* Status Pill */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                status === 'mastered'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : status === 'known'
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : status === 'learning'
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-[#F3F0FF] text-[#7C3AED] border border-purple-100'
              }`}
            >
              Status: {status === 'mastered'
                ? t('vocab.filterMastered', appLang)
                : status === 'known'
                ? t('vocab.filterKnown', appLang)
                : status === 'learning'
                ? t('vocab.filterLearning', appLang)
                : t('vocab.filterNew', appLang)}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(item.id)}
                id="word-modal-fav-btn"
                className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                  isFav
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-[#F8F7FA] text-[#7E7C89] hover:text-amber-500 border border-[#ECEBF1]'
                }`}
                title="Favorito"
              >
                <Star className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[#7E7C89] hover:text-[#1F1F23] hover:bg-[#F8F7FA] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Word & Phonetics Header */}
          <div className="text-center py-2 mb-6 border-b border-[#ECEBF1]">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F23] font-display tracking-tight">
                {item.word}
              </h2>
              <button
                type="button"
                onClick={handleSpeak}
                className="p-2.5 rounded-2xl bg-[#F3F0FF] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all shadow-xs cursor-pointer"
                title="Ouvir pronúncia"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {item.phonetic && (
              <div className="text-xs font-mono text-[#7C3AED] mt-1">{item.phonetic}</div>
            )}

            <div className="text-xl font-bold text-[#7C3AED] mt-2">
              {translation}
            </div>
          </div>

          {/* Details Grid: Categoria, Dificuldade, Idioma */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
            <div className="p-3 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
              <span className="text-[10px] font-bold text-[#7E7C89] uppercase tracking-wider block">
                Categoria
              </span>
              <span className="text-xs font-bold text-[#1F1F23] mt-0.5 block truncate">
                {categoryMeta.name}
              </span>
            </div>

            <div className="p-3 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
              <span className="text-[10px] font-bold text-[#7E7C89] uppercase tracking-wider block">
                Dificuldade
              </span>
              <span className="text-xs font-bold text-[#1F1F23] mt-0.5 block capitalize">
                {item.difficulty === 'basic'
                  ? t('session.diffBasic', appLang)
                  : item.difficulty === 'intermediate'
                  ? t('session.diffMedium', appLang)
                  : t('session.diffAdvanced', appLang)}
              </span>
            </div>

            <div className="p-3 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
              <span className="text-[10px] font-bold text-[#7E7C89] uppercase tracking-wider block">
                Idioma
              </span>
              <span className="text-xs font-bold text-[#1F1F23] mt-0.5 block">
                {studyLangInfo.flag} {studyLangInfo.nativeName}
              </span>
            </div>
          </div>

          {/* Meaning Box */}
          <div className="space-y-4">
            <div className="bg-[#FAF5FF] p-4 rounded-2xl border border-purple-100">
              <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider block mb-1">
                Significado Contextual
              </span>
              <p className="text-sm text-[#1F1F23] leading-relaxed font-medium">
                {meaning}
              </p>
            </div>

            {/* Example sentence */}
            {item.example && (
              <div className="bg-[#F8F7FA] p-4 rounded-2xl border border-[#ECEBF1]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#7E7C89] uppercase tracking-wider">
                    Exemplo em uso
                  </span>
                  <button
                    type="button"
                    onClick={() => audioService.speak(item.example, studyLang)}
                    className="p-1 text-[#7E7C89] hover:text-[#7C3AED] rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Ouvir frase completa"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm text-[#1F1F23] font-semibold">"{item.example}"</p>
                {exampleTrans && (
                  <p className="text-xs text-[#7E7C89] mt-1 italic">
                    "{exampleTrans}"
                  </p>
                )}
              </div>
            )}

            {/* Synonyms & Antonyms */}
            {((item.synonyms && item.synonyms.length > 0) ||
              (item.antonyms && item.antonyms.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.synonyms && item.synonyms.length > 0 && (
                  <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Sinônimos
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.synonyms.map((syn) => (
                        <span
                          key={syn}
                          onClick={() => onSelectRelatedWord && onSelectRelatedWord(syn)}
                          className="text-xs font-semibold px-2 py-0.5 bg-white text-emerald-700 rounded-lg border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.antonyms && item.antonyms.length > 0 && (
                  <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
                      Antônimos
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.antonyms.map((ant) => (
                        <span
                          key={ant}
                          onClick={() => onSelectRelatedWord && onSelectRelatedWord(ant)}
                          className="text-xs font-semibold px-2 py-0.5 bg-white text-rose-700 rounded-lg border border-rose-200 cursor-pointer hover:bg-rose-100 transition-colors"
                        >
                          {ant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Practice Button */}
          <div className="mt-6 pt-4 border-t border-[#ECEBF1]">
            <button
              type="button"
              onClick={handlePractice}
              id="word-modal-practice-btn"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-200/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Praticar Esta Palavra</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
