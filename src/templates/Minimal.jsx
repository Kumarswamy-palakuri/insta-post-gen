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

  const rawCorrect = String(question.correctAnswer || 'A').toUpperCase().trim();
  const correctKey = ['A', 'B', 'C', 'D'].includes(rawCorrect) ? rawCorrect : 'A';
  const optionsToRender = isAnswerMode ? [correctKey] : ['A', 'B', 'C', 'D'];

  const fit = getAdaptiveCardClasses(
    dimension,
    isAnswerMode,
    question.question?.length || 0,
    customization.fontSize
  );

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden bg-white text-neutral-900 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        backgroundColor: customization.customBg || '#ffffff',
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Header */}
      <div className={`relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-neutral-200 ${fit.headerClass}`}>
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 rounded object-cover border border-neutral-300 flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded bg-black text-white flex items-center justify-center font-black text-xs flex-shrink-0">
              Q
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[10px] sm:text-xs tracking-widest uppercase text-black truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-neutral-500 font-mono leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 font-mono text-[9px] sm:text-xs text-neutral-500 flex-shrink-0">
          <span className="uppercase tracking-wider text-neutral-700 whitespace-nowrap max-w-[160px] sm:max-w-[220px] truncate">
            {question.topic || 'General'}
          </span>
          <span>/</span>
          <span className="whitespace-nowrap font-bold text-black">{qNum} OF {totalNum}</span>
        </div>
      </div>

      {/* Main Question */}
      <div className={`relative z-10 ${fit.mainSectionClass}`}>
        <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-1.5 whitespace-nowrap flex-shrink-0 select-none">
          {isAnswerMode ? '[ 02 / REVEAL ]' : '[ 01 / QUESTION ]'}
        </div>

        <h2 className={`font-bold tracking-tight text-neutral-900 mb-2 sm:mb-2.5 ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Options: In Answer Mode, show ONLY the single correct option to free space for the Explanation */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {optionsToRender.map((key) => {
            const isCorrect = key === correctKey;
            const optionText = question.options?.[key] || '';

            let cardStyle = 'bg-neutral-50/80 border border-neutral-200 text-neutral-900 hover:border-neutral-400';
            let labelStyle = 'bg-black text-white font-mono font-bold';

            if (isAnswerMode) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 font-medium shadow-xs';
                labelStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
              } else {
                cardStyle = 'bg-neutral-50/40 border-neutral-200/50 text-neutral-400 opacity-40';
                labelStyle = 'bg-neutral-200 text-neutral-500';
              }
            }

            return (
              <div
                key={key}
                className={`flex items-center rounded-lg transition-all ${fit.optionPadding} ${cardStyle}`}
              >
                <div className={`rounded flex items-center justify-center font-mono mr-2 sm:mr-2.5 flex-shrink-0 ${fit.optionBadgeSize} ${labelStyle}`}>
                  {isAnswerMode && isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : key}
                </div>
                <div className={`font-medium leading-tight flex-1 ${fit.optionTextSize}`}>
                  {optionText}
                </div>
                {isAnswerMode && isCorrect && (
                  <span className="ml-1.5 font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 whitespace-nowrap">
                    [{key}] CORRECT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-800 font-mono ${fit.explanationPadding}`}>
            <span className="text-emerald-700 font-bold block mb-0.5 text-[10px]">[ EXPLANATION ]</span>
            <p className={fit.explanationTextSize}>{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`relative z-10 flex-shrink-0 pt-2 border-t border-neutral-200 flex items-center justify-between gap-2 text-[9px] sm:text-[11px] font-mono text-neutral-500 ${fit.footerClass}`}>
        <div className="min-w-0 flex-1 truncate">{isAnswerMode ? answerCtaText : ctaText}</div>
        <div className="uppercase tracking-widest text-neutral-900 font-bold flex-shrink-0 whitespace-nowrap">@{handle}</div>
      </div>
    </div>
  );
}
