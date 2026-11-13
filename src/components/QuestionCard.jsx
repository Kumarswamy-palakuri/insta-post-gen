import React, { useRef, useState } from 'react';
import { Download, Copy, Check, Edit3, Image as ImageIcon, Flame } from 'lucide-react';
import { getTemplateById } from '../templates';
import { downloadSingleNode, DIMENSIONS_CONFIG } from '../utils/imageExport';
import { generateSingleQuestionCaption } from '../utils/captionGenerator';

export default function QuestionCard({
  question,
  questionIndex = 0,
  totalQuestions = 1,
  selectedTemplate = 'black-gold',
  branding = {},
  customization = {},
  dimension = 'square',
  onEdit = null,
  onOpenCaptionModal = null,
  showNotification = null,
}) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const templateObj = getTemplateById(selectedTemplate);
  const TemplateComponent = templateObj.component;

  const dimConfig = DIMENSIONS_CONFIG[dimension] || DIMENSIONS_CONFIG.square;

  // Handle single download
  const handleDownload = async (format = 'png') => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await downloadSingleNode({
        node: cardRef.current,
        filename: `Q${questionIndex + 1}_Question_${question.topic || 'Quiz'}`,
        format,
        dimensionKey: dimension,
        templateName: templateObj.name,
      });
      if (showNotification) {
        showNotification(`Downloaded Question ${questionIndex + 1} (${format.toUpperCase()})`, 'success');
      }
    } catch (err) {
      if (showNotification) {
        showNotification(`Export failed: ${err.message}`, 'error');
      }
    } finally {
      setDownloading(false);
    }
  };

  // Copy viral question caption to clipboard
  const handleCopyText = () => {
    if (onOpenCaptionModal) {
      onOpenCaptionModal(questionIndex);
      return;
    }
    const text = generateSingleQuestionCaption({
      question,
      branding,
      questionIndex,
      totalQuestions,
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (showNotification) {
      showNotification('Viral caption with high-reach hashtags copied!', 'success');
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl flex flex-col">
      {/* Top Card Controls */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Post 1: Question Image ({dimConfig.label})
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {onEdit && (
            <button
              onClick={() => onEdit(questionIndex)}
              title="Customize question and options"
              className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          <button
            onClick={handleCopyText}
            title="Copy viral Instagram caption with trending hashtags"
            className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Flame className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Viral Caption'}</span>
          </button>
        </div>
      </div>

      {/* Instagram Post Canvas Container */}
      <div className="p-2 sm:p-6 bg-slate-950/60 flex items-center justify-center overflow-hidden">
        <div
          ref={cardRef}
          className={`w-full max-w-[480px] shadow-2xl rounded-2xl overflow-hidden ${dimConfig.aspectClass} flex flex-col`}
        >
          <TemplateComponent
            question={question}
            isAnswerMode={false}
            branding={branding}
            customization={customization}
            dimension={dimension}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
          />
        </div>
      </div>

      {/* Bottom Download Bar */}
      <div className="px-4 py-3 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between">
        <div className="text-xs text-slate-400 flex items-center space-x-1">
          <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
          <span>{dimConfig.width} × {dimConfig.height}px</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownload('jpg')}
            disabled={downloading}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-200 transition disabled:opacity-50"
          >
            JPG
          </button>
          <button
            onClick={() => handleDownload('png')}
            disabled={downloading}
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition flex items-center space-x-1.5 shadow-md shadow-brand-600/30 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Exporting...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

