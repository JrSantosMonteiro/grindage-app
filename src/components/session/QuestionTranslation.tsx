import React, { useState } from 'react';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Question } from '../../types';
import { audioService } from '../../utils/audio';

interface QuestionTranslationProps {
  question: Question;
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onSelectOption: (option: string) => void;
}

export function QuestionTranslation({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onSelectOption,
}: QuestionTranslationProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.speak(question.prompt);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Target Word Display */}
      <div className="text-center mb-7">
        <span className="inline-block px-3 py-1 rounded-full bg-purple-100/90 text-violet-800 text-xs font-bold uppercase tracking-wider mb-2">
          {question.vocabItem.type === 'slang'
            ? 'Gíria'
            : question.vocabItem.type === 'idiom'
            ? 'Expressão Idiomática'
            : 'Palavra'} • {question.vocabItem.difficulty}
        </span>

        <h3 className="text-xs sm:text-sm font-semibold text-slate-500 mb-2">
          Qual é o significado de:
        </h3>

        {/* Word + Speaker */}
        <div className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white rounded-3xl border border-purple-100/90 shadow-sm">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            "{question.prompt}"
          </span>
          <button
            type="button"
            onClick={handleSpeak}
            className="p-2.5 rounded-2xl bg-purple-50 text-violet-600 hover:bg-violet-600 hover:text-white transition-all shadow-xs"
            title="Ouvir pronúncia"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {question.vocabItem.phonetic && (
          <div className="text-xs font-mono text-purple-400 mt-1.5">
            {question.vocabItem.phonetic}
          </div>
        )}

        {question.promptContext && (
          <p className="text-xs text-slate-400 mt-2 italic">
            {question.promptContext}
          </p>
        )}
      </div>

      {/* 4 Options Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3" id="translation-options">
        {question.options?.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isThisCorrect = option === question.correctAnswer;

          let btnStyle =
            'bg-white text-slate-800 border-slate-200 hover:border-violet-400 hover:bg-purple-50/40 shadow-xs';

          if (isAnswered) {
            if (isThisCorrect) {
              btnStyle =
                'bg-emerald-50 text-emerald-950 border-emerald-500 ring-2 ring-emerald-500/20 font-bold';
            } else if (isSelected && !isCorrect) {
              btnStyle =
                'bg-rose-50 text-rose-950 border-rose-500 ring-2 ring-rose-500/20 font-medium';
            } else {
              btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
            }
          } else if (isSelected) {
            btnStyle =
              'bg-purple-100/80 text-violet-950 border-violet-600 ring-2 ring-violet-500/20 font-bold shadow-sm';
          }

          return (
            <motion.button
              key={option}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(option)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileTap={{ scale: isAnswered ? 1 : 0.98 }}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-semibold transition-all ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-purple-100/70 text-violet-800 text-xs font-extrabold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{option}</span>
              </div>

              {isAnswered && isThisCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
