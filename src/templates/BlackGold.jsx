import React from 'react';
import { Award, CheckCircle2, Sparkles, Flame, Check } from 'lucide-react';
import { getAdaptiveCardClasses } from '../utils/cardFit';

export default function BlackGold({
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
    answerCtaText = 'Share with your study group! 🚀',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black text-amber-50 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        background: customization.customBg || undefined,
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Decorative Gold Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-amber-500/20">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-amber-400/50 shadow-md flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-medium leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold tracking-wide uppercase bg-amber-500/10 border border-amber-400/30 text-amber-300 whitespace-nowrap max-w-[105px] sm:max-w-[150px] truncate">
            {question.topic || 'General Quiz'}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold bg-zinc-800/80 text-zinc-300 border border-zinc-700 whitespace-nowrap">
            {qNum}/{totalNum}
          </span>
        </div>
      </div>

      {/* Question Main Section */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
        {/* Post Type Badge */}
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {isAnswerMode ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">ANSWER REVEAL</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>QUIZ TIME</span>
              </>
            )}
          </span>
          {question.difficulty && (
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              • {question.difficulty}
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className={`font-bold tracking-tight text-white mb-2 sm:mb-2.5 drop-shadow-sm ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Four Option Cards */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {['A', 'B', 'C', 'D'].map((key) => {
            const isCorrect = key === question.correctAnswer;
            const optionText = question.options?.[key] || '';

            let cardStyle = 'bg-zinc-900/80 border-zinc-800 text-zinc-200 hover:border-amber-500/40';
            let badgeStyle = 'bg-zinc-800 text-amber-400 border-zinc-700';

            if (isAnswerMode) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-100 shadow-md shadow-emerald-900/30';
                badgeStyle = 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400';
              } else {
                cardStyle = 'bg-zinc-900/40 border-zinc-800/60 text-zinc-500 opacity-60';
                badgeStyle = 'bg-zinc-800/60 text-zinc-500 border-zinc-700/40';
              }
            }

            return (
              <div
                key={key}
                className={`relative flex items-center rounded-xl border transition-all duration-200 ${fit.optionPadding} ${cardStyle}`}
              >
                <div
                  className={`flex-shrink-0 rounded-lg flex items-center justify-center font-bold border mr-2 sm:mr-2.5 ${fit.optionBadgeSize} ${badgeStyle}`}
                >
                  {isAnswerMode && isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : key}
                </div>
                <div className={`font-medium flex-1 leading-tight ${fit.optionTextSize}`}>
                  {optionText}
                </div>
                {isAnswerMode && isCorrect && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                    Correct
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Answer Explanation Box (Shown only in Answer Mode) */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-100 ${fit.explanationPadding}`}>
            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" />
              <span>Explanation</span>
            </div>
            <p className={`text-zinc-300 ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding & Call to Action */}
      <div className="relative z-10 flex-shrink-0 pt-2 border-t border-amber-500/20 flex items-center justify-between gap-2 text-xs">
        <div className="font-bold text-amber-400 flex items-center space-x-1.5 text-[10px] sm:text-xs min-w-0 flex-1">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 flex-shrink-0" />
          <span className="truncate">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="font-black tracking-wider uppercase bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
