import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_VOCABULARY } from '../data/vocabulary';
import {
  Achievement,
  LearningStatus,
  SessionResultStats,
  UserProfile,
  VocabularyCategory,
  VocabularyItem,
  WordUserStatus,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'grindage_profile_v1',
  WORD_STATUSES: 'grindage_word_statuses_v1',
  ACHIEVEMENTS: 'grindage_achievements_v1',
};

export const LEVEL_THRESHOLDS = [
  { level: 1, wordsRequired: 0, title: 'Iniciante Curioso' },
  { level: 2, wordsRequired: 10, title: 'Explorador de Palavras' },
  { level: 3, wordsRequired: 25, title: 'Caçador de Expressões' },
  { level: 4, wordsRequired: 45, title: 'Mestre do Vocabulário' },
  { level: 5, wordsRequired: 70, title: 'Guardião das Gírias' },
  { level: 6, wordsRequired: 100, title: 'Orador Fluente' },
  { level: 7, wordsRequired: 150, title: 'Lenda Linguística' },
];

export function getLevelData(learnedWordsCount: number): {
  level: number;
  title: string;
  currentWords: number;
  nextLevelWords: number;
  progressPercent: number;
} {
  let currentTier = LEVEL_THRESHOLDS[0];
  let nextTier = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (learnedWordsCount >= LEVEL_THRESHOLDS[i].wordsRequired) {
      currentTier = LEVEL_THRESHOLDS[i];
      nextTier = LEVEL_THRESHOLDS[i + 1] || {
        level: currentTier.level + 1,
        wordsRequired: currentTier.wordsRequired + 50,
        title: 'Mestre Supremo',
      };
    }
  }

  const range = nextTier.wordsRequired - currentTier.wordsRequired;
  const earnedInRange = learnedWordsCount - currentTier.wordsRequired;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInRange / Math.max(1, range)) * 100)));

  return {
    level: currentTier.level,
    title: currentTier.title,
    currentWords: learnedWordsCount,
    nextLevelWords: nextTier.wordsRequired,
    progressPercent,
  };
}

// Generate default dates for the last 7 days including today
function getInitialStudiedDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alexandre Monteiro',
  avatar: '🦊',
  level: 3,
  levelTitle: 'Caçador de Expressões',
  streakDays: 7,
  bestStreak: 12,
  dailyGoal: 20,
  dailyWordsProgress: 14,
  lastActiveDate: new Date().toISOString().split('T')[0],
  studiedDates: getInitialStudiedDates(),
  completedSessionsCount: 8,
  totalCorrectAnswers: 46,
  totalAttemptedAnswers: 52,
  soundEnabled: true,
};

function getInitialWordStatuses(): Record<string, WordUserStatus> {
  const map: Record<string, WordUserStatus> = {};
  
  INITIAL_VOCABULARY.forEach((item, index) => {
    // Seed initial sensible statuses for demonstration
    let status: LearningStatus = 'new';
    let practiced = 0;
    let correct = 0;
    let isFavorite = false;

    if (index < 12) {
      status = 'mastered';
      practiced = 5;
      correct = 5;
      if (index === 0 || index === 5 || index === 22) isFavorite = true;
    } else if (index < 28) {
      status = 'known';
      practiced = 3;
      correct = 2;
    } else if (index < 45) {
      status = 'learning';
      practiced = 2;
      correct = 1;
      if (index === 32 || index === 34) isFavorite = true;
    }

    map[item.id] = {
      wordId: item.id,
      status,
      timesPracticed: practiced,
      timesCorrect: correct,
      isFavorite,
      lastReviewedDate: practiced > 0 ? new Date().toISOString().split('T')[0] : undefined,
    };
  });

  return map;
}

export class StorageService {
  public static getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  }

  public static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  public static getWordStatuses(): Record<string, WordUserStatus> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.WORD_STATUSES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    const initial = getInitialWordStatuses();
    this.saveWordStatuses(initial);
    return initial;
  }

  public static saveWordStatuses(statuses: Record<string, WordUserStatus>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WORD_STATUSES, JSON.stringify(statuses));
    } catch {
      // ignore
    }
  }

  public static getAchievements(): Achievement[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public static saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }

  public static toggleFavorite(wordId: string): boolean {
    const statuses = this.getWordStatuses();
    const current = statuses[wordId] || {
      wordId,
      status: 'new',
      timesPracticed: 0,
      timesCorrect: 0,
      isFavorite: false,
    };

    current.isFavorite = !current.isFavorite;
    statuses[wordId] = current;
    this.saveWordStatuses(statuses);

    // Check favorite achievement
    this.checkFavoriteAchievement();

    return current.isFavorite;
  }

  public static updateWordStatus(wordId: string, status: LearningStatus): void {
    const statuses = this.getWordStatuses();
    const current = statuses[wordId] || {
      wordId,
      status: 'new',
      timesPracticed: 0,
      timesCorrect: 0,
      isFavorite: false,
    };

    current.status = status;
    statuses[wordId] = current;
    this.saveWordStatuses(statuses);
  }

  public static checkFavoriteAchievement(): void {
    const statuses = this.getWordStatuses();
    const favCount = Object.values(statuses).filter((s) => s.isFavorite).length;
    const achievements = this.getAchievements();

    let changed = false;
    const updated = achievements.map((a) => {
      if (a.id === 'favorite_collector') {
        const newProg = Math.min(a.maxProgress, favCount);
        const unlocked = newProg >= a.maxProgress;
        if (newProg !== a.progress || unlocked !== a.unlocked) {
          changed = true;
          return {
            ...a,
            progress: newProg,
            unlocked,
            unlockedAt: unlocked && !a.unlocked ? new Date().toISOString() : a.unlockedAt,
          };
        }
      }
      return a;
    });

    if (changed) {
      this.saveAchievements(updated);
    }
  }

  public static recordSessionResult(
    result: {
      correctCount: number;
      totalCount: number;
      comboMax: number;
      practicedWordIds: string[];
      category?: VocabularyCategory | 'all';
    }
  ): {
    newLevel: number;
    leveledUp: boolean;
    unlockedAchievements: Achievement[];
  } {
    const profile = this.getProfile();
    const statuses = this.getWordStatuses();
    const achievements = this.getAchievements();

    const todayStr = new Date().toISOString().split('T')[0];
    const oldLevel = profile.level;

    // Update streak dates
    const studiedDates = [...profile.studiedDates];
    if (!studiedDates.includes(todayStr)) {
      studiedDates.push(todayStr);
    }

    // Update words practiced first so we can count learned words for level
    result.practicedWordIds.forEach((wordId) => {
      const current = statuses[wordId] || {
        wordId,
        status: 'new',
        timesPracticed: 0,
        timesCorrect: 0,
        isFavorite: false,
      };

      current.timesPracticed += 1;
      current.timesCorrect += 1;
      current.lastReviewedDate = todayStr;

      if (current.status === 'new') {
        current.status = 'learning';
      } else if (current.status === 'learning' && current.timesCorrect >= 2) {
        current.status = 'known';
      } else if (current.status === 'known' && current.timesCorrect >= 4) {
        current.status = 'mastered';
      }

      statuses[wordId] = current;
    });

    this.saveWordStatuses(statuses);

    const learnedWordsCount = Object.values(statuses).filter(
      (s) => s.status === 'learning' || s.status === 'known' || s.status === 'mastered'
    ).length;
    const levelInfo = getLevelData(learnedWordsCount);

    const updatedProfile: UserProfile = {
      ...profile,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      dailyWordsProgress: profile.dailyWordsProgress + result.practicedWordIds.length,
      lastActiveDate: todayStr,
      studiedDates,
      completedSessionsCount: profile.completedSessionsCount + 1,
      totalCorrectAnswers: profile.totalCorrectAnswers + result.correctCount,
      totalAttemptedAnswers: profile.totalAttemptedAnswers + result.totalCount,
    };

    this.saveProfile(updatedProfile);

    // Evaluate Achievements
    const newlyUnlocked: Achievement[] = [];
    const learnedCount = Object.values(statuses).filter(
      (s) => s.status === 'learning' || s.status === 'known' || s.status === 'mastered'
    ).length;
    const masteredCount = Object.values(statuses).filter((s) => s.status === 'mastered').length;

    const updatedAchievements = achievements.map((a) => {
      let currentProgress = a.progress;
      let unlocked = a.unlocked;

      if (a.id === 'first_word') {
        currentProgress = Math.min(1, learnedCount);
        if (currentProgress >= 1 && !unlocked) {
          unlocked = true;
          newlyUnlocked.push(a);
        }
      } else if (a.id === 'combo_ten') {
        currentProgress = Math.max(a.progress, Math.min(10, result.comboMax));
        if (currentProgress >= 10 && !unlocked) {
          unlocked = true;
          newlyUnlocked.push(a);
        }
      } else if (a.id === 'words_fifty') {
        currentProgress = Math.min(50, learnedCount);
        if (currentProgress >= 50 && !unlocked) {
          unlocked = true;
          newlyUnlocked.push(a);
        }
      } else if (a.id === 'words_hundred') {
        currentProgress = Math.min(100, learnedCount);
        if (currentProgress >= 100 && !unlocked) {
          unlocked = true;
          newlyUnlocked.push(a);
        }
      } else if (a.id === 'master_five') {
        currentProgress = Math.min(15, masteredCount);
        if (currentProgress >= 15 && !unlocked) {
          unlocked = true;
          newlyUnlocked.push(a);
        }
      } else if (a.id === 'slang_master' && result.category === 'slang') {
        currentProgress = Math.min(5, a.progress + 1);
        if (currentProgress >= 5 && !unlocked) {
          unlocked = true;
          newlyUnlocked.push(a);
        }
      }

      return {
        ...a,
        progress: currentProgress,
        unlocked,
        unlockedAt: unlocked && !a.unlocked ? new Date().toISOString() : a.unlockedAt,
      };
    });

    this.saveAchievements(updatedAchievements);

    return {
      newLevel: levelInfo.level,
      leveledUp: levelInfo.level > oldLevel,
      unlockedAchievements: newlyUnlocked,
    };
  }

  public static resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WORD_STATUSES);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  }
}
