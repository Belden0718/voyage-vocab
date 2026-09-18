import React, { useState } from 'react';
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

// 智慧詞庫檢索 (支援還原單複數、時態與詞組包含)
const findInWordsPool = (rawWord: string, pool: WordItem[]): WordItem | undefined => {
  const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean || clean.length < 2) return undefined;

  // 1. 完全一致
  let found = pool.find(w => w.word.toLowerCase() === clean);
  if (found) return found;

  // 2. 複數 -es / -s
  if (clean.endsWith('es')) {
    found = pool.find(w => w.word.toLowerCase() === clean.slice(0, -2));
    if (found) return found;
  }
  if (clean.endsWith('s')) {
    found = pool.find(w => w.word.toLowerCase() === clean.slice(0, -1));
    if (found) return found;
  }

  // 3. 過去式 -ed / -d
  if (clean.endsWith('ed')) {
    found = pool.find(w => w.word.toLowerCase() === clean.slice(0, -2) || w.word.toLowerCase() === clean.slice(0, -1));
    if (found) return found;
  }

  // 4. 動名詞/現在分詞 -ing
  if (clean.endsWith('ing')) {
    found = pool.find(w => w.word.toLowerCase() === clean.slice(0, -3) || w.word.toLowerCase() === clean.slice(0, -3) + 'e');
    if (found) return found;
  }

  // 5. 詞組或片語包含
  found = pool.find(w => w.word.toLowerCase().split(/\s+/).includes(clean));
  return found;
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
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchedWord, setMatchedWord] = useState<WordItem | null>(null);
  const [customMeaning, setCustomMeaning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 切割單字與標點
  const tokens = sentence.split(/([a-zA-Z'-]+)/g);

  const handleWordClick = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = token.trim();
    if (!clean || !/[a-zA-Z]/.test(clean)) return;

    triggerHaptic('light');
    speakText(clean, speechRate, speechLang);

    const match = findInWordsPool(clean, wordsPool);
    setSelectedWord(clean);
    setMatchedWord(match || null);
    setCustomMeaning('');
    setIsSaved(false);
  };

  const handleSaveToCustomVocab = () => {
    if (!selectedWord) return;
    triggerHaptic('success');
    saveCustomWord({
      word: selectedWord.toLowerCase(),
      phonetic: matchedWord?.phonetic || '/-/',
      partOfSpeech: matchedWord?.partOfSpeech || 'n.',
      translation: customMeaning.trim() || matchedWord?.translation || '情境生詞',
      example: sentence,
      exampleTranslation: translation || '',
      category: 'daily',
      categoryLabel: '自訂生詞'
    });
    setIsSaved(true);
    onWordSaved?.();
  };

  const cambridgeUrl = selectedWord 
    ? `https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/${encodeURIComponent(selectedWord.toLowerCase())}`
    : '#';

  const googleUrl = selectedWord
    ? `https://translate.google.com/?sl=en&tl=zh-TW&text=${encodeURIComponent(selectedWord)}&op=translate`
    : '#';

  return (
    <div className="relative">
      {/* 例句文字本體 (每個英文單字皆可點擊) */}
      <p className={`leading-relaxed select-text ${className}`}>
        {tokens.map((tok, idx) => {
          const isWord = /[a-zA-Z]/.test(tok);
          if (!isWord) {
            return <span key={idx}>{tok}</span>;
          }

          const isSelected = selectedWord?.toLowerCase() === tok.toLowerCase();
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

      {/* 點擊單字後的即時查詞浮窗 (Word Quick Peek Drawer) */}
      {selectedWord && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="mt-3 p-3.5 rounded-2xl border shadow-xl bg-white text-slate-800 border-slate-200 animate-scale-up z-30 space-y-2.5 text-left"
        >
          {/* 頂部單字名稱、音標、發音與關閉 */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-black text-indigo-700 tracking-tight">
                {selectedWord}
              </span>
              {matchedWord?.phonetic && (
                <span className="text-xs font-mono text-slate-400">
                  {matchedWord.phonetic}
                </span>
              )}
              {matchedWord?.partOfSpeech && (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {matchedWord.partOfSpeech}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  speakText(selectedWord, speechRate, speechLang);
                }}
                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-90 transition-all"
                title="重聽單字發音"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedWord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="關閉"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 查詞結果區 */}
          {matchedWord ? (
            /* 詞庫內已有收錄 */
            <div className="space-y-1 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  本機詞庫已收錄
                </span>
                <span className="text-sm font-bold text-emerald-900">
                  {matchedWord.translation}
                </span>
              </div>
              {matchedWord.tip && (
                <p className="text-[11px] text-emerald-800">
                  💡 {matchedWord.tip}
                </p>
              )}
            </div>
          ) : (
            /* 詞庫尚未收錄的衍生生詞 */
            <div className="space-y-2">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>此生詞不在基礎 310 詞中，可在線上辭典秒查或一鍵收錄：</span>
              </div>

              {/* 外部權威辭典跳轉捷徑 */}
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href={cambridgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs border border-sky-200/60 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>劍橋辭典</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs border border-slate-200 transition-all"
                >
                  <span>Google 翻譯</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>

              {/* 快速加入生詞庫表單 */}
              <div className="pt-1 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="輸入中譯 (例: 推薦 / 提示)"
                  value={customMeaning}
                  onChange={(e) => setCustomMeaning(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
                <button
                  onClick={handleSaveToCustomVocab}
                  disabled={isSaved}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shrink-0 ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-xs'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已加入生詞</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>收錄生詞</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
