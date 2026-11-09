import React, { useRef, useState } from 'react';
import { Download, RefreshCw, Copy, Check, Eye, Edit3, Image as ImageIcon } from 'lucide-react';
import { getTemplateById } from '../templates';
import { downloadSingleNode, DIMENSIONS_CONFIG } from '../utils/imageExport';

export default function QuestionCard({
  question,
  questionIndex = 0,
  totalQuestions = 1,
  selectedTemplate = 'black-gold',
  branding = {},
  customization = {},
  dimension = 'square',
  onEdit = null,
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

  // Copy question text to clipboard for caption
  const handleCopyText = () => {
    const text = `🧠 QUIZ TIME: ${question.topic}\n\nQ: ${question.question}\n\nA) ${question.options.A}\nB) ${question.options.B}\nC) ${question.options.C}\nD) ${question.options.D}\n\n💬 Comment your answer below!\n\nFollow @${branding.handle || 'learn_in_a_minute'} for daily quizzes!\n#quiz #knowledge #education #upsc #ssc #gk`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (showNotification) {
      showNotification('Question caption copied to clipboard!', 'success');
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
            title="Copy caption text for Instagram"
            className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Caption'}</span>
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

