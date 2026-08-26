export type VocabularyType = 'word' | 'expression' | 'slang' | 'idiom' | 'phrasal_verb';
export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';
export type LearningStatus = 'new' | 'learning' | 'known' | 'mastered';
export type VocabularyCategory =
  | 'daily'
  | 'travel'
  | 'work'
  | 'tech'
  | 'internet'
  | 'gaming'
  | 'cinema'
  | 'music'
  | 'food'
  | 'feelings'
  | 'relationships'
  | 'slang'
  | 'idioms'
  | 'business';

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  category: VocabularyCategory;
  difficulty: DifficultyLevel;
  type: VocabularyType;
  meaning: string;
  example: string;
  exampleTranslation: string;
  relatedWords: string[];
  phonetic?: string;
  synonyms?: string[];
  antonyms?: string[];
  situationTag?: string;
}

export interface CategoryMeta {
  id: VocabularyCategory;
  name: string;
  iconName: string;
  description: string;
  color: string;
  badge: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  levelTitle: string;
  streakDays: number;
  bestStreak: number;
  dailyGoal: number;
  dailyWordsProgress: number;
  lastActiveDate: string; // YYYY-MM-DD
  studiedDates: string[]; // List of YYYY-MM-DD
  completedSessionsCount: number;
  totalCorrectAnswers: number;
  totalAttemptedAnswers: number;
  soundEnabled: boolean;
}

export interface WordUserStatus {
  wordId: string;
  status: LearningStatus;
  timesPracticed: number;
  timesCorrect: number;
  isFavorite: boolean;
  lastReviewedDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export type ExerciseType = 'translation' | 'fill_expression' | 'match_pairs' | 'synonym_antonym' | 'mixed';

export interface PairMatchItem {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  exerciseType: 'translation' | 'fill_expression' | 'match_pairs' | 'synonym_antonym';
  vocabItem: VocabularyItem;
  prompt: string;
  promptContext?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  pairs?: PairMatchItem[];
  questionSubtype?: 'synonym' | 'antonym';
}

export interface SessionConfig {
  category?: VocabularyCategory | 'all';
  difficulty: DifficultyLevel | 'all';
  exerciseType: ExerciseType;
  questionCount: number;
  targetWordId?: string;
}

export interface SessionResultStats {
  totalQuestions: number;
  correctAnswers: number;
  maxCombo: number;
  wordsPracticed: VocabularyItem[];
  unlockedAchievements: Achievement[];
}

export type NavigationTab = 'dashboard' | 'learn' | 'games' | 'vocabulary' | 'achievements' | 'profile';
export type NavTab = NavigationTab;
