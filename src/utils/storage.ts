import type { WordItem, UserWordProgress, UserStats } from '../types';
import { INITIAL_VOCABULARY } from '../data/vocabulary';

const STORAGE_KEYS = {
  VOCAB_PROGRESS: 'voyage_vocab_progress_v1',
  CUSTOM_VOCAB: 'voyage_vocab_custom_v1',
  USER_STATS: 'voyage_vocab_stats_v1',
  SETTINGS: 'voyage_vocab_settings_v1',
};

export interface AppSettings {
  speechRate: number;
  speechLang: string;
  hapticEnabled: boolean;
  autoSpeak: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  speechRate: 0.9,
  speechLang: 'en-US',
  hapticEnabled: true,
  autoSpeak: true,
};

// 取得全部單字 (內建 + 使用者自訂)
export const getAllWords = (): WordItem[] => {
  try {
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_VOCAB);
    const customWords: WordItem[] = custom ? JSON.parse(custom) : [];
    return [...INITIAL_VOCABULARY, ...customWords];
  } catch {
    return INITIAL_VOCABULARY;
  }
};

// 儲存自訂單字
export const saveCustomWord = (word: Omit<WordItem, 'id'>): WordItem => {
  const allCustom = getCustomWords();
  const newWord: WordItem = {
    ...word,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  };
  const updated = [newWord, ...allCustom];
  localStorage.setItem(STORAGE_KEYS.CUSTOM_VOCAB, JSON.stringify(updated));
  return newWord;
};

export const getCustomWords = (): WordItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VOCAB);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// 取得所有單字的學習進度 Map
export const getWordProgressMap = (): Record<string, UserWordProgress> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCAB_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// 記錄單字複習反饋 (0: 忘記/生疏, 1: 模糊, 2: 掌握)
export const recordWordReview = (wordId: string, rating: 'again' | 'hard' | 'good' | 'easy'): UserWordProgress => {
  const progressMap = getWordProgressMap();
  const current = progressMap[wordId] || {
    wordId,
    box: 0,
    lastReviewedAt: 0,
    nextReviewAt: 0,
    reviewCount: 0,
    correctCount: 0,
    isStarred: false,
  };

  const now = Date.now();
  let nextBox = current.box;

  // Leitner 簡易箱子排程
  if (rating === 'again') {
    nextBox = 0; // 忘記，回歸第一層
  } else if (rating === 'hard') {
    nextBox = Math.max(0, current.box);
  } else if (rating === 'good') {
    nextBox = Math.min(3, current.box + 1);
  } else if (rating === 'easy') {
    nextBox = Math.min(3, current.box + 2);
  }

  // 下次複習時間：0盒: 1小時後, 1盒: 1天後, 2盒: 3天後, 3盒: 7天後
  const intervalsDays = [0.04, 1, 3, 7];
  const nextIntervalMs = intervalsDays[nextBox] * 24 * 60 * 60 * 1000;

  const updated: UserWordProgress = {
    ...current,
    box: nextBox,
    lastReviewedAt: now,
    nextReviewAt: now + nextIntervalMs,
    reviewCount: current.reviewCount + 1,
    correctCount: rating === 'again' ? current.correctCount : current.correctCount + 1,
  };

  progressMap[wordId] = updated;
  localStorage.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(progressMap));

  // 更新統計
  updateStatsOnReview(rating !== 'again');

  return updated;
};

// 切換星標
export const toggleStarWord = (wordId: string): boolean => {
  const progressMap = getWordProgressMap();
  const current = progressMap[wordId] || {
    wordId,
    box: 0,
    lastReviewedAt: 0,
    nextReviewAt: 0,
    reviewCount: 0,
    correctCount: 0,
    isStarred: false,
  };

  const newStarred = !current.isStarred;
  progressMap[wordId] = {
    ...current,
    isStarred: newStarred,
  };
  localStorage.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(progressMap));
  return newStarred;
};

// 使用者學習統計 (Streak 連勝)
export const getUserStats = (): UserStats => {
  const todayStr = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (!raw) {
      return { streakDays: 1, lastActiveDate: todayStr, totalMastered: 0, totalReviewed: 0 };
    }
    const stats: UserStats = JSON.parse(raw);
    return stats;
  } catch {
    return { streakDays: 1, lastActiveDate: todayStr, totalMastered: 0, totalReviewed: 0 };
  }
};

export const updateStatsOnReview = (isCorrect: boolean) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const stats = getUserStats();

  let streak = stats.streakDays;
  if (stats.lastActiveDate !== todayStr) {
    const lastDate = new Date(stats.lastActiveDate);
    const today = new Date(todayStr);
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  const progressMap = getWordProgressMap();
  const totalMastered = Object.values(progressMap).filter(p => p.box >= 2).length;

  const newStats: UserStats = {
    streakDays: streak,
    lastActiveDate: todayStr,
    totalMastered,
    totalReviewed: stats.totalReviewed + (isCorrect ? 1 : 0),
  };

  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(newStats));
};

// 設定儲存
export const getAppSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveAppSettings = (settings: Partial<AppSettings>): AppSettings => {
  const current = getAppSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
};
