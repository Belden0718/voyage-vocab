import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { WordItem } from '../types';
import { speakText, triggerHaptic } from '../utils/speech';
import { saveCustomWord } from '../utils/storage';
import { Volume2, ExternalLink, X, BookOpen, Plus, Check, Layers } from 'lucide-react';

interface InteractiveSentenceProps {
  sentence: string;
  translation?: string;
  wordsPool?: WordItem[];
  speechRate?: number;
  speechLang?: string;
  className?: string;
  isDark?: boolean;
  onWordSaved?: () => void;
}

// 常用高頻動詞片語與慣用語 (Phrasal Verbs & Idioms) 智慧辨識庫
const PHRASAL_VERBS_MAP: Record<string, { base: string; pos: string; trans: string; explanation?: string; phonetic?: string }> = {
  // turn out 系列
  'turn out': { base: 'turn out', pos: 'phr v.', trans: '結果是、原來是、最終發現', explanation: '由 turn (轉向) + out (向外) 組成，表示事情發展揭曉的最終結果', phonetic: '/tɜ:rn aʊt/' },
  'turned out': { base: 'turn out', pos: 'phr v.', trans: '結果是、原來是 (過去式)', explanation: '由 turn + out 組成，表示事情發展揭曉的最終結果 (如 It turned out that...)', phonetic: '/tɜ:rnd aʊt/' },
  'turns out': { base: 'turn out', pos: 'phr v.', trans: '結果是、原來是 (第三人稱單數)', explanation: '口語常作 Turns out (that)...', phonetic: '/tɜ:rnz aʊt/' },
  'turning out': { base: 'turn out', pos: 'phr v.', trans: '結果演變為... (進行式)', explanation: '表示事情發展進展', phonetic: '/ˈtɜ:rnɪŋ aʊt/' },

  // check in / out 系列
  'check in': { base: 'check in', pos: 'phr v.', trans: '辦理報到、登記手續 (飯店入住/機場登機)', explanation: '抵達時向櫃檯登記報到', phonetic: '/tʃek ɪn/' },
  'checked in': { base: 'check in', pos: 'phr v.', trans: '辦理報到手續 (過去式)', explanation: '已完成登機或入住登記', phonetic: '/tʃekt ɪn/' },
  'check out': { base: 'check out', pos: 'phr v.', trans: '退房、結帳離開；檢查查看', explanation: '離店時結清帳單', phonetic: '/tʃek aʊt/' },
  'checked out': { base: 'check out', pos: 'phr v.', trans: '辦理退房手續 (過去式)', explanation: '已完成退房結帳', phonetic: '/tʃekt aʊt/' },

  // pick up / drop off
  'pick up': { base: 'pick up', pos: 'phr v.', trans: '接送、領取 (行李/票券)、拿起', explanation: '去特定地點接人或取件', phonetic: '/pɪk ʌp/' },
  'picked up': { base: 'pick up', pos: 'phr v.', trans: '接送、領取 (過去式)', explanation: '已取件或接載完畢', phonetic: '/pɪkt ʌp/' },
  'drop off': { base: 'drop off', pos: 'phr v.', trans: '放客下車、繳還 (租車/借物)', explanation: '順路載人抵達或歸還車輛', phonetic: '/drɑ:p ɔ:f/' },
  'dropped off': { base: 'drop off', pos: 'phr v.', trans: '放客下車、繳還 (過去式)', explanation: '已還車或完成送達', phonetic: '/drɑ:pt ɔ:f/' },

  // take off
  'take off': { base: 'take off', pos: 'phr v.', trans: '(飛機) 起飛；脫下 (衣物)', explanation: '指飛機升空離開跑道，或脫去外套鞋帽', phonetic: '/teɪk ɔ:f/' },
  'took off': { base: 'take off', pos: 'phr v.', trans: '(飛機) 起飛；脫下 (過去式)', explanation: '飛機已升空', phonetic: '/tʊk ɔ:f/' },
  'taking off': { base: 'take off', pos: 'phr v.', trans: '(飛機) 起飛中 (進行式)', explanation: '正在加速升空中', phonetic: '/ˈteɪkɪŋ ɔ:f/' },

  // figure out / find out
  'figure out': { base: 'figure out', pos: 'phr v.', trans: '搞清楚、弄明白、想出解決辦法', explanation: '經由思考或觀察摸索出答案', phonetic: '/ˈfɪɡjər aʊt/' },
  'figured out': { base: 'figure out', pos: 'phr v.', trans: '搞清楚、弄明白 (過去式)', explanation: '已經理清頭緒', phonetic: '/ˈfɪɡjərd aʊt/' },
  'find out': { base: 'find out', pos: 'phr v.', trans: '發現、查明、打聽得知', explanation: '探聽或獲知未知資訊', phonetic: '/faɪnd aʊt/' },
  'found out': { base: 'find out', pos: 'phr v.', trans: '發現、查明 (過去式)', explanation: '已獲知相關資訊', phonetic: '/faʊnd aʊt/' },

  // look forward to
  'look forward to': { base: 'look forward to', pos: 'phr v.', trans: '滿心期待、盼望 (後接名詞/Ving)', explanation: '帶著興奮的心情等待某事到來', phonetic: '/lʊk ˈfɔ:rwərd tu:/' },
  'looking forward to': { base: 'look forward to', pos: 'phr v.', trans: '正滿心期待著', explanation: '社交信件與會話極常用的結尾敬語', phonetic: '/ˈlʊkɪŋ ˈfɔ:rwərd tu:/' },
  'looked forward to': { base: 'look forward to', pos: 'phr v.', trans: '期待、盼望 (過去式)', explanation: '過去所期待之事', phonetic: '/lʊkt ˈfɔ:rwərd tu:/' },

  // run out of
  'run out of': { base: 'run out of', pos: 'phr v.', trans: '用光、耗盡 (電量/水/現金/時間)', explanation: '某種消耗品或資源見底', phonetic: '/rʌn aʊt əv/' },
  'ran out of': { base: 'run out of', pos: 'phr v.', trans: '用光、耗盡 (過去式)', explanation: '資源已經消耗殆盡', phonetic: '/ræn aʊt əv/' },

  // catch up
  'catch up': { base: 'catch up', pos: 'phr v.', trans: '敘舊、聊近況；趕上進度', explanation: '很久沒見的朋友更新彼此近況', phonetic: '/kætʃ ʌp/' },
  'caught up': { base: 'catch up', pos: 'phr v.', trans: '敘舊、聊近況 (過去式)', explanation: '已敘舊或趕上進度', phonetic: '/kɔ:t ʌp/' },

  // get along
  'get along': { base: 'get along', pos: 'phr v.', trans: '相處融洽、合得來', explanation: '彼此互動順暢無摩擦 (get along with someone)', phonetic: '/ɡet əˈlɔ:ŋ/' },
  'got along': { base: 'get along', pos: 'phr v.', trans: '相處融洽 (過去式)', explanation: '彼此相處很好', phonetic: '/ɡɑ:t əˈlɔ:ŋ/' },

  // come across
  'come across': { base: 'come across', pos: 'phr v.', trans: '偶然遇見、碰巧發現', explanation: '非刻意尋找卻巧遇', phonetic: '/kʌm əˈkrɔ:s/' },
  'came across': { base: 'come across', pos: 'phr v.', trans: '偶然遇見、碰巧發現 (過去式)', explanation: '巧遇某人或發現某物', phonetic: '/keɪm əˈkrɔ:s/' },

  // set off / out
  'set off': { base: 'set off', pos: 'phr v.', trans: '出發、啟程、動身', explanation: '開始一趟旅程或行動', phonetic: '/set ɔ:f/' },
  'set out': { base: 'set out', pos: 'phr v.', trans: '出發、著手進行', explanation: '啟程或開始一項計畫', phonetic: '/set aʊt/' },

  // fill out
  'fill out': { base: 'fill out', pos: 'phr v.', trans: '填寫 (表格/入境卡/申請單)', explanation: '將空欄逐項填妥完整', phonetic: '/fɪl aʊt/' },
  'filled out': { base: 'fill out', pos: 'phr v.', trans: '填寫 (過去式)', explanation: '已填妥表格', phonetic: '/fɪld aʊt/' },

  // make sure
  'make sure': { base: 'make sure', pos: 'idiom', trans: '確認、確保、務必', explanation: '檢查以保證無誤 (Make sure to...)', phonetic: '/meɪk ʃʊr/' },
  'made sure': { base: 'make sure', pos: 'idiom', trans: '確認、確保 (過去式)', explanation: '已事先確認', phonetic: '/meɪd ʃʊr/' },

  // in advance
  'in advance': { base: 'in advance', pos: 'adv phr.', trans: '提前、預先、事先', explanation: '事情發生之前就先做好 (Book in advance)', phonetic: '/ɪn ədˈvæns/' },

  // on time / in time
  'on time': { base: 'on time', pos: 'adv phr.', trans: '準時、按時', explanation: '分秒不差依表定時間', phonetic: '/ɑ:n taɪm/' },
  'in time': { base: 'in time', pos: 'adv phr.', trans: '及時、來得及', explanation: '在最後期限或截止前趕上', phonetic: '/ɪn taɪm/' },

  // used to
  'used to': { base: 'used to', pos: 'modal phr.', trans: '過去習慣、曾經 (現在已不如此)', explanation: '過去經常發生的狀態或習慣', phonetic: '/ju:st tu:/' },

  // due to
  'due to': { base: 'due to', pos: 'prep phr.', trans: '由於、因為 (常用於說明原因)', explanation: 'Due to bad weather / delay', phonetic: '/du: tu:/' },
};

// 常見高頻基礎詞速查表
const BASIC_COMMON_WORDS: Record<string, { pos: string; trans: string; phonetic?: string }> = {
  'and': { pos: 'conj.', trans: '和、與、而且', phonetic: '/ænd/' },
  'or': { pos: 'conj.', trans: '或者、還是', phonetic: '/ɔ:r/' },
  'but': { pos: 'conj.', trans: '但是、然而', phonetic: '/bʌt/' },
  'so': { pos: 'conj./adv.', trans: '所以、如此', phonetic: '/soʊ/' },
  'please': { pos: 'adv./v.', trans: '請、拜託；使滿意', phonetic: '/pli:z/' },
  'have': { pos: 'v.', trans: '有、具備；讓、使得', phonetic: '/hæv/' },
  'has': { pos: 'v.', trans: '有 (第三人稱單數)', phonetic: '/hæz/' },
  'had': { pos: 'v.', trans: '有 (過去式/過去分詞)', phonetic: '/hæd/' },
  'your': { pos: 'pron.', trans: '你的、你們的 (所有格)', phonetic: '/jɔ:r/' },
  'you': { pos: 'pron.', trans: '你、你們', phonetic: '/ju:/' },
  'my': { pos: 'pron.', trans: '我的', phonetic: '/maɪ/' },
  'me': { pos: 'pron.', trans: '我 (受格)', phonetic: '/mi:/' },
  'we': { pos: 'pron.', trans: '我們', phonetic: '/wi:/' },
  'our': { pos: 'pron.', trans: '我們的', phonetic: '/ˈaʊər/' },
  'us': { pos: 'pron.', trans: '我們 (受格)', phonetic: '/ʌs/' },
  'ready': { pos: 'adj.', trans: '準備好的、現成的', phonetic: '/ˈredi/' },
  'at': { pos: 'prep.', trans: '在 (特定地點/時刻)', phonetic: '/æt/' },
  'in': { pos: 'prep.', trans: '在...裡面、在 (區域/時間)', phonetic: '/ɪn/' },
  'on': { pos: 'prep.', trans: '在...上面、在 (某日)', phonetic: '/ɑ:n/' },
  'to': { pos: 'prep./to', trans: '到、向、朝著；不定詞', phonetic: '/tu:/' },
  'for': { pos: 'prep.', trans: '為了、給、持續 (時間)', phonetic: '/fɔ:r/' },
  'of': { pos: 'prep.', trans: '...的、屬於、關於', phonetic: '/ʌv/' },
  'with': { pos: 'prep.', trans: '和...一起、用、具有', phonetic: '/wɪð/' },
  'by': { pos: 'prep.', trans: '藉由、在...旁邊、被', phonetic: '/baɪ/' },
  'the': { pos: 'art.', trans: '這/那 (定冠詞)', phonetic: '/ði:/' },
  'a': { pos: 'art.', trans: '一個 (不定冠詞)', phonetic: '/eɪ/' },
  'an': { pos: 'art.', trans: '一個 (母音開頭前)', phonetic: '/æn/' },
  'is': { pos: 'v.', trans: '是 (be動詞單數現在式)', phonetic: '/ɪz/' },
  'are': { pos: 'v.', trans: '是 (be動詞複數現在式)', phonetic: '/ɑ:r/' },
  'was': { pos: 'v.', trans: '是 (be動詞單數過去式)', phonetic: '/wʌz/' },
  'were': { pos: 'v.', trans: '是 (be動詞複數過去式)', phonetic: '/wɜ:r/' },
  'be': { pos: 'v.', trans: '是、存在、成為 (原型)', phonetic: '/bi:/' },
  'can': { pos: 'modal', trans: '能夠、可以', phonetic: '/kæn/' },
  'could': { pos: 'modal', trans: '能夠、可以 (禮貌請求)', phonetic: '/kʊd/' },
  'would': { pos: 'modal', trans: '將會、願意 (委婉客氣)', phonetic: '/wʊd/' },
  'will': { pos: 'modal', trans: '將會、願意', phonetic: '/wɪl/' },
  'should': { pos: 'modal', trans: '應該', phonetic: '/ʃʊd/' },
  'may': { pos: 'modal', trans: '也許、可以 (許可)', phonetic: '/meɪ/' },
  'must': { pos: 'modal', trans: '必須、一定', phonetic: '/mʌst/' },
  'not': { pos: 'adv.', trans: '不、沒有', phonetic: '/nɑ:t/' },
  'no': { pos: 'adj./adv.', trans: '沒有、不', phonetic: '/noʊ/' },
  'turn': { pos: 'v./n.', trans: '轉動、轉向；輪流', phonetic: '/tɜ:rn/' },
  'turned': { pos: 'v.', trans: '轉向、轉動 (過去式)', phonetic: '/tɜ:rnd/' },
  'out': { pos: 'adv./prep.', trans: '在外面、出來、離開', phonetic: '/aʊt/' },
  'that': { pos: 'pron./conj.', trans: '那個；連接詞 (引導名詞子句)', phonetic: '/ðæt/' },
  'share': { pos: 'v./n.', trans: '分享、共有；股份', phonetic: '/ʃer/' },
  'college': { pos: 'n.', trans: '大學、學院', phonetic: '/ˈkɑ:lɪdʒ/' },
  'days': { pos: 'n.', trans: '歲月、時代、日子 (複數)', phonetic: '/deɪz/' },
  'actually': { pos: 'adv.', trans: '實際上、居然、竟然', phonetic: '/ˈæktʃuəli/' },
};

interface LookupResult {
  word: string;
  baseWord?: string;
  phonetic?: string;
  partOfSpeech?: string;
  translation: string;
  tip?: string;
  source: 'phrasal' | 'vocab' | 'common' | 'online';
}

// 智慧語境查詞：支援動詞片語識別、本機詞庫、常見字與線上辭典
const lookupWordInContext = (
  clean: string,
  fullSentence: string,
  pool: WordItem[],
  adjacentCandidates: string[] = []
): { primary: LookupResult; singleWordFallback?: LookupResult } => {
  if (!clean) {
    return { primary: { word: clean, translation: '', source: 'online' } };
  }

  // 1. 最優先：檢查相鄰單字是否構成常見動詞片語 (例如 turned + out -> turned out)
  for (const cand of adjacentCandidates) {
    if (PHRASAL_VERBS_MAP[cand]) {
      const ph = PHRASAL_VERBS_MAP[cand];
      const phrasalResult: LookupResult = {
        word: cand,
        baseWord: ph.base,
        phonetic: ph.phonetic,
        partOfSpeech: ph.pos,
        translation: ph.trans,
        tip: ph.explanation,
        source: 'phrasal',
      };

      // 同時準備單字本身的獨立查詢 (方便使用者切換查看單字原意)
      const singleBasic = BASIC_COMMON_WORDS[clean];
      const singleWordFallback: LookupResult = singleBasic ? {
        word: clean,
        phonetic: singleBasic.phonetic,
        partOfSpeech: singleBasic.pos,
        translation: singleBasic.trans,
        source: 'common'
      } : {
        word: clean,
        translation: '',
        source: 'online'
      };

      return { primary: phrasalResult, singleWordFallback };
    }
  }

  // 2. 檢查：當前句子是否「完整包含」詞庫中某個多詞單字 (例如 "boarding pass")
  const lowerSentence = fullSentence.toLowerCase();
  const matchedPhrase = pool.find(w => {
    const wLower = w.word.toLowerCase();
    if (wLower.includes(' ')) {
      if (lowerSentence.includes(wLower)) {
        const parts = wLower.split(/\s+/);
        return parts.includes(clean);
      }
    }
    return false;
  });

  if (matchedPhrase) {
    return {
      primary: {
        word: matchedPhrase.word,
        phonetic: matchedPhrase.phonetic,
        partOfSpeech: matchedPhrase.partOfSpeech,
        translation: matchedPhrase.translation,
        tip: matchedPhrase.tip,
        source: 'vocab',
      }
    };
  }

  // 3. 本機 310 詞庫全字匹配
  const exact = pool.find(w => w.word.toLowerCase() === clean);
  if (exact) {
    return {
      primary: {
        word: exact.word,
        phonetic: exact.phonetic,
        partOfSpeech: exact.partOfSpeech,
        translation: exact.translation,
        tip: exact.tip,
        source: 'vocab',
      }
    };
  }

  // 4. 常見高頻功能詞、連詞、介系詞字典
  if (BASIC_COMMON_WORDS[clean]) {
    const basic = BASIC_COMMON_WORDS[clean];
    return {
      primary: {
        word: clean,
        phonetic: basic.phonetic,
        partOfSpeech: basic.pos,
        translation: basic.trans,
        source: 'common',
      }
    };
  }

  // 5. 詞形變化還原 (單複數 -s/-es, 過去式 -ed, 進行式 -ing)
  let stemMatch: WordItem | undefined;
  if (clean.endsWith('es')) {
    stemMatch = pool.find(w => w.word.toLowerCase() === clean.slice(0, -2));
  } else if (clean.endsWith('s')) {
    stemMatch = pool.find(w => w.word.toLowerCase() === clean.slice(0, -1));
  } else if (clean.endsWith('ed')) {
    stemMatch = pool.find(w => w.word.toLowerCase() === clean.slice(0, -2) || w.word.toLowerCase() === clean.slice(0, -1));
  } else if (clean.endsWith('ing')) {
    stemMatch = pool.find(w => w.word.toLowerCase() === clean.slice(0, -3) || w.word.toLowerCase() === clean.slice(0, -3) + 'e');
  }

  if (stemMatch) {
    return {
      primary: {
        word: clean,
        phonetic: stemMatch.phonetic,
        partOfSpeech: stemMatch.partOfSpeech,
        translation: `${stemMatch.translation} (${stemMatch.word} 的變化型)`,
        tip: stemMatch.tip,
        source: 'vocab',
      }
    };
  }

  // 6. 線上權威辭典
  return {
    primary: {
      word: clean,
      translation: '',
      source: 'online',
    }
  };
};

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  sentence,
  translation,
  wordsPool = [],
  speechRate = 0.9,
  speechLang = 'en-US',
  className = '',
  isDark = false,
  onWordSaved,
}) => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [lookupInfo, setLookupInfo] = useState<LookupResult | null>(null);
  const [singleWordFallback, setSingleWordFallback] = useState<LookupResult | null>(null);
  const [showSingleWord, setShowSingleWord] = useState(false);
  const [customMeaning, setCustomMeaning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 切割單字與標點符號
  const tokens = sentence.split(/([a-zA-Z'-]+)/g);

  // 提取所有純英文單字及其 tokenIndex，便於相鄰片語上下文推斷
  const wordTokens = tokens
    .map((tok, idx) => ({ 
      raw: tok, 
      clean: tok.trim().toLowerCase().replace(/[^a-z]/g, ''), 
      tokenIndex: idx 
    }))
    .filter(t => t.clean.length > 0);

  const handleWordClick = (token: string, tokenIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = token.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return;

    triggerHaptic('light');

    // 尋找當前單字在 wordTokens 序列中的位置
    const currIdx = wordTokens.findIndex(t => t.tokenIndex === tokenIndex);

    // 產生相鄰片語候選字 (2詞與3詞組合)
    const adjacentCandidates: string[] = [];
    if (currIdx >= 0) {
      const prev = wordTokens[currIdx - 1]?.clean;
      const curr = wordTokens[currIdx]?.clean;
      const next = wordTokens[currIdx + 1]?.clean;
      const nextNext = wordTokens[currIdx + 2]?.clean;

      // 3詞優先
      if (curr && next && nextNext) adjacentCandidates.push(`${curr} ${next} ${nextNext}`);
      if (prev && curr && next) adjacentCandidates.push(`${prev} ${curr} ${next}`);
      // 2詞 (如 turned out 或 out 前面的 turned)
      if (curr && next) adjacentCandidates.push(`${curr} ${next}`);
      if (prev && curr) adjacentCandidates.push(`${prev} ${curr}`);
    }

    const { primary, singleWordFallback: fallback } = lookupWordInContext(
      clean,
      sentence,
      wordsPool,
      adjacentCandidates
    );

    // 播放發音：若是片語優先朗讀整組片語 (如 "turned out")，否則朗讀單字
    speakText(primary.word, speechRate, speechLang);

    setActiveWord(primary.word);
    setLookupInfo(primary);
    setSingleWordFallback(fallback || null);
    setShowSingleWord(false);
    setCustomMeaning('');
    setIsSaved(false);
  };

  const handleClose = () => {
    setActiveWord(null);
    setLookupInfo(null);
    setSingleWordFallback(null);
    setShowSingleWord(false);
  };

  const displayedInfo = (showSingleWord && singleWordFallback) ? singleWordFallback : lookupInfo;

  const handleSaveToCustomVocab = () => {
    if (!displayedInfo) return;
    triggerHaptic('success');
    saveCustomWord({
      word: displayedInfo.word.toLowerCase(),
      phonetic: displayedInfo.phonetic || '/-/',
      partOfSpeech: displayedInfo.partOfSpeech || 'n.',
      translation: customMeaning.trim() || displayedInfo.translation || '情境生詞',
      example: sentence,
      exampleTranslation: translation || '',
      category: 'daily',
      categoryLabel: '自訂生詞'
    });
    setIsSaved(true);
    onWordSaved?.();
  };

  const targetLookupWord = displayedInfo?.word || activeWord || '';
  const cambridgeUrl = `https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/${encodeURIComponent(targetLookupWord.toLowerCase())}`;
  const googleUrl = `https://translate.google.com/?sl=en&tl=zh-TW&text=${encodeURIComponent(targetLookupWord)}&op=translate`;

  // 全局 Bottom Sheet 彈窗 (使用 createPortal 掛載於 body，完全不撐開卡片，免滾動！)
  const modalContent = activeWord && displayedInfo && (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3.5 border-t sm:border border-slate-200 animate-slide-up text-slate-800 pb-8 sm:pb-5 max-h-[85vh] overflow-y-auto"
      >
        {/* 手機頂部指示條 */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden" />

        {/* 彈窗頂部：單字/片語、音標、發音與關閉按鈕 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-indigo-700 tracking-tight">
              {displayedInfo.word}
            </span>
            {displayedInfo.baseWord && (
              <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                原型: {displayedInfo.baseWord}
              </span>
            )}
            {displayedInfo.phonetic && (
              <span className="text-xs font-mono text-slate-400">
                {displayedInfo.phonetic}
              </span>
            )}
            {displayedInfo.partOfSpeech && (
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {displayedInfo.partOfSpeech}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                triggerHaptic('light');
                speakText(displayedInfo.word, speechRate, speechLang);
              }}
              className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-90 transition-all"
              title="重聽發音"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="關閉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 中文釋義主區塊 */}
        {displayedInfo.translation ? (
          <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
            displayedInfo.source === 'phrasal'
              ? 'bg-amber-50/80 border-amber-200/80'
              : 'bg-emerald-50/70 border-emerald-100'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                displayedInfo.source === 'phrasal'
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-emerald-100/90 text-emerald-800'
              }`}>
                {displayedInfo.source === 'phrasal' ? '🔥 智慧識別動詞片語' : displayedInfo.source === 'vocab' ? '本機核心詞庫' : '常用單字釋義'}
              </span>

              {/* 切換查看片語 / 單獨單詞 */}
              {lookupInfo?.source === 'phrasal' && singleWordFallback && (
                <button
                  onClick={() => setShowSingleWord(!showSingleWord)}
                  className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-indigo-100"
                >
                  <Layers className="w-3 h-3" />
                  <span>{showSingleWord ? '返回片語釋義' : `看單詞「${singleWordFallback.word}」`}</span>
                </button>
              )}
            </div>

            <div className={`text-lg font-black pt-0.5 ${
              displayedInfo.source === 'phrasal' ? 'text-amber-950' : 'text-emerald-950'
            }`}>
              {displayedInfo.translation}
            </div>
            {displayedInfo.tip && (
              <p className={`text-xs pt-1 border-t mt-1 leading-relaxed ${
                displayedInfo.source === 'phrasal' ? 'text-amber-900 border-amber-200/60' : 'text-emerald-800 border-emerald-200/50'
              }`}>
                💡 {displayedInfo.tip}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-700">此單字不在基礎 310 詞中，可透過線上辭典即時查閱或收錄：</p>
          </div>
        )}

        {/* 原句情境提示 */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
          <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">情境原句</div>
          <p className="text-slate-700 font-medium italic">"{sentence}"</p>
          {translation && (
            <p className="text-slate-500 text-[11px]">{translation}</p>
          )}
        </div>

        {/* 線上辭典快捷按鈕 */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={cambridgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs border border-sky-200/70 transition-all active:scale-98"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>劍橋辭典詳解</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs border border-slate-200 transition-all active:scale-98"
          >
            <span>Google 翻譯</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* 快速收錄到生詞庫 */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <input
            type="text"
            placeholder="補充自訂筆記 / 中譯"
            value={customMeaning}
            onChange={(e) => setCustomMeaning(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
          <button
            onClick={handleSaveToCustomVocab}
            disabled={isSaved}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-sm'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已收錄</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>加入生詞庫</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 例句本體文字 (每個單字皆可點擊) */}
      <p className={`leading-relaxed select-text ${className}`}>
        {tokens.map((tok, idx) => {
          const isWord = /[a-zA-Z]/.test(tok);
          if (!isWord) {
            return <span key={idx}>{tok}</span>;
          }

          const isSelected = activeWord?.toLowerCase().includes(tok.toLowerCase());
          return (
            <span
              key={idx}
              onClick={(e) => handleWordClick(tok, idx, e)}
              className={`cursor-pointer rounded-xs px-0.5 transition-all inline-block active:scale-95 ${
                isSelected
                  ? 'bg-amber-300 text-slate-900 font-bold shadow-xs ring-2 ring-amber-400'
                  : isDark
                  ? 'hover:bg-white/20 hover:text-white hover:underline underline-offset-4 decoration-sky-400/80'
                  : 'hover:bg-indigo-50 hover:text-indigo-600 hover:underline underline-offset-4 decoration-indigo-400/80'
              }`}
              title={`點擊朗讀「${tok}」並即時查詞`}
            >
              {tok}
            </span>
          );
        })}
      </p>

      {/* 透過 React Portal 渲染至 document.body，脫離卡片約束與捲軸困擾 */}
      {typeof document !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};
