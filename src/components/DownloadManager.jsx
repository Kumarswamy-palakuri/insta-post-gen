import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  FolderArchive,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { getTemplateById } from '../templates';
import { downloadAllAsZip, downloadSingleNode, DIMENSIONS_CONFIG } from '../utils/imageExport';

export default function DownloadManager({
  questions = [],
  selectedTemplate = 'black-gold',
  branding = {},
  customization = {},
  dimension = 'square',
  onClose,
  showNotification,
}) {
  const [exportFormat, setExportFormat] = useState('png'); // 'png' | 'jpg'
  const [selectedDimension, setSelectedDimension] = useState(dimension);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, text: '' });

  // References to hidden render nodes
  const offscreenRefs = useRef([]);

  const templateObj = getTemplateById(selectedTemplate);
  const TemplateComponent = templateObj.component;
  const dimConfig = DIMENSIONS_CONFIG[selectedDimension] || DIMENSIONS_CONFIG.square;

  // Match exact preview dimensions (480px base width scaled to 1080px in capture)
  const cardWidth = 480;
  const cardHeight = selectedDimension === 'portrait'
    ? 600
    : selectedDimension === 'story'
      ? 853.33
      : 480;

  // Handle Full ZIP generation
  const handleExportZip = async () => {
    if (!questions || questions.length === 0) return;

    setIsExportingZip(true);
    setProgress({ current: 0, total: questions.length * 2, text: 'Preparing slides...' });

    try {
      // Small pause to guarantee DOM and font render settled
      await new Promise((resolve) => setTimeout(resolve, 100));

      const itemsToCapture = questions.map((q, idx) => {
        const questionNode = document.getElementById(`offscreen-q-${idx}`);
        const answerNode = document.getElementById(`offscreen-a-${idx}`);
        return {
          questionNode,
          answerNode,
          questionIndex: idx,
          questionText: q.question,
        };
      });

      await downloadAllAsZip({
        items: itemsToCapture,
        quizTitle: `${questions[0]?.topic || 'Quiz'}_Pack`,
        dimensionKey: selectedDimension,
        templateName: templateObj.name,
        format: exportFormat,
        onProgress: (current, total, text) => {
          setProgress({ current, total, text });
        },
      });

      if (showNotification) {
        showNotification('ZIP archive generated and downloaded successfully!', 'success');
      }
      onClose();
    } catch (err) {
      console.error('ZIP export error:', err);
      if (showNotification) {
        showNotification(`ZIP export failed: ${err.message}`, 'error');
      }
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-slate-700/80 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bulk Instagram Export Manager</h3>
              <p className="text-xs text-slate-400">Download all question & answer posts for your carousel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExportingZip}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Details</div>
              <div className="text-sm font-bold text-white mt-0.5">{questions[0]?.topic || 'Quiz Pack'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Slides</div>
              <div className="text-sm font-black text-brand-400 mt-0.5">
                {questions.length * 2} Images ({questions.length} Q + {questions.length} A)
              </div>
            </div>
          </div>

          {/* Dimension Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Instagram Format
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {Object.entries(DIMENSIONS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDimension(key)}
                  className={`p-3 rounded-xl border text-center transition ${
                    selectedDimension === key
                      ? 'border-brand-500 bg-brand-950/50 ring-1 ring-brand-500 text-brand-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="text-xs font-bold">{config.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {config.width}×{config.height}px
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Format Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('png')}
                className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition ${
                  exportFormat === 'png'
                    ? 'border-brand-500 bg-brand-950/40 ring-1 ring-brand-500 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  PNG
                </div>
                <div>
                  <div className="text-xs font-bold">PNG (Lossless)</div>
                  <div className="text-[10px] text-slate-400">Best for Instagram clarity & crisp text</div>
                </div>
              </button>

              <button
                onClick={() => setExportFormat('jpg')}
                className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition ${
                  exportFormat === 'jpg'
                    ? 'border-brand-500 bg-brand-950/40 ring-1 ring-brand-500 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  JPG
                </div>
                <div>
                  <div className="text-xs font-bold">JPG (Compressed)</div>
                  <div className="text-[10px] text-slate-400">Smaller file size for quick sharing</div>
                </div>
              </button>
            </div>
          </div>

          {/* Structure Preview */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1">
              ZIP Folder Output Structure:
            </div>
            <div className="font-mono text-[11px] text-slate-400 pl-2">
              📁 {questions[0]?.topic || 'Quiz'}_Pack/
              <br />
              &nbsp;&nbsp;📄 Slide_01a_Question.{exportFormat}
              <br />
              &nbsp;&nbsp;📄 Slide_01b_Answer_Reveal.{exportFormat}
              <br />
              &nbsp;&nbsp;📄 Slide_02a_Question.{exportFormat}...
            </div>
          </div>

          {/* Progress Bar (Visible while exporting) */}
          {isExportingZip && (
            <div className="space-y-2 p-3.5 bg-brand-950/40 border border-brand-500/40 rounded-xl">
              <div className="flex items-center justify-between text-xs font-bold text-brand-300">
                <span>{progress.text || 'Processing...'}</span>
                <span>{Math.round((progress.current / (progress.total || 1)) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${(progress.current / (progress.total || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-800/80 border-t border-slate-700 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={isExportingZip}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 transition disabled:opacity-40 text-center"
          >
            Cancel
          </button>

          <button
            onClick={handleExportZip}
            disabled={isExportingZip}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 transition"
          >
            {isExportingZip ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Exporting ZIP...</span>
              </>
            ) : (
              <>
                <FolderArchive className="w-4 h-4" />
                <span>Download All {questions.length * 2} Images (ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden Render Container for pixel-perfect ZIP capture matching preview 1:1 */}
      <div
        className="fixed top-0 left-0 pointer-events-none -z-50 overflow-hidden"
        style={{
          width: '480px',
          height: `${cardHeight}px`,
          opacity: 1,
          visibility: 'visible',
        }}
        aria-hidden="true"
      >
        {questions.map((q, idx) => (
          <React.Fragment key={`offscreen-group-${idx}`}>
            {/* Offscreen Question Post - EXACT same structure and styling as QuestionCard */}
            <div
              id={`offscreen-q-${idx}`}
              className={`w-[480px] shadow-2xl rounded-2xl overflow-hidden ${dimConfig.aspectClass} flex flex-col absolute top-0 left-0`}
              style={{
                width: '480px',
                height: `${cardHeight}px`,
              }}
            >
              <TemplateComponent
                question={q}
                isAnswerMode={false}
                branding={branding}
                customization={customization}
                dimension={selectedDimension}
                questionIndex={idx}
                totalQuestions={questions.length}
              />
            </div>

            {/* Offscreen Answer Reveal Post - EXACT same structure and styling as AnswerCard */}
            <div
              id={`offscreen-a-${idx}`}
              className={`w-[480px] shadow-2xl rounded-2xl overflow-hidden ${dimConfig.aspectClass} flex flex-col absolute top-0 left-0`}
              style={{
                width: '480px',
                height: `${cardHeight}px`,
              }}
            >
              <TemplateComponent
                question={q}
                isAnswerMode={true}
                branding={branding}
                customization={customization}
                dimension={selectedDimension}
                questionIndex={idx}
                totalQuestions={questions.length}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

