import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './firebase';
import type { WordItem, UserWordProgress, UserStats } from '../types';

export interface CloudUserData {
  customWords: WordItem[];
  progressMap: Record<string, UserWordProgress>;
  stats: UserStats;
  updatedAt: number;
}

// Google 一鍵登入
export const loginWithGoogle = async (): Promise<User | null> => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase 尚未配置金鑰');
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

// 登出
export const logoutFirebase = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};

// 監聽登入狀態改變
export const subscribeAuthChange = (callback: (user: User | null) => void) => {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// 上傳本機資料至 Firestore 雲端
export const uploadDataToCloud = async (user: User, data: CloudUserData): Promise<void> => {
  if (!db) return;
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    ...data,
    updatedAt: Date.now(),
  }, { merge: true });
};

// 從 Firestore 讀取使用者雲端資料
export const fetchCloudData = async (user: User): Promise<CloudUserData | null> => {
  if (!db) return null;
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data() as CloudUserData;
  }
  return null;
};

// 即時監聽雲端資料變更 (若在電腦加單字，手機會即時接收到更新)
export const subscribeCloudData = (
  user: User, 
  onUpdate: (data: CloudUserData) => void
) => {
  if (!db) return () => {};
  const userRef = doc(db, 'users', user.uid);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as CloudUserData);
    }
  });
};
