import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { WordItem } from '../types';
import { speakText, triggerHaptic } from '../utils/speech';
import { saveCustomWord } from '../utils/storage';
import { Volume2, ExternalLink, X, BookOpen, Plus, Check } from 'lucide-react';

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

// 常見高頻功能詞、介系詞、代名詞、連詞與常用字速查字典
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
  'this': { pos: 'pron./adj.', trans: '這個、這', phonetic: '/ðɪs/' },
  'that': { pos: 'pron./adj.', trans: '那個、那', phonetic: '/ðæt/' },
  'here': { pos: 'adv.', trans: '這裡、在這兒', phonetic: '/hɪr/' },
  'there': { pos: 'adv.', trans: '那裡、在那兒', phonetic: '/ðer/' },
  'where': { pos: 'adv.', trans: '在哪裡、何處', phonetic: '/wer/' },
  'what': { pos: 'pron.', trans: '什麼', phonetic: '/wʌt/' },
  'how': { pos: 'adv.', trans: '如何、怎樣、多麼', phonetic: '/haʊ/' },
  'when': { pos: 'adv.', trans: '何時、當...的時候', phonetic: '/wen/' },
  'why': { pos: 'adv.', trans: '為什麼', phonetic: '/waɪ/' },
  'all': { pos: 'adj./pron.', trans: '全部的、所有的', phonetic: '/ɔ:l/' },
  'get': { pos: 'v.', trans: '獲得、得到、到達', phonetic: '/ɡet/' },
  'go': { pos: 'v.', trans: '去、前往', phonetic: '/ɡoʊ/' },
  'take': { pos: 'v.', trans: '拿、搭乘、需要', phonetic: '/teɪk/' },
  'show': { pos: 'v./n.', trans: '出示、展示；表演', phonetic: '/ʃoʊ/' },
  'need': { pos: 'v./n.', trans: '需要、必須', phonetic: '/ni:d/' },
  'help': { pos: 'v./n.', trans: '幫助、協助', phonetic: '/help/' },
};

interface LookupResult {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  translation: string;
  tip?: string;
  source: 'common' | 'vocab' | 'online';
}

// 智慧語境查詞：防止如 "and" 誤配到 "cost an arm and a leg"
const lookupWordInContext = (
  rawWord: string,
  fullSentence: string,
  pool: WordItem[]
): LookupResult => {
  const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) {
    return { word: rawWord, translation: '', source: 'online' };
  }

  // 1. 優先檢查：當前句子是否「完整包含」某個多詞詞組 (例如 "boarding pass")，且使用者點擊的是該詞組中的字
  const lowerSentence = fullSentence.toLowerCase();
  const matchedPhrase = pool.find(w => {
    const wLower = w.word.toLowerCase();
    if (wLower.includes(' ')) {
      // 詞庫是多詞 (如 "boarding pass")
      if (lowerSentence.includes(wLower)) {
        // 且此片語確實完整存在於當前例句中，並且包含點擊的單字
        const parts = wLower.split(/\s+/);
        return parts.includes(clean);
      }
    }
    return false;
  });

  if (matchedPhrase) {
    return {
      word: matchedPhrase.word,
      phonetic: matchedPhrase.phonetic,
      partOfSpeech: matchedPhrase.partOfSpeech,
      translation: matchedPhrase.translation,
      tip: matchedPhrase.tip,
      source: 'vocab',
    };
  }

  // 2. 本機 310 詞庫單字精確全字匹配
  const exact = pool.find(w => w.word.toLowerCase() === clean);
  if (exact) {
    return {
      word: exact.word,
      phonetic: exact.phonetic,
      partOfSpeech: exact.partOfSpeech,
      translation: exact.translation,
      tip: exact.tip,
      source: 'vocab',
    };
  }

  // 3. 常見文法、介系詞、連詞速查表 (and, please, ready, have, your 等)
  if (BASIC_COMMON_WORDS[clean]) {
    const basic = BASIC_COMMON_WORDS[clean];
    return {
      word: clean,
      phonetic: basic.phonetic,
      partOfSpeech: basic.pos,
      translation: basic.trans,
      source: 'common',
    };
  }

  // 4. 詞形變化還原 (單複數 -s/-es, 過去式 -ed, 進行式 -ing)
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
      word: clean,
      phonetic: stemMatch.phonetic,
      partOfSpeech: stemMatch.partOfSpeech,
      translation: `${stemMatch.translation} (${stemMatch.word} 的變化型)`,
      tip: stemMatch.tip,
      source: 'vocab',
    };
  }

  // 5. 衍生延伸詞彙：提供線上權威辭典
  return {
    word: clean,
    translation: '',
    source: 'online',
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
  const [customMeaning, setCustomMeaning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 切割單字與標點符號
  const tokens = sentence.split(/([a-zA-Z'-]+)/g);

  const handleWordClick = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = token.trim();
    if (!clean || !/[a-zA-Z]/.test(clean)) return;

    triggerHaptic('light');
    speakText(clean, speechRate, speechLang);

    const result = lookupWordInContext(clean, sentence, wordsPool);
    setActiveWord(clean);
    setLookupInfo(result);
    setCustomMeaning('');
    setIsSaved(false);
  };

  const handleClose = () => {
    setActiveWord(null);
    setLookupInfo(null);
  };

  const handleSaveToCustomVocab = () => {
    if (!activeWord) return;
    triggerHaptic('success');
    saveCustomWord({
      word: activeWord.toLowerCase(),
      phonetic: lookupInfo?.phonetic || '/-/',
      partOfSpeech: lookupInfo?.partOfSpeech || 'n.',
      translation: customMeaning.trim() || lookupInfo?.translation || '情境生詞',
      example: sentence,
      exampleTranslation: translation || '',
      category: 'daily',
      categoryLabel: '自訂生詞'
    });
    setIsSaved(true);
    onWordSaved?.();
  };

  const cambridgeUrl = activeWord 
    ? `https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/${encodeURIComponent(activeWord.toLowerCase())}`
    : '#';

  const googleUrl = activeWord
    ? `https://translate.google.com/?sl=en&tl=zh-TW&text=${encodeURIComponent(activeWord)}&op=translate`
    : '#';

  // 全局 Bottom Sheet 彈窗 (使用 createPortal 掛載於 body，完全不撐開卡片，免滾動！)
  const modalContent = activeWord && lookupInfo && (
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

        {/* 彈窗頂部：單字、音標、發音與關閉按鈕 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-indigo-700 tracking-tight">
              {lookupInfo.word}
            </span>
            {lookupInfo.phonetic && (
              <span className="text-xs font-mono text-slate-400">
                {lookupInfo.phonetic}
              </span>
            )}
            {lookupInfo.partOfSpeech && (
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {lookupInfo.partOfSpeech}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                triggerHaptic('light');
                speakText(lookupInfo.word, speechRate, speechLang);
              }}
              className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-90 transition-all"
              title="重聽單字發音"
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
        {lookupInfo.translation ? (
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                {lookupInfo.source === 'vocab' ? '本機核心詞庫' : '常用語意釋義'}
              </span>
            </div>
            <div className="text-lg font-black text-emerald-950 pt-0.5">
              {lookupInfo.translation}
            </div>
            {lookupInfo.tip && (
              <p className="text-xs text-emerald-800 pt-1 border-t border-emerald-200/50 mt-1">
                💡 {lookupInfo.tip}
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

          const isSelected = activeWord?.toLowerCase() === tok.toLowerCase();
          return (
            <span
              key={idx}
              onClick={(e) => handleWordClick(tok, e)}
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
