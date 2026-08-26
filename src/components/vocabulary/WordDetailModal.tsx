import { Volume2, Star, X, Play, BookOpen, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VocabularyItem, WordUserStatus, SessionConfig } from '../../types';
import { getCategoryMeta } from '../../data/categories';
import { audioService } from '../../utils/audio';

interface WordDetailModalProps {
  item: VocabularyItem | null;
  userStatus?: WordUserStatus;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (wordId: string) => void;
  onPracticeWord: (config: SessionConfig) => void;
  onSelectRelatedWord?: (word: string) => void;
}

export function WordDetailModal({
  item,
  userStatus,
  isOpen,
  onClose,
  onToggleFavorite,
  onPracticeWord,
  onSelectRelatedWord,
}: WordDetailModalProps) {
  if (!isOpen || !item) return null;

  const categoryMeta = getCategoryMeta(item.category);
  const isFav = userStatus?.isFavorite || false;
  const status = userStatus?.status || 'new';

  const handleSpeak = () => {
    audioService.speak(item.word);
  };

  const handlePractice = () => {
    onClose();
    onPracticeWord({
      category: item.category,
      difficulty: 'all',
      exerciseType: 'mixed',
      questionCount: 5,
      targetWordId: item.id,
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
                  : 'bg-[#F3F0FF] text-[#8B5CF6] border border-purple-100'
              }`}
            >
              Status: {status === 'mastered'
                ? 'Dominada'
                : status === 'known'
                ? 'Conhecida'
                : status === 'learning'
                ? 'Aprendendo'
                : 'Nova'}
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
                title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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
                className="p-2.5 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-all shadow-xs cursor-pointer"
                title="Ouvir pronúncia"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {item.phonetic && (
              <div className="text-xs font-mono text-[#8B5CF6] mt-1">{item.phonetic}</div>
            )}

            <div className="text-xl font-bold text-[#8B5CF6] mt-2">
              {item.translation}
            </div>
          </div>

          {/* Details Grid: Categoria, Dificuldade, Tipo */}
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
                  ? 'Básico'
                  : item.difficulty === 'intermediate'
                  ? 'Intermediário'
                  : 'Avançado'}
              </span>
            </div>

            <div className="p-3 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
              <span className="text-[10px] font-bold text-[#7E7C89] uppercase tracking-wider block">
                Tipo
              </span>
              <span className="text-xs font-bold text-[#1F1F23] mt-0.5 block capitalize">
                {item.type === 'slang'
                  ? 'Gíria'
                  : item.type === 'idiom'
                  ? 'Expressão'
                  : item.type === 'expression'
                  ? 'Locução'
                  : 'Palavra'}
              </span>
            </div>
          </div>

          {/* Significado / Explicação */}
          <div className="space-y-4 mb-6 text-left">
            <div>
              <h4 className="text-xs font-bold text-[#7E7C89] uppercase tracking-wider mb-1.5">
                Significado
              </h4>
              <p className="text-sm text-[#2D2D2D] leading-relaxed font-medium bg-[#F8F7FA] p-3.5 rounded-2xl border border-[#ECEBF1]">
                {item.meaning}
              </p>
            </div>

            {/* Exemplo de uso em frase */}
            <div>
              <h4 className="text-xs font-bold text-[#7E7C89] uppercase tracking-wider mb-1.5">
                Exemplo de Uso
              </h4>
              <div className="p-3.5 bg-[#F3F0FF] rounded-2xl border border-purple-100">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-[#1F1F23] italic">
                    "{item.example}"
                  </p>
                  <button
                    type="button"
                    onClick={() => audioService.speak(item.example)}
                    className="p-1 text-[#8B5CF6] hover:text-[#7C3AED] shrink-0 cursor-pointer"
                    title="Ouvir frase"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#7E7C89] mt-1 font-medium">
                  Tradução: {item.exampleTranslation}
                </p>
              </div>
            </div>

            {/* Sinônimos e Antônimos se existirem */}
            {(item.synonyms?.length || item.antonyms?.length) && (
              <div className="grid grid-cols-2 gap-3">
                {item.synonyms && item.synonyms.length > 0 && (
                  <div className="p-3 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
                    <span className="text-[10px] font-bold text-[#7E7C89] uppercase block mb-1">
                      Sinônimos
                    </span>
                    <div className="text-xs text-[#1F1F23] font-semibold flex flex-wrap gap-1">
                      {item.synonyms.join(', ')}
                    </div>
                  </div>
                )}

                {item.antonyms && item.antonyms.length > 0 && (
                  <div className="p-3 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF1]">
                    <span className="text-[10px] font-bold text-[#7E7C89] uppercase block mb-1">
                      Antônimos (Opostos)
                    </span>
                    <div className="text-xs text-[#1F1F23] font-semibold flex flex-wrap gap-1">
                      {item.antonyms.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Palavras Relacionadas */}
            {item.relatedWords && item.relatedWords.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#7E7C89] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#8B5CF6]" />
                  Palavras Relacionadas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.relatedWords.map((rw) => (
                    <button
                      key={rw}
                      type="button"
                      onClick={() => onSelectRelatedWord && onSelectRelatedWord(rw)}
                      className="px-3 py-1.5 rounded-xl bg-[#F3F0FF] hover:bg-[#8B5CF6] text-[#8B5CF6] hover:text-white text-xs font-bold border border-purple-100 transition-colors cursor-pointer"
                    >
                      {rw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isFav
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-[#F8F7FA] text-[#1F1F23] border-[#ECEBF1] hover:bg-amber-50'
              }`}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-current text-amber-500' : ''}`} />
              <span>{isFav ? 'Favoritado' : 'Favoritar'}</span>
            </button>

            <button
              type="button"
              onClick={handlePractice}
              id="word-modal-practice-btn"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-md shadow-purple-200/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Treinar Esta Palavra</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
