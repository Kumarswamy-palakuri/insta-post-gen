import React from 'react';
import { Check } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function Minimal({
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
    subText = 'Knowledge Series',
    logoUrl = '',
    ctaText = 'What\'s your answer? Reply in comments.',
    answerCtaText = 'Save this card for reference.',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-[#121214] text-neutral-100 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-neutral-800">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 rounded object-cover border border-neutral-700 flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-black text-xs flex-shrink-0">
              Q
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[10px] sm:text-xs tracking-widest uppercase text-white truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-neutral-400 font-mono leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 font-mono text-[9px] sm:text-xs text-neutral-400 flex-shrink-0">
          <span className="uppercase tracking-wider text-neutral-300 whitespace-nowrap max-w-[105px] sm:max-w-[150px] truncate">
            {question.topic || 'General'}
          </span>
          <span>/</span>
          <span className="whitespace-nowrap">{qNum} OF {totalNum}</span>
        </div>
      </div>

      {/* Main Question */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1.5">
          {isAnswerMode ? '[ 02 / REVEAL ]' : '[ 01 / QUESTION ]'}
        </div>

        <h2 className={`font-semibold tracking-tight text-white mb-2 sm:mb-2.5 ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Options */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let cardStyle = 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700';
            let labelStyle = 'bg-neutral-800 text-neutral-300 border-neutral-700';

            if (isAnswerMode) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-950/60 border-emerald-500 text-white font-medium';
                labelStyle = 'bg-emerald-500 text-black font-bold border-emerald-500';
              } else {
                cardStyle = 'bg-neutral-950/50 border-neutral-900 text-neutral-600 opacity-40';
                labelStyle = 'bg-neutral-900 text-neutral-600 border-neutral-800';
              }
            }

            return (
              <div
                key={key}
                className={`flex items-center rounded-lg border transition-all ${fit.optionPadding} ${cardStyle}`}
              >
                <div className={`rounded flex items-center justify-center font-mono border mr-2 sm:mr-2.5 flex-shrink-0 ${fit.optionBadgeSize} ${labelStyle}`}>
                  {isAnswerMode && isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : key}
                </div>
                <div className={`font-medium leading-tight flex-1 ${fit.optionTextSize}`}>
                  {optionText}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono ${fit.explanationPadding}`}>
            <span className="text-emerald-400 font-bold block mb-0.5 text-[10px]">[ EXPLANATION ]</span>
            <p className={fit.explanationTextSize}>{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t border-neutral-800 flex items-center justify-between gap-2 text-[9px] sm:text-[11px] font-mono text-neutral-400">
        <div className="min-w-0 flex-1 truncate">{isAnswerMode ? answerCtaText : ctaText}</div>
        <div className="uppercase tracking-widest text-neutral-300 font-bold flex-shrink-0 whitespace-nowrap">@{handle}</div>
      </div>
    </div>
  );
}
