import type { WordItem, QuizQuestion } from '../types';

// 洗牌函式
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generateQuizSet = (
  allWords: WordItem[],
  count: number = 10,
  categoryFilter?: string
): QuizQuestion[] => {
  const targetWords = categoryFilter && categoryFilter !== 'all'
    ? allWords.filter(w => w.category === categoryFilter)
    : allWords;

  const pool = targetWords.length >= 4 ? targetWords : allWords;
  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((word, index) => {
    // 隨機決定題型: 0=英選中, 1=中選英, 2=聽力題
    const typeRoll = index % 3;
    let type: QuizQuestion['type'] = 'meaning';
    if (typeRoll === 1) type = 'fillInBlank';
    if (typeRoll === 2) type = 'listening';

    // 取得 3 個干擾選項
    const others = allWords.filter(w => w.id !== word.id);
    const distractorCandidates = shuffle(others).slice(0, 3);

    let prompt = '';
    let correctAnswer = '';
    let options: string[] = [];

    if (type === 'meaning') {
      prompt = `請問「${word.word}」的意思是？`;
      correctAnswer = word.translation;
      options = shuffle([correctAnswer, ...distractorCandidates.map(d => d.translation)]);
    } else if (type === 'fillInBlank') {
      prompt = `下列哪一個英文代表「${word.translation}」？`;
      correctAnswer = word.word;
      options = shuffle([correctAnswer, ...distractorCandidates.map(d => d.word)]);
    } else {
      // listening
      prompt = '請仔細聆聽發音，選出正確的英文單字：';
      correctAnswer = word.word;
      options = shuffle([correctAnswer, ...distractorCandidates.map(d => d.word)]);
    }

    return {
      id: `q-${word.id}-${index}`,
      type,
      word,
      prompt,
      options,
      correctAnswer,
      explanation: `${word.word} (${word.phonetic}) [${word.partOfSpeech}] : ${word.translation}\n例句: ${word.example}\n翻譯: ${word.exampleTranslation}`,
    };
  });
};
