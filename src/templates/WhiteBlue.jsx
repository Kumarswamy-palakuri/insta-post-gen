import React from 'react';
import { Award, BookOpen, CheckCircle2, Check, Sparkles, Flame } from 'lucide-react';
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
    answerCtaText = 'Did you get it right? Share with friends! 🚀',
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
      className={`relative w-full h-full flex flex-col overflow-hidden bg-white text-slate-800 select-none ${fit.containerPadding} ${fontClass}`}
      style={{
        backgroundColor: customization.customBg || '#ffffff',
        color: customization.customTextColor || undefined,
      }}
    >
      {/* Decorative subtle ambient studio lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Header Bar */}
      <div className={`relative z-10 flex-shrink-0 flex items-center justify-between gap-2 pb-2 sm:pb-2.5 border-b border-slate-100 sm:border-slate-200/80 ${fit.headerClass}`}>
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 flex-shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wide uppercase text-slate-900 truncate">
              {handle}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-none truncate">{subText}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200/80 whitespace-nowrap max-w-[160px] sm:max-w-[220px] truncate shadow-xs">
            {question.topic || 'General Quiz'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200/70 whitespace-nowrap">
            {qNum}/{totalNum}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className={`relative z-10 ${fit.mainSectionClass}`}>
        {/* Post Type Badge */}
        <div className="flex items-center flex-wrap gap-2 mb-1.5 flex-shrink-0">
          {isAnswerMode ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-black uppercase tracking-wider shadow-xs select-none">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="whitespace-nowrap">ANSWER REVEAL</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-300 text-[10px] font-black uppercase tracking-wider shadow-xs select-none">
              <Sparkles className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="whitespace-nowrap">QUIZ TIME</span>
            </span>
          )}
          {question.difficulty && (
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider whitespace-nowrap flex-shrink-0 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 shadow-xs">
              • {question.difficulty}
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className={`font-black text-slate-900 leading-snug mb-2 sm:mb-2.5 drop-shadow-none ${fit.questionSize}`}>
          {question.question}
        </h2>

        {/* Option Cards: In Answer Mode, show ONLY the single correct option to free space for the Explanation */}
        <div className={`grid grid-cols-1 ${fit.optionGap}`}>
          {optionsToRender.map((key) => {
            const isCorrect = key === correctKey;
            const optionText = question.options?.[key] || '';

            let cardStyle = 'bg-slate-50/90 border border-slate-200/90 text-slate-800 hover:border-blue-400 hover:bg-blue-50/30 shadow-xs';
            let labelStyle = 'bg-blue-600 text-white font-black shadow-xs';

            if (isAnswerMode) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-50/90 border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm shadow-emerald-500/10';
                labelStyle = 'bg-emerald-600 text-white font-black shadow-xs';
              } else {
                cardStyle = 'bg-slate-50/40 border-slate-200/50 text-slate-400 opacity-50';
                labelStyle = 'bg-slate-200 text-slate-500';
              }
            }

            return (
              <div
                key={key}
                className={`flex items-center rounded-xl border transition-all ${fit.optionPadding} ${cardStyle}`}
              >
                <div className={`rounded-lg flex items-center justify-center mr-2 sm:mr-2.5 flex-shrink-0 ${fit.optionBadgeSize} ${labelStyle}`}>
                  {isAnswerMode && isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : key}
                </div>
                <div className={`font-semibold leading-tight flex-1 ${fit.optionTextSize}`}>
                  {optionText}
                </div>
                {isAnswerMode && isCorrect && (
                  <span className="ml-1.5 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 whitespace-nowrap shadow-xs">
                    ({key}) CORRECT
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation Box (Shown only in Answer Mode) */}
        {isAnswerMode && question.explanation && (
          <div className={`rounded-xl bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50/80 border border-indigo-200/70 text-slate-800 shadow-xs ${fit.explanationPadding}`}>
            <div className="text-[10px] font-black text-indigo-700 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span>Explanation & Key Fact</span>
            </div>
            <p className={`text-slate-700 font-medium leading-relaxed ${fit.explanationTextSize}`}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`relative z-10 flex-shrink-0 pt-2 border-t border-slate-100 sm:border-slate-200/80 flex items-center justify-between gap-2 text-xs ${fit.footerClass}`}>
        <div className="font-bold text-slate-700 flex items-center space-x-1.5 text-[10px] sm:text-xs min-w-0 flex-1">
          <Flame className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="truncate">{isAnswerMode ? answerCtaText : ctaText}</span>
        </div>
        <div className="font-extrabold text-blue-700 tracking-wider uppercase text-[10px] sm:text-xs flex-shrink-0 whitespace-nowrap">
          @{handle}
        </div>
      </div>
    </div>
  );
}
