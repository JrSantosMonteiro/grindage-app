import {
  Sparkles,
  Flame,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Volume2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, WordUserStatus, VocabularyItem, VocabularyCategory } from '../../types';
import { getLevelData } from '../../services/storage';
import { CATEGORIES } from '../../data/categories';
import { INITIAL_VOCABULARY } from '../../data/vocabulary';
import { audioService } from '../../utils/audio';

interface DashboardProps {
  profile: UserProfile;
  wordStatuses: Record<string, WordUserStatus>;
  onStartQuickSession: (category?: VocabularyCategory) => void;
  onNavigateLearn: () => void;
  onNavigateVocabulary: () => void;
  onOpenStreakModal: () => void;
  onSelectWordDetail: (item: VocabularyItem) => void;
}

export function Dashboard({
  profile,
  wordStatuses,
  onStartQuickSession,
  onNavigateLearn,
  onNavigateVocabulary,
  onOpenStreakModal,
  onSelectWordDetail,
}: DashboardProps) {
  const levelData = getLevelData(profile.xp);

  // Compute stats
  const statusesList = Object.values(wordStatuses);
  const wordsLearned = statusesList.filter(
    (s) => s.status === 'learning' || s.status === 'known' || s.status === 'mastered'
  ).length;
  const wordsMastered = statusesList.filter((s) => s.status === 'mastered').length;
  const wordsToReview = statusesList.filter(
    (s) => s.status === 'learning' && s.timesPracticed > 0
  ).length;

  // Daily goal calculation
  const goalProgress = Math.min(100, Math.round((profile.dailyWordsProgress / Math.max(1, profile.dailyGoal)) * 100));

  // Recent words
  const recentWords = INITIAL_VOCABULARY.slice(0, 6);

  // Category emoji map for sleek display
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12" id="dashboard-view">
      {/* 1. Header with greeting and stats */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
            Bem-vindo de volta, {profile.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-[#7E7C89] text-sm mt-0.5">
            Continue sua jornada de vocabulário e expressões hoje.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStreakModal}
            className="bg-white px-4 py-2 rounded-2xl border border-[#ECEBF1] flex items-center gap-2 shadow-sm hover:border-orange-300 transition-all cursor-pointer"
          >
            <span className="text-orange-500 font-bold text-lg">🔥</span>
            <span className="font-bold text-[#1F1F23] text-sm">{profile.streakDays} Dias</span>
          </button>
          <div className="bg-white px-4 py-2 rounded-2xl border border-[#ECEBF1] flex items-center gap-2 shadow-sm font-bold text-sm text-[#1F1F23]">
            <span className="text-[#8B5CF6] font-bold text-lg">✨</span>
            <span>{profile.xp.toLocaleString()} XP</span>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Meta de Hoje + Quick Stats Side */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Big Hero Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-[32px] p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between sm:items-center relative overflow-hidden shadow-xl shadow-purple-200/50">
          <div className="relative z-10 space-y-4 max-w-md">
            <h2 className="text-3xl font-bold leading-tight font-display">Meta de Hoje</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium opacity-90">
                <span>Progresso de palavras</span>
                <span className="font-bold">
                  {profile.dailyWordsProgress} / {profile.dailyGoal}
                </span>
              </div>
              <div className="w-full sm:w-64 h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
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
                ? '🎉 Meta atingida com sucesso!'
                : `Faltam ${Math.max(0, profile.dailyGoal - profile.dailyWordsProgress)} palavras para completar.`}
            </p>
            <button
              onClick={() => onStartQuickSession()}
              id="continue-learning-btn"
              className="bg-white text-[#8B5CF6] px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg hover:bg-opacity-95 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continuar Aprendendo</span>
            </button>
          </div>

          {/* Decorative graphic / background watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none hidden sm:block">
            <Sparkles className="w-64 h-64 text-white fill-current" />
          </div>
        </div>

        {/* Right: Quick Stat Overview Cards */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-6 border border-[#ECEBF1] flex flex-col justify-center gap-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8B5CF6] shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#7E7C89] font-medium">Dominadas</p>
              <p className="text-xl font-bold text-[#1F1F23]">{wordsMastered} Palavras</p>
            </div>
          </div>

          <div className="h-[1px] bg-[#ECEBF1] w-full" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#7E7C89] font-medium">Para Revisar</p>
              <p className="text-xl font-bold text-amber-600">{wordsToReview} Expressões</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5 Metrics Cards Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 1. Palavras Aprendidas */}
        <div className="bg-white rounded-[24px] p-5 border border-[#ECEBF1] shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-[#1F1F23] font-display">
            {wordsLearned}
          </div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">Aprendidas</div>
        </div>

        {/* 2. Palavras Dominadas */}
        <div className="bg-white rounded-[24px] p-5 border border-[#ECEBF1] shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-[#1F1F23] font-display">
            {wordsMastered}
          </div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">Dominadas</div>
        </div>

        {/* 3. Para Revisar */}
        <div className="bg-white rounded-[24px] p-5 border border-[#ECEBF1] shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-[#1F1F23] font-display">
            {wordsToReview}
          </div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">Para revisar</div>
        </div>

        {/* 4. Sequência */}
        <button
          onClick={onOpenStreakModal}
          className="bg-white rounded-[24px] p-5 border border-[#ECEBF1] shadow-xs hover:border-orange-300 transition-all text-left cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div className="text-2xl font-bold text-orange-600 font-display">
            {profile.streakDays} <span className="text-xs font-medium text-[#7E7C89]">dias</span>
          </div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">Sequência 🔥</div>
        </button>

        {/* 5. XP Total */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-[24px] p-5 border border-[#ECEBF1] shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="text-2xl font-bold text-[#8B5CF6] font-display">
            {profile.xp}
          </div>
          <div className="text-xs font-medium text-[#7E7C89] mt-0.5">XP Total</div>
        </div>
      </section>

      {/* 4. Categorias Populares */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-[#1F1F23] font-display">Categorias Populares</h3>
            <p className="text-xs text-[#7E7C89]">Escolha uma categoria para praticar no seu ritmo</p>
          </div>
          <button
            onClick={onNavigateLearn}
            className="text-[#8B5CF6] font-semibold text-sm hover:underline cursor-pointer flex items-center gap-1"
          >
            Ver todas ({CATEGORIES.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 4).map((cat) => {
            const count = INITIAL_VOCABULARY.filter((v) => v.category === cat.id).length;
            const emoji = categoryEmojis[cat.id] || '📚';
            const bgClass = categoryBgColors[cat.id] || 'bg-[#F3F0FF]';
            return (
              <div
                key={cat.id}
                onClick={() => onStartQuickSession(cat.id)}
                className="bg-white p-5 rounded-[24px] border border-[#ECEBF1] flex flex-col items-center text-center gap-3 hover:border-[#8B5CF6] hover:shadow-md cursor-pointer transition-all group"
              >
                <div className={`w-14 h-14 ${bgClass} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {emoji}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1F1F23] group-hover:text-[#8B5CF6] transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-[#7E7C89] mt-0.5">{count} palavras</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Vocabulário Ativo Recente */}
      <section className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#ECEBF1] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1F1F23] font-display">
              Vocabulário em Destaque
            </h3>
            <p className="text-xs text-[#7E7C89]">
              Palavras e expressões recomendadas para sua fixação diária
            </p>
          </div>
          <button
            onClick={onNavigateVocabulary}
            className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Explorar todas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {recentWords.map((item) => {
            const status = wordStatuses[item.id]?.status || 'new';
            return (
              <div
                key={item.id}
                onClick={() => onSelectWordDetail(item)}
                className="p-4 rounded-[20px] bg-white border border-[#ECEBF1] hover:border-[#8B5CF6] hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1F1F23] group-hover:text-[#8B5CF6] transition-colors truncate">
                      {item.word}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioService.speak(item.word);
                      }}
                      className="p-1 text-[#7E7C89] hover:text-[#8B5CF6] rounded-lg hover:bg-[#F3F0FF] transition-colors"
                      title="Ouvir"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-[#7E7C89] truncate mt-0.5">{item.translation}</div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize shrink-0 ${
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
                    ? 'Dominada'
                    : status === 'known'
                    ? 'Conhecida'
                    : status === 'learning'
                    ? 'Aprendendo'
                    : 'Nova'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Sleek Footer */}
      <footer className="flex items-center justify-between py-4 text-xs text-[#A1A1AA] uppercase tracking-widest font-bold border-t border-[#ECEBF1]">
        <span>Versão 1.0.2 Stable</span>
        <div className="flex gap-4">
          <span className="hover:text-[#7E7C89] cursor-pointer">Suporte</span>
          <span className="hover:text-[#7E7C89] cursor-pointer">Privacidade</span>
          <span className="hover:text-[#7E7C89] cursor-pointer">Termos</span>
        </div>
      </footer>
    </div>
  );
}
