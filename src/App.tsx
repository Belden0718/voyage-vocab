import React, { useState, useEffect } from 'react';
import type { WordItem, UserWordProgress, CategoryType, UserStats } from './types';
import { 
  getAllWords, getWordProgressMap, recordWordReview, toggleStarWord, 
  getUserStats, saveCustomWord, getAppSettings, 
  saveAppSettings 
} from './utils/storage';
import type { AppSettings } from './utils/storage';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import type { TabType } from './components/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { DashboardView } from './components/DashboardView';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { SurvivalPhraseView } from './components/SurvivalPhraseView';
import { WordListView } from './components/WordListView';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [words, setWords] = useState<WordItem[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserWordProgress>>({});
  const [stats, setStats] = useState<UserStats>({ streakDays: 1, lastActiveDate: '', totalMastered: 0, totalReviewed: 0 });
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 初始化資料載入
  useEffect(() => {
    const loadedWords = getAllWords();
    setWords(loadedWords);
    setProgressMap(getWordProgressMap());
    setStats(getUserStats());
    setSettings(getAppSettings());
  }, []);

  // 處理單字 SRS 評分
  const handleReviewWord = (wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    const updated = recordWordReview(wordId, rating);
    setProgressMap(prev => ({ ...prev, [wordId]: updated }));
    setStats(getUserStats());
  };

  // 處理星標切換
  const handleToggleStar = (wordId: string) => {
    const isStarred = toggleStarWord(wordId);
    setProgressMap(prev => {
      const cur = prev[wordId];
      if (!cur) return prev;
      return { ...prev, [wordId]: { ...cur, isStarred } };
    });
  };

  // 新增自訂單字
  const handleAddCustomWord = (newWordData: Omit<WordItem, 'id'>) => {
    const created = saveCustomWord(newWordData);
    setWords(prev => [created, ...prev]);
  };

  // 測驗結果反饋
  const handleQuizResult = (wordId: string, isCorrect: boolean) => {
    handleReviewWord(wordId, isCorrect ? 'good' : 'again');
  };

  // 更新個人設定
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = saveAppSettings(newSettings);
    setSettings(updated);
  };

  // 備份匯出 JSON
  const handleExportData = () => {
    const data = {
      progressMap,
      stats,
      settings,
      customWords: words.filter(w => w.id.startsWith('custom-')),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyage_vocab_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 備份匯入 JSON
  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.progressMap) {
          localStorage.setItem('voyage_vocab_progress_v1', JSON.stringify(parsed.progressMap));
          setProgressMap(parsed.progressMap);
        }
        if (parsed.customWords) {
          localStorage.setItem('voyage_vocab_custom_v1', JSON.stringify(parsed.customWords));
          setWords(getAllWords());
        }
        alert('備份資料匯入成功！');
      } catch (err) {
        alert('匯入失敗：檔案格式不相符');
      }
    };
    reader.readAsText(file);
  };

  const starredCount = Object.values(progressMap).filter(p => p.isStarred).length;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* 行動裝置最佳化寬度容器 (Mobile-App Container) */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col relative shadow-2xl overflow-hidden pb-16">
        {/* PWA 加入桌面安裝提示條 */}
        <InstallPrompt />

        {/* 頂部功能列 */}
        <Navbar
          stats={stats}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 主要頁面內容區 */}
        <main className="flex-1 px-4 pt-3 pb-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              words={words}
              progressMap={progressMap}
              onChangeTab={setActiveTab}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardView
              words={words}
              progressMap={progressMap}
              settings={settings}
              initialCategory={selectedCategory}
              onReviewWord={handleReviewWord}
              onToggleStar={handleToggleStar}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              words={words}
              settings={settings}
              onRecordResult={handleQuizResult}
            />
          )}

          {activeTab === 'phrases' && (
            <SurvivalPhraseView
              settings={settings}
            />
          )}

          {activeTab === 'words' && (
            <WordListView
              words={words}
              progressMap={progressMap}
              settings={settings}
              onToggleStar={handleToggleStar}
              onAddCustomWord={handleAddCustomWord}
              onExportData={handleExportData}
              onImportData={handleImportData}
            />
          )}
        </main>

        {/* 手機端底部導航選單 */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          starredCount={starredCount}
        />

        {/* 設定彈窗 */}
        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </div>
  );
};

export default App;
