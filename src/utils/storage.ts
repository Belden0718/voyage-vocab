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

export const setCustomWords = (words: WordItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_VOCAB, JSON.stringify(words));
};

// 舊版單字 ID 映射表 (用於平滑升級用戶歷史進度)
const LEGACY_ID_MAP: Record<string, string> = {
  'vocab-1': 'boarding pass',
  'vocab-2': 'luggage carousel',
  'vocab-3': 'carry-on',
  'vocab-4': 'customs declaration',
  'vocab-5': 'layover',
  'vocab-6': 'excess baggage',
  'vocab-7': 'gate change',
  'vocab-8': 'turbulence',
  'vocab-9': 'jet lag',
  'vocab-10': 'aisle seat',
  'vocab-11': 'final call',
  'vocab-12': 'duty-free',
  'vocab-13': 'complimentary',
  'vocab-14': 'concierge',
  'vocab-15': 'amenities',
  'vocab-16': 'wake-up call',
  'vocab-17': 'deposit',
  'vocab-18': 'late check-out',
  'vocab-19': 'housekeeping',
  'vocab-20': 'travel adapter',
  'vocab-21': 'luggage storage',
  'vocab-22': 'key card',
  'vocab-23': 'reservation',
  'vocab-24': 'allergic to',
  'vocab-25': 'tap water',
  'vocab-26': 'to go / take out',
  'vocab-27': 'split the bill',
  'vocab-28': 'vegetarian',
  'vocab-29': 'gluten-free',
  'vocab-30': 'medium-rare',
  'vocab-31': 'dressing on the side',
  'vocab-32': 'gratuity',
  'vocab-33': 'specialty',
  'vocab-34': 'cutlery',
  'vocab-35': 'fitting room',
  'vocab-36': 'tax refund',
  'vocab-37': 'out of stock',
  'vocab-38': 'receipt',
  'vocab-39': 'bargain',
  'vocab-40': 'clearance sale',
  'vocab-41': 'contactless payment',
  'vocab-42': 'warranty',
  'vocab-43': 'buy one get one free',
  'vocab-44': 'exchange policy',
  'vocab-45': 'platform',
  'vocab-46': 'transfer',
  'vocab-47': 'one-way ticket',
  'vocab-48': 'pedestrian',
  'vocab-49': 'fare',
  'vocab-50': 'shuttle bus',
  'vocab-51': 'rush hour',
  'vocab-52': 'car rental',
  'vocab-53': 'intersection',
  'vocab-54': 'detour',
  'vocab-55': 'No worries',
  'vocab-56': 'under the weather',
  'vocab-57': 'Catch you later',
  'vocab-59': 'Hit me up',
  'vocab-61': 'Take your time',
  'vocab-62': 'Call it a day',
  'vocab-63': 'On the same page',
  'vocab-64': 'That makes sense',
  'vocab-65': 'prescription',
  'vocab-66': 'lost and found',
  'vocab-67': 'painkiller',
  'vocab-68': 'emergency exit',
  'vocab-69': 'ambulance',
  'vocab-70': 'embassy',
  'vocab-71': 'pickpocket',
  'vocab-72': 'police report',
  'vocab-73': 'bandage',
  'vocab-74': 'stomachache',
  'vocab-75': 'boarding gate',
  'vocab-76': 'currency exchange',
  'vocab-77': 'eSIM',
  'vocab-78': 'power bank',
  'vocab-79': 'no-show',
  'vocab-80': 'front desk',
  'vocab-81': 'beverage',
  'vocab-82': 'appetizer',
  'vocab-83': 'dessert',
  'vocab-84': 'doggy bag',
  'vocab-85': 'window shopping',
  'vocab-86': 'price tag',
  'vocab-87': 'sold out',
  'vocab-88': 'roundabout',
  'vocab-89': 'expressway',
  'vocab-90': 'transit pass',
  'vocab-91': 'Hang out',
  'vocab-92': 'Sleep on it',
  'vocab-93': 'Hands down',
  'vocab-94': 'Keep in touch',
  'vocab-95': 'clinic',
  'vocab-96': 'food poisoning',
  'vocab-97': 'first aid kit',
  'vocab-98': 'sunscreen',
  'vocab-99': 'insect repellent',
  'vocab-100': 'sprain',
  'vocab-101': 'overhead bin',
  'vocab-102': 'passport control',
  'vocab-103': 'direct flight',
  'vocab-104': 'bellhop',
  'vocab-105': 'minibar',
  'vocab-106': 'suite',
  'vocab-107': 'entree',
  'vocab-108': 'napkin',
  'vocab-109': 'refill',
  'vocab-110': 'coupon',
  'vocab-111': 'cashier',
  'vocab-112': 'sales tax',
  'vocab-113': 'gas station',
  'vocab-114': 'parking lot',
  'vocab-115': 'speed limit',
  'vocab-116': 'Cheers',
  'vocab-117': 'Count me in',
  'vocab-118': 'My bad',
  'vocab-119': 'pharmacy',
  'vocab-120': 'diarrhea',
};

const normalizeText = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

export const migrateLegacyProgressMap = (rawMap: Record<string, UserWordProgress>): Record<string, UserWordProgress> => {
  const allCurrent = INITIAL_VOCABULARY;
  const currentIdSet = new Set(allCurrent.map(w => w.id));
  
  const textToIdMap = new Map<string, string>();
  allCurrent.forEach(w => {
    textToIdMap.set(normalizeText(w.word), w.id);
  });

  const migrated: Record<string, UserWordProgress> = {};
  let hasChanges = false;

  Object.entries(rawMap).forEach(([id, progress]) => {
    if (currentIdSet.has(id) || id.startsWith('custom-')) {
      migrated[id] = progress;
      return;
    }

    const legacyText = LEGACY_ID_MAP[id];
    let matchedNewId: string | undefined;

    if (legacyText) {
      matchedNewId = textToIdMap.get(normalizeText(legacyText));
    }

    if (matchedNewId) {
      migrated[matchedNewId] = {
        ...progress,
        wordId: matchedNewId,
      };
      hasChanges = true;
    } else {
      migrated[id] = progress;
    }
  });

  if (hasChanges) {
    try {
      localStorage.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(migrated));
    } catch {
      // ignore
    }
  }

  return migrated;
};

export const setWordProgressMap = (progressMap: Record<string, UserWordProgress>) => {
  localStorage.setItem(STORAGE_KEYS.VOCAB_PROGRESS, JSON.stringify(progressMap));
};

// 取得所有單字的學習進度 Map (自動遷移舊版進度)
export const getWordProgressMap = (): Record<string, UserWordProgress> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCAB_PROGRESS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return migrateLegacyProgressMap(parsed);
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

// 預設統計結構
const DEFAULT_USER_STATS: UserStats = {
  streakDays: 1,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  totalMastered: 0,
  totalReviewed: 0,
  exp: 0,
  level: 1,
  levelTitle: '旅行新手',
  badges: [],
  quizCompletedCount: 0,
  perfectQuizCount: 0,
};

// 使用者學習統計 (Streak、EXP 與等級)
export const getUserStats = (): UserStats => {
  const todayStr = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (!raw) {
      return { ...DEFAULT_USER_STATS, lastActiveDate: todayStr };
    }
    const stats: UserStats = JSON.parse(raw);
    const title = (!stats.levelTitle || stats.levelTitle === '出發準備生') ? '旅行新手' : stats.levelTitle;
    return {
      ...DEFAULT_USER_STATS,
      ...stats,
      badges: stats.badges || [],
      exp: stats.exp ?? 0,
      level: stats.level ?? 1,
      levelTitle: title,
      quizCompletedCount: stats.quizCompletedCount ?? 0,
      perfectQuizCount: stats.perfectQuizCount ?? 0,
    };
  } catch {
    return { ...DEFAULT_USER_STATS, lastActiveDate: todayStr };
  }
};

export const saveUserStats = (stats: UserStats): UserStats => {
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  return stats;
};

// 增加經驗值並儲存
export const addExp = (amount: number): UserStats => {
  const current = getUserStats();
  const newExp = Math.max(0, current.exp + amount);
  const updated: UserStats = {
    ...current,
    exp: newExp,
  };
  return saveUserStats(updated);
};

// 記錄測驗完成統計 (獲得經驗值與測驗計數)
export const recordQuizCompletedStats = (score: number, totalQuestions: number): { stats: UserStats; expEarned: number } => {
  const current = getUserStats();
  const isPerfect = score === totalQuestions && totalQuestions > 0;
  
  // 經驗值：每題 20 EXP，滿分額外獎勵 60 EXP
  const baseExp = score * 20;
  const bonusExp = isPerfect ? 60 : 0;
  const expEarned = baseExp + bonusExp;

  const updated: UserStats = {
    ...current,
    exp: current.exp + expEarned,
    quizCompletedCount: current.quizCompletedCount + 1,
    perfectQuizCount: current.perfectQuizCount + (isPerfect ? 1 : 0),
  };

  saveUserStats(updated);
  return { stats: updated, expEarned };
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

  // 翻卡複習答對獲得 5 EXP
  const expGain = isCorrect ? 5 : 0;

  const newStats: UserStats = {
    ...stats,
    streakDays: streak,
    lastActiveDate: todayStr,
    totalMastered,
    totalReviewed: stats.totalReviewed + (isCorrect ? 1 : 0),
    exp: stats.exp + expGain,
  };

  saveUserStats(newStats);
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
