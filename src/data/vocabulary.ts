import type { WordItem } from '../types';
import { AIRPORT_VOCABULARY } from './vocab/airport';
import { HOTEL_VOCABULARY } from './vocab/hotel';
import { DINING_VOCABULARY } from './vocab/dining';
import { SHOPPING_VOCABULARY } from './vocab/shopping';
import { TRANSPORT_VOCABULARY } from './vocab/transport';
import { DAILY_VOCABULARY } from './vocab/daily';
import { EMERGENCY_VOCABULARY } from './vocab/emergency';
import { SOCIAL_VOCABULARY } from './vocab/social';
import { CULTURE_VOCABULARY } from './vocab/culture';
import { DIGITAL_VOCABULARY } from './vocab/digital';
import { SERVICE_VOCABULARY } from './vocab/service';

export {
  AIRPORT_VOCABULARY,
  HOTEL_VOCABULARY,
  DINING_VOCABULARY,
  SHOPPING_VOCABULARY,
  TRANSPORT_VOCABULARY,
  DAILY_VOCABULARY,
  EMERGENCY_VOCABULARY,
  SOCIAL_VOCABULARY,
  CULTURE_VOCABULARY,
  DIGITAL_VOCABULARY,
  SERVICE_VOCABULARY
};

/**
 * 完整初始單字庫：
 * 涵蓋機場出入境 (25)、飯店住宿 (25)、餐飲美食 (30)、購物退稅 (25)、
 * 交通出行 (25)、日常生活 (30)、緊急醫療 (30)、社交破冰 (35)、文化生活 (35)、
 * 數位與戶外 (25)、爭議與酒吧 (25)，共計 310 個全場景黃金詞彙。
 * 每一詞彙均配備 Cambridge 標準美式 (phonetic) 與英式/澳式 (phoneticUk) 雙 IPA 音標。
 */
export const INITIAL_VOCABULARY: WordItem[] = [
  ...AIRPORT_VOCABULARY,
  ...HOTEL_VOCABULARY,
  ...DINING_VOCABULARY,
  ...SHOPPING_VOCABULARY,
  ...TRANSPORT_VOCABULARY,
  ...DAILY_VOCABULARY,
  ...EMERGENCY_VOCABULARY,
  ...SOCIAL_VOCABULARY,
  ...CULTURE_VOCABULARY,
  ...DIGITAL_VOCABULARY,
  ...SERVICE_VOCABULARY
];
