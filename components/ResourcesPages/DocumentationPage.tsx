import React from 'react';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { Book, Layout, Code, FileText, ArrowRight } from 'lucide-react';

interface DocumentationPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const guides = [
  {
    title: "Platform Overview",
    description: "Learn the basics of navigation and setting up your startup profile.",
    icon: Layout,
    linkPage: Page.START,
    linkSubPage: SubPage.MINDSET
  },
  {
    title: "Business Canvas Guide",
    description: "A step-by-step walkthrough on how to fill out your Lean Canvas using AI.",
    icon: FileText,
    linkPage: Page.START,
    linkSubPage: SubPage.STRATEGY
  },
  {
    title: "Financial Modeling 101",
    description: "Understanding inputs for the projection generator and burn rate calculator.",
    icon: Code,
    linkPage: Page.BUILD,
    linkSubPage: SubPage.ECONOMICS
  },
  {
    title: "Legal & Compliance",
    description: "How to use the document automation tool for Ethiopian legal contracts.",
    icon: Book,
    linkPage: Page.GROW,
    linkSubPage: SubPage.LEGAL
  }
];

export const DocumentationPage: React.FC<DocumentationPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <div className="text-center mb-16 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to know about using Capkit to build your startup.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="hidden md:block col-span-1">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 sticky top-24 backdrop-blur-sm">
                <h3 className="font-bold text-white mb-4">Contents</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="text-blue-400 font-medium cursor-pointer border-l-2 border-blue-400 pl-3 -ml-3">Getting Started</li>
                  <li className="hover:text-white cursor-pointer transition-colors pl-3">Account Management</li>
                  <li className="hover:text-white cursor-pointer transition-colors pl-3">Start Phase Tools</li>
                  <li className="hover:text-white cursor-pointer transition-colors pl-3">Build Phase Tools</li>
                  <li className="hover:text-white cursor-pointer transition-colors pl-3">Grow Phase Tools</li>
                  <li className="hover:text-white cursor-pointer transition-colors pl-3">API Reference</li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-3 md:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-6 text-white">Tool Guides</h2>
                <div className="grid gap-6">
                  {guides.map((guide, i) => (
                    <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group hover:shadow-lg"
                         onClick={() => onNavigate(guide.linkPage, guide.linkSubPage)}>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-blue-500/10 transition-colors border border-slate-700 group-hover:border-blue-500/30">
                          <guide.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {guide.title}
                          </h3>
                          <p className="text-slate-400 text-sm">{guide.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 text-white">Quick Start Video</h2>
                <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform z-10 shadow-xl">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1" />
                  </div>
                  <span className="absolute bottom-4 left-4 text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm">Capkit Platform Tour (3:45)</span>
                </div>
              </section>
            </div>
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};