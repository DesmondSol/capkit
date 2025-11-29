import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { UserProfile, Language } from '../types';
import { TranslationKey } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  currentUserProfile: UserProfile | null;
  t: (key: TranslationKey, defaultText?: string) => string;
  accessLevel: 'full' | 'mindset_only';
  onUnlockSuccess: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentUserProfile,
  t,
  accessLevel,
  onUnlockSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [unlockCode, setUnlockCode] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserProfile) {
      setName(currentUserProfile.name || '');
      setEmail(currentUserProfile.email || '');
      setPhone(currentUserProfile.phone || '');
      setOtherDetails(currentUserProfile.otherDetails || '');
      setPhoto(currentUserProfile.photo || null);
      setPhotoPreview(currentUserProfile.photo || null);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setOtherDetails('');
      setPhoto(null);
      setPhotoPreview(null);
    }
    setUnlockCode('');
    setUnlockError(null);
  }, [currentUserProfile, isOpen]);

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhoto(base64String);
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, phone, otherDetails, photo });
  };

  const handleUnlockAttempt = () => {
    if (unlockCode.toLowerCase() === 'demo') {
      onUnlockSuccess();
    } else {
      setUnlockError(t('user_profile_unlock_error'));
    }
  };

  const contactText = t('unlock_contact_info');
  const contactParts = contactText.split(':');
  const contactInfo = contactParts.length > 1 
    ? { intro: contactParts[0] + ':', email: contactParts[1].trim() }
    : { intro: contactText, email: null };

  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('user_profile_modal_title')} size="lg">
      <div className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-blue-500 shadow-md">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-slate-500" />
              )}
            </div>
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label
              htmlFor="photoUpload"
              className="cursor-pointer bg-slate-600 text-slate-200 px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-500 transition-colors"
            >
              {photoPreview ? t('user_profile_change_photo_button') : t('user_profile_upload_photo_button')}
            </label>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">{t('user_profile_name_label')}</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputBaseClasses} placeholder={t('user_profile_name_placeholder')} required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">{t('user_profile_email_label')}</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBaseClasses} placeholder={t('user_profile_email_placeholder')} disabled />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">{t('user_profile_phone_label')}</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputBaseClasses} placeholder={t('user_profile_phone_placeholder')} />
          </div>
          <div>
            <label htmlFor="otherDetails" className="block text-sm font-medium text-slate-300 mb-1">{t('user_profile_other_details_label')}</label>
            <textarea id="otherDetails" value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)} rows={3} className={inputBaseClasses} placeholder={t('user_profile_other_details_placeholder')} />
          </div>

          <div className="flex justify-end pt-3 space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">{t('cancel_button')}</Button>
            <Button type="submit" variant="primary">{t('user_profile_save_button')}</Button>
          </div>
        </form>

        {accessLevel === 'mindset_only' && (
          <div className="pt-5 border-t border-slate-700 space-y-3">
            <h4 className="text-lg font-semibold text-blue-400">{t('user_profile_unlock_title')}</h4>
            <p className="text-sm text-slate-400">{t('user_profile_unlock_description')}</p>
            {unlockError && <p className="text-sm text-red-400">{unlockError}</p>}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={unlockCode}
                onChange={(e) => { setUnlockCode(e.target.value); setUnlockError(null); }}
                placeholder={t('auth_unlock_code_placeholder')}
                className={inputBaseClasses}
              />
              <Button onClick={handleUnlockAttempt} variant="secondary">{t('user_profile_unlock_button')}</Button>
            </div>
            <p className="text-xs text-slate-400 pt-2">
                {contactInfo.intro}
                {contactInfo.email && (
                    <a href={`mailto:${contactInfo.email}`} className="font-semibold text-blue-400 hover:underline ml-1">
                        {contactInfo.email}
                    </a>
                )}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
  </svg>
);