import React, { useState } from 'react';
import type { AppSettings } from '../utils/storage';
import { speakText, triggerHaptic } from '../utils/speech';
import { CountryFlag } from './CountryFlag';
import { isFirebaseConfigured, saveCustomFirebaseConfig } from '../services/firebase';
import { loginWithGoogle, logoutFirebase } from '../services/syncService';
import type { User } from 'firebase/auth';
import { 
  X, Smartphone, Sliders, Cloud, LogIn, LogOut, 
  CheckCircle2, AlertCircle, KeyRound, ChevronDown, ChevronUp 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  currentUser: User | null;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  currentUser,
  onClose,
  onUpdateSettings,
}) => {
  const [showConfigInput, setShowConfigInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [appId, setAppId] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const testVoice = (lang: string, rate: number) => {
    speakText('Welcome to VoyageVocab! Enjoy your English learning journey.', rate, lang);
  };

  const handleLogin = async () => {
    setAuthLoading(true);
    setErrorMsg('');
    try {
      triggerHaptic('light');
      await loginWithGoogle();
      triggerHaptic('success');
    } catch (err: unknown) {
      triggerHaptic('warning');
      setErrorMsg((err as Error).message || 'Google 登入失敗');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    triggerHaptic('light');
    await logoutFirebase();
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) return;

    saveCustomFirebaseConfig({
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      appId: appId.trim(),
    });
  };

  const hasFirebase = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 animate-scale-up text-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* 標題列 */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
            <Sliders className="w-5 h-5 text-indigo-600" />
            個人學習設定 & 雲端同步
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 雲端 Firebase 同步區塊 */}
        <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-indigo-600" />
              Firebase 雲端即時同步
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              currentUser 
                ? 'bg-emerald-100 text-emerald-700' 
                : hasFirebase 
                ? 'bg-sky-100 text-sky-700' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {currentUser ? '即時同步中' : hasFirebase ? '已連線 / 未登入' : '本機模式'}
            </span>
          </div>

          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 flex items-start gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 使用者已登入狀態 */}
          {currentUser ? (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {currentUser.photoURL && (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border border-indigo-200 shadow-sm" 
                    />
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.displayName || 'Google 使用者'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-rose-600 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95"
                >
                  <LogOut className="w-3 h-3" />
                  登出
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>電腦與手機新增的生詞將全自動即時同步！</span>
              </div>
            </div>
          ) : hasFirebase ? (
            /* 已設定 Firebase 但尚未登入 */
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                登入 Google 帳號後，您在電腦上加的單字會即時在手機 App 出現！
              </p>
              <button
                onClick={handleLogin}
                disabled={authLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{authLoading ? '連線中...' : '使用 Google 帳號一鍵登入同步'}</span>
              </button>
            </div>
          ) : (
            /* 尚未設定 Firebase 金鑰 */
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                目前使用本地快取儲存。可綁定 Firebase 啟用跨設備即時同步。
              </p>
              
              <button
                type="button"
                onClick={() => setShowConfigInput(!showConfigInput)}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>綁定 Firebase 金鑰</span>
                {showConfigInput ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
              </button>

              {showConfigInput && (
                <form onSubmit={handleSaveFirebaseConfig} className="space-y-2 pt-1 animate-fade-in text-[11px]">
                  <div>
                    <label className="text-slate-600 block font-semibold">API Key *</label>
                    <input
                      type="text"
                      required
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block font-semibold">Project ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="my-english-app"
                      value={projectId}
                      onChange={e => setProjectId(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block font-semibold">Auth Domain (選填)</label>
                    <input
                      type="text"
                      placeholder="my-english-app.firebaseapp.com"
                      value={authDomain}
                      onChange={e => setAuthDomain(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 block font-semibold">App ID (選填)</label>
                    <input
                      type="text"
                      placeholder="1:12345:web:..."
                      value={appId}
                      onChange={e => setAppId(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-[10px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs hover:bg-indigo-700 active:scale-95"
                  >
                    儲存金鑰並啟用
                  </button>
                </form>
              )}
            </div>
          )}
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
                { code: 'en-US', label: '美式口音', country: 'US' },
                { code: 'en-GB', label: '英式口音', country: 'GB' },
                { code: 'en-AU', label: '澳洲口音', country: 'AU' },
              ].map(voice => (
                <button
                  key={voice.code}
                  onClick={() => {
                    triggerHaptic('light');
                    onUpdateSettings({ speechLang: voice.code });
                    testVoice(voice.code, settings.speechRate);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1.5 ${
                    settings.speechLang === voice.code
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CountryFlag code={voice.country} className="w-5 h-3.5 inline-block rounded-[2px] shadow-2xs border border-white/20 align-middle shrink-0" />
                  <span>{voice.label}</span>
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
