import React from 'react';
import { Leaf, CheckCircle2, Check, Sparkles } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function GreenWhite({
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
    ctaText = 'What\'s your guess? Comment below! 🌿',
    answerCtaText = 'Save & share for exam revision! 📗',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-[#062419] via-[#0d3f2d] to-[#041710] text-emerald-50 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-emerald-500/20">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-emerald-400 flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black shadow-sm shadow-emerald-500/30 flex-shrink-0">
              <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase text-emerald-300 truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-emerald-200/70 leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 whitespace-nowrap max-w-[105px] sm:max-w-[150px] truncate">
            {question.topic || 'General Knowledge'}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-800 whitespace-nowrap">
            {qNum}/{totalNum}
          </span>
        </div>
      </div>

      {/* Main Question */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        <div className="flex items-center space-x-1.5 mb-1.5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {isAnswerMode ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span>OFFICIAL ANSWER</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>DAILY QUIZ CHALLENGE</span>
              </>
            )}
          </span>
        </div>

        <h2 className={`font-bold text-white leading-snug mb-2 sm:mb-2.5 drop-shadow ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Option Cards */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let cardStyle = 'bg-emerald-950/60 border-emerald-900/60 text-emerald-100 hover:border-emerald-500/50';
            let labelStyle = 'bg-emerald-900 text-emerald-300 border-emerald-700 font-bold';

            if (isAnswerMode) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-50 shadow-md shadow-emerald-950/60';
                labelStyle = 'bg-emerald-400 text-zinc-950 font-black border-emerald-400';
              } else {
                cardStyle = 'bg-emerald-950/30 border-emerald-950 text-emerald-400/40 opacity-50';
                labelStyle = 'bg-emerald-950 text-emerald-700 border-transparent';
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
                  <span className="ml-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-900 px-1.5 py-0.2 rounded border border-emerald-400/50">
                    RIGHT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-100 ${fit.explanationPadding}`}>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Explanation Note</span>
            </div>
            <p className={`text-emerald-200/90 font-normal ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t border-emerald-500/20 flex items-center justify-between gap-2 text-xs">
        <div className="font-bold text-emerald-300 text-[10px] sm:text-xs min-w-0 flex-1">
          <span className="truncate block">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="font-black tracking-widest text-emerald-200 uppercase text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
