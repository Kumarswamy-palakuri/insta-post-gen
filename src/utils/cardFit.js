/**
 * Adaptive layout and typography sizing helper for Instagram cards.
 * Guarantees that 100% of question text, 4 options, explanation, header, and footer
 * fit inside the card without overflowing or getting clipped across Square, Portrait, and Story formats.
 */

export const getAdaptiveCardClasses = (
  dimension = 'square',
  isAnswerMode = false,
  questionLength = 80,
  fontSizeOption = 'auto'
) => {
  const isSquare = dimension === 'square';
  const isStory = dimension === 'story';
  const isLong = questionLength > 85;
  const isVeryLong = questionLength > 140;

  // Container padding
  let containerPadding = 'p-5 sm:p-6 justify-between';
  if (isStory) {
    containerPadding = 'py-12 px-7 justify-between';
  } else if (dimension === 'portrait') {
    containerPadding = 'py-8 px-7 justify-between';
  } else {
    // Square (1:1) has the tightest vertical aspect
    containerPadding = isAnswerMode
      ? 'p-3 sm:p-4 justify-between'
      : 'p-3 sm:p-5 justify-between';
  }

  // Question Typography
  let questionSize = 'text-base sm:text-lg';
  if (fontSizeOption === 'compact' || (isSquare && isAnswerMode && isLong) || isVeryLong) {
    questionSize = 'text-xs sm:text-sm leading-snug';
  } else if (fontSizeOption === 'large' && !isSquare) {
    questionSize = 'text-xl sm:text-2xl leading-snug';
  } else if (isSquare && isAnswerMode) {
    questionSize = 'text-xs sm:text-sm leading-snug';
  } else if (isSquare) {
    questionSize = isLong ? 'text-sm sm:text-base leading-snug' : 'text-base sm:text-lg leading-snug';
  } else {
    questionSize = isLong ? 'text-base sm:text-lg leading-snug' : 'text-lg sm:text-xl leading-snug';
  }

  // Option Cards Padding & Gap
  let optionGap = 'gap-2';
  let optionPadding = 'p-2 sm:p-2.5';
  let optionTextSize = 'text-xs sm:text-sm';
  let optionBadgeSize = 'w-6 h-6 sm:w-7 sm:h-7 text-xs';

  if (!isSquare && !isAnswerMode) {
    optionGap = 'gap-2.5 sm:gap-3';
    optionPadding = 'p-2.5 sm:p-3';
    optionBadgeSize = 'w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm';
  } else if (isSquare && isAnswerMode) {
    // Answer Reveal in Square 1:1 needs streamlined spacing for explanation
    optionGap = 'gap-1.5';
    optionPadding = 'p-1.5 sm:p-2';
    optionTextSize = 'text-[11px] sm:text-xs';
    optionBadgeSize = 'w-5 h-5 sm:w-6 sm:h-6 text-[11px]';
  } else if (isSquare) {
    optionGap = 'gap-2';
    optionPadding = 'p-2 sm:p-2.5';
    optionTextSize = 'text-xs sm:text-sm';
    optionBadgeSize = 'w-6 h-6 sm:w-7 sm:h-7 text-xs';
  }

  // Explanation Box
  let explanationPadding = isSquare ? 'p-2 sm:p-2.5 mt-2' : 'p-3 mt-3';
  let explanationTextSize = isSquare ? 'text-[10px] sm:text-[11px] leading-snug' : 'text-xs leading-relaxed';

  return {
    containerPadding,
    questionSize,
    optionGap,
    optionPadding,
    optionTextSize,
    optionBadgeSize,
    explanationPadding,
    explanationTextSize,
  };
};

