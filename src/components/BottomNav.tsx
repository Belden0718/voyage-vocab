import React from 'react';
import { LayoutDashboard, Layers, HelpCircle, BookOpen, Bookmark } from 'lucide-react';
import { triggerHaptic } from '../utils/speech';

export type TabType = 'dashboard' | 'flashcards' | 'quiz' | 'phrases' | 'words';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  starredCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, starredCount = 0 }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: '首頁', icon: LayoutDashboard },
    { id: 'flashcards' as TabType, label: '字卡', icon: Layers },
    { id: 'quiz' as TabType, label: '測驗', icon: HelpCircle },
    { id: 'phrases' as TabType, label: '會話手冊', icon: BookOpen },
    { id: 'words' as TabType, label: '單字庫', icon: Bookmark, badge: starredCount > 0 ? starredCount : undefined },
  ];

  const handleTabClick = (tabId: TabType) => {
    triggerHaptic('light');
    onChangeTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-1.5 px-2">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white scale-90">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10.5px] mt-1 transition-all ${isActive ? 'scale-105 font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
