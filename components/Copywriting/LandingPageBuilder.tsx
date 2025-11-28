

import React, { useState, useEffect } from 'react';
import { 
    CopywritingData, 
    Language, 
    UserProfile, 
    CanvasData, 
    TranslationKey
} from '../../types';
import { Button } from '../common/Button';
import { generateLandingPageHtml } from '../../services/geminiService';
import { GENERIC_ERROR_MESSAGE } from '../../constants';

interface LandingPageBuilderProps {
  copywritingData: CopywritingData;
  onUpdateData: (data: CopywritingData) => void;
  strategyData: Partial<CanvasData>;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
  triggerAiGeneration: boolean;
  resetAiTrigger: () => void;
}

export const LandingPageBuilder: React.FC<LandingPageBuilderProps> = ({
  copywritingData,
  onUpdateData,
  strategyData,
  language,
  t,
  triggerAiGeneration,
  resetAiTrigger,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const htmlCode = copywritingData.landingPageHtml || '';

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateLandingPageHtml(strategyData);
      if (result) {
        onUpdateData({ ...copywritingData, landingPageHtml: result });
      } else {
        setError(t('error_ai_failed_generic', GENERIC_ERROR_MESSAGE));
      }
    } catch (e) {
      console.error(e);
      setError(t('error_ai_failed_generic', GENERIC_ERROR_MESSAGE));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (triggerAiGeneration) {
      handleGenerate();
      resetAiTrigger();
    }
  }, [triggerAiGeneration, resetAiTrigger]);
  
  const handleCopyCode = () => {
    if (!htmlCode) return;
    navigator.clipboard.writeText(htmlCode).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleDownload = () => {
    if (!htmlCode) return;
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <div>
        <h3 className="text-xl font-semibold text-blue-400">{t('landing_page_builder_title')}</h3>
        <p className="text-sm text-slate-400 mt-1">{t('landing_page_builder_explanation')}</p>
      </div>
      
      {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">{error}</p>}
      
      <div className="text-center">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          variant="primary"
          size="lg"
          leftIcon={isLoading ? <SpinnerIcon className="h-5 w-5" /> : <SparklesIcon className="h-5 w-5" />}
        >
          {isLoading ? t('landing_page_generating_button') : (htmlCode ? t('landing_page_regenerating_button') : t('landing_page_generate_button'))}
        </Button>
      </div>

      {htmlCode && (
        <div className="pt-6 border-t border-slate-700">
          <div className="flex justify-between items-center mb-4">
             <div className="flex border border-slate-600 rounded-lg p-1">
                <Button variant={activeTab === 'preview' ? 'secondary' : 'outline'} size="sm" onClick={() => setActiveTab('preview')} className="!rounded-md">Preview</Button>
                <Button variant={activeTab === 'code' ? 'secondary' : 'outline'} size="sm" onClick={() => setActiveTab('code')} className="!rounded-md">Code</Button>
             </div>
             <div className="flex space-x-2">
                <Button onClick={handleCopyCode} variant="outline" size="sm">
                  {copySuccess ? t('landing_page_code_copied') : t('landing_page_copy_code_button')}
                </Button>
                <Button onClick={handleDownload} variant="secondary" size="sm">
                  {t('landing_page_download_button')}
                </Button>
             </div>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="border border-slate-600 rounded-lg overflow-hidden bg-white">
                <iframe
                    srcDoc={htmlCode}
                    title="Landing Page Preview"
                    className="w-full h-[60vh] "
                    sandbox="allow-scripts"
                />
            </div>
          ) : (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 max-h-[60vh] overflow-auto">
              <pre><code className="text-sm text-slate-300 language-html whitespace-pre-wrap">{htmlCode}</code></pre>
            </div>
          )}
        </div>
      )}

      {!htmlCode && !isLoading && (
        <div className="text-center py-10 px-6 border-t border-slate-700 mt-6">
            <p className="text-slate-500 italic">{t('landing_page_no_code')}</p>
        </div>
      )}
    </div>
  );
};

// --- SVG Icons ---
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L12.187 15l-2.846.813a4.5 4.5 0 01-3.09-3.09L5.437 10.5l2.846-.813a4.5 4.5 0 013.09-3.09L12 3.75l.813 2.846a4.5 4.5 0 013.09 3.09L18.75 9l-2.846.813a4.5 4.5 0 01-3.09-3.09L12.187 6 12 5.25l.187.75z" />
    </svg>
);

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" {...props} className={`animate-spin ${props.className || ''}`}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);