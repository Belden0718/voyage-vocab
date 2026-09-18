import React, { useState, useEffect } from 'react';
import type { WordItem, UserWordProgress, CategoryType } from '../types';
import type { AppSettings } from '../utils/storage';
import { 
  Volume2, Star, RotateCw, ArrowLeft, ArrowRight, Lightbulb 
} from 'lucide-react';
import { speakText, triggerHaptic } from '../utils/speech';

interface FlashcardViewProps {
  words: WordItem[];
  progressMap: Record<string, UserWordProgress>;
  settings: AppSettings;
  initialCategory?: CategoryType | 'all' | 'starred';
  onReviewWord: (wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onToggleStar: (wordId: string) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  words,
  progressMap,
  settings,
  initialCategory = 'all',
  onReviewWord,
  onToggleStar,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all' | 'starred'>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // 依分類過濾
  const filteredWords = words.filter(w => {
    if (selectedCategory === 'starred') {
      return progressMap[w.id]?.isStarred;
    }
    if (selectedCategory === 'all') return true;
    return w.category === selectedCategory;
  });

  const currentWord: WordItem | undefined = filteredWords[currentIndex];
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

  const handleFlip = () => {
    triggerHaptic('light');
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (text: string, slow: boolean = false, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic('light');
    const rate = slow ? 0.7 : settings.speechRate;
    speakText(text, rate, settings.speechLang);
  };

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      triggerHaptic('light');
      setCurrentIndex(prev => prev + 1);
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
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 若已到最後一張，回首張或提示
      setCurrentIndex(0);
    }
  };

  if (filteredWords.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4 pb-12 animate-fade-in select-none">
      {/* 分類滑動條 */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          全部 ({words.length})
        </button>
        <button
          onClick={() => { setSelectedCategory('starred'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
            selectedCategory === 'starred'
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          星標收藏
        </button>
        <button
          onClick={() => { setSelectedCategory('airport'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedCategory === 'airport' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200/80'
          }`}
        >
          ✈️ 機場
        </button>
        <button
          onClick={() => { setSelectedCategory('hotel'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedCategory === 'hotel' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200/80'
          }`}
        >
          🏨 住宿
        </button>
        <button
          onClick={() => { setSelectedCategory('dining'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedCategory === 'dining' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200/80'
          }`}
        >
          🍽️ 餐廳
        </button>
        <button
          onClick={() => { setSelectedCategory('shopping'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedCategory === 'shopping' ? 'bg-pink-600 text-white' : 'bg-white text-slate-600 border border-slate-200/80'
          }`}
        >
          🛍️ 購物
        </button>
        <button
          onClick={() => { setSelectedCategory('transport'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedCategory === 'transport' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200/80'
          }`}
        >
          🚊 交通
        </button>
        <button
          onClick={() => { setSelectedCategory('daily'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedCategory === 'daily' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200/80'
          }`}
        >
          💬 口語
        </button>
        <button
          onClick={() => { setSelectedCategory('emergency'); setCurrentIndex(0); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedCategory === 'emergency' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200/80'
          }`}
        >
          🚨 緊急
        </button>
      </div>

      {/* 進度與切換指示列 */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-medium">
        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
          {currentIndex + 1} / {filteredWords.length}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === filteredWords.length - 1}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D 翻轉單字卡片本體 */}
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
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                {currentWord?.categoryLabel}
              </span>

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
            <div className="text-center my-auto space-y-2">
              <div className="inline-block">
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mr-1.5">
                  {currentWord?.partOfSpeech}
                </span>
                <span className="text-xs text-slate-400 font-mono tracking-wide">
                  {currentWord?.phonetic}
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
              <span>點擊卡片查看中文與例句</span>
            </div>
          </div>

          {/* 背面 (Back) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900 flex flex-col justify-between backface-hidden rotate-y-180 overflow-y-auto no-scrollbar">
            {/* 頂部中文字意 */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-sky-400">
                  {currentWord?.partOfSpeech} {currentWord?.word}
                </span>
                <span className="text-[11px] text-slate-400">繁中解析</span>
              </div>
              <h3 className="text-2xl font-black text-amber-300 mt-2">
                {currentWord?.translation}
              </h3>
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
              <p className="text-xs font-medium text-white/95 leading-relaxed">
                "{currentWord?.example}"
              </p>
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
              再次點擊卡片翻回正面
            </div>
          </div>
        </div>
      </div>

      {/* Anki 間隔重複 (SRS) 打分評估按鈕 */}
      <div className="space-y-1.5 pt-2">
        <div className="text-center text-[11px] font-medium text-slate-400">
          評估您的記憶熟悉度（自動為您排程複習）
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleReview('again')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">生疏 / 忘記</span>
            <span className="text-[10px] text-rose-500 mt-0.5">重置複習</span>
          </button>

          <button
            onClick={() => handleReview('hard')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">模糊困難</span>
            <span className="text-[10px] text-amber-600 mt-0.5">稍後加強</span>
          </button>

          <button
            onClick={() => handleReview('good')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">熟悉掌握</span>
            <span className="text-[10px] text-indigo-500 mt-0.5">3天後複習</span>
          </button>

          <button
            onClick={() => handleReview('easy')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all shadow-sm"
          >
            <span className="font-bold text-xs">精通熟練</span>
            <span className="text-[10px] text-emerald-600 mt-0.5">7天後複習</span>
          </button>
        </div>
      </div>
    </div>
  );
};
