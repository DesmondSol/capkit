

import React, { useState } from 'react';
import { Button } from './common/Button';
import { Language, TranslationKey, UserAuthData } from '../types';
import { Modal } from './common/Modal';

interface AuthPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, accessLevel: 'full' | 'mindset_only') => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

export const AuthPage: React.FC<AuthPageProps> = ({ isOpen, onClose, onLoginSuccess, t, language }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [unlockCode, setUnlockCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const users: UserAuthData[] = JSON.parse(localStorage.getItem('sparkUsers') || '[]');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError(t('auth_error_email_exists'));
      return;
    }

    const newUser: UserAuthData = {
      name,
      email,
      password, // Storing plaintext password - NOT secure, for demo purposes only
      accessLevel: unlockCode.toLowerCase() === 'demo' ? 'full' : 'mindset_only',
    };

    users.push(newUser);
    localStorage.setItem('sparkUsers', JSON.stringify(users));
    onLoginSuccess(newUser.email, newUser.accessLevel);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users: UserAuthData[] = JSON.parse(localStorage.getItem('sparkUsers') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      onLoginSuccess(user.email, user.accessLevel);
    } else {
      setError(t('auth_error_invalid_credentials'));
    }
  };

  const inputBaseClasses = "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-500";
  const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-2";

  const modalTitle = isLoginView ? t('auth_login_title') : t('auth_signup_title');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
        <div className="text-center mb-6 -mt-2">
            <p className="text-slate-300 mt-2">{isLoginView ? t('auth_login_subtitle') : t('auth_signup_subtitle')}</p>
        </div>
        
        <form onSubmit={isLoginView ? handleLogin : handleSignUp} className="space-y-6">
          {error && <p className="text-red-400 bg-red-900/30 text-center p-3 rounded-lg text-sm">{error}</p>}

          {!isLoginView && (
            <div>
              <label htmlFor="name" className={labelBaseClasses}>{t('auth_name_label')}</label>
              <input id="name" name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className={inputBaseClasses} />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className={labelBaseClasses}>{t('auth_email_label')}</label>
            <input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputBaseClasses} />
          </div>

          <div>
            <label htmlFor="password" className={labelBaseClasses}>{t('auth_password_label')}</label>
            <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputBaseClasses} />
          </div>

          {!isLoginView && (
            <div>
              <label htmlFor="unlockCode" className={labelBaseClasses}>{t('auth_unlock_code_label')}</label>
              <input id="unlockCode" name="unlockCode" type="text" value={unlockCode} onChange={e => setUnlockCode(e.target.value)} placeholder={t('auth_unlock_code_placeholder')} className={inputBaseClasses} />
            </div>
          )}

          <div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              {isLoginView ? t('auth_login_button') : t('auth_signup_button')}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                {isLoginView ? t('auth_switch_to_signup') : t('auth_switch_to_login')}
            </button>
        </div>
    </Modal>
  );
};
