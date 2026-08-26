import { useState, useMemo } from 'react';
import { X, Sparkles, Zap, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, SessionConfig, SessionResultStats, VocabularyItem } from '../../types';
import { generateSessionQuestions } from '../../services/exerciseEngine';
import { StorageService } from '../../services/storage';
import { audioService } from '../../utils/audio';
import { QuestionTranslation } from './QuestionTranslation';
import { QuestionFillExpression } from './QuestionFillExpression';
import { QuestionMatchPairs } from './QuestionMatchPairs';
import { QuestionSynonymAntonym } from './QuestionSynonymAntonym';
import { SessionResult } from './SessionResult';

interface LearningSessionProps {
  config: SessionConfig;
  onExit: () => void;
  onGoVocabulary: () => void;
}

export function LearningSession({
  config,
  onExit,
  onGoVocabulary,
}: LearningSessionProps) {
  const questions = useMemo(() => generateSessionQuestions(config), [config]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [practicedVocab, setPracticedVocab] = useState<VocabularyItem[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResultStats | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / Math.max(1, questions.length)) * 100);

  // Handle single option selection (Translation, Fill, Synonym)
  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isMatch =
      option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

    if (isMatch) {
      setIsCorrect(true);
      const newCombo = currentCombo + 1;
      setCurrentCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setCorrectAnswersCount((prev) => prev + 1);

      audioService.playCorrect();
      if (newCombo >= 3) {
        audioService.playCombo();
      }

      // Add to practiced list
      if (!practicedVocab.find((v) => v.id === currentQuestion.vocabItem.id)) {
        setPracticedVocab((prev) => [...prev, currentQuestion.vocabItem]);
      }
    } else {
      setIsCorrect(false);
      setCurrentCombo(0);
      audioService.playIncorrect();

      if (!practicedVocab.find((v) => v.id === currentQuestion.vocabItem.id)) {
        setPracticedVocab((prev) => [...prev, currentQuestion.vocabItem]);
      }
    }
  };

  // Handle Pair match completion
  const handlePairMatchComplete = (success: boolean) => {
    setIsAnswered(true);
    setIsCorrect(success);
    if (success) {
      const newCombo = currentCombo + 1;
      setCurrentCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  // Advance to next question or complete
  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Session Completed!
      const practicedIds = practicedVocab.map((v) => v.id);
      if (currentQuestion && !practicedIds.includes(currentQuestion.vocabItem.id)) {
        practicedIds.push(currentQuestion.vocabItem.id);
      }

      const outcome = StorageService.recordSessionResult({
        correctCount: correctAnswersCount + (isCorrect ? 1 : 0),
        totalCount: questions.length,
        comboMax: Math.max(maxCombo, currentCombo),
        practicedWordIds: practicedIds,
        category: config.category,
      });

      const stats: SessionResultStats = {
        totalQuestions: questions.length,
        correctAnswers: correctAnswersCount + (isCorrect ? 1 : 0),
        maxCombo: Math.max(maxCombo, currentCombo),
        wordsPracticed: practicedVocab,
        unlockedAchievements: outcome.unlockedAchievements,
      };

      setSessionResult(stats);
      setIsCompleted(true);
    }
  };

  // Restart session
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentCombo(0);
    setMaxCombo(0);
    setCorrectAnswersCount(0);
    setPracticedVocab([]);
    setIsCompleted(false);
    setSessionResult(null);
  };

  if (isCompleted && sessionResult) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4">
        <SessionResult
          stats={sessionResult}
          onRestart={handleRestart}
          onGoHome={onExit}
          onGoVocabulary={onGoVocabulary}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F8F7FC] flex flex-col justify-between"
      id="learning-session-container"
    >
      {/* Top Header Navigation & Progress Bar */}
      <header className="bg-white border-b border-[#ECEBF1] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        {/* Close Button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 text-[#7E7C89] hover:text-[#1F1F23] hover:bg-[#F8F7FA] rounded-full transition-colors cursor-pointer"
          title="Sair da sessão"
          id="exit-session-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Center Progress Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#7E7C89] mb-1.5 px-1">
            <span>
              Pergunta {currentIndex + 1} de {questions.length}
            </span>
            <span className="text-[#8B5CF6] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#F3F0FF] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#8B5CF6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Right Indicators: Combo Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentCombo > 1 ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100 font-bold text-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-orange-500" />
              <span>x{currentCombo} combo</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F0FF] text-[#8B5CF6] border border-purple-100 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Praticando</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Question Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {currentQuestion.exerciseType === 'translation' && (
                <QuestionTranslation
                  question={currentQuestion}
                  selectedAnswer={selectedAnswer}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  onSelectOption={handleSelectOption}
                />
              )}

              {currentQuestion.exerciseType === 'fill_expression' && (
                <QuestionFillExpression
                  question={currentQuestion}
                  selectedAnswer={selectedAnswer}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  onSelectOption={handleSelectOption}
                />
              )}

              {currentQuestion.exerciseType === 'match_pairs' && (
                <QuestionMatchPairs
                  question={currentQuestion}
                  isAnswered={isAnswered}
                  onComplete={handlePairMatchComplete}
                />
              )}

              {currentQuestion.exerciseType === 'synonym_antonym' && (
                <QuestionSynonymAntonym
                  question={currentQuestion}
                  selectedAnswer={selectedAnswer}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  onSelectOption={handleSelectOption}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Feedback Banner */}
      <footer
        className={`w-full border-t p-4 sm:p-6 transition-all duration-300 ${
          isAnswered
            ? isCorrect
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-rose-50 border-rose-200'
            : 'bg-white border-purple-100'
        }`}
      >
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Feedback details */}
          <div className="w-full sm:w-auto">
            {isAnswered ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div
                  className={`p-2 rounded-2xl shrink-0 mt-0.5 ${
                    isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-extrabold font-display ${
                        isCorrect ? 'text-emerald-900' : 'text-rose-900'
                      }`}
                    >
                      {isCorrect ? 'Correto!' : 'Não foi dessa vez!'}
                    </span>
                    {isCorrect && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-xs font-bold">
                        +{10 + (currentCombo > 1 ? 5 : 0)} XP
                      </span>
                    )}
                  </div>

                  {/* Explanation text */}
                  <p
                    className={`text-xs sm:text-sm mt-0.5 line-clamp-2 max-w-md ${
                      isCorrect ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {!isCorrect && (
                      <span className="font-bold block mb-0.5">
                        Resposta certa: "{currentQuestion.correctAnswer}"
                      </span>
                    )}
                    {currentQuestion.explanation}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Escolha a alternativa para verificar e ganhar experiência.
              </div>
            )}
          </div>

          {/* Continue / Action button */}
          {isAnswered && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              type="button"
              onClick={handleNext}
              id="session-continue-btn"
              className={`w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg active:scale-95 transition-all ${
                isCorrect
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
              }`}
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </footer>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full border border-[#ECEBF1] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F1F23] font-display">
              Deseja sair da sessão?
            </h3>
            <p className="text-xs text-[#7E7C89] mt-1 mb-6">
              Seu progresso parcial nesta sessão de exercícios não será salvo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#F8F7FA] text-[#1F1F23] font-bold text-xs hover:bg-[#ECEBF1] border border-[#ECEBF1] cursor-pointer"
              >
                Continuar estudando
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
