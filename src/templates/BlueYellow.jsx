import React from 'react';
import { BookOpen, CheckCircle, Check, Star } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function BlueYellow({
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
    ctaText = 'Comment Your Answer 👇',
    answerCtaText = 'Share & Challenge Friends! 🎯',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-b from-[#0a192f] via-[#0f284e] to-[#071324] text-slate-100 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-blue-800/40">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-yellow-400 flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-blue-950 font-black text-sm flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wide text-yellow-400 uppercase truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-blue-200 leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <span className="px-2 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-yellow-400 text-blue-950 whitespace-nowrap max-w-[160px] sm:max-w-[220px] truncate">
            {question.topic || 'Quiz'}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-xs font-bold bg-blue-900/60 text-blue-200 border border-blue-700/60 whitespace-nowrap">
            {qNum}/{totalNum}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        <div className="flex items-center flex-wrap gap-2 mb-1.5 flex-shrink-0">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-900/50 border border-blue-700/50 text-blue-300 whitespace-nowrap flex-shrink-0 select-none">
            {isAnswerMode ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-400 whitespace-nowrap">CORRECT ANSWER REVEAL</span>
              </>
            ) : (
              <>
                <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                <span className="whitespace-nowrap">TEST YOUR KNOWLEDGE</span>
              </>
            )}
          </div>
        </div>

        <h2 className={`font-black text-white leading-snug mb-2 sm:mb-2.5 drop-shadow ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Options */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let cardBg = 'bg-[#132d56]/70 border-blue-800/60 text-slate-100 hover:border-yellow-400/50';
            let labelBg = 'bg-yellow-400 text-blue-950 font-black';

            if (isAnswerMode) {
              if (isCorrect) {
                cardBg = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-md shadow-emerald-950/50';
                labelBg = 'bg-emerald-400 text-emerald-950 font-black';
              } else {
                cardBg = 'bg-blue-950/40 border-blue-900/40 text-blue-400/60 opacity-60';
                labelBg = 'bg-blue-900/40 text-blue-400/60';
              }
            }

            return (
              <div
                key={key}
                className={`flex items-center rounded-xl border transition-all ${fit.optionPadding} ${cardBg}`}
              >
                <div className={`rounded-lg flex items-center justify-center mr-2 sm:mr-2.5 flex-shrink-0 ${fit.optionBadgeSize} ${labelBg}`}>
                  {isAnswerMode && isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : key}
                </div>
                <div className={`font-semibold leading-tight flex-1 ${fit.optionTextSize}`}>
                  {optionText}
                </div>
                {isAnswerMode && isCorrect && (
                  <span className="ml-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/50">
                    RIGHT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-xl bg-blue-900/40 border border-yellow-400/30 text-blue-100 ${fit.explanationPadding}`}>
            <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-0.5 flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Key Takeaway</span>
            </div>
            <p className={`text-slate-200 ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t border-blue-800/40 flex items-center justify-between gap-2 text-xs">
        <div className="font-bold text-yellow-400 text-[10px] sm:text-xs min-w-0 flex-1">
          <span className="truncate block">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="font-extrabold text-blue-300 tracking-wider uppercase text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
