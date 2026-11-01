import React from 'react';
import { Check, FileText, CheckSquare2 } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function ExamStyle({
  question,
  isAnswerMode = false,
  branding = {},
  customization = {},
  dimension = 'square',
  questionIndex = 0,
  totalQuestions = 1,
}) {
  const {
    handle = 'learn_in_a_minute',
    subText = 'All-India Test Series',
    logoUrl = '',
    ctaText = 'Mark your answer in the comments! ✍️',
    answerCtaText = 'Save for upcoming exam revision! 📝',
  } = branding;

  const fontClass = customization.font || 'font-sans';
  const qNum = String(questionIndex + 1).padStart(2, '0');
  const totalNum = String(totalQuestions).padStart(2, '0');

  const fit = getAdaptiveCardClasses(
    dimension,
    isAnswerMode,
    question.question?.length || 0,
    customization.fontSize
  );

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden bg-[#181d28] text-slate-100 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Official Header Strip */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b-2 border-indigo-500/30">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover border border-indigo-400 flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-indigo-600 flex items-center justify-center text-white shadow font-bold flex-shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase text-indigo-300 truncate">
              {handle}
            </div>
            <div className="text-[9px] text-slate-400 uppercase tracking-widest leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-wider whitespace-nowrap max-w-[105px] sm:max-w-[150px] truncate">
            {question.topic || 'General Studies'}
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono font-semibold text-slate-300 whitespace-nowrap">
            ITEM NO. {qNum} / {totalNum}
          </div>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        {/* Exam Section Tag */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
            {isAnswerMode ? 'OFFICIAL KEY & SOLUTION' : 'EXAM QUESTION PAPER'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">MARKS: 2.0 • NEG: 0.66</span>
        </div>

        {/* Question Text with Q.XX prefix */}
        <div className="flex items-start space-x-1.5 mb-2 sm:mb-2.5">
          <span className="text-xs sm:text-sm font-black text-indigo-400 font-mono mt-0.5">
            Q.{questionIndex + 1}.
          </span>
          <h2 className={`font-bold text-white leading-snug flex-1 ${fit.questionSize}`}>
            {question.question}
          </h2>
        </div>

        {/* OMR-Style Option Bubbles */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let containerClass = 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:border-indigo-400';
            let bubbleClass = 'border-slate-500 text-slate-300 bg-slate-800';

            if (isAnswerMode) {
              if (isCorrect) {
                containerClass = 'bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-md';
                bubbleClass = 'border-emerald-400 bg-emerald-500 text-black font-black';
              } else {
                containerClass = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50';
                bubbleClass = 'border-slate-700 text-slate-600 bg-transparent';
              }
            }

            return (
              <div
                key={key}
                className={`flex items-center rounded-lg border transition-all ${fit.optionPadding} ${containerClass}`}
              >
                <div
                  className={`rounded-full flex items-center justify-center font-bold border-2 mr-2 sm:mr-2.5 flex-shrink-0 ${fit.optionBadgeSize} ${bubbleClass}`}
                >
                  {isAnswerMode && isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `(${key})`}
                </div>
                <div className={`font-medium leading-tight flex-1 ${fit.optionTextSize}`}>
                  {optionText}
                </div>
                {isAnswerMode && isCorrect && (
                  <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-900/60 border border-emerald-500/40">
                    CORRECT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-lg bg-indigo-950/40 border border-indigo-500/40 text-slate-200 ${fit.explanationPadding}`}>
            <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
              <CheckSquare2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>DETAILED SOLUTION:</span>
            </div>
            <p className={`text-slate-300 ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t-2 border-indigo-500/30 flex items-center justify-between gap-2 text-xs font-mono">
        <div className="text-indigo-300 font-bold text-[10px] sm:text-xs min-w-0 flex-1">
          <span className="truncate block">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
