import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

// 預設專案配置 (使用者提供)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD9Ut9Gq_qXnzlLag261Acx2xR8EZ2-ubk",
  authDomain: "voyage-vocab.firebaseapp.com",
  projectId: "voyage-vocab",
  storageBucket: "voyage-vocab.firebasestorage.app",
  messagingSenderId: "852823535541",
  appId: "1:852823535541:web:2703790ac2d7f0c12433fc",
  measurementId: "G-G2M5N9R110"
};

const getFirebaseConfig = () => {
  const env = import.meta.env;
  
  // 優先檢查是否有透過 Vite 注入的環境變數
  if (env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: env.VITE_FIREBASE_APP_ID || '',
    };
  }

  // 支援使用者在 App 設定中覆蓋自訂配置
  try {
    const customConfig = localStorage.getItem('voyage_firebase_custom_config');
    if (customConfig) {
      return JSON.parse(customConfig);
    }
  } catch {
    // ignore
  }

  return DEFAULT_FIREBASE_CONFIG;
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const config = getFirebaseConfig();

export const isFirebaseConfigured = (): boolean => {
  return !!(config && config.apiKey && config.projectId);
};

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(config!) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
}

export const googleProvider = new GoogleAuthProvider();
export { app, auth, db };

// 儲存使用者自訂的 Firebase 配置並重新整理
export const saveCustomFirebaseConfig = (cfg: Record<string, string>) => {
  localStorage.setItem('voyage_firebase_custom_config', JSON.stringify(cfg));
  window.location.reload();
};
