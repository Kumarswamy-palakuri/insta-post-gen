import React from 'react';
import { Flame, CheckCircle2, Check, Zap } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function OrangeBlack({
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
    ctaText = 'Comment Your Answer! 💬🔥',
    answerCtaText = 'Share if you got this right! ⚡',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-b from-[#121113] via-[#1a181c] to-[#0d0c0e] text-zinc-100 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Orange Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-orange-500/20">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-orange-500 flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-black font-black shadow-md shadow-orange-500/30 flex-shrink-0">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase text-orange-400 truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-zinc-400 leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <span className="px-2 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-orange-500 text-black shadow-sm whitespace-nowrap max-w-[105px] sm:max-w-[150px] truncate">
            {question.topic || 'Quiz'}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-xs font-bold bg-zinc-800 text-orange-400 border border-zinc-700 whitespace-nowrap">
            {qNum}/{totalNum}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        <div className="flex items-center space-x-1.5 mb-1.5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/40">
            {isAnswerMode ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">ANSWER UNLOCKED</span>
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 text-orange-400" />
                <span>CHALLENGE OF THE DAY</span>
              </>
            )}
          </span>
        </div>

        <h2 className={`font-black text-white leading-snug mb-2 sm:mb-2.5 drop-shadow ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Options */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let cardStyle = 'bg-zinc-900/90 border-zinc-800 text-zinc-200 hover:border-orange-500/50';
            let labelStyle = 'bg-zinc-800 text-orange-400 border-zinc-700 font-black';

            if (isAnswerMode) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-md shadow-emerald-950/50';
                labelStyle = 'bg-emerald-500 text-black font-black border-emerald-400';
              } else {
                cardStyle = 'bg-zinc-900/40 border-zinc-800/40 text-zinc-500 opacity-50';
                labelStyle = 'bg-zinc-800/40 text-zinc-600 border-zinc-800';
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
                  <span className="ml-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/40">
                    CORRECT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-xl bg-orange-950/30 border border-orange-500/40 text-orange-100 ${fit.explanationPadding}`}>
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Explanation Breakdown</span>
            </div>
            <p className={`text-zinc-300 font-normal ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t border-orange-500/20 flex items-center justify-between gap-2 text-xs">
        <div className="font-bold text-orange-400 text-[10px] sm:text-xs min-w-0 flex-1">
          <span className="truncate block">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="font-black tracking-wider text-zinc-400 uppercase text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
