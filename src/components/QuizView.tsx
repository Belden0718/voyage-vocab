import React, { useState, useEffect } from 'react';
import type { WordItem, QuizQuestion } from '../types';
import type { AppSettings } from '../utils/storage';
import { generateQuizSet } from '../utils/quizGenerator';
import { speakText, triggerHaptic } from '../utils/speech';
import confetti from 'canvas-confetti';
import { 
  Trophy, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, 
  Headphones
} from 'lucide-react';

interface QuizViewProps {
  words: WordItem[];
  settings: AppSettings;
  onRecordResult: (wordId: string, isCorrect: boolean) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ words, settings, onRecordResult }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([]);

  // 初始化測驗題目
  const startNewQuiz = () => {
    const qList = generateQuizSet(words, 8);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setWrongAnswers([]);
  };

  useEffect(() => {
    if (words.length > 0) {
      startNewQuiz();
    }
  }, [words]);

  const currentQ = questions[currentIndex];

  // 若當前是聽力題且進入該題時，自動發音提示
  useEffect(() => {
    if (currentQ?.type === 'listening' && !isAnswered) {
      speakText(currentQ.word.word, settings.speechRate, settings.speechLang);
    }
  }, [currentIndex, currentQ?.type]);

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

  const handleNextQuestion = () => {
    triggerHaptic('light');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      triggerHaptic('success');
      // 滿意時慶祝特效
      try {
        confetti({
          particleCount: 80,
          spread: 70,
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
        <p className="text-slate-600">單字數量需至少 4 個以上才能進行測驗。</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">正在生成測驗題庫...</div>
    );
  }

  // 測驗完成結算畫面
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-5 pb-12 animate-scale-up">
        <div className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-amber-100">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-800">測驗挑戰完成！</h2>
            <p className="text-xs text-slate-400 mt-1">恭喜完成了出國生活英文日常小測驗</p>
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
          </div>

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
            onClick={startNewQuiz}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            再測一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12 animate-fade-in select-none">
      {/* 測驗進度條 */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
          <span>題目 {currentIndex + 1} / {questions.length}</span>
          <span className="text-indigo-600 font-bold">目前得分: {score}</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 題目主卡片 */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {currentQ.type === 'listening' ? '🎧 聽力聽辨題' : currentQ.type === 'fillInBlank' ? '✍️ 中選英測驗' : '📖 英翻中測驗'}
          </span>
          <span className="text-xs text-slate-400">{currentQ.word.categoryLabel}</span>
        </div>

        {/* 題目提問內容 */}
        <div className="text-center py-3 space-y-3">
          <h3 className="text-lg font-bold text-slate-800">{currentQ.prompt}</h3>

          {/* 聽力播放按鈕 */}
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

          {/* 題目英文標示 (英翻中時) */}
          {currentQ.type === 'meaning' && (
            <div className="text-3xl font-black text-indigo-700 tracking-tight">
              {currentQ.word.word}
            </div>
          )}

          {/* 中翻英時 */}
          {currentQ.type === 'fillInBlank' && (
            <div className="text-2xl font-black text-indigo-700">
              「{currentQ.word.translation}」
            </div>
          )}
        </div>

        {/* 選項列表 */}
        <div className="space-y-2.5 pt-2">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100";
            
            if (isAnswered) {
              if (opt === currentQ.correctAnswer) {
                btnStyle = "bg-emerald-500 border-emerald-600 text-white font-bold shadow-md shadow-emerald-100";
              } else if (opt === selectedOption) {
                btnStyle = "bg-rose-500 border-rose-600 text-white font-bold shadow-md shadow-rose-100";
              } else {
                btnStyle = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-sm flex items-center justify-between active:scale-98 ${btnStyle}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center text-xs font-bold font-mono">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-semibold">{opt}</span>
                </div>

                {isAnswered && opt === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                )}
                {isAnswered && opt === selectedOption && opt !== currentQ.correctAnswer && (
                  <XCircle className="w-5 h-5 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* 答題後解析提示 */}
        {isAnswered && (
          <div className="mt-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2 animate-fade-in">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>詳解：{currentQ.word.word}</span>
              <button
                onClick={() => speakText(currentQ.word.example, settings.speechRate, settings.speechLang)}
                className="flex items-center text-indigo-600 gap-1 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" /> 聽例句
              </button>
            </div>
            <p className="text-slate-600">{currentQ.word.example}</p>
            <p className="text-slate-400">{currentQ.word.exampleTranslation}</p>

            <button
              onClick={handleNextQuestion}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1"
            >
              <span>{currentIndex < questions.length - 1 ? '下一題' : '查看測驗結果'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
