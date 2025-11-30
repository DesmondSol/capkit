import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { TranslationKey, Language } from '../types';
import { Shield, AlertTriangle } from 'lucide-react';

interface TermsAgreementModalProps {
    isOpen: boolean;
    onAccept: () => void;
    t: (key: TranslationKey, defaultText?: string) => string;
    language: Language;
}

export const TermsAgreementModal: React.FC<TermsAgreementModalProps> = ({ isOpen, onAccept, t, language }) => {
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToAi, setAgreedToAi] = useState(false);

    const canAccept = agreedToTerms && agreedToAi;

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { }}
            title={t('terms_modal_title')}
            size="lg"
            hideCloseButton={true}
            disableBackdropClick={true}
        >
            <div className="space-y-6">
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Shield className="w-5 h-5" />
                        <h4 className="font-semibold">{t('terms_section_title')}</h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {t('terms_section_content')}
                    </p>
                </div>

                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/50">
                    <div className="flex items-center gap-2 mb-2 text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                        <h4 className="font-semibold">{t('terms_ai_disclaimer_title')}</h4>
                    </div>
                    <p className="text-sm text-amber-200/80 leading-relaxed">
                        {t('terms_ai_disclaimer_content')}
                    </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-700">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 rounded border-slate-500 text-blue-600 focus:ring-blue-500 bg-slate-700"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                            {t('terms_agree_checkbox')}
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 rounded border-slate-500 text-blue-600 focus:ring-blue-500 bg-slate-700"
                            checked={agreedToAi}
                            onChange={(e) => setAgreedToAi(e.target.checked)}
                        />
                        <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                            {t('terms_ai_agree_checkbox')}
                        </span>
                    </label>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={onAccept}
                        disabled={!canAccept}
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        {t('terms_accept_button')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};