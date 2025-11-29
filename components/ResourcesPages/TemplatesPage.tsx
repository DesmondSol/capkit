import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { FileText, Download, FileSpreadsheet, Presentation } from 'lucide-react';
import { Button } from '../common/Button';

interface TemplatesPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const templates = [
  { name: "Pitch Deck Template", category: "Fundraising", format: "PPTX", icon: Presentation },
  { name: "Financial Model (SaaS)", category: "Finance", format: "XLSX", icon: FileSpreadsheet },
  { name: "Founder Agreement", category: "Legal", format: "DOCX", icon: FileText },
  { name: "Employment Contract (ET)", category: "Legal", format: "DOCX", icon: FileText },
  { name: "Marketing Plan", category: "Marketing", format: "DOCX", icon: FileText },
  { name: "One-Pager Template", category: "Fundraising", format: "PDF", icon: FileText },
  { name: "Cap Table Template", category: "Finance", format: "XLSX", icon: FileSpreadsheet },
  { name: "Product Roadmap", category: "Product", format: "PPTX", icon: Presentation },
];

const categories = ["All", "Fundraising", "Finance", "Legal", "Marketing", "Product"];

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = templates.filter(t => activeCategory === "All" || t.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <div className="text-center mb-12 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Library</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Download premium templates to save time and look professional.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-900 rounded-lg text-slate-300 group-hover:text-blue-400 transition-colors border border-slate-700 group-hover:border-blue-500/20">
                      <template.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-slate-900 rounded text-slate-500 border border-slate-700 font-mono">
                      {template.format}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-white mb-1">{template.name}</h3>
                  <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">{template.category}</p>
                </div>
                
                <Button variant="outline" size="sm" className="w-full justify-center group-hover:border-blue-500/50 group-hover:text-blue-400">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </motion.div>
            ))}
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};