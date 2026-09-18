import type { WordItem } from '../types';

// Web Speech API 文字轉語音輔助函式
export const speakText = (text: string, rate: number = 0.9, lang: string = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  window.speechSynthesis.cancel(); // 停止先前的發音

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;

  // 優先選擇高品質英文語音
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha')));
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// 依當前腔調設定取得對應音標與國旗標籤
export const getPhoneticInfo = (
  word: WordItem,
  speechLang: string = 'en-US'
): { label: string; flag: string; phonetic: string; altLabel?: string; altPhonetic?: string } => {
  const isUk = speechLang === 'en-GB';
  const isAu = speechLang === 'en-AU';
  const wantsUk = isUk || isAu;

  if (wantsUk) {
    return {
      label: isAu ? 'AU/UK' : 'UK',
      flag: isAu ? '🇦🇺' : '🇬🇧',
      phonetic: word.phoneticUk || word.phonetic,
      altLabel: 'US',
      altPhonetic: word.phonetic,
    };
  }

  return {
    label: 'US',
    flag: '🇺🇸',
    phonetic: word.phonetic,
    altLabel: word.phoneticUk ? 'UK' : undefined,
    altPhonetic: word.phoneticUk,
  };
};

// 手機觸覺震動回饋 (Haptic Feedback)
export const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' = 'light') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'light') navigator.vibrate(15);
      else if (type === 'medium') navigator.vibrate(30);
      else if (type === 'success') navigator.vibrate([20, 50, 20]);
      else if (type === 'warning') navigator.vibrate([40, 60, 40]);
    } catch {
      // 忽略部分瀏覽器限制
    }
  }
};
