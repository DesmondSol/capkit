import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { Search, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

interface HelpCenterPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const faqs = [
  {
    category: "Getting Started",
    questions: [
      { q: "What is Capkit?", a: "Capkit is an all-in-one platform for Ethiopian entrepreneurs to validate ideas, build products, and prepare for investment using AI-powered tools." },
      { q: "Is Capkit free to use?", a: "Yes, the core tools in the Start and Build phases are completely free. We may introduce premium features for advanced growth tools in the future." },
      { q: "Do I need technical skills?", a: "Not at all. Our tools are designed for non-technical founders. The AI Co-founder can guide you through technical concepts in simple terms." }
    ]
  },
  {
    category: "Account & Security",
    questions: [
      { q: "How is my data secured?", a: "We use industry-standard encryption for all data. Your business plans and intellectual property are private and only accessible by you." },
      { q: "Can I export my data?", a: "Yes, most tools allow you to export your work as PDF documents. We are working on adding more formats like Word and Excel." }
    ]
  },
  {
    category: "Tools & Features",
    questions: [
      { q: "How does the AI Co-founder work?", a: "The AI uses Google's Gemini models, fine-tuned on startup methodologies. It acts as a consultant, answering questions and generating content based on your specific business context." },
      { q: "Can I invite my co-founders?", a: "Currently, collaboration features are in beta. You can share your account credentials (securely) or export reports to share with your team." }
    ]
  }
];

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-6 md:p-12">
          
          <div className="text-center mb-16 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">help?</span></h1>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for answers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-full py-4 pl-12 pr-6 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-lg backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-8 mb-20">
            {filteredFaqs.map((category, catIndex) => (
              <div key={category.category} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-blue-400 mb-4">{category.category}</h2>
                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const id = `${catIndex}-${index}`;
                    const isOpen = openIndex === id;
                    
                    return (
                      <div key={index} className="border-b border-slate-700/50 last:border-0">
                        <button 
                          onClick={() => toggleFAQ(id)}
                          className="w-full text-left py-4 flex justify-between items-center hover:text-blue-400 transition-colors focus:outline-none"
                        >
                          <span className="font-medium text-lg pr-4">{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>
                        <motion.div 
                          initial={false}
                          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-slate-400 pb-4 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-500">No results found for "{searchTerm}".</p>
              </div>
            )}
          </div>

          <div className="text-center bg-slate-800/50 p-8 rounded-2xl border border-blue-500/20 max-w-2xl mx-auto backdrop-blur-sm">
            <MessageCircle className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-slate-400 mb-6">Can't find the answer you're looking for? Please contact our friendly support team.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
              Get in Touch
            </button>
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};