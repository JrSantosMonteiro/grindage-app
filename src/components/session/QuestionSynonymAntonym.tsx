import React from 'react';
import { Volume2, CheckCircle, XCircle, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Question } from '../../types';
import { audioService } from '../../utils/audio';

interface QuestionSynonymAntonymProps {
  question: Question;
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onSelectOption: (option: string) => void;
}

export function QuestionSynonymAntonym({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onSelectOption,
}: QuestionSynonymAntonymProps) {
  const isSynonym = question.questionSubtype === 'synonym';

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.speak(question.vocabItem.word);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="text-center mb-6">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
            isSynonym
              ? 'bg-purple-100 text-purple-800'
              : 'bg-amber-100 text-amber-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          {isSynonym ? 'Descubra o Sinônimo' : 'Descubra o Antônimo (Oposto)'}
        </span>

        <h3 className="text-sm font-semibold text-slate-500 mb-2">
          {question.prompt}
        </h3>

        <div className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white rounded-3xl border border-purple-100 shadow-sm mt-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            "{question.vocabItem.word}"
          </span>
          <button
            type="button"
            onClick={handleSpeak}
            className="p-2 rounded-xl bg-purple-50 text-violet-600 hover:bg-violet-600 hover:text-white transition-all"
            title="Ouvir pronúncia"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {question.promptContext && (
          <p className="text-xs text-slate-400 mt-2">
            {question.promptContext}
          </p>
        )}
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3" id="synonym-antonym-options">
        {question.options?.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isThisCorrect = option.toLowerCase() === question.correctAnswer.toLowerCase();

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
              whileTap={{ scale: isAnswered ? 1 : 0.98 }}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-semibold transition-all ${btnStyle}`}
            >
              <span>{option}</span>
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
