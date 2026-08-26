import React from 'react';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Question, StudyLanguage } from '../../types';
import { audioService } from '../../utils/audio';

interface QuestionFillExpressionProps {
  question: Question;
  selectedAnswer: string | null;
  isAnswered: boolean;
  isCorrect: boolean;
  onSelectOption: (option: string) => void;
  studyLang?: StudyLanguage;
}

export function QuestionFillExpression({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onSelectOption,
  studyLang = 'en',
}: QuestionFillExpressionProps) {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Speak full expression if answered or current word
    audioService.speak(isAnswered ? question.vocabItem.word : question.prompt, studyLang);
  };

  // Render prompt with stylish blank
  const renderPromptWithBlank = () => {
    const parts = question.prompt.split('____');
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
        {parts.map((part, index) => (
          <span key={index} className="flex items-center">
            {part}
            {index < parts.length - 1 && (
              <span
                className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 mx-1.5 rounded-xl border-2 border-dashed font-mono text-xl transition-all ${
                  isAnswered
                    ? isCorrect
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                      : 'bg-rose-100 text-rose-800 border-rose-500 line-through'
                    : selectedAnswer
                    ? 'bg-purple-100 text-violet-900 border-violet-500'
                    : 'bg-purple-50 text-purple-400 border-purple-300'
                }`}
              >
                {selectedAnswer || '____'}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider mb-2">
          Complete a Expressão
        </span>
        <h3 className="text-xs sm:text-sm font-semibold text-slate-500 mb-4">
          Preencha a palavra que falta para formar a expressão correta:
        </h3>

        {/* Big Blank Expression Box */}
        <div className="relative p-6 sm:p-8 bg-white rounded-3xl border border-purple-100 shadow-sm flex flex-col items-center">
          {renderPromptWithBlank()}

          {question.promptContext && (
            <div className="text-xs text-purple-700 font-semibold mt-3 px-3 py-1 bg-purple-50 rounded-full">
              {question.promptContext}
            </div>
          )}

          <button
            type="button"
            onClick={handleSpeak}
            className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-purple-50 text-violet-600 hover:bg-violet-600 hover:text-white transition-all"
            title="Ouvir"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="w-full grid grid-cols-2 gap-3" id="fill-expression-options">
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
              btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-50';
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
              className={`flex items-center justify-between p-4 rounded-2xl border-2 text-center sm:text-left text-sm sm:text-base font-bold transition-all ${btnStyle}`}
            >
              <span className="truncate">{option}</span>
              {isAnswered && isThisCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
