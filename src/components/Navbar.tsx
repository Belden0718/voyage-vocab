import React from 'react';
import { Flame, Settings, Cloud, CloudCheck } from 'lucide-react';
import type { UserStats } from '../types';
import type { User } from 'firebase/auth';

interface NavbarProps {
  stats: UserStats;
  currentUser: User | null;
  isCloudReady: boolean;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  stats, 
  currentUser, 
  isCloudReady, 
  onOpenSettings 
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-3.5 py-2.5 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* 左側品牌與 Logo */}
        <div className="flex items-center space-x-2 min-w-0">
          <img 
            src="/apple-touch-icon.png" 
            alt="VoyageVocab Logo" 
            className="w-8 h-8 rounded-xl shadow-sm shadow-indigo-200/50 object-cover border border-slate-100/80 shrink-0" 
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-slate-800 text-sm sm:text-base leading-tight tracking-tight whitespace-nowrap">
                隨行英文
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full shrink-0">
                旅遊 & 生活
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">VoyageVocab Pocket</p>
          </div>
        </div>

        {/* 右側快捷操作群組 */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* 雲端同步狀態 */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border shrink-0 whitespace-nowrap transition-all ${
              currentUser
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200/70'
                : isCloudReady
                ? 'bg-sky-50 text-sky-600 border-sky-200/70'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
            title={currentUser ? `已登入: ${currentUser.displayName || currentUser.email}` : '點擊設定雲端同步'}
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Avatar" 
                className="w-4 h-4 rounded-full object-cover shrink-0" 
              />
            ) : currentUser ? (
              <CloudCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className="whitespace-nowrap">{currentUser ? '已同步' : '本機'}</span>
          </button>

          {/* 連勝火花 */}
          <div className="flex items-center bg-amber-50 text-amber-600 border border-amber-200/60 px-2 py-1 rounded-full text-xs font-bold shrink-0 whitespace-nowrap shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-0.5 shrink-0 animate-bounce" />
            <span className="whitespace-nowrap">{stats.streakDays} 天</span>
          </div>

          {/* 設定按鈕 */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:scale-95 transition-all shrink-0"
            aria-label="設定與安裝"
          >
            <Settings className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
};
