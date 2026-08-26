import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { getVocabularyByLanguage } from '../data/vocabulary';
import {
  Achievement,
  AppLanguage,
  LanguageProgress,
  LearningStatus,
  StudyLanguage,
  UserProfile,
  VocabularyCategory,
  WordUserStatus,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'grindage_profile_v2',
  WORD_STATUSES_PREFIX: 'grindage_word_statuses_v2_',
  ACHIEVEMENTS: 'grindage_achievements_v2',
};

export const LEVEL_THRESHOLDS = [
  {
    level: 1,
    wordsRequired: 0,
    titles: {
      pt: 'Iniciante Curioso',
      es: 'Principiante Curioso',
      en: 'Curious Beginner',
      fr: 'Débutant Curieux',
    },
  },
  {
    level: 2,
    wordsRequired: 10,
    titles: {
      pt: 'Explorador de Palavras',
      es: 'Explorador de Palabras',
      en: 'Word Explorer',
      fr: 'Explorateur de Mots',
    },
  },
  {
    level: 3,
    wordsRequired: 25,
    titles: {
      pt: 'Caçador de Expressões',
      es: 'Cazador de Expresiones',
      en: 'Idiom Hunter',
      fr: 'Chasseur d’Expressions',
    },
  },
  {
    level: 4,
    wordsRequired: 45,
    titles: {
      pt: 'Mestre do Vocabulário',
      es: 'Maestro del Vocabulario',
      en: 'Vocabulary Master',
      fr: 'Maître du Vocabulaire',
    },
  },
  {
    level: 5,
    wordsRequired: 70,
    titles: {
      pt: 'Guardião das Gírias',
      es: 'Guardián de la Jerga',
      en: 'Slang Guardian',
      fr: 'Gardien de l’Argot',
    },
  },
  {
    level: 6,
    wordsRequired: 100,
    titles: {
      pt: 'Orador Fluente',
      es: 'Orador Fluido',
      en: 'Fluent Speaker',
      fr: 'Orateur Fluide',
    },
  },
  {
    level: 7,
    wordsRequired: 150,
    titles: {
      pt: 'Lenda Linguística',
      es: 'Leyenda Lingüística',
      en: 'Linguistic Legend',
      fr: 'Légende Linguistique',
    },
  },
];

export function getLevelData(
  learnedWordsCount: number,
  appLang: AppLanguage = 'pt'
): {
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
        titles: {
          pt: 'Mestre Supremo',
          es: 'Maestro Supremo',
          en: 'Supreme Master',
          fr: 'Maître Suprême',
        },
      };
    }
  }

  const range = nextTier.wordsRequired - currentTier.wordsRequired;
  const earnedInRange = learnedWordsCount - currentTier.wordsRequired;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earnedInRange / Math.max(1, range)) * 100)));

  return {
    level: currentTier.level,
    title: currentTier.titles[appLang] || currentTier.titles.pt,
    currentWords: learnedWordsCount,
    nextLevelWords: nextTier.wordsRequired,
    progressPercent,
  };
}

function getInitialStudiedDates(count: number = 7): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const DEFAULT_LANGUAGE_PROGRESS: Record<StudyLanguage, LanguageProgress> = {
  en: {
    level: 3,
    levelTitle: 'Caçador de Expressões',
    streakDays: 7,
    bestStreak: 12,
    dailyGoal: 20,
    dailyWordsProgress: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    studiedDates: getInitialStudiedDates(7),
    completedSessionsCount: 8,
    totalCorrectAnswers: 46,
    totalAttemptedAnswers: 52,
  },
  es: {
    level: 2,
    levelTitle: 'Explorador de Palavras',
    streakDays: 3,
    bestStreak: 5,
    dailyGoal: 20,
    dailyWordsProgress: 6,
    lastActiveDate: new Date().toISOString().split('T')[0],
    studiedDates: getInitialStudiedDates(3),
    completedSessionsCount: 4,
    totalCorrectAnswers: 24,
    totalAttemptedAnswers: 28,
  },
  fr: {
    level: 1,
    levelTitle: 'Iniciante Curioso',
    streakDays: 2,
    bestStreak: 2,
    dailyGoal: 20,
    dailyWordsProgress: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    studiedDates: getInitialStudiedDates(2),
    completedSessionsCount: 2,
    totalCorrectAnswers: 12,
    totalAttemptedAnswers: 15,
  },
  pt: {
    level: 1,
    levelTitle: 'Iniciante Curioso',
    streakDays: 1,
    bestStreak: 1,
    dailyGoal: 20,
    dailyWordsProgress: 2,
    lastActiveDate: new Date().toISOString().split('T')[0],
    studiedDates: getInitialStudiedDates(1),
    completedSessionsCount: 1,
    totalCorrectAnswers: 6,
    totalAttemptedAnswers: 8,
  },
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alexandre Monteiro',
  avatar: '🦊',
  currentStudyLanguage: 'en',
  appLanguage: 'pt',
  languagesProgress: DEFAULT_LANGUAGE_PROGRESS,
  level: 3,
  levelTitle: 'Caçador de Expressões',
  streakDays: 7,
  bestStreak: 12,
  dailyGoal: 20,
  dailyWordsProgress: 14,
  lastActiveDate: new Date().toISOString().split('T')[0],
  studiedDates: getInitialStudiedDates(7),
  completedSessionsCount: 8,
  totalCorrectAnswers: 46,
  totalAttemptedAnswers: 52,
  soundEnabled: true,
};

function getInitialWordStatusesForLanguage(lang: StudyLanguage): Record<string, WordUserStatus> {
  const map: Record<string, WordUserStatus> = {};
  const vocab = getVocabularyByLanguage(lang);

  vocab.forEach((item, index) => {
    let status: LearningStatus = 'new';
    let practiced = 0;
    let correct = 0;
    let isFavorite = false;

    if (lang === 'en') {
      if (index < 4) {
        status = 'mastered';
        practiced = 5;
        correct = 5;
        if (index === 0) isFavorite = true;
      } else if (index < 8) {
        status = 'known';
        practiced = 3;
        correct = 2;
      } else if (index < 10) {
        status = 'learning';
        practiced = 2;
        correct = 1;
        isFavorite = true;
      }
    } else if (lang === 'es') {
      if (index < 3) {
        status = 'mastered';
        practiced = 4;
        correct = 4;
        if (index === 0) isFavorite = true;
      } else if (index < 6) {
        status = 'known';
        practiced = 2;
        correct = 2;
      }
    } else if (lang === 'fr') {
      if (index < 2) {
        status = 'known';
        practiced = 3;
        correct = 3;
      } else if (index < 4) {
        status = 'learning';
        practiced = 1;
        correct = 1;
      }
    } else if (lang === 'pt') {
      if (index < 2) {
        status = 'learning';
        practiced = 1;
        correct = 1;
      }
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
        const mergedLanguagesProgress = {
          ...DEFAULT_LANGUAGE_PROGRESS,
          ...(parsed.languagesProgress || {}),
        };
        const currentLang: StudyLanguage = parsed.currentStudyLanguage || 'en';
        const langProg = mergedLanguagesProgress[currentLang] || DEFAULT_LANGUAGE_PROGRESS[currentLang];

        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          currentStudyLanguage: currentLang,
          appLanguage: parsed.appLanguage || 'pt',
          languagesProgress: mergedLanguagesProgress,
          // Sync root shortcuts with the active language
          level: langProg.level,
          levelTitle: langProg.levelTitle,
          streakDays: langProg.streakDays,
          bestStreak: langProg.bestStreak,
          dailyGoal: langProg.dailyGoal,
          dailyWordsProgress: langProg.dailyWordsProgress,
          lastActiveDate: langProg.lastActiveDate,
          studiedDates: langProg.studiedDates,
          completedSessionsCount: langProg.completedSessionsCount,
          totalCorrectAnswers: langProg.totalCorrectAnswers,
          totalAttemptedAnswers: langProg.totalAttemptedAnswers,
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROFILE;
  }

  public static saveProfile(profile: UserProfile): void {
    try {
      // Keep root fields in sync with active study language
      const lang = profile.currentStudyLanguage;
      const updatedLanguagesProgress = {
        ...profile.languagesProgress,
        [lang]: {
          level: profile.level,
          levelTitle: profile.levelTitle,
          streakDays: profile.streakDays,
          bestStreak: profile.bestStreak,
          dailyGoal: profile.dailyGoal,
          dailyWordsProgress: profile.dailyWordsProgress,
          lastActiveDate: profile.lastActiveDate,
          studiedDates: profile.studiedDates,
          completedSessionsCount: profile.completedSessionsCount,
          totalCorrectAnswers: profile.totalCorrectAnswers,
          totalAttemptedAnswers: profile.totalAttemptedAnswers,
        },
      };

      const finalProfile: UserProfile = {
        ...profile,
        languagesProgress: updatedLanguagesProgress,
      };

      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(finalProfile));
    } catch {
      // ignore
    }
  }

  public static switchStudyLanguage(newLang: StudyLanguage): UserProfile {
    const profile = this.getProfile();
    const targetProg = profile.languagesProgress[newLang] || DEFAULT_LANGUAGE_PROGRESS[newLang];

    const updatedProfile: UserProfile = {
      ...profile,
      currentStudyLanguage: newLang,
      level: targetProg.level,
      levelTitle: targetProg.levelTitle,
      streakDays: targetProg.streakDays,
      bestStreak: targetProg.bestStreak,
      dailyGoal: targetProg.dailyGoal,
      dailyWordsProgress: targetProg.dailyWordsProgress,
      lastActiveDate: targetProg.lastActiveDate,
      studiedDates: targetProg.studiedDates,
      completedSessionsCount: targetProg.completedSessionsCount,
      totalCorrectAnswers: targetProg.totalCorrectAnswers,
      totalAttemptedAnswers: targetProg.totalAttemptedAnswers,
    };

    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  public static switchAppLanguage(newLang: AppLanguage): UserProfile {
    const profile = this.getProfile();
    const updatedProfile: UserProfile = {
      ...profile,
      appLanguage: newLang,
    };
    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  public static getWordStatuses(lang?: StudyLanguage): Record<string, WordUserStatus> {
    const targetLang = lang || this.getProfile().currentStudyLanguage;
    const storageKey = `${STORAGE_KEYS.WORD_STATUSES_PREFIX}${targetLang}`;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }

    const initial = getInitialWordStatusesForLanguage(targetLang);
    this.saveWordStatuses(initial, targetLang);
    return initial;
  }

  public static saveWordStatuses(statuses: Record<string, WordUserStatus>, lang?: StudyLanguage): void {
    const targetLang = lang || this.getProfile().currentStudyLanguage;
    const storageKey = `${STORAGE_KEYS.WORD_STATUSES_PREFIX}${targetLang}`;

    try {
      localStorage.setItem(storageKey, JSON.stringify(statuses));
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

  public static toggleFavorite(wordId: string, lang?: StudyLanguage): boolean {
    const targetLang = lang || this.getProfile().currentStudyLanguage;
    const statuses = this.getWordStatuses(targetLang);
    const current = statuses[wordId] || {
      wordId,
      status: 'new',
      timesPracticed: 0,
      timesCorrect: 0,
      isFavorite: false,
    };

    current.isFavorite = !current.isFavorite;
    statuses[wordId] = current;
    this.saveWordStatuses(statuses, targetLang);

    // Check favorite achievement
    this.checkFavoriteAchievement(targetLang);

    return current.isFavorite;
  }

  public static updateWordStatus(wordId: string, status: LearningStatus, lang?: StudyLanguage): void {
    const targetLang = lang || this.getProfile().currentStudyLanguage;
    const statuses = this.getWordStatuses(targetLang);
    const current = statuses[wordId] || {
      wordId,
      status: 'new',
      timesPracticed: 0,
      timesCorrect: 0,
      isFavorite: false,
    };

    current.status = status;
    statuses[wordId] = current;
    this.saveWordStatuses(statuses, targetLang);
  }

  public static checkFavoriteAchievement(lang?: StudyLanguage): void {
    const targetLang = lang || this.getProfile().currentStudyLanguage;
    const statuses = this.getWordStatuses(targetLang);
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
    },
    lang?: StudyLanguage
  ): {
    newLevel: number;
    leveledUp: boolean;
    unlockedAchievements: Achievement[];
  } {
    const profile = this.getProfile();
    const targetLang = lang || profile.currentStudyLanguage;
    const statuses = this.getWordStatuses(targetLang);
    const achievements = this.getAchievements();

    const todayStr = new Date().toISOString().split('T')[0];
    const currentLangProg = profile.languagesProgress[targetLang] || DEFAULT_LANGUAGE_PROGRESS[targetLang];
    const oldLevel = currentLangProg.level;

    // Update streak dates for this language
    const studiedDates = [...currentLangProg.studiedDates];
    if (!studiedDates.includes(todayStr)) {
      studiedDates.push(todayStr);
    }

    // Update words practiced in this language
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

    this.saveWordStatuses(statuses, targetLang);

    const learnedWordsCount = Object.values(statuses).filter(
      (s) => s.status === 'learning' || s.status === 'known' || s.status === 'mastered'
    ).length;
    const levelInfo = getLevelData(learnedWordsCount, profile.appLanguage);

    const updatedLanguageProgress: LanguageProgress = {
      ...currentLangProg,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      dailyWordsProgress: currentLangProg.dailyWordsProgress + result.practicedWordIds.length,
      lastActiveDate: todayStr,
      studiedDates,
      completedSessionsCount: currentLangProg.completedSessionsCount + 1,
      totalCorrectAnswers: currentLangProg.totalCorrectAnswers + result.correctCount,
      totalAttemptedAnswers: currentLangProg.totalAttemptedAnswers + result.totalCount,
    };

    const updatedProfile: UserProfile = {
      ...profile,
      languagesProgress: {
        ...profile.languagesProgress,
        [targetLang]: updatedLanguageProgress,
      },
      // If the current active language is targetLang, update root shortcuts as well
      ...(profile.currentStudyLanguage === targetLang
        ? {
            level: levelInfo.level,
            levelTitle: levelInfo.title,
            dailyWordsProgress: updatedLanguageProgress.dailyWordsProgress,
            lastActiveDate: todayStr,
            studiedDates,
            completedSessionsCount: updatedLanguageProgress.completedSessionsCount,
            totalCorrectAnswers: updatedLanguageProgress.totalCorrectAnswers,
            totalAttemptedAnswers: updatedLanguageProgress.totalAttemptedAnswers,
          }
        : {}),
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

  public static resetCurrentLanguageProgress(lang: StudyLanguage): void {
    const profile = this.getProfile();
    const defaultProg = DEFAULT_LANGUAGE_PROGRESS[lang];

    const updatedProfile: UserProfile = {
      ...profile,
      languagesProgress: {
        ...profile.languagesProgress,
        [lang]: {
          ...defaultProg,
          level: 1,
          streakDays: 0,
          bestStreak: 0,
          dailyWordsProgress: 0,
          completedSessionsCount: 0,
          totalCorrectAnswers: 0,
          totalAttemptedAnswers: 0,
          studiedDates: [new Date().toISOString().split('T')[0]],
        },
      },
    };

    localStorage.removeItem(`${STORAGE_KEYS.WORD_STATUSES_PREFIX}${lang}`);
    this.saveProfile(updatedProfile);
  }

  public static resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    ['en', 'es', 'fr', 'pt'].forEach((lang) => {
      localStorage.removeItem(`${STORAGE_KEYS.WORD_STATUSES_PREFIX}${lang}`);
    });
  }
}
