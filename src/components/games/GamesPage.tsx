import { useState } from 'react';
import {
  Shuffle,
  BookOpen,
  HelpCircle,
  Layers,
  Zap,
  Play,
  Sparkles,
  Trophy,
  Flame,
} from 'lucide-react';
import { SessionConfig } from '../../types';
import { SessionModal } from '../learn/SessionModal';

interface GamesPageProps {
  onStartSession: (config: SessionConfig) => void;
}

export function GamesPage({ onStartSession }: GamesPageProps) {
  const [modalCategory, setModalCategory] = useState<'all' | null>(null);

  const gameModes = [
    {
      id: 'mixed',
      title: 'Modo Misto Dinâmico',
      tag: 'Mais Completo',
      description:
        'O modo definitivo do Grindage. Alterna perguntas de tradução, preenchimento de expressões, conexões de pares e sinônimos em uma experiência fluida.',
      icon: Shuffle,
      color: 'from-violet-600 to-purple-600',
      difficulty: 'all' as const,
      exerciseType: 'mixed' as const,
      highlight: 'Desafio com Todos os Formatos',
    },
    {
      id: 'translation',
      title: 'Maratona de Tradução',
      tag: 'Velocidade & Precisão',
      description:
        'Treine o reflexo de reconhecimento imediato. Veja termos em inglês com áudio nativo e encontre a tradução correspondente em português.',
      icon: BookOpen,
      color: 'from-indigo-600 to-violet-600',
      difficulty: 'all' as const,
      exerciseType: 'translation' as const,
      highlight: 'Áudio Nativo & Reconhecimento Rápido',
    },
    {
      id: 'expressions',
      title: 'Desafio de Expressões & Gírias',
      tag: 'Fluência Real',
      description:
        'Preencha as palavras que faltam em expressões idiomáticas, gírias urbanas e diálogos cotidianos para falar como um nativo.',
      icon: HelpCircle,
      color: 'from-purple-600 to-fuchsia-600',
      difficulty: 'all' as const,
      exerciseType: 'fill_expression' as const,
      highlight: 'Fixação de Gírias em Contexto',
    },
    {
      id: 'pairs',
      title: 'Pareamento Relâmpago',
      tag: 'Agilidade Mental',
      description:
        'Conecte rapidamente pares de termos em inglês às suas respectivas definições e traduções em português.',
      icon: Layers,
      color: 'from-violet-600 to-purple-800',
      difficulty: 'all' as const,
      exerciseType: 'match_pairs' as const,
      highlight: 'Agilidade de Associação',
    },
    {
      id: 'synonyms',
      title: 'Duelo de Sinônimos & Opostos',
      tag: 'Vocabulário Avançado',
      description:
        'Eleve a sofisticação do seu vocabulário descobrindo os sinônimos mais naturais e os antônimos exatos de cada palavra.',
      icon: Zap,
      color: 'from-amber-600 to-violet-600',
      difficulty: 'intermediate' as const,
      exerciseType: 'synonym_antonym' as const,
      highlight: 'Sinônimos & Antônimos Avançados',
    },
  ];

  const handleLaunchDirect = (game: typeof gameModes[0]) => {
    onStartSession({
      category: 'all',
      difficulty: game.difficulty,
      exerciseType: game.exerciseType,
      questionCount: 10,
    });
  };

  return (
    <div className="space-y-6 w-full pb-12" id="games-view">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#ECEBF1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3.5 py-1.5 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] text-xs font-bold tracking-wide mb-3">
            Minigames & Modos Rápidos
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1F23] font-display">
            Jogos Interativos de Vocabulário
          </h2>
          <p className="text-xs sm:text-sm text-[#7E7C89] mt-1 max-w-xl">
            Aprenda brincando através de formatos dinâmicos projetados para fixação sem esforço.
            Acumule sequências de acertos, domine palavras e evolua seu vocabulário!
          </p>
        </div>

        <button
          onClick={() => setModalCategory('all')}
          className="self-start md:self-center flex items-center gap-2 py-3.5 px-6 rounded-2xl bg-[#F8F7FA] hover:bg-[#F3F0FF] text-[#1F1F23] hover:text-[#8B5CF6] font-bold text-sm border border-[#ECEBF1] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <span>Personalizar Modo</span>
        </button>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="games-grid">
        {gameModes.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white rounded-[24px] p-6 border border-[#ECEBF1] hover:border-[#8B5CF6] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center shadow-md shadow-purple-200/50`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F3F0FF] text-[#8B5CF6] border border-purple-100">
                    {game.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1F1F23] font-display">
                  {game.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7E7C89] mt-2 leading-relaxed">
                  {game.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#8B5CF6] bg-[#F3F0FF] px-3 py-1.5 rounded-xl w-fit border border-purple-100">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                  <span>{game.highlight}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECEBF1] flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#7E7C89]">10 perguntas rápidas</span>

                <button
                  onClick={() => handleLaunchDirect(game)}
                  id={`play-game-${game.id}`}
                  className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200/50 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Jogar Agora</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalCategory && (
        <SessionModal
          isOpen={Boolean(modalCategory)}
          onClose={() => setModalCategory(null)}
          category="all"
          onStartSession={(cfg) => {
            setModalCategory(null);
            onStartSession(cfg);
          }}
        />
      )}
    </div>
  );
}
