import React from 'react';
import type { AppSettings } from '../utils/storage';
import { speakText, triggerHaptic } from '../utils/speech';
import { X, Smartphone, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const testVoice = (lang: string, rate: number) => {
    speakText('Welcome to VoyageVocab! Enjoy your English learning journey.', rate, lang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 animate-scale-up text-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* 標題列 */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
            <Sliders className="w-5 h-5 text-indigo-600" />
            個人學習設定 & 桌面操作
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 語音設定 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
            🔊 英語發音引擎
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              英文口音風格
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en-US', label: '美式口音 🇺🇸' },
                { code: 'en-GB', label: '英式口音 🇬🇧' },
                { code: 'en-AU', label: '澳洲口音 🇦🇺' },
              ].map(voice => (
                <button
                  key={voice.code}
                  onClick={() => {
                    triggerHaptic('light');
                    onUpdateSettings({ speechLang: voice.code });
                    testVoice(voice.code, settings.speechRate);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                    settings.speechLang === voice.code
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {voice.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>發音語速</span>
              <span className="text-indigo-600 font-bold">{settings.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateSettings({ speechRate: val });
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-slate-700">換卡時自動朗讀發音</span>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => onUpdateSettings({ autoSpeak: e.target.checked })}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* 手機桌面加入教學 */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            加入手機桌面指南 (PWA)
          </h4>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <span>🍏 iPhone / iPad (iOS Safari)</span>
            </div>
            <p className="leading-relaxed">
              1. 點擊螢幕下方 Safari 的 <strong>分享按鈕</strong>（中間箭頭圖示）。<br />
              2. 往下選取 <strong>「加入主畫面 (Add to Home Screen)」</strong>。<br />
              3. 點選右上角「新增」，手機桌面即可像 App 一樣隨開即背！
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <span>🤖 Android (Google Chrome)</span>
            </div>
            <p className="leading-relaxed">
              1. 點擊瀏覽器右上角 <strong>選單 (三個點)</strong>。<br />
              2. 點選 <strong>「加到主畫面」</strong> 或 <strong>「安裝應用程式」</strong>。<br />
              3. 確定安裝，即可享有全螢幕獨立視窗與離線加速。
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all active:scale-98"
        >
          儲存並關閉
        </button>
      </div>
    </div>
  );
};
