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
import { AppLanguage, SessionConfig, StudyLanguage, VocabularyCategory, WordUserStatus } from '../../types';
import { CATEGORIES, getCategoryMeta } from '../../data/categories';
import { getVocabularyByLanguage } from '../../data/vocabulary';
import { SessionModal } from './SessionModal';
import { SUPPORTED_LANGUAGES, t } from '../../i18n/translations';

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
  studyLang?: StudyLanguage;
  appLang?: AppLanguage;
}

export function LearnPage({
  wordStatuses,
  onStartSession,
  studyLang = 'en',
  appLang = 'pt',
}: LearnPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | 'all' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'essential' | 'slang' | 'business'>('all');

  const vocab = getVocabularyByLanguage(studyLang);
  const studyLangInfo = SUPPORTED_LANGUAGES[studyLang] || SUPPORTED_LANGUAGES.en;

  const filteredCategories = CATEGORIES.filter((cat) => {
    const meta = getCategoryMeta(cat.id, appLang);
    const matchesSearch =
      meta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'slang') return cat.id === 'slang' || cat.id === 'idioms';
    if (filterType === 'business') return cat.id === 'business' || cat.id === 'work';
    if (filterType === 'essential') return cat.id === 'daily' || cat.id === 'travel' || cat.id === 'food';
    return true;
  });

  // Calculate stats for each category
  const getCategoryStats = (catId: VocabularyCategory) => {
    const catWords = vocab.filter((v) => v.category === catId);
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
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#ECEBF1] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#F3F0FF] text-[#7C3AED] text-xs font-bold tracking-wide mb-3">
            <span>{studyLangInfo.flag}</span>
            <span>{t('lang.studying', appLang)}: {studyLangInfo.nativeName}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
            {t('learn.title', appLang)}
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7C89] mt-1 max-w-xl">
            {t('learn.subtitle', appLang)}
          </p>
        </div>

        {/* Quick Global Session Button */}
        <button
          onClick={() => setSelectedCategory('all')}
          id="learn-quick-all-btn"
          className="self-start md:self-center flex items-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-200/50 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{t('learn.quickSession', appLang)}</span>
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
            placeholder={t('learn.searchPlaceholder', appLang)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7FA] border border-[#ECEBF1] rounded-xl text-xs sm:text-sm text-[#1F1F23] placeholder:text-[#7E7C89] focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', key: 'learn.filterAll' },
            { id: 'essential', key: 'learn.filterEssential' },
            { id: 'slang', key: 'learn.filterSlang' },
            { id: 'business', key: 'learn.filterBusiness' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as typeof filterType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-[#F8F7FA] text-[#7E7C89] hover:bg-[#F3F0FF] hover:text-[#7C3AED]'
              }`}
            >
              {t(tab.key, appLang)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="categories-grid">
        {filteredCategories.map((category) => {
          const Icon = ICON_COMPONENTS[category.iconName] || BookOpen;
          const meta = getCategoryMeta(category.id, appLang);
          const stats = getCategoryStats(category.id);

          return (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="group relative bg-white rounded-[24px] p-6 border border-[#ECEBF1] hover:border-[#7C3AED] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header of card: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${category.color} text-white flex items-center justify-center shadow-md shadow-purple-200/50 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F3F0FF] text-[#7C3AED] border border-purple-100">
                    {meta.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#1F1F23] font-display group-hover:text-[#7C3AED] transition-colors">
                  {meta.name}
                </h3>
                <p className="text-xs text-[#7E7C89] mt-1 line-clamp-2">
                  {meta.description}
                </p>
              </div>

              {/* Progress and Action Footer */}
              <div className="mt-5 pt-4 border-t border-[#ECEBF1]">
                <div className="flex items-center justify-between text-xs font-bold text-[#7E7C89] mb-2">
                  <span>{stats.learned} / {stats.total} {t('dash.words', appLang)}</span>
                  <span className="text-[#7C3AED] font-bold">{stats.percent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden mb-3.5">
                  <div
                    className="h-full bg-[#7C3AED] rounded-full transition-all duration-500"
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#7E7C89]">
                    {studyLangInfo.flag} {studyLangInfo.nativeName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] group-hover:translate-x-1 transition-transform">
                    <span>{t('learn.practice', appLang)}</span>
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
          studyLang={studyLang}
          appLang={appLang}
          onStartSession={(cfg) => {
            setSelectedCategory(null);
            onStartSession({
              ...cfg,
              studyLanguage: studyLang,
            });
          }}
        />
      )}
    </div>
  );
}
