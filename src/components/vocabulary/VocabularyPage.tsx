import { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Volume2,
  Filter,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Play,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  LearningStatus,
  SessionConfig,
  VocabularyCategory,
  VocabularyItem,
  WordUserStatus,
} from '../../types';
import { INITIAL_VOCABULARY } from '../../data/vocabulary';
import { CATEGORIES, getCategoryMeta } from '../../data/categories';
import { audioService } from '../../utils/audio';
import { WordDetailModal } from './WordDetailModal';

interface VocabularyPageProps {
  wordStatuses: Record<string, WordUserStatus>;
  onToggleFavorite: (wordId: string) => void;
  onStartSession: (config: SessionConfig) => void;
  selectedWordFromState?: VocabularyItem | null;
  onClearSelectedWord?: () => void;
}

export function VocabularyPage({
  wordStatuses,
  onToggleFavorite,
  onStartSession,
  selectedWordFromState,
  onClearSelectedWord,
}: VocabularyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'learning' | 'mastered' | 'favorites' | 'known'>('all');
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [modalWord, setModalWord] = useState<VocabularyItem | null>(selectedWordFromState || null);

  // Sync if external detail selected
  if (selectedWordFromState && modalWord?.id !== selectedWordFromState.id) {
    setModalWord(selectedWordFromState);
  }

  // Filtered vocabulary list
  const filteredList = useMemo(() => {
    return INITIAL_VOCABULARY.filter((item) => {
      const userStatus = wordStatuses[item.id] || {
        wordId: item.id,
        status: 'new',
        timesPracticed: 0,
        timesCorrect: 0,
        isFavorite: false,
      };

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.word.toLowerCase().includes(query) ||
        item.translation.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query) ||
        item.example.toLowerCase().includes(query) ||
        item.relatedWords.some((w) => w.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Difficulty filter
      if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) return false;

      // Status Tab filter
      if (activeTab === 'favorites') return userStatus.isFavorite;
      if (activeTab === 'learning') return userStatus.status === 'learning';
      if (activeTab === 'mastered') return userStatus.status === 'mastered';
      if (activeTab === 'known') return userStatus.status === 'known';

      return true;
    });
  }, [searchQuery, activeTab, selectedCategory, selectedDifficulty, wordStatuses]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const total = INITIAL_VOCABULARY.length;
    let learning = 0;
    let mastered = 0;
    let known = 0;
    let favorites = 0;

    INITIAL_VOCABULARY.forEach((item) => {
      const s = wordStatuses[item.id];
      if (s?.isFavorite) favorites++;
      if (s?.status === 'learning') learning++;
      if (s?.status === 'mastered') mastered++;
      if (s?.status === 'known') known++;
    });

    return { total, learning, mastered, known, favorites };
  }, [wordStatuses]);

  return (
    <div className="space-y-6 w-full pb-12" id="vocabulary-view">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#ECEBF1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3.5 py-1.5 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] text-xs font-bold tracking-wide mb-3">
            Biblioteca Pessoal
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
            Meu Vocabulário ({tabCounts.total})
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7C89] mt-1 max-w-xl">
            Acompanhe seu dicionário ativo de termos, gírias e expressões. Revise significados,
            ouça a pronúncia e pratique palavras específicas.
          </p>
        </div>

        {/* Practice Favorites / Review button */}
        <button
          onClick={() =>
            onStartSession({
              category: 'all',
              difficulty: 'all',
              exerciseType: 'mixed',
              questionCount: 10,
            })
          }
          className="self-start md:self-center flex items-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-md shadow-purple-200/50 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Praticar Vocabulário</span>
        </button>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-[#ECEBF1] shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E7C89]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palavra em inglês, tradução, exemplo ou tag..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7FA] border border-[#ECEBF1] rounded-xl text-xs sm:text-sm text-[#1F1F23] placeholder:text-[#7E7C89] focus:outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as VocabularyCategory | 'all')}
            className="py-2.5 px-3 bg-[#F8F7FA] border border-[#ECEBF1] rounded-xl text-xs sm:text-sm font-semibold text-[#1F1F23] focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="py-2.5 px-3 bg-[#F8F7FA] border border-[#ECEBF1] rounded-xl text-xs sm:text-sm font-semibold text-[#1F1F23] focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
          >
            <option value="all">Todas as Dificuldades</option>
            <option value="basic">Básico</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>

        {/* Status Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Todas', count: tabCounts.total },
            { id: 'learning', label: 'Aprendendo', count: tabCounts.learning },
            { id: 'known', label: 'Conhecidas', count: tabCounts.known },
            { id: 'mastered', label: 'Dominadas', count: tabCounts.mastered },
            { id: 'favorites', label: 'Favoritas', count: tabCounts.favorites, icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'bg-[#F8F7FA] text-[#7E7C89] hover:bg-[#F3F0FF] hover:text-[#8B5CF6]'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#ECEBF1] text-[#7E7C89]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vocabulary Items Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 text-center border border-[#ECEBF1]">
          <BookOpen className="w-12 h-12 text-[#8B5CF6]/50 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#1F1F23] font-display">Nenhuma palavra encontrada</h3>
          <p className="text-xs text-[#7E7C89] mt-1 max-w-sm mx-auto">
            Tente ajustar os filtros de busca ou pratique novas sessões para desbloquear mais vocabulário.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="vocab-cards-grid">
          {filteredList.map((item) => {
            const userStatus = wordStatuses[item.id] || {
              wordId: item.id,
              status: 'new',
              timesPracticed: 0,
              timesCorrect: 0,
              isFavorite: false,
            };
            const catMeta = getCategoryMeta(item.category);
            const isFav = userStatus.isFavorite;

            return (
              <div
                key={item.id}
                onClick={() => setModalWord(item)}
                className="group relative bg-white rounded-[24px] p-5 border border-[#ECEBF1] hover:border-[#8B5CF6] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Category + Favorite button */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3F0FF] text-[#8B5CF6] border border-purple-100">
                      {catMeta.name}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isFav
                          ? 'text-amber-500 bg-amber-50'
                          : 'text-[#7E7C89]/60 hover:text-amber-400 hover:bg-[#F8F7FA]'
                      }`}
                      title={isFav ? 'Remover favorito' : 'Favoritar'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Word & Speaker */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1F1F23] font-display group-hover:text-[#8B5CF6] transition-colors">
                      {item.word}
                    </h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioService.speak(item.word);
                      }}
                      className="p-1 text-[#7E7C89] hover:text-[#8B5CF6] rounded-md hover:bg-[#F3F0FF] transition-colors cursor-pointer"
                      title="Ouvir"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Translation */}
                  <p className="text-xs sm:text-sm font-semibold text-[#2D2D2D] mt-0.5">
                    {item.translation}
                  </p>

                  {/* Meaning snippet */}
                  <p className="text-xs text-[#7E7C89] mt-1.5 line-clamp-2">
                    {item.meaning}
                  </p>
                </div>

                {/* Bottom status & difficulty pill */}
                <div className="mt-4 pt-3 border-t border-[#ECEBF1] flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      userStatus.status === 'mastered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : userStatus.status === 'known'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : userStatus.status === 'learning'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-[#F3F0FF] text-[#8B5CF6] border border-purple-100'
                    }`}
                  >
                    {userStatus.status === 'mastered'
                      ? 'Dominada'
                      : userStatus.status === 'known'
                      ? 'Conhecida'
                      : userStatus.status === 'learning'
                      ? 'Aprendendo'
                      : 'Nova'}
                  </span>

                  <span className="text-[10px] font-medium text-[#7E7C89] capitalize">
                    {item.difficulty === 'basic'
                      ? 'Básico'
                      : item.difficulty === 'intermediate'
                      ? 'Médio'
                      : 'Avançado'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Word Details Modal */}
      {modalWord && (
        <WordDetailModal
          item={modalWord}
          userStatus={wordStatuses[modalWord.id]}
          isOpen={Boolean(modalWord)}
          onClose={() => {
            setModalWord(null);
            if (onClearSelectedWord) onClearSelectedWord();
          }}
          onToggleFavorite={onToggleFavorite}
          onPracticeWord={onStartSession}
          onSelectRelatedWord={(rw) => {
            const found = INITIAL_VOCABULARY.find(
              (v) => v.word.toLowerCase() === rw.toLowerCase()
            );
            if (found) setModalWord(found);
            else setSearchQuery(rw);
          }}
        />
      )}
    </div>
  );
}
