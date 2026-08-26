import {
  Sparkles,
  Flame,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Play,
  ArrowRight,
  Volume2,
  Trophy,
  Lightbulb,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, WordUserStatus, VocabularyItem, VocabularyCategory, StudyLanguage, AppLanguage } from '../../types';
import { getLevelData } from '../../services/storage';
import { CATEGORIES, getCategoryMeta } from '../../data/categories';
import {
  getVocabularyByLanguage,
  getWordExampleTranslation,
  getWordMeaning,
  getWordTranslation,
} from '../../data/vocabulary';
import { audioService } from '../../utils/audio';
import { SUPPORTED_LANGUAGES, t } from '../../i18n/translations';

interface DashboardProps {
  profile: UserProfile;
  wordStatuses: Record<string, WordUserStatus>;
  onStartQuickSession: (category?: VocabularyCategory) => void;
  onNavigateLearn: () => void;
  onNavigateVocabulary: () => void;
  onOpenStreakModal: () => void;
  onSelectWordDetail: (item: VocabularyItem) => void;
  onSwitchStudyLanguage?: (lang: StudyLanguage) => void;
  onSwitchAppLanguage?: (lang: AppLanguage) => void;
}

export function Dashboard({
  profile,
  wordStatuses,
  onStartQuickSession,
  onNavigateLearn,
  onNavigateVocabulary,
  onOpenStreakModal,
  onSelectWordDetail,
  onSwitchStudyLanguage,
  onSwitchAppLanguage,
}: DashboardProps) {
  const appLang: AppLanguage = profile.appLanguage || 'pt';
  const studyLang: StudyLanguage = profile.currentStudyLanguage || 'en';
  const studyLangInfo = SUPPORTED_LANGUAGES[studyLang] || SUPPORTED_LANGUAGES.en;

  const currentVocab = getVocabularyByLanguage(studyLang);

  // Compute stats
  const statusesList = Object.values(wordStatuses);
  const wordsLearned = statusesList.filter(
    (s) => s.status === 'learning' || s.status === 'known' || s.status === 'mastered'
  ).length;
  const wordsMastered = statusesList.filter((s) => s.status === 'mastered').length;
  const wordsToReview = statusesList.filter(
    (s) => s.status === 'learning' && s.timesPracticed > 0
  ).length;

  const levelInfo = getLevelData(wordsLearned, appLang);

  // Daily goal calculation
  const goalProgress = Math.min(100, Math.round((profile.dailyWordsProgress / Math.max(1, profile.dailyGoal)) * 100));

  // Recent words from active language
  const recentWords = currentVocab.slice(0, 6);

  // Word of the day from active language
  const wordOfTheDay = currentVocab.find((v) => v.category === 'slang') || currentVocab[0];

  const categoryEmojis: Record<string, string> = {
    daily: '🏠',
    travel: '✈️',
    work: '💼',
    tech: '💻',
    slang: '⚡',
    idioms: '🧩',
    food: '🍕',
    emotions: '🎭',
    movies: '🎬',
    music: '🎧',
    games: '🎮',
    relationships: '🤝',
    internet: '🌐',
    business: '📈',
  };

  const categoryBgColors: Record<string, string> = {
    daily: 'bg-[#F3F0FF]',
    travel: 'bg-[#FFF1F2]',
    work: 'bg-[#F0FDFA]',
    tech: 'bg-[#EFF6FF]',
    slang: 'bg-[#FFFBEB]',
    idioms: 'bg-[#FAF5FF]',
    food: 'bg-[#FFF7ED]',
    emotions: 'bg-[#FDF2F8]',
    movies: 'bg-[#FEF2F2]',
    music: 'bg-[#F5F3FF]',
    games: 'bg-[#ECFDF5]',
    relationships: 'bg-[#FFF1F2]',
    internet: 'bg-[#F0F9FF]',
    business: 'bg-[#F0FDF4]',
  };

  const weekDayKeys = ['days.mon', 'days.tue', 'days.wed', 'days.thu', 'days.fri', 'days.sat', 'days.sun'];
  const todayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon ... 6 for Sun

  return (
    <div className="w-full pb-12" id="dashboard-view">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================
            CENTER / MAIN SECTION (Spans 8 columns on large screens)
            ======================================================== */}
        <div className="xl:col-span-8 space-y-6">
          {/* 1. Header with greeting */}
          <header>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
              {t('dash.welcome', appLang, { name: profile.name.split(' ')[0] })}
            </h1>
            <p className="text-[#7E7C89] text-sm mt-0.5">
              {t('dash.subtitle', appLang)}
            </p>
          </header>

          {/* 2. Hero Section: Meta de Hoje */}
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-purple-200/50">
            <div className="relative z-10 space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{studyLangInfo.flag} {t('lang.studying', appLang)}: {studyLangInfo.nativeName}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold leading-tight font-display">
                {goalProgress >= 100 ? t('dash.goalCompleted', appLang) : t('dash.heroTitle', appLang)}
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium opacity-90">
                  <span>{t('dash.dayProgress', appLang)}</span>
                  <span className="font-bold">
                    {profile.dailyWordsProgress} / {profile.dailyGoal} {t('dash.words', appLang)}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              <p className="text-xs text-white/80 font-medium">
                {goalProgress >= 100
                  ? '🎉 ' + t('dash.goalCompleted', appLang)
                  : t('dash.wordsRemaining', appLang, {
                      count: Math.max(0, profile.dailyGoal - profile.dailyWordsProgress),
                    })}
              </p>

              <div className="pt-1">
                <button
                  onClick={() => onStartQuickSession()}
                  id="continue-learning-btn"
                  className="bg-white text-[#7C3AED] px-7 py-3 rounded-2xl font-bold text-sm sm:text-base shadow-lg hover:bg-opacity-95 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t('dash.continueBtn', appLang)}</span>
                </button>
              </div>
            </div>

            {/* Decorative graphic background */}
            <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none hidden sm:block">
              <Sparkles className="w-64 h-64 text-white fill-current" />
            </div>
          </div>

          {/* 3. Metrics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {/* 1. Palavras Aprendidas */}
            <div className="bg-white rounded-[22px] p-4.5 border border-[#ECEBF1] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#F3F0FF] text-[#7C3AED] flex items-center justify-center mb-2.5">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div className="text-2xl font-bold text-[#1F1F23] font-display">
                {wordsLearned}
              </div>
              <div className="text-xs font-medium text-[#7E7C89] mt-0.5">
                {t('dash.learned', appLang)}
              </div>
            </div>

            {/* 2. Palavras Dominadas */}
            <div className="bg-white rounded-[22px] p-4.5 border border-[#ECEBF1] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div className="text-2xl font-bold text-[#1F1F23] font-display">
                {wordsMastered}
              </div>
              <div className="text-xs font-medium text-[#7E7C89] mt-0.5">
                {t('dash.mastered', appLang)}
              </div>
            </div>

            {/* 3. Para Revisar */}
            <div className="bg-white rounded-[22px] p-4.5 border border-[#ECEBF1] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                <RotateCcw className="w-4.5 h-4.5" />
              </div>
              <div className="text-2xl font-bold text-[#1F1F23] font-display">
                {wordsToReview}
              </div>
              <div className="text-xs font-medium text-[#7E7C89] mt-0.5">
                {t('dash.toReview', appLang)}
              </div>
            </div>

            {/* 4. Sessões Concluídas */}
            <div className="bg-white rounded-[22px] p-4.5 border border-[#ECEBF1] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#F3F0FF] text-[#7C3AED] flex items-center justify-center mb-2.5">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <div className="text-2xl font-bold text-[#7C3AED] font-display">
                {profile.completedSessionsCount}
              </div>
              <div className="text-xs font-medium text-[#7E7C89] mt-0.5">
                {t('dash.sessionsDone', appLang)}
              </div>
            </div>
          </div>

          {/* 4. Categorias de Estudo */}
          <section className="bg-white rounded-[30px] p-5 sm:p-6 border border-[#ECEBF1] shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1F1F23] font-display">
                  {t('dash.categoriesTitle', appLang)}
                </h3>
                <p className="text-xs text-[#7E7C89]">{t('dash.categoriesSub', appLang)}</p>
              </div>
              <button
                onClick={onNavigateLearn}
                className="text-[#7C3AED] font-semibold text-xs sm:text-sm hover:underline cursor-pointer flex items-center gap-1"
              >
                {t('dash.viewAll', appLang)} ({CATEGORIES.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {CATEGORIES.slice(0, 4).map((cat) => {
                const count = currentVocab.filter((v) => v.category === cat.id).length;
                const emoji = categoryEmojis[cat.id] || '📚';
                const bgClass = categoryBgColors[cat.id] || 'bg-[#F3F0FF]';
                const meta = getCategoryMeta(cat.id, appLang);

                return (
                  <div
                    key={cat.id}
                    onClick={() => onStartQuickSession(cat.id)}
                    className="p-4 rounded-[20px] bg-[#FDFDFD] border border-[#ECEBF1] flex flex-col items-center text-center gap-2 hover:border-[#7C3AED] hover:shadow-md cursor-pointer transition-all group"
                  >
                    <div className={`w-12 h-12 ${bgClass} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[#1F1F23] group-hover:text-[#7C3AED] transition-colors">
                        {meta.name}
                      </span>
                      <span className="text-[11px] text-[#7E7C89] mt-0.5">
                        {count} {t('dash.words', appLang)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Vocabulário em Destaque */}
          <section className="bg-white rounded-[30px] p-5 sm:p-6 border border-[#ECEBF1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1F1F23] font-display">
                  {t('dash.featuredTitle', appLang)}
                </h3>
                <p className="text-xs text-[#7E7C89]">
                  {t('dash.featuredSub', appLang)} ({studyLangInfo.nativeName})
                </p>
              </div>
              <button
                onClick={onNavigateVocabulary}
                className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {t('dash.exploreAll', appLang)} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentWords.map((item) => {
                const status = wordStatuses[item.id]?.status || 'new';
                const trans = getWordTranslation(item, appLang);

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectWordDetail(item)}
                    className="p-3.5 rounded-[18px] bg-white border border-[#ECEBF1] hover:border-[#7C3AED] hover:shadow-2xs cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1F1F23] group-hover:text-[#7C3AED] transition-colors truncate">
                          {item.word}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            audioService.speak(item.word, studyLang);
                          }}
                          className="p-1 text-[#7E7C89] hover:text-[#7C3AED] rounded-lg hover:bg-[#F3F0FF] transition-colors cursor-pointer"
                          title="Ouvir"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs text-[#7E7C89] truncate mt-0.5">{trans}</div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize shrink-0 ${
                        status === 'mastered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : status === 'known'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : status === 'learning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-[#F8F7FA] text-[#7E7C89] border border-[#ECEBF1]'
                      }`}
                    >
                      {status === 'mastered'
                        ? t('vocab.filterMastered', appLang)
                        : status === 'known'
                        ? t('vocab.filterKnown', appLang)
                        : status === 'learning'
                        ? t('vocab.filterLearning', appLang)
                        : t('vocab.filterNew', appLang)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ========================================================
            RIGHT SECTION / WIDGET PANEL (Spans 4 columns on large screens)
            ======================================================== */}
        <div className="xl:col-span-4 space-y-6">
          {/* Widget 1: Palavra do Dia */}
          <div className="bg-white rounded-[30px] p-5 sm:p-6 border border-[#ECEBF1] shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {t('dash.wordOfDay', appLang)}
              </span>
              <span className="text-xs font-semibold text-[#7E7C89]">{studyLangInfo.flag} {studyLangInfo.nativeName}</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1F1F23] font-display">
                  {wordOfTheDay.word}
                </h3>
                <button
                  type="button"
                  onClick={() => audioService.speak(wordOfTheDay.word, studyLang)}
                  className="w-9 h-9 rounded-full bg-[#F3F0FF] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                  title="Ouvir Pronúncia"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {wordOfTheDay.phonetic && (
                <span className="text-xs text-[#7C3AED] font-mono block mt-0.5">
                  {wordOfTheDay.phonetic}
                </span>
              )}

              <p className="text-sm font-semibold text-[#1F1F23] mt-2 bg-[#F8F7FA] p-2.5 rounded-xl border border-[#ECEBF1]">
                {getWordTranslation(wordOfTheDay, appLang)}
              </p>

              {wordOfTheDay.example && (
                <div className="mt-3 text-xs text-[#7E7C89] bg-purple-50/50 p-3 rounded-2xl border border-purple-100/70 space-y-1">
                  <div className="font-medium text-[#1F1F23] flex items-center gap-1">
                    <span>"{wordOfTheDay.example}"</span>
                  </div>
                  {getWordExampleTranslation(wordOfTheDay, appLang) && (
                    <div className="text-[#7E7C89] italic">
                      "{getWordExampleTranslation(wordOfTheDay, appLang)}"
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => onSelectWordDetail(wordOfTheDay)}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{t('dash.practiceWord', appLang)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Widget 2: Sequência Semanal */}
          <div className="bg-white rounded-[30px] p-5 sm:p-6 border border-[#ECEBF1] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Flame className="w-4.5 h-4.5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F1F23]">{t('dash.streakTitle', appLang)}</h3>
                  <p className="text-[11px] text-[#7E7C89]">
                    {profile.streakDays} {t('dash.streakDays', appLang)} ({studyLangInfo.nativeName})
                  </p>
                </div>
              </div>
            </div>

            {/* Week days row */}
            <div className="grid grid-cols-7 gap-1.5 text-center mt-3">
              {weekDayKeys.map((dayKey, idx) => {
                const isPastOrToday = idx <= todayIndex;
                const isToday = idx === todayIndex;
                return (
                  <div
                    key={dayKey}
                    className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                      isToday
                        ? 'bg-orange-500 text-white shadow-xs font-bold'
                        : isPastOrToday
                        ? 'bg-orange-50 text-orange-700 border border-orange-100'
                        : 'bg-[#F8F7FA] text-[#A1A1AA] border border-[#ECEBF1]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold">{t(dayKey, appLang)}</span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                      {isPastOrToday ? (
                        <Flame className={`w-3.5 h-3.5 fill-current ${isToday ? 'text-white' : 'text-orange-500'}`} />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D8]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#ECEBF1] flex items-center justify-between text-xs text-[#7E7C89]">
              <span>{t('dash.personalRecord', appLang)}</span>
              <span className="font-bold text-[#1F1F23]">🔥 {profile.bestStreak} {t('dash.streakDays', appLang)}</span>
            </div>
          </div>

          {/* Widget 3: Nível e Próximo Marco */}
          <div className="bg-white rounded-[30px] p-5 sm:p-6 border border-[#ECEBF1] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7E7C89] uppercase tracking-wider">
                {t('dash.levelEvolution', appLang)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F3F0FF] text-[#7C3AED] text-[11px] font-bold">
                {t('dash.level', appLang)} {levelInfo.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#1F1F23] font-display">
                  {levelInfo.title}
                </span>
              </div>
              <p className="text-xs text-[#7E7C89] mt-0.5">
                {t('dash.wordsToLevel', appLang, {
                  count: Math.max(0, levelInfo.nextLevelWords - wordsLearned),
                })}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold text-[#7E7C89]">
                <span>{wordsLearned} {t('dash.learned', appLang).toLowerCase()}</span>
                <span className="text-[#7C3AED]">{levelInfo.nextLevelWords} {t('dash.needed', appLang)}</span>
              </div>
              <div className="w-full h-2.5 bg-[#F3F0FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C3AED] rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Widget 4: Dica Rápida de Pronúncia */}
          <div className="bg-linear-to-br from-[#FAF5FF] to-[#F3F0FF] rounded-[30px] p-5 border border-purple-100 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-[#7C3AED]">
              <Lightbulb className="w-4.5 h-4.5" />
              <span className="text-xs font-bold uppercase tracking-wider">{t('dash.tipTitle', appLang)}</span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {t('dash.tipBody', appLang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
