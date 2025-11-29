import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

interface RoadmapPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const roadmapData = [
  {
    quarter: "Q1 2025",
    status: "Completed",
    items: [
      "Launch of Capkit Beta",
      "Core Strategy & Business Canvas Tools",
      "Market Research Accelerator V1",
      "Basic Financial Modeling"
    ]
  },
  {
    quarter: "Q2 2025",
    status: "In Progress",
    current: true,
    items: [
      "Investor CRM & Pipeline Management",
      "Legal Document Automation (Ethiopian Context)",
      "Mobile-Responsive Design Overhaul",
      "Amharic Language Support (Beta)"
    ]
  },
  {
    quarter: "Q3 2025",
    status: "Planned",
    items: [
      "Mentor Matching Platform",
      "Advanced AI Co-Founder Chatbot",
      "Offline Mode for Low-Connectivity Areas",
      "Integration with Telebirr & Chapa APIs"
    ]
  },
  {
    quarter: "Q4 2025",
    status: "Planned",
    items: [
      "Native Mobile App (iOS & Android)",
      "Founder Community Forum",
      "Live Pitch Practice with AI Analysis",
      "Marketplace for Service Providers"
    ]
  }
];

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          <div className="text-center mb-16 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Product Roadmap</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our vision for the future of Capkit. See what we've built and what's coming next to empower Ethiopian entrepreneurs.
            </p>
          </div>

          <div className="relative mb-20">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-12">
              {roadmapData.map((phase, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={phase.quarter}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row gap-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-slate-900 z-10 -translate-x-1/2 mt-6 hidden md:block
                      ${phase.status === 'Completed' ? 'bg-emerald-500' : phase.current ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-600'}`}
                    ></div>

                    {/* Content Card */}
                    <div className="flex-1"></div> {/* Spacer */}
                    <div className="flex-1">
                      <div className={`bg-slate-800/50 p-6 rounded-2xl border backdrop-blur-sm ${phase.current ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-slate-700'} relative`}>
                        {phase.current && (
                          <span className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            Current Focus
                          </span>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-2xl font-bold text-slate-100">{phase.quarter}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-md font-medium border
                            ${phase.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              phase.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-slate-700 text-slate-400 border-slate-600'}`}
                          >
                            {phase.status}
                          </span>
                        </div>

                        <ul className="space-y-3">
                          {phase.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                              {phase.status === 'Completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              ) : phase.status === 'In Progress' ? (
                                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                              )}
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="text-center bg-slate-800/50 rounded-2xl p-8 border border-slate-700 backdrop-blur-sm mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Have a feature request?</h2>
            <p className="text-slate-400 mb-6">We build for you. Let us know what tools would help your startup succeed.</p>
            <Button onClick={() => onNavigate(Page.BUILD, SubPage.PRODUCT_DESIGN)} variant="secondary">
              Submit Feedback <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};