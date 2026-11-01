import React from 'react';
import { Sparkles, CheckCircle2, Zap, Check } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function PurpleGradient({
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
    ctaText = 'Drop your answer below! 👇',
    answerCtaText = 'Save & share this reel/post! 💜',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-[#180928] via-[#2a0e44] to-[#0d0417] text-purple-50 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-purple-500/20">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-purple-400 flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30 flex-shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase bg-gradient-to-r from-purple-200 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-purple-300/80 leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-purple-500/20 border border-purple-400/30 text-purple-200 backdrop-blur-md whitespace-nowrap max-w-[105px] sm:max-w-[150px] truncate">
            {question.topic || 'Brain Quiz'}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold bg-white/10 text-purple-200 whitespace-nowrap">
            {qNum}/{totalNum}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        <div className="flex items-center space-x-1.5 mb-1.5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-fuchsia-500/30 to-purple-500/30 text-fuchsia-300 border border-fuchsia-400/30">
            {isAnswerMode ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span className="text-emerald-300">ANSWER EXPLAINED</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-fuchsia-300" />
                <span>DAILY BRAIN TEASER</span>
              </>
            )}
          </span>
        </div>

        <h2 className={`font-extrabold text-white leading-snug mb-2 sm:mb-2.5 drop-shadow ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Options */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let cardClass = 'bg-white/[0.07] backdrop-blur-md border-white/10 text-purple-100 hover:border-purple-400/40 hover:bg-white/[0.1]';
            let badgeClass = 'bg-purple-900/60 text-fuchsia-300 border-purple-500/30';

            if (isAnswerMode) {
              if (isCorrect) {
                cardClass = 'bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-md shadow-emerald-950/50';
                badgeClass = 'bg-emerald-500 text-black font-extrabold';
              } else {
                cardClass = 'bg-white/[0.03] border-white/5 text-purple-300/40 opacity-50';
                badgeClass = 'bg-purple-950/40 text-purple-400/40 border-transparent';
              }
            }

            return (
              <div
                key={key}
                className={`flex items-center rounded-xl border transition-all ${fit.optionPadding} ${cardClass}`}
              >
                <div className={`rounded-lg flex items-center justify-center font-bold border mr-2 sm:mr-2.5 flex-shrink-0 ${fit.optionBadgeSize} ${badgeClass}`}>
                  {isAnswerMode && isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : key}
                </div>
                <div className={`font-semibold leading-tight flex-1 ${fit.optionTextSize}`}>
                  {optionText}
                </div>
                {isAnswerMode && isCorrect && (
                  <span className="ml-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.2 rounded border border-emerald-500/40">
                    CORRECT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-xl bg-purple-900/40 border border-fuchsia-500/30 backdrop-blur-md ${fit.explanationPadding}`}>
            <div className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Explanation & Fact</span>
            </div>
            <p className={`text-purple-100 ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t border-purple-500/20 flex items-center justify-between gap-2 text-xs">
        <div className="font-bold text-fuchsia-300 text-[10px] sm:text-xs min-w-0 flex-1">
          <span className="truncate block">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="font-extrabold tracking-widest text-purple-200 uppercase text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
