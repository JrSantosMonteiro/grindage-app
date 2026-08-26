import { useState } from 'react';
import {
  Coffee,
  Plane,
  Briefcase,
  Cpu,
  Globe,
  Gamepad2,
  Film,
  Music,
  UtensilsCrossed,
  Heart,
  Users,
  Flame,
  Sparkles,
  TrendingUp,
  Play,
  Search,
  BookOpen,
} from 'lucide-react';
import { CategoryMeta, SessionConfig, VocabularyCategory, WordUserStatus } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { INITIAL_VOCABULARY } from '../../data/vocabulary';
import { SessionModal } from './SessionModal';

// Icon Map helper
const ICON_COMPONENTS: Record<string, typeof Coffee> = {
  Coffee,
  Plane,
  Briefcase,
  Cpu,
  Globe,
  Gamepad2,
  Film,
  Music,
  UtensilsCrossed,
  Heart,
  Users,
  Flame,
  Sparkles,
  TrendingUp,
  BookOpen,
};

interface LearnPageProps {
  wordStatuses: Record<string, WordUserStatus>;
  onStartSession: (config: SessionConfig) => void;
}

export function LearnPage({ wordStatuses, onStartSession }: LearnPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | 'all' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'essential' | 'slang' | 'business'>('all');

  const filteredCategories = CATEGORIES.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'slang') return cat.id === 'slang' || cat.id === 'idioms';
    if (filterType === 'business') return cat.id === 'business' || cat.id === 'work';
    if (filterType === 'essential') return cat.id === 'daily' || cat.id === 'travel' || cat.id === 'food';
    return true;
  });

  // Calculate stats for each category
  const getCategoryStats = (catId: VocabularyCategory) => {
    const catWords = INITIAL_VOCABULARY.filter((v) => v.category === catId);
    const total = catWords.length;
    const learned = catWords.filter((v) => {
      const st = wordStatuses[v.id]?.status;
      return st === 'learning' || st === 'known' || st === 'mastered';
    }).length;
    const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
    return { total, learned, percent };
  };

  return (
    <div className="space-y-6 w-full pb-12" id="learn-view">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#ECEBF1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3.5 py-1.5 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] text-xs font-bold tracking-wide mb-3">
            Aprender & Expandir
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
            Categorias de Vocabulário
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7C89] mt-1 max-w-xl">
            Selecione uma área temática para treinar vocabulário contextual, expressões reais,
            gírias contemporâneas e expressões idiomáticas.
          </p>
        </div>

        {/* Quick Global Session Button */}
        <button
          onClick={() => setSelectedCategory('all')}
          id="learn-quick-all-btn"
          className="self-start md:self-center flex items-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-sm shadow-md shadow-purple-200/50 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Sessão Geral Rápida</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#ECEBF1]">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E7C89]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar categoria..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7FA] border border-[#ECEBF1] rounded-xl text-xs sm:text-sm text-[#1F1F23] placeholder:text-[#7E7C89] focus:outline-none focus:border-[#8B5CF6] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'essential', label: 'Essenciais' },
            { id: 'slang', label: 'Gírias & Expressões' },
            { id: 'business', label: 'Trabalho & Negócios' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as typeof filterType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'bg-[#F8F7FA] text-[#7E7C89] hover:bg-[#F3F0FF] hover:text-[#8B5CF6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="categories-grid">
        {filteredCategories.map((category) => {
          const Icon = ICON_COMPONENTS[category.iconName] || BookOpen;
          const stats = getCategoryStats(category.id);

          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="group relative bg-white rounded-[24px] p-6 border border-[#ECEBF1] hover:border-[#8B5CF6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header of card: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center shadow-md shadow-purple-200/50 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F3F0FF] text-[#8B5CF6] border border-purple-100">
                    {category.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1F1F23] font-display group-hover:text-[#8B5CF6] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-[#7E7C89] mt-1 line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Progress and Action Footer */}
              <div className="mt-5 pt-4 border-t border-[#ECEBF1]">
                <div className="flex items-center justify-between text-xs font-bold text-[#7E7C89] mb-2">
                  <span>{stats.learned} de {stats.total} palavras</span>
                  <span className="text-[#8B5CF6] font-bold">{stats.percent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden mb-3.5">
                  <div
                    className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#7E7C89]">
                    Toque para configurar
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8B5CF6] group-hover:translate-x-1 transition-transform">
                    <span>Praticar</span>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Modal */}
      {selectedCategory && (
        <SessionModal
          isOpen={Boolean(selectedCategory)}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory}
          onStartSession={(cfg) => {
            setSelectedCategory(null);
            onStartSession(cfg);
          }}
        />
      )}
    </div>
  );
}
