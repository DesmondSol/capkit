
import React, { useState, useEffect } from 'react';
import { Button } from './common/Button';
import { Language, TranslationKey } from '../types';
import { Modal } from './common/Modal';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from './firebase';

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
  const [isLoading, setIsLoading] = useState(false);

  // Clear errors when switching views
  useEffect(() => {
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
  }, [isLoginView, isOpen]);

  const getFriendlyErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return t('auth_error_email_exists', 'This email is already in use.');
      case 'auth/invalid-email':
        return language === 'am' ? 'የኢሜል አድራሻው የተሳሳተ ነው።' : 'Invalid email address format.';
      case 'auth/user-disabled':
        return language === 'am' ? 'ይህ መለያ ተሰናክሏል።' : 'This user account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return t('auth_error_invalid_credentials', 'Invalid email or password.');
      case 'auth/weak-password':
        return language === 'am' ? 'የይለፍ ቃል በጣም ደካማ ነው። ቢያንስ 6 ቁምፊዎችን ይጠቀሙ።' : 'Password is too weak. Please use at least 6 characters.';
      case 'auth/network-request-failed':
        return language === 'am' ? 'የኔትወርክ ችግር። እባክዎ ግንኙነትዎን ያረጋግጡ።' : 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return language === 'am' ? 'በጣም ብዙ ሙከራዎች። እባክዎ ቆየት ብለው ይሞክሩ።' : 'Too many failed attempts. Please try again later.';
      default:
        return t('auth_error_generic', 'An unexpected error occurred. Please try again.');
    }
  };

  const validateInputs = (): boolean => {
    if (!email.includes('@')) {
      setError(language === 'am' ? 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ።' : 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError(language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት።' : 'Password must be at least 6 characters long.');
      return false;
    }
    if (!isLoginView && name.trim().length === 0) {
      setError(language === 'am' ? 'እባክዎ ስምዎን ያስገቡ።' : 'Please enter your full name.');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name immediately
      if (auth.currentUser && name) {
          await updateProfile(auth.currentUser, { displayName: name });
      }
      
      const accessLevel = unlockCode.toLowerCase() === 'demo' ? 'full' : 'mindset_only';
      onLoginSuccess(userCredential.user.email!, accessLevel);
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user.email!, 'mindset_only'); 
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setIsLoading(false);
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
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start space-x-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {!isLoginView && (
            <div>
              <label htmlFor="name" className={labelBaseClasses}>{t('auth_name_label')}</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className={inputBaseClasses} 
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className={labelBaseClasses}>{t('auth_email_label')}</label>
            <input 
                id="email" 
                name="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className={inputBaseClasses} 
                placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className={labelBaseClasses}>{t('auth_password_label')}</label>
            <input 
                id="password" 
                name="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className={inputBaseClasses} 
                placeholder="••••••••"
            />
            {!isLoginView && <p className="text-xs text-slate-500 mt-1">{language === 'am' ? 'ቢያንስ 6 ቁምፊዎች' : 'Min. 6 characters'}</p>}
          </div>

          {!isLoginView && (
            <div>
              <label htmlFor="unlockCode" className={labelBaseClasses}>{t('auth_unlock_code_label')}</label>
              <input id="unlockCode" name="unlockCode" type="text" value={unlockCode} onChange={e => setUnlockCode(e.target.value)} placeholder={t('auth_unlock_code_placeholder')} className={inputBaseClasses} />
            </div>
          )}

          <div>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                  <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                  </span>
              ) : (
                  isLoginView ? t('auth_login_button') : t('auth_signup_button')
              )}
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
