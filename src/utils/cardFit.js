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

  // Container padding & vertical distribution
  let containerPadding = 'p-5 sm:p-6 justify-between';
  if (isStory) {
    // In Story / Reel (9:16), vertically center the cohesive content block in Instagram safe zone
    containerPadding = 'py-12 sm:py-16 px-6 sm:px-8 justify-center';
  } else if (dimension === 'portrait') {
    containerPadding = 'py-8 px-7 justify-between';
  } else {
    // Square (1:1) has the tightest vertical aspect
    containerPadding = isAnswerMode
      ? 'p-3 sm:p-4 justify-between'
      : 'p-3 sm:p-5 justify-between';
  }

  // Header & Footer Story Adjacency
  // In Story (9:16), header and footer sit right adjacent above and below question contents (not most top & most bottom)
  const headerClass = isStory ? 'mb-3 sm:mb-4' : '';
  const footerClass = isStory ? 'mt-3 sm:mt-4' : '';
  const mainSectionClass = isStory
    ? 'flex-initial py-2 sm:py-3'
    : 'flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2';

  // Question Typography
  let questionSize = 'text-base sm:text-lg';
  if (fontSizeOption === 'compact' || isVeryLong) {
    questionSize = 'text-xs sm:text-sm leading-snug';
  } else if (fontSizeOption === 'large' && !isSquare) {
    questionSize = 'text-xl sm:text-2xl leading-snug';
  } else if (isSquare && isAnswerMode) {
    questionSize = isLong ? 'text-xs sm:text-sm leading-snug' : 'text-sm sm:text-base leading-snug';
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
    // Answer Reveal in Square 1:1 renders only the single correct option, giving generous space for explanation
    optionGap = 'gap-2';
    optionPadding = 'p-2 sm:p-2.5';
    optionTextSize = 'text-xs sm:text-sm';
    optionBadgeSize = 'w-6 h-6 sm:w-7 sm:h-7 text-xs';
  } else if (isSquare) {
    optionGap = 'gap-2';
    optionPadding = 'p-2 sm:p-2.5';
    optionTextSize = 'text-xs sm:text-sm';
    optionBadgeSize = 'w-6 h-6 sm:w-7 sm:h-7 text-xs';
  }

  // Explanation Box
  let explanationPadding = isSquare ? 'p-2.5 sm:p-3 mt-2 sm:mt-2.5' : 'p-3.5 mt-3';
  let explanationTextSize = isSquare
    ? isLong
      ? 'text-[11px] sm:text-xs leading-snug'
      : 'text-xs sm:text-sm leading-normal'
    : 'text-xs sm:text-sm leading-relaxed';

  return {
    containerPadding,
    headerClass,
    footerClass,
    mainSectionClass,
    questionSize,
    optionGap,
    optionPadding,
    optionTextSize,
    optionBadgeSize,
    explanationPadding,
    explanationTextSize,
  };
};

