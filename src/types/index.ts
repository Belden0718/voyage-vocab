export type CategoryType = 
  | 'airport'      // 機場出入境
  | 'hotel'        // 飯店住宿
  | 'dining'       // 餐廳美食
  | 'shopping'     // 購物退稅
  | 'transport'    // 交通指路
  | 'daily'        // 生活常用口語
  | 'emergency';   // 緊急醫療

export interface WordItem {
  id: string;
  word: string;
  phonetic: string; // 美式音標 (US IPA)
  phoneticUk?: string; // 英式音標 (UK/AU IPA)
  partOfSpeech: string;
  translation: string;
  category: CategoryType;
  categoryLabel: string;
  example: string;
  exampleTranslation: string;
  tip?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

export interface UserWordProgress {
  wordId: string;
  box: number; // 0: 新詞, 1: 學習中, 2: 熟悉, 3: 精通 (Leitner 盒子)
  lastReviewedAt: number;
  nextReviewAt: number;
  reviewCount: number;
  correctCount: number;
  isStarred: boolean;
}

export interface PhraseItem {
  id: string;
  category: CategoryType;
  categoryLabel: string;
  en: string;
  zh: string;
  situation: string; // 使用情境
  tags?: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'meaning' | 'listening' | 'fillInBlank';
  word: WordItem;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserStats {
  streakDays: number;
  lastActiveDate: string;
  totalMastered: number;
  totalReviewed: number;
}
