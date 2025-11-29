
import React from 'react';
import { motion } from 'framer-motion';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { Briefcase, SearchX } from 'lucide-react';

interface CareersPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <div className="text-center mb-16 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Fanaye</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Help us build the operating system for Ethiopian startups.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-slate-800/50 p-12 rounded-2xl border border-slate-700 text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
                <Briefcase className="w-10 h-10 text-slate-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">No Open Positions</h2>
              <p className="text-slate-400 mb-8">
                We currently don't have any open roles at Fanaye Technologies. However, we are always looking for talented individuals who are passionate about the startup ecosystem.
              </p>
              
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 inline-block">
                <p className="text-sm text-slate-300">
                  Keep an eye on our social media or check back later for future opportunities in:
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {['Software Engineering', 'Product Management', 'Growth Marketing', 'Customer Success'].map(role => (
                    <span key={role} className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300 border border-slate-600">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};
