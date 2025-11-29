
import React from 'react';
import { motion } from 'framer-motion';
import { Page, SubPage } from '../types';
import { Sparkles, MapPin, Coffee, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="py-16 px-6 border-t border-white/10 bg-slate-900/50 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center gap-2 mb-4" 
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate(null, null)}
              style={{ cursor: 'pointer' }}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-100">Capkit</span>
            </motion.div>
            <p className="text-slate-400 mb-4 max-w-xs">
              Powered by Fanaye Technologies. Empowering Ethiopian founders with tools to build the future.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate(Page.FEATURES, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.TOOLS, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Tools
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.ROADMAP, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.STARTUPS, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Startups Showcase
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate(Page.ABOUT, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.BLOG, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.CAREERS, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.CONTACT, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate(Page.HELP_CENTER, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.COMMUNITY, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Community
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.DOCUMENTATION, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Documentation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.TEMPLATES, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Templates
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate(Page.PRIVACY, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.TERMS, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Terms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate(Page.SECURITY, null)} className="text-slate-400 hover:text-blue-400 transition-colors text-sm text-left">
                  Security
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2025 Fanaye Technologies. All rights reserved.</p>

          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>May contain traces of</span>
            <Coffee className="w-4 h-4 text-blue-400" />
            <span>• Built with</span>
            <Heart className="w-4 h-4 text-blue-400" />
            <span>by </span>
            <a 
              href="https://www.linkedin.com/in/sol-tig/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-blue-400 transition-colors underline decoration-blue-500/30 hover:decoration-blue-500"
            >
              Solomon T.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
