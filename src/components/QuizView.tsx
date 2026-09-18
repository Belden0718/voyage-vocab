import React, { useState, useEffect, useRef } from 'react';
import type { WordItem, QuizQuestion, BadgeItem, UserStats } from '../types';
import type { AppSettings } from '../utils/storage';
import { generateQuizSet } from '../utils/quizGenerator';
import { speakText, triggerHaptic } from '../utils/speech';
import { calculateLevelInfo } from '../utils/gamification';
import confetti from 'canvas-confetti';
import { 
  Trophy, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, 
  Headphones, Sparkles, Award, Zap
} from 'lucide-react';

interface QuizResultSummary {
  expEarned: number;
  newlyUnlocked: BadgeItem[];
  currentStats?: UserStats;
}

interface QuizViewProps {
  words: WordItem[];
  settings: AppSettings;
  onRecordResult: (wordId: string, isCorrect: boolean) => void;
  onQuizComplete?: (score: number, total: number) => QuizResultSummary;
}

export const QuizView: React.FC<QuizViewProps> = ({ 
  words, 
  settings, 
  onRecordResult,
  onQuizComplete 
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResultSummary | null>(null);
  
  // 保存 words 參考，避免父組件 re-render 導致重複洗牌
  const wordsRef = useRef(words);
  wordsRef.current = words;

  // 初始化測驗題目 (固定抽取 8 題)
  const startNewQuiz = (sourceWords?: WordItem[]) => {
    const listToUse = sourceWords || wordsRef.current;
    if (listToUse.length < 4) return;
    const qList = generateQuizSet(listToUse, 8);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setWrongAnswers([]);
    setQuizResult(null);
  };

  // 僅在初次載入且尚無題目時初始化，嚴禁因父組件 re-render 而洗掉作答進度
  useEffect(() => {
    if (questions.length === 0 && words.length >= 4) {
      startNewQuiz(words);
    }
  }, [words.length]);

  const currentQ = questions[currentIndex];

  // 若當前是聽力題且剛切換到該題時，自動語音發音
  useEffect(() => {
    if (currentQ?.type === 'listening' && !isAnswered) {
      const timer = setTimeout(() => {
        speakText(currentQ.word.word, settings.speechRate, settings.speechLang);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentQ?.id]);

  // 處理作答反饋
  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      triggerHaptic('success');
      setScore(prev => prev + 1);
      onRecordResult(currentQ.word.id, true);
    } else {
      triggerHaptic('warning');
      setWrongAnswers(prev => [...prev, currentQ]);
      onRecordResult(currentQ.word.id, false);
    }
  };

  // 進入下一題或結算
  const handleNextQuestion = () => {
    triggerHaptic('light');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      triggerHaptic('success');

      // 呼叫結算並獲取經驗值與解鎖成就
      if (onQuizComplete) {
        const res = onQuizComplete(score, questions.length);
        setQuizResult(res);
      }

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  if (words.length < 4) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm my-8">
        <p className="text-slate-600 font-bold">單字庫數量需至少 4 個以上才能進行測驗。</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">正在生成測驗題庫...</div>
    );
  }

  // 測驗完成結算畫面
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    const levelInfo = quizResult?.currentStats ? calculateLevelInfo(quizResult.currentStats.exp) : null;

    return (
      <div className="space-y-5 pb-12 animate-scale-up">
        <div className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-amber-100">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-800">測驗挑戰完成！</h2>
            <p className="text-xs text-slate-400 mt-1">恭喜完成出國實用生活英文挑戰</p>
          </div>

          {/* 分數圓環/卡片 */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-500 font-medium">答對題數</span>
              <p className="text-2xl font-black text-indigo-700">{score} / {questions.length}</p>
            </div>
            <div className="h-8 w-px bg-indigo-200" />
            <div>
              <span className="text-xs text-slate-500 font-medium">正確率</span>
              <p className="text-2xl font-black text-emerald-600">{accuracy}%</p>
            </div>
            <div className="h-8 w-px bg-indigo-200" />
            <div>
              <span className="text-xs text-slate-500 font-medium">獲得 EXP</span>
              <p className="text-2xl font-black text-amber-500 flex items-center justify-center gap-0.5">
                <Zap className="w-5 h-5 fill-amber-500" />
                +{quizResult?.expEarned ?? score * 20}
              </p>
            </div>
          </div>

          {/* 等級與經驗值進度 */}
          {levelInfo && (
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="text-base">{levelInfo.icon}</span>
                  <span>Lv.{levelInfo.level} {levelInfo.title}</span>
                </span>
                <span className="text-indigo-600 font-mono font-bold">
                  {levelInfo.currentExp} EXP
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-indigo-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right">
                {levelInfo.isMaxLevel ? '已達最高榮譽等級！' : `距下一級還需 ${levelInfo.maxExp - levelInfo.currentExp} EXP`}
              </p>
            </div>
          )}

          {/* 新解鎖徽章慶祝 */}
          {quizResult && quizResult.newlyUnlocked.length > 0 && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-left space-y-2 animate-bounce-short">
              <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                🎉 恭喜解鎖全新成就徽章！
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {quizResult.newlyUnlocked.map(b => (
                  <div key={b.id} className="flex items-center gap-2.5 bg-white/80 p-2 rounded-xl border border-amber-100">
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{b.name}</p>
                      <p className="text-[10px] text-slate-500">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 答錯檢討列表 */}
          {wrongAnswers.length > 0 && (
            <div className="text-left space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-500" />
                需加強錯題複習 ({wrongAnswers.length} 題)
              </h4>
              <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                {wrongAnswers.map(item => (
                  <div key={item.id} className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{item.word.word} ({item.word.phonetic})</span>
                      <span className="text-rose-600 font-medium">{item.word.translation}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{item.word.example}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => startNewQuiz()}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            再測一次 (換一組題目)
          </button>
        </div>
      </div>
    );
  }

  const isCurrentCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div className="space-y-4 pb-12 animate-fade-in select-none">
      {/* 測驗頂部進度與得分 */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            題目 {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-normal text-[11px]">答對率</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-black">
              得分: {score}
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 題目主卡片 */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/60">
            {currentQ.type === 'listening' ? '🎧 聽力聽辨題' : currentQ.type === 'fillInBlank' ? '✍️ 中選英測驗' : '📖 英選中測驗'}
          </span>
          <span className="text-xs font-medium text-slate-400">{currentQ.word.categoryLabel}</span>
        </div>

        {/* 題目提問內容 */}
        <div className="text-center py-2 space-y-3">
          <h3 className="text-sm font-semibold text-slate-500">{currentQ.prompt}</h3>

          {/* 聽力題播放按鈕 */}
          {currentQ.type === 'listening' && (
            <button
              onClick={() => {
                triggerHaptic('light');
                speakText(currentQ.word.word, settings.speechRate, settings.speechLang);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-sm shadow-sm active:scale-95 transition-all mx-auto"
            >
              <Headphones className="w-5 h-5 text-indigo-600" />
              點擊播放英語發音
            </button>
          )}

          {/* 英選中時：顯示超大英文單字 */}
          {currentQ.type === 'meaning' && (
            <div className="space-y-1">
              <div className="text-3xl font-black text-indigo-700 tracking-tight">
                {currentQ.word.word}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {settings.speechLang === 'en-US' ? currentQ.word.phonetic : (currentQ.word.phoneticUk || currentQ.word.phonetic)}
              </div>
            </div>
          )}

          {/* 中選英時：顯示清晰中文釋義 */}
          {currentQ.type === 'fillInBlank' && (
            <div className="text-2xl font-black text-slate-800">
              「{currentQ.word.translation}」
            </div>
          )}
        </div>

        {/* 四個選項列表 */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = "bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-indigo-50/50 hover:border-indigo-200";
            let badgeText: string | null = null;
            let icon = null;

            if (isAnswered) {
              if (opt === currentQ.correctAnswer) {
                // 正確答案一律高亮為亮綠色
                btnStyle = "bg-emerald-500 border-emerald-600 text-white font-bold shadow-md shadow-emerald-200 scale-[1.01]";
                badgeText = "正確答案";
                icon = <CheckCircle2 className="w-5 h-5 text-white shrink-0" />;
              } else if (opt === selectedOption) {
                // 使用者如果選錯了，標記為紅色
                btnStyle = "bg-rose-500 border-rose-600 text-white font-bold shadow-md shadow-rose-200";
                badgeText = "您的選擇";
                icon = <XCircle className="w-5 h-5 text-white shrink-0" />;
              } else {
                // 其餘干擾項淡化
                btnStyle = "bg-slate-50 border-slate-100 text-slate-400 opacity-40";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-sm flex items-center justify-between active:scale-98 ${btnStyle}`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                    isAnswered && (opt === currentQ.correctAnswer || opt === selectedOption)
                      ? 'bg-white/20 text-white'
                      : 'bg-black/5 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-semibold truncate">{opt}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {badgeText && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                      {badgeText}
                    </span>
                  )}
                  {icon}
                </div>
              </button>
            );
          })}
        </div>

        {/* 答題後即時反饋與解析 */}
        {isAnswered && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {/* 反饋橫幅 */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              isCurrentCorrect 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2.5">
                {isCurrentCorrect ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                    <XCircle className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h4 className="font-black text-sm">
                    {isCurrentCorrect ? '回答正確！得分 +1' : '回答錯誤！別氣餒'}
                  </h4>
                  <p className="text-[11px] opacity-80">
                    {isCurrentCorrect 
                      ? '掌握度提升，繼續保持！' 
                      : `正確答案是：${currentQ.correctAnswer}`}
                  </p>
                </div>
              </div>

              {isCurrentCorrect && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400 text-amber-950 font-black text-xs shadow-sm shrink-0">
                  <Zap className="w-3.5 h-3.5 fill-amber-950" />
                  +20 EXP
                </div>
              )}
            </div>

            {/* 單字詳解卡片 */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black text-sm">{currentQ.word.word}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {settings.speechLang === 'en-US' ? currentQ.word.phonetic : (currentQ.word.phoneticUk || currentQ.word.phonetic)}
                  </span>
                  <span className="text-slate-500 font-normal">[{currentQ.word.partOfSpeech}]</span>
                </span>
                <button
                  onClick={() => speakText(currentQ.word.example, settings.speechRate, settings.speechLang)}
                  className="flex items-center text-indigo-600 gap-1 hover:underline font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 聽例句
                </button>
              </div>
              <p className="text-slate-700 font-medium">{currentQ.word.example}</p>
              <p className="text-slate-400 text-[11px]">{currentQ.word.exampleTranslation}</p>
              {currentQ.word.tip && (
                <p className="text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-100 text-[11px]">
                  💡 筆記：{currentQ.word.tip}
                </p>
              )}
            </div>

            {/* 下一題按鈕 */}
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{currentIndex < questions.length - 1 ? `進入下一題 (${currentIndex + 2}/${questions.length})` : '查看測驗結算'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
