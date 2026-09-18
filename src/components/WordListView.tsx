import React, { useState } from 'react';
import type { WordItem, UserWordProgress, CategoryType } from '../types';
import type { AppSettings } from '../utils/storage';
import { speakText, triggerHaptic } from '../utils/speech';
import { 
  Search, Star, Plus, Volume2, CheckCircle, Clock, 
  Download, Upload, X 
} from 'lucide-react';

interface WordListViewProps {
  words: WordItem[];
  progressMap: Record<string, UserWordProgress>;
  settings: AppSettings;
  onToggleStar: (wordId: string) => void;
  onAddCustomWord: (word: Omit<WordItem, 'id'>) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export const WordListView: React.FC<WordListViewProps> = ({
  words,
  progressMap,
  settings,
  onToggleStar,
  onAddCustomWord,
  onExportData,
  onImportData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'starred' | 'mastered' | 'learning'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // 新增單字表單狀態
  const [newWord, setNewWord] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('n.');
  const [newTranslation, setNewTranslation] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('daily');
  const [newExample, setNewExample] = useState('');
  const [newExampleTranslation, setNewExampleTranslation] = useState('');
  const [newTip, setNewTip] = useState('');

  const filteredWords = words.filter(w => {
    const progress = progressMap[w.id];
    if (filterMode === 'starred' && !progress?.isStarred) return false;
    if (filterMode === 'mastered' && (!progress || progress.box < 2)) return false;
    if (filterMode === 'learning' && (!progress || progress.box !== 1)) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      w.word.toLowerCase().includes(q) ||
      w.translation.includes(q) ||
      w.categoryLabel.includes(q)
    );
  });

  const handleSpeak = (text: string) => {
    triggerHaptic('light');
    speakText(text, settings.speechRate, settings.speechLang);
  };

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    onAddCustomWord({
      word: newWord.trim(),
      phonetic: newPhonetic.trim() || `/${newWord.toLowerCase()}/`,
      partOfSpeech: newPartOfSpeech,
      translation: newTranslation.trim(),
      category: newCategory,
      categoryLabel: newCategory === 'airport' ? '機場飛行' : newCategory === 'hotel' ? '飯店住宿' : newCategory === 'dining' ? '餐廳美食' : newCategory === 'shopping' ? '購物退稅' : newCategory === 'transport' ? '交通指路' : newCategory === 'daily' ? '日常口語' : '緊急醫療',
      example: newExample.trim() || `I need to know how to use "${newWord}".`,
      exampleTranslation: newExampleTranslation.trim() || `我需要知道如何使用「${newWord}」。`,
      tip: newTip.trim() || undefined,
    });

    // 重設表單
    setNewWord('');
    setNewPhonetic('');
    setNewTranslation('');
    setNewExample('');
    setNewExampleTranslation('');
    setNewTip('');
    setShowAddModal(false);
    triggerHaptic('success');
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in select-none">
      {/* 頂部搜尋與新增按鈕 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋單字、中文或詞類..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setShowAddModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-2xl shadow-md active:scale-95 transition-all shrink-0 flex items-center gap-1 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>加生詞</span>
        </button>
      </div>

      {/* 篩選標籤 */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filterMode === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          全部 ({words.length})
        </button>
        <button
          onClick={() => setFilterMode('starred')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filterMode === 'starred'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          星標珍藏
        </button>
        <button
          onClick={() => setFilterMode('mastered')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filterMode === 'mastered'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          已掌握
        </button>
        <button
          onClick={() => setFilterMode('learning')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filterMode === 'learning'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          學習中
        </button>
      </div>

      {/* 單字列表清單 */}
      <div className="space-y-2">
        {filteredWords.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            查無相符單字
          </div>
        ) : (
          filteredWords.map(item => {
            const progress = progressMap[item.id];
            const isStarred = progress?.isStarred;
            const box = progress?.box ?? 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSpeak(item.word)}
                    className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all shrink-0"
                    aria-label="發音"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-slate-800">{item.word}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.phonetic}</span>
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {item.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.translation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {/* 熟悉度標籤 */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    box >= 2 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : box === 1 
                      ? 'bg-sky-50 text-sky-600' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {box >= 2 ? '精通' : box === 1 ? '熟悉' : '新詞'}
                  </span>

                  <button
                    onClick={() => onToggleStar(item.id)}
                    className={`p-1.5 rounded-xl transition-all ${
                      isStarred ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 底部資料備份操作 */}
      <div className="pt-4 flex justify-center gap-3 text-xs text-slate-400">
        <button
          onClick={onExportData}
          className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          備份進度資料
        </button>
        <span>•</span>
        <label className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>匯入備份</span>
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportData(file);
            }}
          />
        </label>
      </div>

      {/* 新增單字彈窗 (Modal) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-scale-up text-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                新增自訂生詞
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">英文單字 / 片語 *</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="例如：boarding pass, carry-on..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">詞性</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                  >
                    <option value="n.">名詞 (n.)</option>
                    <option value="v.">動詞 (v.)</option>
                    <option value="adj.">形容詞 (adj.)</option>
                    <option value="adv.">副詞 (adv.)</option>
                    <option value="phr.">片語 (phr.)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">音標 (選填)</label>
                  <input
                    type="text"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    placeholder="/.../"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">中文意思 *</label>
                <input
                  type="text"
                  required
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="例如：登機證、手提行李"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">所屬場景分類</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CategoryType)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                >
                  <option value="airport">✈️ 機場出入境</option>
                  <option value="hotel">🏨 飯店住宿</option>
                  <option value="dining">🍽️ 餐廳美食</option>
                  <option value="shopping">🛍️ 購物退稅</option>
                  <option value="transport">🚊 交通指路</option>
                  <option value="daily">💬 生活口語</option>
                  <option value="emergency">🚨 緊急求助</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">例句 (選填)</label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="輸入實用英文例句..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">例句中文翻譯 (選填)</label>
                <input
                  type="text"
                  value={newExampleTranslation}
                  onChange={(e) => setNewExampleTranslation(e.target.value)}
                  placeholder="例句繁中翻譯..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl active:scale-98"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md active:scale-98"
                >
                  新增存檔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
