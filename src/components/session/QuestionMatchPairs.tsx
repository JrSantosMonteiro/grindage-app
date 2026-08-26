import { useState, useEffect } from 'react';
import { CheckCircle2, Layers, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Question } from '../../types';
import { audioService } from '../../utils/audio';

interface QuestionMatchPairsProps {
  question: Question;
  isAnswered: boolean;
  onComplete: (success: boolean) => void;
}

export function QuestionMatchPairs({
  question,
  isAnswered,
  onComplete,
}: QuestionMatchPairsProps) {
  const pairs = question.pairs || [];

  // Shuffle right sides once
  const [leftItems] = useState(() => pairs.map((p) => ({ id: p.id, text: p.left })));
  const [rightItems] = useState(() => {
    const list = pairs.map((p) => ({ id: p.id, text: p.right }));
    return list.sort(() => Math.random() - 0.5);
  });

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<{ leftId: string; rightId: string } | null>(null);

  // Check matching whenever both are selected
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        // Matched!
        audioService.playCorrect();
        const nextMatched = [...matchedIds, selectedLeft];
        setMatchedIds(nextMatched);
        setSelectedLeft(null);
        setSelectedRight(null);

        // Speak the English word matched
        const pair = pairs.find((p) => p.id === selectedLeft);
        if (pair) audioService.speak(pair.left);

        if (nextMatched.length === pairs.length) {
          setTimeout(() => {
            onComplete(true);
          }, 600);
        }
      } else {
        // Mistake
        audioService.playIncorrect();
        setErrorPair({ leftId: selectedLeft, rightId: selectedRight });
        setTimeout(() => {
          setErrorPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 700);
      }
    }
  }, [selectedLeft, selectedRight, matchedIds, pairs, onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
          Combine os Pares
        </span>
        <h3 className="text-sm font-bold text-slate-800">
          Toque no termo em inglês e na sua tradução em português
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {matchedIds.length} de {pairs.length} pares conectados
        </p>
      </div>

      <div className="w-full grid grid-cols-2 gap-3 sm:gap-4" id="match-pairs-board">
        {/* Left Column (English words) */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Inglês
          </div>
          {leftItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedLeft === item.id;
            const isError = errorPair?.leftId === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                disabled={isMatched || isAnswered}
                onClick={() => {
                  if (!isMatched) {
                    setSelectedLeft(item.id);
                    audioService.speak(item.text);
                  }
                }}
                whileTap={{ scale: isMatched ? 1 : 0.97 }}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all ${
                  isMatched
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400 opacity-60 line-through'
                    : isError
                    ? 'bg-rose-50 text-rose-800 border-rose-500 animate-shake'
                    : isSelected
                    ? 'bg-purple-100 text-violet-900 border-violet-600 ring-2 ring-violet-500/20 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-violet-300 hover:bg-purple-50/30'
                }`}
              >
                <span className="truncate">{item.text}</span>
                {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" />}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column (Portuguese translations) */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Português
          </div>
          {rightItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedRight === item.id;
            const isError = errorPair?.rightId === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                disabled={isMatched || isAnswered}
                onClick={() => {
                  if (!isMatched) setSelectedRight(item.id);
                }}
                whileTap={{ scale: isMatched ? 1 : 0.97 }}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 font-semibold text-xs sm:text-sm transition-all ${
                  isMatched
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400 opacity-60'
                    : isError
                    ? 'bg-rose-50 text-rose-800 border-rose-500'
                    : isSelected
                    ? 'bg-purple-100 text-violet-900 border-violet-600 ring-2 ring-violet-500/20 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-violet-300 hover:bg-purple-50/30'
                }`}
              >
                <span className="truncate">{item.text}</span>
                {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1.5" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
