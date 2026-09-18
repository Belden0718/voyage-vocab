import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, PlusSquare, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // 檢查是否已經是以桌面獨立應用 (PWA standalone) 執行
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      return; // 已經在桌面 App 中，不需要提示
    }

    // 檢查 iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 監聽 Android / Chrome 的 beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 如果是 iOS，也提醒可以加入主畫面
    if (isIosDevice) {
      const dismissed = localStorage.getItem('voyage_pwa_ios_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('voyage_pwa_ios_dismissed', 'true');
  };

  if (isStandalone || !showBanner) {
    return null;
  }

  return (
    <>
      {/* 頂部安裝提醒橫條 */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs animate-fade-in">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-white/20 rounded-lg">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold">加到手機桌面體驗更佳！</p>
            <p className="text-[11px] text-indigo-100">支援離線背單字、全螢幕無網址列</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleInstallClick}
            className="bg-white text-indigo-700 font-bold px-3 py-1 rounded-full text-xs shadow hover:bg-indigo-50 active:scale-95 transition-all flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5 mr-0.5" />
            <span>{isIOS ? '教學' : '立即加到桌面'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="text-indigo-200 hover:text-white p-1"
            aria-label="關閉提示"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 手動加入桌面說明彈窗 */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-scale-up text-slate-800">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                加入手機桌面步驟
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">在 iPhone / iPad Safari 瀏覽器中：</p>
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <Share className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">步驟 1</span>
                    <p>點選 Safari 底部工具列正中央的「分享」圖標。</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <PlusSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">步驟 2</span>
                    <p>在選單中往下滾動，找到並點選「加入主畫面」。</p>
                  </div>
                </div>

                <div className="text-xs text-indigo-600 bg-indigo-50 p-2.5 rounded-xl">
                  ✨ 加入後即可從手機桌面直接開啟，全螢幕運行更省電順暢！
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">在 Android / Chrome 瀏覽器中：</p>
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">安裝應用程式</span>
                    <p>點選瀏覽器右上角選單 (三個點)，選擇「加到主畫面」或「安裝應用程式」。</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
};
