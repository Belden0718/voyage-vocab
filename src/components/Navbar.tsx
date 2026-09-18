import React from 'react';
import { Flame, Settings, Compass } from 'lucide-react';
import type { UserStats } from '../types';

interface NavbarProps {
  stats: UserStats;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ stats, onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Compass className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight tracking-tight">
              隨行英文 <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full ml-1">旅遊 & 生活</span>
            </h1>
            <p className="text-[11px] text-slate-400">VoyageVocab Pocket</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 連勝火花 */}
          <div className="flex items-center bg-amber-50 text-amber-600 border border-amber-200/60 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1 animate-bounce" />
            <span>{stats.streakDays} 天</span>
          </div>

          {/* 設定按鈕 */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="設定與安裝"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
