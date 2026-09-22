import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { WordItem, UserWordProgress, CategoryType } from '../types';
import type { AppSettings } from '../utils/storage';
import type { TabType } from './BottomNav';
import { 
  Volume2, Star, RotateCw, ArrowLeft, ArrowRight, Lightbulb,
  Shuffle, Sparkles, ListOrdered, Trophy
} from 'lucide-react';
import { speakText, triggerHaptic, getPhoneticInfo } from '../utils/speech';
import { CountryFlag } from './CountryFlag';
import { InteractiveSentence } from './InteractiveSentence';

export type FlashcardDeckMode = 'smart' | 'shuffle' | 'order';

const STORAGE_KEY_DECK_MODE = 'voyage_vocab_flashcard_mode';

interface CategoryOption {
  id: CategoryType | 'all' | 'starred';
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: '全部' },
  { id: 'starred', label: '星標收藏' },
  { id: 'airport', label: '✈️ 機場' },
  { id: 'hotel', label: '🏨 住宿' },
  { id: 'dining', label: '🍽️ 餐廳' },
  { id: 'shopping', label: '🛍️ 購物' },
  { id: 'transport', label: '🚊 交通' },
  { id: 'daily', label: '💬 口語' },
  { id: 'emergency', label: '🚨 緊急' },
  { id: 'social', label: '🤝 社交' },
  { id: 'culture', label: '🧭 文化' },
  { id: 'digital', label: '📱 數位' },
  { id: 'service', label: '🍸 服務' },
];

// 洗牌演算法 (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 智慧 Leitner SRS 卡組排序
const generateSmartDeck = (
  sourceWords: WordItem[],
  progressMap: Record<string, UserWordProgress>
): WordItem[] => {
  const now = Date.now();
  const dueWords: WordItem[] = [];
  const lapsedWords: WordItem[] = [];
  const newWords: WordItem[] = [];
  const learningWords: WordItem[] = [];
  const masteredWords: WordItem[] = [];

  for (const word of sourceWords) {
    const p = progressMap[word.id];
    if (!p || p.reviewCount === 0) {
      newWords.push(word);
    } else if (p.nextReviewAt > 0 && p.nextReviewAt <= now) {
      dueWords.push(word);
    } else if (p.box === 0 && p.reviewCount > 0) {
      lapsedWords.push(word);
    } else if (p.box === 1) {
      learningWords.push(word);
    } else {
      masteredWords.push(word);
    }
  }

  // 1. 到期需複習單字：最久未複習/過期最久者排最前面
  dueWords.sort((a, b) => {
    const pA = progressMap[a.id]?.nextReviewAt || 0;
    const pB = progressMap[b.id]?.nextReviewAt || 0;
    return pA - pB;
  });

  // 2. 其餘分組內部均隨機洗牌，徹底打破單調的 boarding pass 永遠第一張的問題！
  return [
    ...dueWords,
    ...shuffleArray(lapsedWords),
    ...shuffleArray(newWords),
    ...shuffleArray(learningWords),
    ...shuffleArray(masteredWords),
  ];
};

interface FlashcardViewProps {
  words: WordItem[];
  progressMap: Record<string, UserWordProgress>;
  settings: AppSettings;
  initialCategory?: CategoryType | 'all' | 'starred';
  onReviewWord: (wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onToggleStar: (wordId: string) => void;
  onChangeTab?: (tab: TabType) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  words,
  progressMap,
  settings,
  initialCategory = 'all',
  onReviewWord,
  onToggleStar,
  onChangeTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all' | 'starred'>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<WordItem[]>([]);
  const [shuffleVersion, setShuffleVersion] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 讀取/保存使用者偏好的排序模式 (預設為智慧排程 smart)
  const [deckMode, setDeckMode] = useState<FlashcardDeckMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DECK_MODE);
      if (saved === 'smart' || saved === 'shuffle' || saved === 'order') {
        return saved as FlashcardDeckMode;
      }
    } catch {
      // ignore
    }
    return 'smart';
  });

  // 監聽父層傳入的 initialCategory
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setCurrentIndex(0);
      setIsSessionFinished(false);
    }
  }, [initialCategory]);

  // 根據分類與模式構建卡組 (注意：不把 progressMap 放入 dependency，避免學習中打分造成卡組跳動)
  useEffect(() => {
    const filtered = words.filter(w => {
      if (selectedCategory === 'starred') {
        return progressMap[w.id]?.isStarred;
      }
      if (selectedCategory === 'all') return true;
      return w.category === selectedCategory;
    });

    if (filtered.length === 0) {
      setDeck([]);
      setCurrentIndex(0);
      setIsSessionFinished(false);
      return;
    }

    let nextDeck: WordItem[];
    if (deckMode === 'shuffle') {
      nextDeck = shuffleArray(filtered);
    } else if (deckMode === 'smart') {
      nextDeck = generateSmartDeck(filtered, progressMap);
    } else {
      nextDeck = [...filtered];
    }

    setDeck(nextDeck);
    setCurrentIndex(0);
    setIsSessionFinished(false);
  }, [selectedCategory, deckMode, shuffleVersion, words]);

  const currentWord: WordItem | undefined = deck[currentIndex];
  const currentProgress = currentWord ? progressMap[currentWord.id] : undefined;

  // 換卡時重設翻轉狀態
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex, selectedCategory]);

  // 自動發音
  useEffect(() => {
    if (currentWord && settings.autoSpeak && !isFlipped) {
      speakText(currentWord.word, settings.speechRate, settings.speechLang);
    }
  }, [currentIndex, currentWord?.id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 2200);
  };

  const handleFlip = () => {
    triggerHaptic('light');
    setIsFlipped(prev => !prev);
  };

  const handleSpeak = (text: string, slow: boolean = false, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');
    const rate = slow ? 0.7 : settings.speechRate;
    speakText(text, rate, settings.speechLang);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      triggerHaptic('light');
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      triggerHaptic('light');
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReview = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;
    triggerHaptic(rating === 'again' ? 'warning' : 'success');
    onReviewWord(currentWord.id, rating);
    
    // 平滑移動到下一張
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  };

  const handleModeChange = (mode: FlashcardDeckMode) => {
    if (mode === deckMode) {
      handleReshuffle();
      return;
    }
    triggerHaptic('light');
    setDeckMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY_DECK_MODE, mode);
    } catch {}

    if (mode === 'smart') {
      showToast('⚡ 已切換為智慧排程：待複習與生疏單字優先');
    } else if (mode === 'shuffle') {
      showToast('🔀 已切換為隨機洗牌：打破固定順序抽卡');
    } else {
      showToast('📑 已切換為講義順序：按預設章節順序研讀');
    }
  };

  const handleReshuffle = () => {
    triggerHaptic('medium');
    setShuffleVersion(v => v + 1);
    showToast('卡組已重新洗牌！🔀');
  };

  // 鍵盤快速鍵支援 (桌面端極佳操作體驗)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleReview('again');
      } else if (e.key === '2') {
        e.preventDefault();
        handleReview('hard');
      } else if (e.key === '3') {
        e.preventDefault();
        handleReview('good');
      } else if (e.key === '4') {
        e.preventDefault();
        handleReview('easy');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReshuffle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length, isFlipped, currentWord]);

  // 統計待複習與新單字數量
  const dueCount = useMemo(() => {
    const now = Date.now();
    return deck.filter(w => {
      const p = progressMap[w.id];
      return p && p.nextReviewAt > 0 && p.nextReviewAt <= now;
    }).length;
  }, [deck, progressMap]);

  const newCount = useMemo(() => {
    return deck.filter(w => {
      const p = progressMap[w.id];
      return !p || p.reviewCount === 0;
    }).length;
  }, [deck, progressMap]);

  // 單字卡片頂部的狀態徽章
  const getCardStatus = (word?: WordItem) => {
    if (!word) return null;
    const p = progressMap[word.id];
    const now = Date.now();

    if (p && p.nextReviewAt > 0 && p.nextReviewAt <= now) {
      return {
        label: '待複習',
        color: 'bg-rose-50 text-rose-600 border-rose-200',
        dot: 'bg-rose-500',
      };
    }
    if (!p || p.reviewCount === 0) {
      return {
        label: '新單字',
        color: 'bg-sky-50 text-sky-600 border-sky-200',
        dot: 'bg-sky-500',
      };
    }
    if (p.box === 0 && p.reviewCount > 0) {
      return {
        label: '需加強',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    }
    if (p.box === 1) {
      return {
        label: '學習中',
        color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        dot: 'bg-indigo-500',
      };
    }
    if (p.box === 2) {
      return {
        label: '熟悉',
        color: 'bg-teal-50 text-teal-600 border-teal-200',
        dot: 'bg-teal-500',
      };
    }
    return {
      label: '精通',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      dot: 'bg-emerald-500',
    };
  };

  const cardStatus = getCardStatus(currentWord);

  // 空分類狀態
  if (deck.length === 0) {
    return (
      <div className="space-y-4 pb-12 animate-fade-in select-none">
        {/* 分類滑動條 */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm space-y-4 my-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">目前此分類尚無單字</h3>
          <p className="text-xs text-slate-400">
            {selectedCategory === 'starred' ? '您尚未標記任何珍藏單字，在卡片右上角點擊星標即可加入！' : '請選擇其他分類開始學習'}
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow hover:bg-indigo-700"
          >
            查看全部單字
          </button>
        </div>
      </div>
    );
  }

  // 本輪全部翻閱完成提示畫面
  if (isSessionFinished && deck.length > 0) {
    return (
      <div className="space-y-4 pb-12 animate-fade-in select-none">
        {/* 分類滑動條 */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-7 text-center border border-slate-100 shadow-xl space-y-6 my-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-800">太棒了！本輪單字已翻完 🎉</h3>
            <p className="text-xs text-slate-500">
              您剛剛完成了本組全部 <span className="font-bold text-indigo-600">{deck.length}</span> 個單字的翻卡記憶訓練！
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => {
                triggerHaptic('medium');
                setShuffleVersion(v => v + 1);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              重新洗牌再來一輪
            </button>

            {onChangeTab && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onChangeTab('quiz');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
              >
                <Trophy className="w-4 h-4" />
                前往測驗驗收實戰成果
              </button>
            )}

            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsSessionFinished(false);
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              回到第一張再看一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 pb-12 animate-fade-in select-none relative">
      {/* 浮動提示 Toast */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-fade-in border border-white/10">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. 分類滑動條 */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map(cat => {
          let count = 0;
          if (cat.id === 'all') count = words.length;
          else if (cat.id === 'starred') count = words.filter(w => progressMap[w.id]?.isStarred).length;
          else count = words.filter(w => w.category === cat.id).length;

          if (count === 0 && cat.id !== 'all' && cat.id !== 'starred') return null;

          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat.id === 'starred' && <Star className="w-3 h-3 fill-current text-amber-300" />}
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. 智慧排序模式工具列 */}
      <div className="flex items-center justify-between bg-slate-100/80 p-1 rounded-2xl text-xs border border-slate-200/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleModeChange('smart')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
              deckMode === 'smart'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="智慧排程：待複習與生疏單字優先，新單字隨機洗牌穿插"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>智慧排程</span>
            {dueCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
                {dueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleModeChange('shuffle')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
              deckMode === 'shuffle'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="隨機洗牌：隨機抽卡不受固定順序拘束"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>隨機洗牌</span>
          </button>

          <button
            onClick={() => handleModeChange('order')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
              deckMode === 'order'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="依講義：按預設課文順序學習"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>依講義</span>
          </button>
        </div>

        {/* 重新洗牌按鈕 */}
        <button
          onClick={handleReshuffle}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-white active:scale-95 transition-all text-xs font-semibold"
          title="重新洗牌卡組 (快捷鍵: R)"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">重洗</span>
        </button>
      </div>

      {/* 3. 進度與切換指示列 */}
      <div className="space-y-1.5 px-0.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.8 rounded-full font-bold">
              {currentIndex + 1} / {deck.length}
            </span>
            {dueCount > 0 && (
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {dueCount} 字待複習
              </span>
            )}
            {newCount > 0 && dueCount === 0 && (
              <span className="text-[11px] text-sky-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {newCount} 個新單字
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
              title="上一張 (鍵盤 ← 鍵)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              title="下一張 (鍵盤 → 鍵)"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 進度條 */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 4. 3D 翻轉單字卡片本體 */}
      <div
        onClick={handleFlip}
        className="w-full h-80 cursor-pointer perspective-1000 active:scale-[0.99] transition-transform"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* 正面 (Front) */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col justify-between backface-hidden">
            {/* 卡片頂部標籤與星標 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {currentWord?.categoryLabel}
                </span>
                {cardStatus && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cardStatus.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cardStatus.dot}`} />
                    {cardStatus.label}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentWord) onToggleStar(currentWord.id);
                  }}
                  className={`p-2 rounded-xl transition-all ${
                    currentProgress?.isStarred
                      ? 'text-amber-500 bg-amber-50'
                      : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'
                  }`}
                  aria-label="收藏單字"
                >
                  <Star className={`w-5 h-5 ${currentProgress?.isStarred ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* 單字主體區 */}
            <div className="text-center my-auto space-y-2.5">
              <div className="inline-flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60">
                <span className="text-[11px] font-bold text-indigo-600 bg-white px-1.5 py-0.5 rounded shadow-2xs">
                  {currentWord?.partOfSpeech}
                </span>
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <CountryFlag code={currentWord ? getPhoneticInfo(currentWord, settings.speechLang).countryCode : 'US'} />
                  <span>{currentWord ? getPhoneticInfo(currentWord, settings.speechLang).label : 'US'}</span>
                </span>
                <span className="text-xs text-slate-700 font-mono tracking-wide">
                  {currentWord ? getPhoneticInfo(currentWord, settings.speechLang).phonetic : ''}
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight break-words px-2">
                {currentWord?.word}
              </h2>

              {/* 語音按鈕組 */}
              <div className="flex items-center justify-center gap-2 pt-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={(e) => handleSpeak(currentWord?.word || '', false, e)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs active:scale-95 transition-all shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  發音
                </button>
                <button
                  onClick={(e) => handleSpeak(currentWord?.word || '', true, e)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium text-xs active:scale-95 transition-all"
                  title="慢速發音"
                >
                  0.7x 慢速
                </button>
              </div>
            </div>

            {/* 翻轉提示 */}
            <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs font-medium pt-2 border-t border-slate-50">
              <RotateCw className="w-3.5 h-3.5 text-slate-400 animate-spin-slow" />
              <span>點擊卡片查看中文與例句 (空白鍵)</span>
            </div>
          </div>

          {/* 背面 (Back) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900 flex flex-col justify-between backface-hidden rotate-y-180 overflow-y-auto no-scrollbar">
            {/* 頂部中文字意 */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-sky-400">
                    {currentWord?.partOfSpeech} {currentWord?.word}
                  </span>
                  {cardStatus && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15">
                      {cardStatus.label}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">繁中解析</span>
              </div>
              <h3 className="text-2xl font-black text-amber-300 mt-2">
                {currentWord?.translation}
              </h3>
              {currentWord?.phoneticUk && (
                <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <CountryFlag code="US" className="w-3.5 h-2.5 inline-block rounded-[1px] shadow-2xs border border-white/20 align-middle shrink-0" />
                    <span>{currentWord.phonetic}</span>
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1 text-sky-300">
                    <CountryFlag code="GB" className="w-3.5 h-2.5 inline-block rounded-[1px] shadow-2xs border border-white/20 align-middle shrink-0" />
                    <span>{currentWord.phoneticUk}</span>
                  </span>
                </div>
              )}
            </div>

            {/* 例句區塊 */}
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-1.5 my-2 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">情境例句</span>
                <button
                  onClick={(e) => handleSpeak(currentWord?.example || '', false, e)}
                  className="p-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30"
                  aria-label="朗讀例句"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <InteractiveSentence
                sentence={currentWord?.example || ''}
                translation={currentWord?.exampleTranslation}
                wordsPool={words}
                speechRate={settings.speechRate}
                speechLang={settings.speechLang}
                isDark={true}
                className="text-xs font-medium text-white/95"
              />
              <p className="text-xs text-slate-300 font-normal">
                {currentWord?.exampleTranslation}
              </p>
            </div>

            {/* 實戰 Tips */}
            {currentWord?.tip && (
              <div className="flex items-start space-x-2 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-200 text-xs">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-snug">{currentWord.tip}</span>
              </div>
            )}

            <div className="text-center text-slate-400 text-[11px] pt-1">
              再次點擊卡片翻回正面 (空白鍵)
            </div>
          </div>
        </div>
      </div>

      {/* 5. Anki 間隔重複 (SRS) 打分評估按鈕 */}
      <div className="space-y-1.5 pt-1">
        <div className="text-center text-[11px] font-medium text-slate-400">
          評估您的記憶熟悉度（自動為您排程複習，可按數字鍵 1-4）
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleReview('again')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">生疏忘記</span>
            <span className="text-[10px] text-rose-500 mt-0.5">重置複習 [1]</span>
          </button>

          <button
            onClick={() => handleReview('hard')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">模糊困難</span>
            <span className="text-[10px] text-amber-600 mt-0.5">稍後加強 [2]</span>
          </button>

          <button
            onClick={() => handleReview('good')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">熟悉掌握</span>
            <span className="text-[10px] text-indigo-500 mt-0.5">3天後複習 [3]</span>
          </button>

          <button
            onClick={() => handleReview('easy')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">精通熟練</span>
            <span className="text-[10px] text-emerald-600 mt-0.5">7天後複習 [4]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
