import React from 'react';
import type { WordItem, UserWordProgress, CategoryType } from '../types';
import type { TabType } from './BottomNav';
import { 
  Plane, Hotel, Utensils, ShoppingBag, Train, MessageCircle, AlertCircle, 
  Play, Sparkles, CheckCircle2, ChevronRight, Trophy, Bookmark
} from 'lucide-react';
import { triggerHaptic } from '../utils/speech';

interface DashboardViewProps {
  words: WordItem[];
  progressMap: Record<string, UserWordProgress>;
  onChangeTab: (tab: TabType) => void;
  onSelectCategory: (category: CategoryType) => void;
}

const CATEGORY_META: Record<CategoryType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  airport: { label: '機場與飛行', icon: Plane, color: 'text-sky-600', bg: 'bg-sky-50' },
  hotel: { label: '飯店與住宿', icon: Hotel, color: 'text-amber-600', bg: 'bg-amber-50' },
  dining: { label: '餐廳與美食', icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  shopping: { label: '購物與退稅', icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
  transport: { label: '交通與指路', icon: Train, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  daily: { label: '日常口語俚語', icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
  emergency: { label: '緊急與醫療', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  words,
  progressMap,
  onChangeTab,
  onSelectCategory,
}) => {
  // 統計數據計算
  const totalCount = words.length;
  const masteredCount = Object.values(progressMap).filter(p => p.box >= 2).length;
  const learningCount = Object.values(progressMap).filter(p => p.box === 1).length;
  const starredCount = Object.values(progressMap).filter(p => p.isStarred).length;
  const progressPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  // 分類統計
  const categories = Object.keys(CATEGORY_META) as CategoryType[];

  const handleCategoryClick = (cat: CategoryType) => {
    triggerHaptic('medium');
    onSelectCategory(cat);
    onChangeTab('flashcards');
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in">
      {/* 頂部今日焦點看板 */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-700 rounded-3xl p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              出國隨行口說口袋書
            </span>
            <span className="text-xs text-indigo-100 font-medium">離線即時查閱</span>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">自信開口說英語</h2>
            <p className="text-xs text-indigo-100/90 mt-1 leading-relaxed">
              涵蓋機場、登機、飯店、點餐、買單到緊急求助必備單字與例句。
            </p>
          </div>

          {/* 進度總覽條 */}
          <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-indigo-100 font-medium">總體掌握進度</span>
              <span className="font-bold text-white">{masteredCount} / {totalCount} 詞 ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* 快速行動按鈕 */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onChangeTab('flashcards');
              }}
              className="flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm py-2.5 px-4 rounded-xl shadow-md active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-indigo-600 text-indigo-600" />
              開始翻卡複習
            </button>
            <button
              onClick={() => {
                triggerHaptic('medium');
                onChangeTab('quiz');
              }}
              className="flex items-center justify-center gap-2 bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/20 text-white font-bold text-sm py-2.5 px-4 rounded-xl backdrop-blur-md active:scale-95 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              測驗小挑戰
            </button>
          </div>
        </div>
      </div>

      {/* 學習數據統計區塊 */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-slate-800">{masteredCount}</span>
          <span className="text-[11px] text-slate-400 font-medium">已精通</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
            <Play className="w-4 h-4 fill-amber-500" />
          </div>
          <span className="text-lg font-black text-slate-800">{learningCount}</span>
          <span className="text-[11px] text-slate-400 font-medium">學習中</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-1">
            <Bookmark className="w-4 h-4 fill-rose-500" />
          </div>
          <span className="text-lg font-black text-slate-800">{starredCount}</span>
          <span className="text-[11px] text-slate-400 font-medium">星標珍藏</span>
        </div>
      </div>

      {/* 場景分類學習專區 */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <span>出國實戰場景詞庫</span>
            <span className="text-xs font-normal text-slate-400">({categories.length} 大情境)</span>
          </h3>
          <span className="text-xs text-indigo-600 font-medium">點擊直接練習</span>
        </div>

        <div className="space-y-2.5">
          {categories.map(cat => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const catWords = words.filter(w => w.category === cat);
            const catMastered = catWords.filter(w => (progressMap[w.id]?.box ?? 0) >= 2).length;
            const catPercent = catWords.length > 0 ? Math.round((catMastered / catWords.length) * 100) : 0;

            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="w-full bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 p-3 rounded-2xl shadow-sm flex items-center justify-between transition-all active:scale-98 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-11 h-11 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{meta.label}</h4>
                    <p className="text-xs text-slate-400">
                      {catMastered} / {catWords.length} 詞掌握度
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700">{catPercent}%</span>
                    <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${catPercent}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
