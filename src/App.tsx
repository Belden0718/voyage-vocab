import React, { useState, useEffect, useRef } from 'react';
import type { WordItem, UserWordProgress, CategoryType, UserStats } from './types';
import { 
  getAllWords, getWordProgressMap, recordWordReview, toggleStarWord, 
  getUserStats, saveCustomWord, updateCustomWord, deleteCustomWord, 
  removeWordProgress, getAppSettings, 
  saveAppSettings, setCustomWords, setWordProgressMap, getCustomWords,
  recordQuizCompletedStats, saveUserStats
} from './utils/storage';
import { checkBadgeUnlocks, calculateLevelInfo } from './utils/gamification';
import type { AppSettings } from './utils/storage';
import { isFirebaseConfigured } from './services/firebase';
import { 
  subscribeAuthChange, uploadDataToCloud, 
  fetchCloudData, subscribeCloudData 
} from './services/syncService';
import type { User } from 'firebase/auth';
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
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Firebase 狀態
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isCloudReady = isFirebaseConfigured();
  const isSyncingFromCloud = useRef(false);

  // 初始化本地資料載入 (含歷史學習紀錄自動回溯補算 EXP 與徽章)
  useEffect(() => {
    const loadedWords = getAllWords();
    const loadedProgress = getWordProgressMap();
    let currentStats = getUserStats();

    // 若為新上線的等級系統，自動根據歷史學習進度回溯補發 EXP 與徽章
    if (currentStats.exp === 0) {
      const mastered = Object.values(loadedProgress).filter(p => p.box >= 2).length;
      const learning = Object.values(loadedProgress).filter(p => p.box === 1).length;
      const reviews = currentStats.totalReviewed || 0;
      
      const retroactiveExp = (mastered * 25) + (learning * 10) + (reviews * 5);
      if (retroactiveExp > 0) {
        currentStats = {
          ...currentStats,
          exp: retroactiveExp,
        };
        const levelInfo = calculateLevelInfo(retroactiveExp);
        currentStats.level = levelInfo.level;
        currentStats.levelTitle = levelInfo.title;

        const badgeCheck = checkBadgeUnlocks(currentStats, loadedWords, loadedProgress);
        if (badgeCheck.newlyUnlocked.length > 0) {
          currentStats.badges = badgeCheck.updatedBadges;
          currentStats.exp += badgeCheck.newlyUnlocked.length * 50;
          const updatedLevel = calculateLevelInfo(currentStats.exp);
          currentStats.level = updatedLevel.level;
          currentStats.levelTitle = updatedLevel.title;
        }

        saveUserStats(currentStats);
      }
    }

    setWords(loadedWords);
    setProgressMap(loadedProgress);
    setStats(currentStats);
    setSettings(getAppSettings());
  }, []);

  // 監聽 Firebase 登入與即時雲端同步
  useEffect(() => {
    const unsubscribeAuth = subscribeAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        // 從雲端抓取初次資料
        try {
          const cloudData = await fetchCloudData(user);
          if (cloudData) {
            isSyncingFromCloud.current = true;
            if (cloudData.customWords) {
              // 合併本地與雲端自訂單字
              const localCustom = getCustomWords();
              const existingIds = new Set(localCustom.map(w => w.id));
              const mergedCustom = [...localCustom];
              cloudData.customWords.forEach(w => {
                if (!existingIds.has(w.id)) {
                  mergedCustom.push(w);
                }
              });
              setCustomWords(mergedCustom);
              setWords(getAllWords());
            }
            if (cloudData.progressMap) {
              const mergedProgress = { ...getWordProgressMap(), ...cloudData.progressMap };
              setWordProgressMap(mergedProgress);
              setProgressMap(mergedProgress);
            }
            if (cloudData.stats) {
              setStats(cloudData.stats);
            }
            setTimeout(() => { isSyncingFromCloud.current = false; }, 500);
          } else {
            // 雲端尚未有資料，將本地資料第一次上傳
            uploadDataToCloud(user, {
              customWords: getCustomWords(),
              progressMap: getWordProgressMap(),
              stats: getUserStats(),
              updatedAt: Date.now(),
            });
          }
        } catch (e) {
          console.error('Fetch cloud data error:', e);
        }

        // 即時監聽其他裝置的異動
        const unsubscribeCloud = subscribeCloudData(user, (newData) => {
          if (isSyncingFromCloud.current) return;
          if (newData.customWords) {
            const currentCustom = getCustomWords();
            const isCustomChanged = JSON.stringify(currentCustom) !== JSON.stringify(newData.customWords);
            if (isCustomChanged) {
              setCustomWords(newData.customWords);
              setWords(getAllWords());
            }
          }
          if (newData.progressMap) {
            const currentMap = getWordProgressMap();
            const isProgressChanged = JSON.stringify(currentMap) !== JSON.stringify(newData.progressMap);
            if (isProgressChanged) {
              setWordProgressMap(newData.progressMap);
              setProgressMap(newData.progressMap);
            }
          }
        });

        return () => {
          unsubscribeCloud();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 輔助：自動同步至雲端
  const syncToCloudIfLoggedIn = (
    updatedProgress?: Record<string, UserWordProgress>,
    updatedWords?: WordItem[],
    updatedStats?: UserStats
  ) => {
    if (currentUser && !isSyncingFromCloud.current) {
      uploadDataToCloud(currentUser, {
        customWords: (updatedWords || words).filter(w => w.id.startsWith('custom-')),
        progressMap: updatedProgress || progressMap,
        stats: updatedStats || getUserStats(),
        updatedAt: Date.now(),
      });
    }
  };

  // 處理單字 SRS 評分
  const handleReviewWord = (wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    const updated = recordWordReview(wordId, rating);
    const nextMap = { ...progressMap, [wordId]: updated };
    setProgressMap(nextMap);
    const updatedStats = getUserStats();
    setStats(updatedStats);
    syncToCloudIfLoggedIn(nextMap, undefined, updatedStats);
  };

  // 處理星標切換
  const handleToggleStar = (wordId: string) => {
    const isStarred = toggleStarWord(wordId);
    setProgressMap(prev => {
      const cur = prev[wordId];
      if (!cur) return prev;
      const nextMap = { ...prev, [wordId]: { ...cur, isStarred } };
      syncToCloudIfLoggedIn(nextMap);
      return nextMap;
    });
  };

  // 新增自訂單字
  const handleAddCustomWord = (newWordData: Omit<WordItem, 'id'>) => {
    const created = saveCustomWord(newWordData);
    const nextWords = [created, ...words];
    setWords(nextWords);
    syncToCloudIfLoggedIn(undefined, nextWords);
  };

  // 編輯更新自訂單字
  const handleUpdateCustomWord = (updatedWord: WordItem) => {
    updateCustomWord(updatedWord);
    const nextWords = words.map(w => (w.id === updatedWord.id ? updatedWord : w));
    setWords(nextWords);
    syncToCloudIfLoggedIn(undefined, nextWords);
  };

  // 刪除自訂單字
  const handleDeleteCustomWord = (wordId: string) => {
    deleteCustomWord(wordId);
    const nextWords = words.filter(w => w.id !== wordId);
    const nextProgress = { ...progressMap };
    delete nextProgress[wordId];
    removeWordProgress(wordId);
    setWords(nextWords);
    setProgressMap(nextProgress);
    syncToCloudIfLoggedIn(nextProgress, nextWords);
  };

  // 測驗結果即時反饋
  const handleQuizResult = (wordId: string, isCorrect: boolean) => {
    handleReviewWord(wordId, isCorrect ? 'good' : 'again');
  };

  // 測驗完成全套結算 (發放 EXP、計算徽章解鎖)
  const handleQuizComplete = (score: number, total: number) => {
    const { stats: updatedStats, expEarned } = recordQuizCompletedStats(score, total);
    const badgeResult = checkBadgeUnlocks(updatedStats, words, progressMap);

    let totalEarned = expEarned;
    if (badgeResult.newlyUnlocked.length > 0) {
      updatedStats.badges = badgeResult.updatedBadges;
      const badgeBonus = badgeResult.newlyUnlocked.length * 50;
      updatedStats.exp += badgeBonus;
      totalEarned += badgeBonus;
      saveUserStats(updatedStats);
    }

    setStats({ ...updatedStats });
    syncToCloudIfLoggedIn(undefined, undefined, updatedStats);

    return {
      expEarned: totalEarned,
      newlyUnlocked: badgeResult.newlyUnlocked,
      currentStats: updatedStats,
    };
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
        syncToCloudIfLoggedIn(parsed.progressMap, getAllWords());
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
          currentUser={currentUser}
          isCloudReady={isCloudReady}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 主要頁面內容區 */}
        <main className="flex-1 px-4 pt-3 pb-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              words={words}
              progressMap={progressMap}
              stats={stats}
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
              onChangeTab={setActiveTab}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              words={words}
              settings={settings}
              onRecordResult={handleQuizResult}
              onQuizComplete={handleQuizComplete}
              onUpdateSettings={handleUpdateSettings}
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
              onUpdateCustomWord={handleUpdateCustomWord}
              onDeleteCustomWord={handleDeleteCustomWord}
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

        {/* 設定與雲端登入彈窗 */}
        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          currentUser={currentUser}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </div>
  );
};

export default App;
