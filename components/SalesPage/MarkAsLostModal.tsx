import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TranslationKey } from '../../types';

interface MarkAsLostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reason: string) => void;
  t: (key: TranslationKey) => string;
}

export const MarkAsLostModal: React.FC<MarkAsLostModalProps> = ({ isOpen, onClose, onSave, t }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSave(reason);
    } else {
        alert(t('crm_lost_reason_label') + ' is required.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('crm_mark_as_lost_modal_title')} size="lg">
      <div className="space-y-4">
        <div>
            <label htmlFor="lostReason" className="block text-sm font-medium text-slate-300 mb-1">{t('crm_lost_reason_label')}</label>
            <textarea
            id="lostReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm"
            placeholder="e.g., Price was too high, competitor offered a better deal, timing wasn't right..."
            required
            />
        </div>
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
          <Button type="button" variant="danger" onClick={handleSubmit}>{t('confirm_button') || 'Confirm Lost'}</Button>
        </div>
      </div>
    </Modal>
  );
};