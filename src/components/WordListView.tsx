import React, { useState } from 'react';
import type { WordItem, UserWordProgress, CategoryType } from '../types';
import type { AppSettings } from '../utils/storage';
import { speakText, triggerHaptic, getPhoneticInfo } from '../utils/speech';
import { CountryFlag } from './CountryFlag';
import { 
  Search, Star, Plus, Volume2, CheckCircle, Clock, 
  Download, Upload, X, Pencil, Trash2, Sparkles 
} from 'lucide-react';

interface WordListViewProps {
  words: WordItem[];
  progressMap: Record<string, UserWordProgress>;
  settings: AppSettings;
  onToggleStar: (wordId: string) => void;
  onAddCustomWord: (word: Omit<WordItem, 'id'>) => void;
  onUpdateCustomWord?: (word: WordItem) => void;
  onDeleteCustomWord?: (wordId: string) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

const CATEGORIES: { key: CategoryType; label: string; icon: string }[] = [
  { key: 'daily', label: '日常口語', icon: '💬' },
  { key: 'social', label: '社交破冰', icon: '🤝' },
  { key: 'dining', label: '餐廳美食', icon: '🍽️' },
  { key: 'hotel', label: '飯店住宿', icon: '🏨' },
  { key: 'airport', label: '機場飛行', icon: '✈️' },
  { key: 'transport', label: '交通指路', icon: '🚊' },
  { key: 'shopping', label: '購物退稅', icon: '🛍️' },
  { key: 'culture', label: '文化探索', icon: '🏛️' },
  { key: 'digital', label: '數位通訊', icon: '📱' },
  { key: 'service', label: '爭議酒吧', icon: '🍻' },
  { key: 'emergency', label: '緊急醫療', icon: '🚨' },
];

const getCategoryLabel = (cat: CategoryType): string => {
  return CATEGORIES.find(c => c.key === cat)?.label || '生活常用';
};

export const WordListView: React.FC<WordListViewProps> = ({
  words,
  progressMap,
  settings,
  onToggleStar,
  onAddCustomWord,
  onUpdateCustomWord,
  onDeleteCustomWord,
  onExportData,
  onImportData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'custom' | 'starred' | 'mastered' | 'learning'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState<WordItem | null>(null);

  // 表單狀態
  const [formWord, setFormWord] = useState('');
  const [formPhonetic, setFormPhonetic] = useState('');
  const [formPartOfSpeech, setFormPartOfSpeech] = useState('phr.');
  const [formTranslation, setFormTranslation] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('daily');
  const [formExample, setFormExample] = useState('');
  const [formExampleTranslation, setFormExampleTranslation] = useState('');
  const [formTip, setFormTip] = useState('');

  const customWordsCount = words.filter(w => w.id.startsWith('custom-')).length;

  const filteredWords = words.filter(w => {
    const progress = progressMap[w.id];
    if (filterMode === 'custom' && !w.id.startsWith('custom-')) return false;
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

  const handleOpenAddModal = () => {
    setEditingWord(null);
    setFormWord('');
    setFormPhonetic('');
    setFormPartOfSpeech('phr.');
    setFormTranslation('');
    setFormCategory('daily');
    setFormExample('');
    setFormExampleTranslation('');
    setFormTip('');
    setShowModal(true);
    triggerHaptic('medium');
  };

  const handleOpenEditModal = (item: WordItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWord(item);
    setFormWord(item.word);
    setFormPhonetic(item.phonetic || '');
    setFormPartOfSpeech(item.partOfSpeech || 'phr.');
    setFormTranslation(item.translation || '');
    setFormCategory(item.category || 'daily');
    setFormExample(item.example || '');
    setFormExampleTranslation(item.exampleTranslation || '');
    setFormTip(item.tip || '');
    setShowModal(true);
    triggerHaptic('medium');
  };

  const handleDeleteWord = (item: WordItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('warning');
    if (window.confirm(`確定要刪除自訂生詞「${item.word}」嗎？刪除後無法復原。`)) {
      onDeleteCustomWord?.(item.id);
      triggerHaptic('success');
    }
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWord.trim() || !formTranslation.trim()) return;

    const label = getCategoryLabel(formCategory);

    if (editingWord) {
      onUpdateCustomWord?.({
        ...editingWord,
        word: formWord.trim(),
        phonetic: formPhonetic.trim() || `/${formWord.toLowerCase()}/`,
        partOfSpeech: formPartOfSpeech,
        translation: formTranslation.trim(),
        category: formCategory,
        categoryLabel: label,
        example: formExample.trim() || `I need to know how to use "${formWord}".`,
        exampleTranslation: formExampleTranslation.trim() || `我需要知道如何使用「${formWord}」。`,
        tip: formTip.trim() || undefined,
      });
    } else {
      onAddCustomWord({
        word: formWord.trim(),
        phonetic: formPhonetic.trim() || `/${formWord.toLowerCase()}/`,
        partOfSpeech: formPartOfSpeech,
        translation: formTranslation.trim(),
        category: formCategory,
        categoryLabel: label,
        example: formExample.trim() || `I need to know how to use "${formWord}".`,
        exampleTranslation: formExampleTranslation.trim() || `我需要知道如何使用「${formWord}」。`,
        tip: formTip.trim() || undefined,
      });
    }

    setShowModal(false);
    setEditingWord(null);
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
          onClick={handleOpenAddModal}
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
        {customWordsCount > 0 && (
          <button
            onClick={() => setFilterMode('custom')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterMode === 'custom'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            自訂生詞 ({customWordsCount})
          </button>
        )}
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
            const isCustom = item.id.startsWith('custom-');

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <button
                    onClick={() => handleSpeak(item.word)}
                    className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all shrink-0"
                    aria-label="發音"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <div 
                    className={`min-w-0 ${isCustom ? 'cursor-pointer group' : ''}`}
                    onClick={isCustom ? (e) => handleOpenEditModal(item, e) : undefined}
                    title={isCustom ? '點擊直接編輯此生詞' : undefined}
                  >
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className={`font-bold text-sm text-slate-800 break-words ${isCustom ? 'group-hover:text-indigo-600 transition-colors' : ''}`}>
                        {item.word}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-100 flex items-center gap-1">
                        <CountryFlag code={getPhoneticInfo(item, settings.speechLang).countryCode} className="w-3 h-2 inline-block rounded-[1px] shadow-2xs border border-slate-200/60 shrink-0" />
                        <span>{getPhoneticInfo(item, settings.speechLang).phonetic}</span>
                      </span>
                      <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {item.partOfSpeech}
                      </span>
                      {isCustom && (
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-50 border border-purple-200/70 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <span>自訂</span>
                          <span className="text-[8px] text-purple-400">(點擊可編輯)</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.translation}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
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

                  {/* 自訂單字專屬操作：編輯與刪除 */}
                  {isCustom && (
                    <>
                      <button
                        onClick={(e) => handleOpenEditModal(item, e)}
                        className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all shadow-2xs"
                        title="編輯此生詞"
                        aria-label="編輯此生詞"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteWord(item, e)}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition-all shadow-2xs"
                        title="刪除此生詞"
                        aria-label="刪除此生詞"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

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

      {/* 新增 / 編輯單字彈窗 (Modal) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-scale-up text-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                {editingWord ? (
                  <>
                    <Pencil className="w-4 h-4 text-indigo-600" />
                    編輯自訂生詞
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-indigo-600" />
                    新增自訂生詞
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWord} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">英文單字 / 片語 *</label>
                <input
                  type="text"
                  required
                  value={formWord}
                  onChange={(e) => setFormWord(e.target.value)}
                  placeholder="例如：it turned out that, boarding pass..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">詞性</label>
                  <select
                    value={formPartOfSpeech}
                    onChange={(e) => setFormPartOfSpeech(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                  >
                    <option value="phr.">片語 (phr.)</option>
                    <option value="idiom">慣用語 (idiom)</option>
                    <option value="n.">名詞 (n.)</option>
                    <option value="v.">動詞 (v.)</option>
                    <option value="adj.">形容詞 (adj.)</option>
                    <option value="adv.">副詞 (adv.)</option>
                    <option value="conj.">連接詞 (conj.)</option>
                    <option value="prep.">介系詞 (prep.)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">音標 (選填)</label>
                  <input
                    type="text"
                    value={formPhonetic}
                    onChange={(e) => setFormPhonetic(e.target.value)}
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
                  value={formTranslation}
                  onChange={(e) => setFormTranslation(e.target.value)}
                  placeholder="例如：結果證明、原來是..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">所屬場景分類</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">實用例句 (選填)</label>
                <textarea
                  rows={2}
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  placeholder="輸入實用英文例句..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">例句中文翻譯 (選填)</label>
                <input
                  type="text"
                  value={formExampleTranslation}
                  onChange={(e) => setFormExampleTranslation(e.target.value)}
                  placeholder="例句中文翻譯..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">學習小撇步 / 搭配用法 (選填)</label>
                <input
                  type="text"
                  value={formTip}
                  onChange={(e) => setFormTip(e.target.value)}
                  placeholder="例如：常用於過去式，接 that 子句..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl active:scale-98"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md active:scale-98"
                >
                  {editingWord ? '儲存變更' : '新增存檔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
