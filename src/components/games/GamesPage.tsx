import { useState } from 'react';
import {
  Shuffle,
  BookOpen,
  HelpCircle,
  Layers,
  Zap,
  Play,
  Sparkles,
} from 'lucide-react';
import { AppLanguage, SessionConfig, StudyLanguage } from '../../types';
import { SessionModal } from '../learn/SessionModal';
import { SUPPORTED_LANGUAGES, t } from '../../i18n/translations';

interface GamesPageProps {
  onStartSession: (config: SessionConfig) => void;
  studyLang?: StudyLanguage;
  appLang?: AppLanguage;
}

export function GamesPage({
  onStartSession,
  studyLang = 'en',
  appLang = 'pt',
}: GamesPageProps) {
  const [modalCategory, setModalCategory] = useState<'all' | null>(null);
  const studyInfo = SUPPORTED_LANGUAGES[studyLang] || SUPPORTED_LANGUAGES.en;

  const gameModes = [
    {
      id: 'mixed',
      title: t('session.mixed', appLang),
      tag: 'Mais Completo',
      description: t('session.mixedDesc', appLang),
      icon: Shuffle,
      color: 'from-violet-600 to-purple-600',
      difficulty: 'all' as const,
      exerciseType: 'mixed' as const,
      highlight: 'Desafio com Todos os Formatos',
    },
    {
      id: 'translation',
      title: t('session.trans', appLang),
      tag: 'Velocidade & Precisão',
      description: t('session.transDesc', appLang),
      icon: BookOpen,
      color: 'from-indigo-600 to-violet-600',
      difficulty: 'all' as const,
      exerciseType: 'translation' as const,
      highlight: 'Áudio Nativo & Reconhecimento Rápido',
    },
    {
      id: 'expressions',
      title: t('session.fill', appLang),
      tag: 'Fluência Real',
      description: t('session.fillDesc', appLang),
      icon: HelpCircle,
      color: 'from-purple-600 to-fuchsia-600',
      difficulty: 'all' as const,
      exerciseType: 'fill_expression' as const,
      highlight: 'Fixação de Gírias em Contexto',
    },
    {
      id: 'pairs',
      title: t('session.pairs', appLang),
      tag: 'Agilidade Mental',
      description: t('session.pairsDesc', appLang),
      icon: Layers,
      color: 'from-violet-600 to-purple-800',
      difficulty: 'all' as const,
      exerciseType: 'match_pairs' as const,
      highlight: 'Agilidade de Associação',
    },
    {
      id: 'synonyms',
      title: t('session.synAnt', appLang),
      tag: 'Vocabulário Avançado',
      description: t('session.synAntDesc', appLang),
      icon: Zap,
      color: 'from-amber-600 to-violet-600',
      difficulty: 'intermediate' as const,
      exerciseType: 'synonym_antonym' as const,
      highlight: 'Sinônimos & Antônimos Avançados',
    },
  ];

  const handleLaunchDirect = (game: (typeof gameModes)[0]) => {
    onStartSession({
      category: 'all',
      difficulty: game.difficulty,
      exerciseType: game.exerciseType,
      questionCount: 10,
      studyLanguage: studyLang,
    });
  };

  return (
    <div className="space-y-6 w-full pb-12" id="games-view">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#ECEBF1] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#F3F0FF] text-[#7C3AED] text-xs font-bold tracking-wide mb-3">
            <span>{studyInfo.flag}</span>
            <span>{t('lang.studying', appLang)}: {studyInfo.nativeName}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
            {t('nav.games', appLang)}
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7C89] mt-1 max-w-xl">
            Aprenda de maneira dinâmica através de formatos interativos focados no idioma {studyInfo.name}.
          </p>
        </div>

        <button
          onClick={() => setModalCategory('all')}
          className="self-start md:self-center flex items-center gap-2 py-3.5 px-6 rounded-2xl bg-[#F8F7FA] hover:bg-[#F3F0FF] text-[#1F1F23] hover:text-[#7C3AED] font-bold text-sm border border-[#ECEBF1] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <span>Personalizar Sessão</span>
        </button>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="games-grid">
        {gameModes.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white rounded-[24px] p-6 border border-[#ECEBF1] hover:border-[#7C3AED] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-md shadow-purple-200/50`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F3F0FF] text-[#7C3AED] border border-purple-100">
                    {game.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1F1F23] font-display">
                  {game.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7E7C89] mt-2 leading-relaxed">
                  {game.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#7C3AED] bg-[#F3F0FF] px-3 py-1.5 rounded-xl w-fit border border-purple-100">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  <span>{game.highlight}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECEBF1] flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#7E7C89]">
                  10 {t('session.questionsLabel', appLang)} • {studyInfo.nativeName}
                </span>

                <button
                  onClick={() => handleLaunchDirect(game)}
                  id={`play-game-${game.id}-btn`}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-200/50 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Jogar Agora</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal if customized */}
      {modalCategory && (
        <SessionModal
          isOpen={Boolean(modalCategory)}
          onClose={() => setModalCategory(null)}
          category={modalCategory}
          studyLang={studyLang}
          appLang={appLang}
          onStartSession={(cfg) => {
            setModalCategory(null);
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
