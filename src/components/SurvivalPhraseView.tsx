import React, { useState } from 'react';
import type { PhraseItem, CategoryType } from '../types';
import { SURVIVAL_PHRASES } from '../data/phrases';
import type { AppSettings } from '../utils/storage';
import { speakText, triggerHaptic } from '../utils/speech';
import { 
  Volume2, Search, Maximize2, X, MessageSquare, 
  Plane, Hotel, Utensils, ShoppingBag, Train, AlertCircle 
} from 'lucide-react';

interface SurvivalPhraseViewProps {
  settings: AppSettings;
}

const CATEGORIES: { id: CategoryType | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: '全部', icon: MessageSquare },
  { id: 'airport', label: '機場', icon: Plane },
  { id: 'hotel', label: '住宿', icon: Hotel },
  { id: 'dining', label: '點餐', icon: Utensils },
  { id: 'shopping', label: '購物', icon: ShoppingBag },
  { id: 'transport', label: '交通', icon: Train },
  { id: 'emergency', label: '緊急', icon: AlertCircle },
];

export const SurvivalPhraseView: React.FC<SurvivalPhraseViewProps> = ({ settings }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fullScreenPhrase, setFullScreenPhrase] = useState<PhraseItem | null>(null);

  const filteredPhrases = SURVIVAL_PHRASES.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchQuery = 
      p.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zh.includes(searchQuery) ||
      p.situation.includes(searchQuery);
    return matchCat && matchQuery;
  });

  const handleSpeak = (text: string) => {
    triggerHaptic('light');
    speakText(text, settings.speechRate, settings.speechLang);
  };

  const handleOpenBigText = (phrase: PhraseItem) => {
    triggerHaptic('medium');
    setFullScreenPhrase(phrase);
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in select-none">
      {/* 頂部搜尋欄 */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜尋中文、英文或情境（如：行李、退稅、Wi-Fi）..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 分類快速切換按鈕 */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 句子列表 */}
      <div className="space-y-3">
        {filteredPhrases.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            找不到符合「{searchQuery}」的常用句子
          </div>
        ) : (
          filteredPhrases.map(phrase => (
            <div
              key={phrase.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  📍 {phrase.situation}
                </span>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleSpeak(phrase.en)}
                    className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all"
                    aria-label="播放發音"
                    title="語音朗讀"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenBigText(phrase)}
                    className="p-1.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 active:scale-95 transition-all"
                    aria-label="放大出示給店員看"
                    title="大字展示模式"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-900 leading-snug">
                {phrase.en}
              </p>
              <p className="text-xs text-slate-500">
                {phrase.zh}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 大字展示模式 (出示給外國店員/海關看) */}
      {fullScreenPhrase && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col justify-between p-6 animate-fade-in text-white">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-semibold text-slate-400">
              出示模式 · {fullScreenPhrase.situation}
            </span>
            <button
              onClick={() => setFullScreenPhrase(null)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="my-auto space-y-6 text-center px-2">
            <div className="text-4xl font-black tracking-normal text-white leading-tight break-words">
              {fullScreenPhrase.en}
            </div>
            <div className="text-lg font-medium text-amber-300">
              {fullScreenPhrase.zh}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSpeak(fullScreenPhrase.en)}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-98"
            >
              <Volume2 className="w-5 h-5" />
              播放英文語音
            </button>
            <button
              onClick={() => setFullScreenPhrase(null)}
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl active:scale-98"
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
