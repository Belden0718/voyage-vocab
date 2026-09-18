# VoyageVocab - 隨行英文口袋書 (PWA 手機桌面版)

專為手機螢幕量身打造的**日常生活與出國旅遊英語學習 Progressive Web App (PWA)**。支援一鍵加入手機主畫面桌面、全螢幕獨立運行、離線背單字、3D 觸控翻卡、道地英語發音與情境急難會話手冊。

---

## 📱 專為手機桌面操作設計的核心特點

1. **一鍵加入手機主畫面 (Add to Home Screen)**：
   - 包含標準 Web App Manifest 與 Service Worker 快取機制。
   - iPhone (iOS Safari) 與 Android (Chrome) 皆可安裝至手機桌面，如同原生 App 般全螢幕獨立開啟，無網址列干擾。
2. **道地語音發音 (Web Speech API)**：
   - 支援單字與例句朗讀，提供 0.7x 慢速模式。
   - 可自由切換美式口音 (US)、英式口音 (GB) 或澳洲口音 (AU)。
3. **3D 觸控翻面單字卡 (Interactive Flashcards)**：
   - 擬真卡片翻轉效果，正面包含發音、音標與詞性，背面包含繁中詳解、情境例句與文化小撇步。
   - 內建 Anki / Leitner 間隔重複記憶評估（生疏、模糊、熟悉、精通），科學化自動排程複習。
4. **即時互動挑戰測驗 (Quiz Mode)**：
   - 支援英翻中、中翻英以及**英語聽力聽辨測驗**。
   - 即時反饋、答錯加入錯題本檢討、滿分彩帶慶祝特效 (`canvas-confetti`)。
5. **旅遊實戰即時會話手冊 (Survival Phrasebook)**：
   - 出國必備應急句子：機場出入境、飯店入住、餐廳點餐、購物退稅、交通搭乘、急難求助。
   - **大字展示模式 (Big Text Show Mode)**：點擊即可全螢幕放大字體並可一鍵播放語音，方便直接出示給外國店員或海關看。
6. **生詞庫與自訂匯入匯出 (Notebook & Custom Words)**：
   - 支援隨手收藏星標單字，亦可自行新增旅途中遇到的新單字。
   - 提供 JSON 檔案一鍵備份與匯入功能，換手機進度不遺失。

---

## 📂 專案結構圖

```
learner/
├── index.html                  # PWA 主頁面與行動端 viewport 設定
├── package.json
├── tailwind.config.js          # Tailwind CSS 主題與 3D 翻轉樣式配置
├── vite.config.ts              # Vite 與 PWA 外掛設定
├── public/                     # 靜態圖示與 PWA Icons (192x192 / 512x512)
└── src/
    ├── App.tsx                 # 應用程式主入口與狀態協同
    ├── main.tsx
    ├── index.css               # 樣式定義與 3D 翻牌特效
    ├── components/             # 前端核心視圖元件 (包含儀表板、字卡、測驗、手冊、設定與導覽)
    │   ├── BottomNav.tsx
    │   ├── DashboardView.tsx
    │   ├── FlashcardView.tsx
    │   ├── InstallPrompt.tsx
    │   ├── Navbar.tsx
    │   ├── QuizView.tsx
    │   ├── SettingsModal.tsx
    │   ├── SurvivalPhraseView.tsx
    │   └── WordListView.tsx
    ├── data/                   # 內建日常生活與出國情境單字與會話庫
    │   ├── phrases.ts
    │   └── vocabulary.ts
    ├── types/                  # TypeScript 型別定義
    │   └── index.ts
    └── utils/                  # 語音朗讀、觸覺回饋、SRS 演算法與測驗生成器
        ├── quizGenerator.ts
        ├── speech.ts
        └── storage.ts
```

---

## 🚀 如何啟動與使用

### 1. 開發模式預覽
在終端機中執行：
```bash
npm run dev
```
啟動後會顯示本地伺服器網址（如 `http://localhost:5173`），若在同一個區域網路（Wi-Fi）下，亦可使用手機瀏覽器直接輸入區域網路 IP（如 `http://192.168.x.x:5173`）預覽。

### 2. 生產模式建置
```bash
npm run build
npm run preview
```

---

## 📲 如何加入手機桌面操作指南

### 🍏 iPhone / iPad (iOS Safari)
1. 在 iPhone 開啟 **Safari** 瀏覽器並開啟網頁。
2. 點擊螢幕下方中間的 **「分享」** 圖示（方形向上箭頭）。
3. 往下滑動，選取 **「加入主畫面 (Add to Home Screen)」**。
4. 點選右上角的 **「新增」**，應用程式圖示就會出現在手機桌面，開啟時即為全螢幕 App！

### 🤖 Android (Google Chrome)
1. 在手機開啟 **Chrome** 瀏覽器並開啟網頁。
2. 點擊右上角選單（三個垂直點）。
3. 點選 **「加到主畫面」** 或點擊畫面頂部的 **「立即加到桌面」** 提示按鈕。
4. 確認安裝，手機桌面即可直接點擊啟動，離線亦可使用！
