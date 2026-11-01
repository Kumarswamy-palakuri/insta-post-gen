import React from 'react';
import { BookOpen, CheckCircle, Check, Compass } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function WhiteBlue({
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
    subText = 'Daily Knowledge Booster',
    logoUrl = '',
    ctaText = 'Comment Your Answer Below! 👇',
    answerCtaText = 'Share with fellow aspirants! 📘',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 text-slate-800 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Decorative subtle patterns */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-slate-200">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-blue-200 shadow-sm flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 flex-shrink-0">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase text-blue-700 truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <span className="px-2 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap max-w-[105px] sm:max-w-[150px] truncate">
            {question.topic || 'General Quiz'}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-xs font-bold bg-slate-200 text-slate-700 whitespace-nowrap">
            {qNum}/{totalNum}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        <div className="flex items-center space-x-1.5 mb-1.5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            {isAnswerMode ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">CORRECT ANSWER REVEALED</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3 h-3 text-blue-600" />
                <span>DAILY QUIZ TIME</span>
              </>
            )}
          </span>
        </div>

        <h2 className={`font-black text-slate-900 leading-snug mb-2 sm:mb-2.5 ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Option Cards */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let cardStyle = 'bg-white border-slate-200 shadow-sm text-slate-800 hover:border-blue-400';
            let labelStyle = 'bg-blue-50 text-blue-700 border-blue-200 font-bold';

            if (isAnswerMode) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-50 border-emerald-500 shadow-sm text-emerald-950 font-medium';
                labelStyle = 'bg-emerald-600 text-white font-black border-emerald-600';
              } else {
                cardStyle = 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60';
                labelStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            }

            return (
              <div
                key={key}
                className={`flex items-center rounded-xl border transition-all ${fit.optionPadding} ${cardStyle}`}
              >
                <div className={`rounded-lg flex items-center justify-center border mr-2 sm:mr-2.5 flex-shrink-0 ${fit.optionBadgeSize} ${labelStyle}`}>
                  {isAnswerMode && isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : key}
                </div>
                <div className={`font-semibold leading-tight flex-1 ${fit.optionTextSize}`}>
                  {optionText}
                </div>
                {isAnswerMode && isCorrect && (
                  <span className="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                    CORRECT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-xl bg-blue-50 border border-blue-200 text-slate-800 ${fit.explanationPadding}`}>
            <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>Explanation</span>
            </div>
            <p className={`text-slate-700 font-normal ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
        <div className="font-bold text-blue-700 text-[10px] sm:text-xs min-w-0 flex-1">
          <span className="truncate block">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="font-black text-slate-600 tracking-wider uppercase text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
