

import React, { useState, useEffect, useRef } from 'react';
import { NavItem, Page, SubPage, Language, UserProfile } from '../types';
import { TranslationKey } from '../types';
import { Button } from './common/Button';

interface NavbarProps {
  navItems: NavItem[];
  onSelectPage: (page: Page | null, subPage: SubPage | null) => void;
  activeSubPage: SubPage | null;
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
  onOpenProfileModal: () => void;
  accessLevel: 'full' | 'mindset_only';
  onLogout: () => void;
  isLoggedIn: boolean;
}

const useClickOutside = <T extends HTMLElement,>(ref: React.RefObject<T>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export const Navbar: React.FC<NavbarProps> = ({ 
    navItems, 
    onSelectPage, 
    activeSubPage, 
    currentLanguage, 
    changeLanguage, 
    t,
    userProfile,
    onOpenProfileModal,
    accessLevel,
    onLogout,
    isLoggedIn
}) => {
  const [openDropdown, setOpenDropdown] = useState<Page | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const mainNavDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null); 

  useClickOutside(mainNavDropdownRef, () => setOpenDropdown(null));
  useClickOutside(langDropdownRef, () => setIsLangDropdownOpen(false));
  useClickOutside(profileDropdownRef, () => setIsProfileDropdownOpen(false));


  const handleNavClick = (page: Page) => {
    setOpenDropdown(openDropdown === page ? null : page);
  };

  const handleSubItemClick = (page: Page, subPage: SubPage) => {
    onSelectPage(page, subPage);
    setOpenDropdown(null);
  };

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  return (
    <nav className="bg-slate-900 text-slate-200 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <button
          onClick={() => onSelectPage(null, null)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md p-1"
          aria-label={t('logo_alt_text')}
        >
          <div className="text-2xl font-bold text-white tracking-wider cursor-pointer">
            Capkit
          </div>
        </button>
        
        <div className="flex-grow flex justify-center items-center space-x-1 sm:space-x-2" ref={mainNavDropdownRef}>
          {navItems.map((item) => {
            const isPageLocked = !isLoggedIn && item.label !== Page.START;
            return (
              <div key={item.label} className="relative">
                <button
                  onClick={() => onSelectPage(item.label, null)}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  className={`px-3 py-2 sm:px-4 text-base sm:text-lg font-medium rounded-md hover:bg-slate-700/70 hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                    ${openDropdown === item.label ? 'bg-slate-700 text-blue-300' : ''}`}
                >
                  {t(item.label as TranslationKey, item.label)}
                </button>
                {openDropdown === item.label && (
                  <div 
                    className="absolute mt-2 w-auto max-w-[90vw] sm:max-w-sm md:w-56 bg-slate-800 rounded-md shadow-2xl z-20 right-0 lg:left-0 py-1 border border-slate-700"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.subItems.map((subItem) => {
                      const isSubItemLocked = isLoggedIn && accessLevel !== 'full' && subItem !== SubPage.MINDSET;
                      return (
                        <a
                          key={subItem}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isSubItemLocked) handleSubItemClick(item.label, subItem);
                          }}
                          className={`flex items-center justify-between px-4 py-3 text-sm transition-colors duration-150 whitespace-normal
                            ${activeSubPage === subItem ? 'bg-blue-600 text-white' : 'text-slate-300'}
                            ${isSubItemLocked ? 'opacity-50 cursor-not-allowed text-slate-500' : 'hover:bg-slate-700 hover:text-blue-300'}`}
                        >
                          {t(subItem as TranslationKey, subItem)}
                          {isSubItemLocked && <LockIcon className="h-4 w-4" />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="px-2 py-1 sm:px-3 text-sm sm:text-base font-medium rounded-md hover:bg-slate-700/70 hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center"
            >
              {currentLanguage === 'am' ? t('lang_am_short') : t('lang_en_short')}
              <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-200 ${isLangDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute mt-2 w-auto max-w-[70vw] sm:max-w-[12rem] md:w-36 bg-slate-800 rounded-md shadow-2xl z-20 right-0 py-1 border border-slate-700">
                {(['en', 'am'] as Language[]).map((lang) => (
                  <a key={lang} href="#" onClick={(e) => { e.preventDefault(); handleLanguageChange(lang); }}
                    className={`block px-4 py-3 text-sm transition-colors duration-150 whitespace-normal
                      ${currentLanguage === lang ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-blue-300'}`}
                  >{lang === 'am' ? t('lang_amharic') : t('lang_english')}</a>
                ))}
              </div>
            )}
          </div>
          
          {isLoggedIn && userProfile ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-600 hover:border-blue-500 transition-colors"
                  title={t('user_profile_button_tooltip')}
                >
                  {userProfile.photo ? (
                    <img src={userProfile.photo} alt={t('user_profile_button_tooltip')} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-slate-400" />
                  )}
              </button>
              {isProfileDropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-slate-800 rounded-md shadow-2xl z-20 right-0 py-1 border border-slate-700">
                      <a href="#" onClick={(e) => { e.preventDefault(); onOpenProfileModal(); setIsProfileDropdownOpen(false); }} className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-300">{t('user_profile_modal_title')}</a>
                      <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); setIsProfileDropdownOpen(false); }} className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-300">{t('user_profile_logout_button')}</a>
                  </div>
              )}
            </div>
          ) : (
             <Button variant="primary" size="sm" onClick={() => onSelectPage(Page.START, null)}>{t('navbar_login_button', 'Login / Sign Up')}</Button>
          )}

        </div>
      </div>
    </nav>
  );
};

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);
const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);