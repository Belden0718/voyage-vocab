import type { BadgeItem, UserStats, WordItem, UserWordProgress } from '../types';

export interface LevelConfig {
  level: number;
  title: string;
  minExp: number;
  icon: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, title: '旅行新手', minExp: 0, icon: '🧳' },
  { level: 2, title: '登機探索家', minExp: 100, icon: '🛫' },
  { level: 3, title: '自由行背包客', minExp: 250, icon: '🎒' },
  { level: 4, title: '在地漫遊者', minExp: 450, icon: '🗺️' },
  { level: 5, title: '街頭暢談家', minExp: 700, icon: '☕' },
  { level: 6, title: '資深旅行家', minExp: 1000, icon: '🏨' },
  { level: 7, title: '環球冒險家', minExp: 1400, icon: '🧭' },
  { level: 8, title: '雙語旅行大師', minExp: 1900, icon: '👑' },
  { level: 9, title: '傳奇世界旅者', minExp: 2500, icon: '🌟' },
  { level: 10, title: '神級英語通', minExp: 3200, icon: '🚀' },
];

export const ALL_BADGES: BadgeItem[] = [
  {
    id: 'badge-first-quiz',
    name: '初試啼聲',
    description: '完成第 1 次測驗小挑戰',
    icon: '🎯',
    category: 'quiz'
  },
  {
    id: 'badge-perfect-score',
    name: '滿分金牌',
    description: '任一次測驗獲得 100% 滿分',
    icon: '💯',
    category: 'quiz'
  },
  {
    id: 'badge-quiz-veteran',
    name: '測驗達人',
    description: '累計完成 5 次測驗小挑戰',
    icon: '🏅',
    category: 'quiz'
  },
  {
    id: 'badge-streak-3',
    name: '持之以恆',
    description: '連續學習達 3 天',
    icon: '🔥',
    category: 'streak'
  },
  {
    id: 'badge-master-10',
    name: '詞彙新星',
    description: '精通掌握超過 10 個核心單字',
    icon: '📚',
    category: 'mastery'
  },
  {
    id: 'badge-master-30',
    name: '詞彙高手',
    description: '精通掌握超過 30 個核心單字',
    icon: '💎',
    category: 'mastery'
  },
  {
    id: 'badge-airport-pro',
    name: '飛航無阻',
    description: '機場飛行分類掌握超過 10 個單字',
    icon: '✈️',
    category: 'category'
  },
  {
    id: 'badge-dining-guru',
    name: '美食老饕',
    description: '餐廳美食分類掌握超過 10 個單字',
    icon: '🍽️',
    category: 'category'
  },
  {
    id: 'badge-hotel-vip',
    name: '尊榮貴賓',
    description: '飯店住宿分類掌握超過 10 個單字',
    icon: '🏨',
    category: 'category'
  },
  {
    id: 'badge-emergency-safe',
    name: '自救守護者',
    description: '緊急醫療分類掌握超過 10 個單字',
    icon: '🚑',
    category: 'category'
  },
  {
    id: 'badge-social-butterfly',
    name: '社交蝴蝶',
    description: '社交破冰分類掌握超過 10 個單字',
    icon: '🦋',
    category: 'category'
  },
  {
    id: 'badge-culture-explorer',
    name: '文化漫遊者',
    description: '文化生活分類掌握超過 10 個單字',
    icon: '🧭',
    category: 'category'
  },
  {
    id: 'badge-digital-nomad',
    name: '數位達人',
    description: '數位與戶外分類掌握超過 10 個單字',
    icon: '📱',
    category: 'category'
  },
  {
    id: 'badge-nightlife-king',
    name: '酒吧之王',
    description: '爭議與酒吧分類掌握超過 10 個單字',
    icon: '🍻',
    category: 'category'
  },
];

/**
 * 依據 EXP 計算目前等級與進度資訊
 */
export const calculateLevelInfo = (exp: number) => {
  let currentConfig = LEVEL_CONFIGS[0];
  let nextConfig: LevelConfig | null = LEVEL_CONFIGS[1];

  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_CONFIGS[i].minExp) {
      currentConfig = LEVEL_CONFIGS[i];
      nextConfig = LEVEL_CONFIGS[i + 1] || null;
      break;
    }
  }

  const minExp = currentConfig.minExp;
  const maxExp = nextConfig ? nextConfig.minExp : minExp + 1000;
  const expInLevel = exp - minExp;
  const expNeeded = maxExp - minExp;
  const progressPercent = nextConfig 
    ? Math.min(100, Math.round((expInLevel / expNeeded) * 100))
    : 100;

  return {
    level: currentConfig.level,
    title: currentConfig.title,
    icon: currentConfig.icon,
    currentExp: exp,
    minExp,
    maxExp,
    expInLevel,
    expNeeded,
    progressPercent,
    isMaxLevel: !nextConfig,
  };
};

/**
 * 檢查並發放符合條件的徽章
 */
export const checkBadgeUnlocks = (
  stats: UserStats,
  words: WordItem[],
  progressMap: Record<string, UserWordProgress>
): { newlyUnlocked: BadgeItem[]; updatedBadges: string[] } => {
  const currentBadgeIds = new Set(stats.badges || []);
  const newlyUnlocked: BadgeItem[] = [];

  // 計算各分類已掌握數量 (box >= 2)
  const countMasteredByCategory = (cat: string) => {
    return words
      .filter(w => w.category === cat)
      .filter(w => (progressMap[w.id]?.box ?? 0) >= 2).length;
  };

  ALL_BADGES.forEach(badge => {
    if (currentBadgeIds.has(badge.id)) return;

    let unlocked = false;
    switch (badge.id) {
      case 'badge-first-quiz':
        if (stats.quizCompletedCount >= 1) unlocked = true;
        break;
      case 'badge-perfect-score':
        if (stats.perfectQuizCount >= 1) unlocked = true;
        break;
      case 'badge-quiz-veteran':
        if (stats.quizCompletedCount >= 5) unlocked = true;
        break;
      case 'badge-streak-3':
        if (stats.streakDays >= 3) unlocked = true;
        break;
      case 'badge-master-10':
        if (stats.totalMastered >= 10) unlocked = true;
        break;
      case 'badge-master-30':
        if (stats.totalMastered >= 30) unlocked = true;
        break;
      case 'badge-airport-pro':
        if (countMasteredByCategory('airport') >= 10) unlocked = true;
        break;
      case 'badge-dining-guru':
        if (countMasteredByCategory('dining') >= 10) unlocked = true;
        break;
      case 'badge-hotel-vip':
        if (countMasteredByCategory('hotel') >= 10) unlocked = true;
        break;
      case 'badge-emergency-safe':
        if (countMasteredByCategory('emergency') >= 10) unlocked = true;
        break;
      case 'badge-social-butterfly':
        if (countMasteredByCategory('social') >= 10) unlocked = true;
        break;
      case 'badge-culture-explorer':
        if (countMasteredByCategory('culture') >= 10) unlocked = true;
        break;
      case 'badge-digital-nomad':
        if (countMasteredByCategory('digital') >= 10) unlocked = true;
        break;
      case 'badge-nightlife-king':
        if (countMasteredByCategory('service') >= 10) unlocked = true;
        break;
    }

    if (unlocked) {
      newlyUnlocked.push(badge);
      currentBadgeIds.add(badge.id);
    }
  });

  return {
    newlyUnlocked,
    updatedBadges: Array.from(currentBadgeIds)
  };
};
