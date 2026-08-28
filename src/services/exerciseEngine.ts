import {
  getVocabularyByLanguage,
  getWordExampleTranslation,
  getWordMeaning,
  getWordTranslation,
} from '../data/vocabulary';
import {
  AppLanguage,
  DifficultyLevel,
  ExerciseType,
  PairMatchItem,
  Question,
  SessionConfig,
  StudyLanguage,
  VocabularyCategory,
  VocabularyItem,
} from '../types';

/**
 * Formats a text so that all words start with a lowercase letter,
 * EXCEPT at the beginning of a sentence/phrase where the initial letter is uppercase.
 */
export function formatChallengeText(text: string, isStartOfSentence: boolean = true): string {
  if (!text) return text;
  
  if (!isStartOfSentence) {
    return text.toLowerCase();
  }

  const lower = text.toLowerCase();

  // Capitalize the first letter at the start of the string or after sentence-ending punctuation (. ! ?)
  return lower.replace(/(^\s*|[.!?]\s+)([a-zà-ÿ])/gi, (match, prefix, char) => {
    return prefix + char.toUpperCase();
  });
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(
  config: SessionConfig,
  appLang: AppLanguage = 'pt'
): Question[] {
  const targetStudyLang: StudyLanguage = config.studyLanguage || 'en';
  const langVocab = getVocabularyByLanguage(targetStudyLang);

  // 1. Filter vocabulary pool
  let pool = [...langVocab];

  if (config.category && config.category !== 'all') {
    const categoryMatches = pool.filter((item) => item.category === config.category);
    if (categoryMatches.length >= 2) {
      pool = categoryMatches;
    }
  }

  if (config.difficulty && config.difficulty !== 'all') {
    const difficultyMatches = pool.filter((item) => item.difficulty === config.difficulty);
    if (difficultyMatches.length >= 2) {
      pool = difficultyMatches;
    }
  }

  // If targeting a specific word, put it first
  if (config.targetWordId) {
    const target = langVocab.find((item) => item.id === config.targetWordId);
    if (target) {
      pool = [target, ...pool.filter((i) => i.id !== config.targetWordId)];
    } else {
      pool = shuffle(pool);
    }
  } else {
    pool = shuffle(pool);
  }

  const count = Math.min(config.questionCount || 10, pool.length);
  const selectedVocab = pool.slice(0, count);
  const questions: Question[] = [];

  const availableTypes: Array<'translation' | 'fill_expression' | 'match_pairs' | 'synonym_antonym'> = [];
  if (config.exerciseType === 'mixed') {
    availableTypes.push('translation', 'fill_expression', 'match_pairs', 'synonym_antonym');
  } else if (config.exerciseType === 'translation') {
    availableTypes.push('translation');
  } else if (config.exerciseType === 'fill_expression') {
    availableTypes.push('fill_expression');
  } else if (config.exerciseType === 'match_pairs') {
    availableTypes.push('match_pairs');
  } else if (config.exerciseType === 'synonym_antonym') {
    availableTypes.push('synonym_antonym');
  }

  selectedVocab.forEach((item, index) => {
    let qType: 'translation' | 'fill_expression' | 'match_pairs' | 'synonym_antonym';

    if (config.exerciseType === 'mixed') {
      const mod = index % 4;
      if (mod === 0) qType = 'translation';
      else if (mod === 1) qType = 'fill_expression';
      else if (mod === 2 && (item.synonyms?.length || item.antonyms?.length)) qType = 'synonym_antonym';
      else if (mod === 3) qType = 'match_pairs';
      else qType = 'translation';
    } else {
      qType = availableTypes[0];
    }

    if (qType === 'fill_expression') {
      questions.push(createFillExpressionQuestion(item, langVocab, appLang));
    } else if (qType === 'match_pairs') {
      questions.push(createMatchPairsQuestion(item, langVocab, appLang));
    } else if (qType === 'synonym_antonym') {
      if (item.synonyms && item.synonyms.length > 0) {
        questions.push(createSynonymAntonymQuestion(item, langVocab, 'synonym', appLang));
      } else if (item.antonyms && item.antonyms.length > 0) {
        questions.push(createSynonymAntonymQuestion(item, langVocab, 'antonym', appLang));
      } else {
        questions.push(createTranslationQuestion(item, langVocab, appLang));
      }
    } else {
      questions.push(createTranslationQuestion(item, langVocab, appLang));
    }
  });

  return questions;
}

function createTranslationQuestion(
  item: VocabularyItem,
  allVocab: VocabularyItem[],
  appLang: AppLanguage
): Question {
  const itemTrans = formatChallengeText(getWordTranslation(item, appLang), true);
  const distractors = allVocab
    .filter((v) => v.id !== item.id)
    .map((v) => formatChallengeText(getWordTranslation(v, appLang), true))
    .filter((t) => t.toLowerCase() !== itemTrans.toLowerCase());

  const shuffledDistractors = shuffle(Array.from(new Set(distractors))).slice(0, 3);
  const options = shuffle([itemTrans, ...shuffledDistractors]);

  return {
    id: `q-trans-${item.id}-${Math.random().toString(36).substring(2, 7)}`,
    exerciseType: 'translation',
    vocabItem: item,
    prompt: formatChallengeText(item.word, true),
    promptContext: item.situationTag ? `${item.situationTag}` : undefined,
    options,
    correctAnswer: itemTrans,
    explanation: `${getWordMeaning(item, appLang)} "${item.example}" (${getWordExampleTranslation(item, appLang)})`,
  };
}

function createFillExpressionQuestion(
  item: VocabularyItem,
  allVocab: VocabularyItem[],
  appLang: AppLanguage
): Question {
  const words = item.word.split(' ');
  let targetBlankWord = words[words.length - 1];
  let promptText = '';
  let isBlankAtStart = false;

  if (words.length > 1) {
    const blankIndex = Math.floor(Math.random() * words.length);
    targetBlankWord = words[blankIndex];
    isBlankAtStart = blankIndex === 0;
    promptText = words
      .map((w, idx) => {
        if (idx === blankIndex) return '____';
        return idx === 0 ? formatChallengeText(w, true) : w.toLowerCase();
      })
      .join(' ');
  } else {
    const regex = new RegExp(`\\b${item.word}\\b`, 'i');
    if (regex.test(item.example)) {
      const matchIndex = item.example.search(regex);
      isBlankAtStart = matchIndex === 0;
      promptText = item.example.replace(regex, '____');
      targetBlankWord = item.word;
    } else {
      promptText = `${item.word.slice(0, 2).toLowerCase()}____`;
      isBlankAtStart = false;
      targetBlankWord = item.word;
    }
  }

  // Ensure prompt sentence begins with uppercase if not starting with blank
  if (!promptText.startsWith('____')) {
    promptText = formatChallengeText(promptText, true);
  }

  const formattedTargetAnswer = formatChallengeText(targetBlankWord, isBlankAtStart);

  const distractorPool = allVocab
    .flatMap((v) => v.word.split(' '))
    .map((w) => formatChallengeText(w, isBlankAtStart))
    .filter(
      (w) =>
        w.length > 2 &&
        w.toLowerCase() !== targetBlankWord.toLowerCase() &&
        !/^[0-9]/.test(w) &&
        !w.includes("'")
    );

  const uniqueDistractors = Array.from(new Set(distractorPool));
  const chosenDistractors = shuffle(uniqueDistractors).slice(0, 3);
  const options = shuffle([formattedTargetAnswer, ...chosenDistractors]);

  return {
    id: `q-fill-${item.id}-${Math.random().toString(36).substring(2, 7)}`,
    exerciseType: 'fill_expression',
    vocabItem: item,
    prompt: promptText,
    promptContext: `"${getWordTranslation(item, appLang)}"`,
    options,
    correctAnswer: formattedTargetAnswer,
    explanation: `"${item.word}": ${getWordMeaning(item, appLang)} "${item.example}"`,
  };
}

function createMatchPairsQuestion(
  item: VocabularyItem,
  allVocab: VocabularyItem[],
  appLang: AppLanguage
): Question {
  const otherItems = shuffle(allVocab.filter((v) => v.id !== item.id)).slice(0, 3);
  const selected = [item, ...otherItems];

  const pairs: PairMatchItem[] = selected.map((v) => ({
    id: v.id,
    left: formatChallengeText(v.word, true),
    right: formatChallengeText(getWordTranslation(v, appLang), true),
  }));

  return {
    id: `q-pair-${item.id}-${Math.random().toString(36).substring(2, 7)}`,
    exerciseType: 'match_pairs',
    vocabItem: item,
    prompt: formatChallengeText(item.word, true),
    correctAnswer: 'all_paired',
    explanation: `${getWordMeaning(item, appLang)}`,
    pairs,
  };
}

function createSynonymAntonymQuestion(
  item: VocabularyItem,
  allVocab: VocabularyItem[],
  subtype: 'synonym' | 'antonym',
  appLang: AppLanguage
): Question {
  const isSynonym = subtype === 'synonym';
  const rawTargetAnswer = isSynonym
    ? item.synonyms?.[0] || getWordTranslation(item, appLang)
    : item.antonyms?.[0] || getWordTranslation(item, appLang);

  const targetAnswer = formatChallengeText(rawTargetAnswer, true);

  const distractors = allVocab
    .flatMap((v) => (isSynonym ? v.synonyms || [v.word] : v.antonyms || [v.word]))
    .map((w) => formatChallengeText(w, true))
    .filter((w) => w.toLowerCase() !== targetAnswer.toLowerCase());

  const chosenDistractors = shuffle(Array.from(new Set(distractors))).slice(0, 3);
  const options = shuffle([targetAnswer, ...chosenDistractors]);

  return {
    id: `q-syn-${item.id}-${Math.random().toString(36).substring(2, 7)}`,
    exerciseType: 'synonym_antonym',
    questionSubtype: subtype,
    vocabItem: item,
    prompt: `"${formatChallengeText(item.word, true)}"`,
    promptContext: `${getWordTranslation(item, appLang)}`,
    options,
    correctAnswer: targetAnswer,
    explanation: `"${formatChallengeText(item.word, true)}" (${formatChallengeText(getWordTranslation(item, appLang), true)}): "${targetAnswer}". ${getWordMeaning(item, appLang)}`,
  };
}
