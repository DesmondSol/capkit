import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TranslationKey } from '../../types';

interface AddProspectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prospectsText: string) => void;
  t: (key: TranslationKey) => string;
}

export const AddProspectsModal: React.FC<AddProspectsModalProps> = ({ isOpen, onClose, onSave, t }) => {
  const [prospectsText, setProspectsText] = useState('');

  const handleSubmit = () => {
    if (prospectsText.trim()) {
      onSave(prospectsText);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('crm_add_prospects_modal_title')} size="lg">
      <div className="space-y-4">
        <p className="text-sm text-slate-400">{t('crm_add_prospects_instructions')}</p>
        <textarea
          value={prospectsText}
          onChange={(e) => setProspectsText(e.target.value)}
          rows={10}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm font-mono"
          placeholder={"Abebe Bikila, abebe@example.com, 0911123456, Met at tech event\nFatuma Roba, fatuma@example.com, 0912987654"}
        />
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
          <Button type="button" variant="primary" onClick={handleSubmit}>{t('add_button')}</Button>
        </div>
      </div>
    </Modal>
  );
};