
import React, { useState, useEffect } from 'react';
import { Button } from './common/Button';
import { Language, TranslationKey } from '../types';
import { Modal } from './common/Modal';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from './firebase';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear state when switching views or opening modal
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
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
      case 'auth/popup-closed-by-user':
        return language === 'am' ? 'የመግቢያ ሂደቱ ተቋርጧል።' : 'Sign-in cancelled by user.';
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

  const handleSuccess = (userEmail: string, accessLevel: 'full' | 'mindset_only') => {
    setSuccessMessage(language === 'am' ? 'በተሳካ ሁኔታ ገብተዋል! በመምራት ላይ...' : 'Successfully logged in! Redirecting...');
    setTimeout(() => {
        onLoginSuccess(userEmail, accessLevel);
    }, 1500); // 1.5 second delay to show success message
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
      handleSuccess(userCredential.user.email!, accessLevel);
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(getFriendlyErrorMessage(err.code));
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
      handleSuccess(userCredential.user.email!, 'mindset_only'); 
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(getFriendlyErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        handleSuccess(userCredential.user.email!, 'mindset_only');
    } catch (err: any) {
        console.error("Google Login Error:", err);
        setError(getFriendlyErrorMessage(err.code));
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
        
        {successMessage && (
            <div className="mb-6 bg-green-900/30 border border-green-500/50 rounded-lg p-3 flex items-center justify-center space-x-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-200 text-sm font-medium">{successMessage}</p>
            </div>
        )}

        <div className="space-y-6">
            <button
                onClick={handleGoogleLogin}
                disabled={isLoading || !!successMessage}
                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white disabled:opacity-70 disabled:cursor-not-allowed mb-6"
            >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isLoginView ? (language === 'am' ? 'በ Google ይግቡ' : 'Sign in with Google') : (language === 'am' ? 'በ Google ይመዝገቡ' : 'Sign up with Google')}
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">
                        {language === 'am' ? 'ወይም በኢሜል ይቀጥሉ' : 'Or continue with email'}
                    </span>
                </div>
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
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading || !!successMessage}>
                {isLoading && !successMessage ? (
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
        </div>

        <div className="text-center mt-6">
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); setSuccessMessage(null); }} className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                {isLoginView ? t('auth_switch_to_signup') : t('auth_switch_to_login')}
            </button>
        </div>
    </Modal>
  );
};
