/**
 * Image Export utility for Instagram Quiz Post Generator
 * Handles single exports (PNG/JPG) and bulk ZIP downloads using html-to-image and JSZip.
 */

import { toPng, toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { addDownloadHistory } from './storage';

export const DIMENSIONS_CONFIG = {
  square: {
    label: 'Square (1:1)',
    width: 1080,
    height: 1080,
    aspectClass: 'aspect-square',
    subTitle: 'Standard Feed Post',
  },
  portrait: {
    label: 'Portrait (4:5)',
    width: 1080,
    height: 1350,
    aspectClass: 'aspect-[4/5]',
    subTitle: 'High-Engagement Feed Post',
  },
  story: {
    label: 'Story / Reel (9:16)',
    width: 1080,
    height: 1920,
    aspectClass: 'aspect-[9/16]',
    subTitle: 'Story & Reels Highlight',
  },
};

/**
 * Clean filename helper
 */
const sanitizeFilename = (name) => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 40);
};

/**
 * Capture an HTML DOM element to data URL
 */
export const captureNodeToDataUrl = async (node, format = 'png', dimensionKey = 'square') => {
  if (!node) {
    throw new Error('Target DOM node not found for export.');
  }

  // Ensure all fonts are loaded and rendered before taking snapshot
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore font loading check errors
    }
  }

  // Brief pause to ensure any pending browser paint/layout operations settle
  await new Promise((resolve) => setTimeout(resolve, 80));

  const rect = node.getBoundingClientRect();
  const width = Math.round(rect.width) || node.offsetWidth || 480;
  const height = Math.round(rect.height) || node.offsetHeight || 480;

  // Calculate target resolution (1080px standard Instagram width)
  const targetWidth = DIMENSIONS_CONFIG[dimensionKey]?.width || 1080;
  // Calculate dynamic pixel ratio to guarantee crisp 1080px output matching preview 1:1
  const pixelRatio = width > 0 ? targetWidth / width : 2.25;

  // html-to-image options for pixel-perfect export matching preview exactly
  const exportOptions = {
    quality: 0.98,
    pixelRatio,
    width,
    height,
    cacheBust: true,
    filter: (domNode) => {
      // Exclude controls or UI helpers with class 'no-export'
      if (domNode.classList && domNode.classList.contains('no-export')) {
        return false;
      }
      return true;
    },
    style: {
      transform: 'none',
      margin: '0',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
  };

  if (format === 'jpg' || format === 'jpeg') {
    exportOptions.backgroundColor = '#0a0a0a';
  }

  try {
    if (format === 'jpg' || format === 'jpeg') {
      return await toJpeg(node, exportOptions);
    }
    return await toPng(node, exportOptions);
  } catch (err) {
    console.error('Error generating image from DOM node:', err);
    throw new Error(`Failed to generate ${format.toUpperCase()} image: ${err.message}`);
  }
};

/**
 * Export and trigger download of a single DOM node
 */
export const downloadSingleNode = async ({
  node,
  filename = 'quiz-post',
  format = 'png',
  dimensionKey = 'square',
  templateName = 'default',
}) => {
  const dataUrl = await captureNodeToDataUrl(node, format, dimensionKey);
  const ext = format === 'jpg' || format === 'jpeg' ? 'jpg' : 'png';
  const cleanName = `${sanitizeFilename(filename)}_${dimensionKey}.${ext}`;

  // Use file-saver or manual download link
  const link = document.createElement('a');
  link.download = cleanName;
  link.href = dataUrl;
  link.click();

  // Log in download history
  addDownloadHistory({
    title: filename,
    type: ext.toUpperCase(),
    format: dimensionKey,
    template: templateName,
    count: 1,
  });

  return cleanName;
};

/**
 * Export both Question and Answer posts for a question as individual files
 */
export const downloadQuestionAndAnswerPair = async ({
  questionNode,
  answerNode,
  questionNumber = 1,
  topic = 'quiz',
  format = 'png',
  dimensionKey = 'square',
  templateName = 'default',
}) => {
  const baseName = `Q${questionNumber}_${sanitizeFilename(topic)}`;
  const ext = format === 'jpg' || format === 'jpeg' ? 'jpg' : 'png';

  if (questionNode) {
    const qDataUrl = await captureNodeToDataUrl(questionNode, format, dimensionKey);
    const qLink = document.createElement('a');
    qLink.download = `${baseName}_question.${ext}`;
    qLink.href = qDataUrl;
    qLink.click();
  }

  // Slight delay between downloads
  await new Promise((r) => setTimeout(r, 400));

  if (answerNode) {
    const aDataUrl = await captureNodeToDataUrl(answerNode, format, dimensionKey);
    const aLink = document.createElement('a');
    aLink.download = `${baseName}_answer_reveal.${ext}`;
    aLink.href = aDataUrl;
    aLink.click();
  }

  addDownloadHistory({
    title: `Q${questionNumber} Post & Answer (${topic})`,
    type: ext.toUpperCase(),
    format: dimensionKey,
    template: templateName,
    count: 2,
  });
};

/**
 * Export all cards into a structured ZIP file
 */
export const downloadAllAsZip = async ({
  items = [], // Array of { questionNode, answerNode, questionIndex, questionText }
  quizTitle = 'Quiz_Pack',
  dimensionKey = 'square',
  templateName = 'default',
  format = 'png',
  onProgress = null, // callback (current, total, statusText)
}) => {
  if (!items || items.length === 0) {
    throw new Error('No items provided to export.');
  }

  // Pre-flush document fonts
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // ignore
    }
  }

  const zip = new JSZip();
  const folder = zip.folder(sanitizeFilename(quizTitle));
  const ext = format === 'jpg' || format === 'jpeg' ? 'jpg' : 'png';
  const totalCaptures = items.length * 2;
  let currentCapture = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const qNum = String(i + 1).padStart(2, '0');

    // 1. Capture Question Post
    if (item.questionNode) {
      if (onProgress) onProgress(currentCapture + 1, totalCaptures, `Rendering Slide ${i + 1} Question...`);
      await new Promise((r) => setTimeout(r, 60)); // ensure DOM paint settle
      const qDataUrl = await captureNodeToDataUrl(item.questionNode, format, dimensionKey);
      const qBase64 = qDataUrl.split(',')[1];
      folder.file(`Slide_${qNum}a_Question.${ext}`, qBase64, { base64: true });
      currentCapture++;
    }

    // 2. Capture Answer Reveal Post
    if (item.answerNode) {
      if (onProgress) onProgress(currentCapture + 1, totalCaptures, `Rendering Slide ${i + 1} Answer Reveal...`);
      await new Promise((r) => setTimeout(r, 60)); // ensure DOM paint settle
      const aDataUrl = await captureNodeToDataUrl(item.answerNode, format, dimensionKey);
      const aBase64 = aDataUrl.split(',')[1];
      folder.file(`Slide_${qNum}b_Answer_Reveal.${ext}`, aBase64, { base64: true });
      currentCapture++;
    }
  }

  if (onProgress) onProgress(totalCaptures, totalCaptures, 'Generating ZIP bundle...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipFileName = `${sanitizeFilename(quizTitle)}_${dimensionKey}_instagram_pack.zip`;
  
  saveAs(zipBlob, zipFileName);

  addDownloadHistory({
    title: `${quizTitle} (Full ZIP Pack)`,
    type: 'ZIP',
    format: dimensionKey,
    template: templateName,
    count: currentCapture,
  });

  return zipFileName;
};

