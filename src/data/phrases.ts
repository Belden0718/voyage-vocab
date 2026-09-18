import type { PhraseItem } from '../types';

export const SURVIVAL_PHRASES: PhraseItem[] = [
  // 機場
  {
    id: 'p-1',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Where can I find the baggage claim for Flight CI004?',
    zh: '請問 CI004 班機的行李提領處在哪裡？',
    situation: '領行李時'
  },
  {
    id: 'p-2',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'I am here for vacation and will be staying for 7 days.',
    zh: '我是來度假旅遊的，預計停留 7 天。',
    situation: '海關入境審查被詢問目的時'
  },
  {
    id: 'p-3',
    category: 'airport',
    categoryLabel: '機場出入境',
    en: 'Excuse me, could you point me to Terminal 2?',
    zh: '不好意思，請問二號航廈要往哪裡走？',
    situation: '找航廈或轉機時'
  },

  // 飯店
  {
    id: 'p-4',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Could we leave our luggage here before check-in?',
    zh: '在辦理入住手續前，我們可以先把行李寄放在這裡嗎？',
    situation: '早到飯店想先輕裝出遊時'
  },
  {
    id: 'p-5',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'What is the Wi-Fi password for the guest network?',
    zh: '請問客用無線網路的 Wi-Fi 密碼是什麼？',
    situation: '詢問網路連線時'
  },
  {
    id: 'p-6',
    category: 'hotel',
    categoryLabel: '飯店住宿',
    en: 'Could I have extra towels and toilet paper, please?',
    zh: '可以麻煩再提供額外的毛巾與衛生紙嗎？',
    situation: '向客房服務索取備品時'
  },

  // 餐廳
  {
    id: 'p-7',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Table for two, please. Do you have an English menu?',
    zh: '兩位用餐，請問有英文菜單嗎？',
    situation: '進餐廳帶位時'
  },
  {
    id: 'p-8',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'What do you recommend as the signature dish here?',
    zh: '請問你們這裡最推薦的招牌菜是什麼？',
    situation: '請店員推薦料理時'
  },
  {
    id: 'p-9',
    category: 'dining',
    categoryLabel: '餐廳美食',
    en: 'Check, please. Can we pay separately by credit card?',
    zh: '買單結帳，請問我們可以分開刷信用卡嗎？',
    situation: '用餐完畢結帳時'
  },

  // 購物
  {
    id: 'p-10',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Can I try this on in a size larger / smaller?',
    zh: '這件我可以試穿大一號 / 小一號的尺碼嗎？',
    situation: '服飾店挑選尺寸時'
  },
  {
    id: 'p-11',
    category: 'shopping',
    categoryLabel: '購物退稅',
    en: 'Does this purchase qualify for a tax refund?',
    zh: '這筆消費有符合免稅/退稅標準嗎？',
    situation: '結帳前確認退稅手續時'
  },

  // 交通指路
  {
    id: 'p-12',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'Excuse me, does this bus go to Central Station?',
    zh: '不好意思，請問這班公車有到中央車站嗎？',
    situation: '上公車前向司機確認路線'
  },
  {
    id: 'p-13',
    category: 'transport',
    categoryLabel: '交通指路',
    en: 'How many stops is it until the Museum of Modern Art?',
    zh: '請問到現代藝術博物館還要坐幾站？',
    situation: '搭乘地鐵或電車時'
  },

  // 緊急狀況
  {
    id: 'p-14',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I lost my passport and wallet. Please help me contact the police.',
    zh: '我的護照與皮夾遺失了，請幫我聯絡警察局。',
    situation: '遺失重要證件急難求救時'
  },
  {
    id: 'p-15',
    category: 'emergency',
    categoryLabel: '緊急與醫療',
    en: 'I am feeling severe stomach pain. Where is the nearest hospital?',
    zh: '我胃部非常劇痛，請問最近的醫院在哪裡？',
    situation: '身體突發不適求助'
  }
];
