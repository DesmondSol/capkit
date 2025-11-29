import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Page, SubPage } from '../../types';
import { 
  Zap, 
  Target, 
  Shield, 
  Users, 
  Globe, 
  BarChart3, 
  Lightbulb, 
  Hammer, 
  Rocket, 
  ArrowRight,
  CheckCircle,
  LayoutGrid
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const featuresList = [
  {
    icon: Lightbulb,
    title: "Start Phase",
    description: "Validate your idea and build a solid foundation.",
    items: [
      "AI Business Canvas Generator",
      "Customer Persona Builder",
      "Market Research Accelerator",
      "Founder Mindset Assessment"
    ]
  },
  {
    icon: Hammer,
    title: "Build Phase",
    description: "Turn your concept into a tangible product.",
    items: [
      "Product Feature Planner",
      "Financial Projections & Modeling",
      "Unit Economics Calculator",
      "Sales & Go-to-Market Strategy"
    ]
  },
  {
    icon: Rocket,
    title: "Grow Phase",
    description: "Scale your operations and prepare for investment.",
    items: [
      "Legal Document Automation",
      "Cap Table Management",
      "Investor CRM Pipeline",
      "Operational Checklists"
    ]
  },
  {
    icon: Globe,
    title: "Localized for Ethiopia",
    description: "Tools tailored to the local market context.",
    items: [
      "Amharic Language Support",
      "Local Compliance Checklists",
      "Market-Specific Templates",
      "Community Integration"
    ]
  }
];

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Powerful Features for Every Stage
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From ideation to investment, Capkit provides a comprehensive suite of AI-powered tools designed to accelerate your startup journey.
            </p>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {featuresList.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-700 mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Founders Choose Capkit</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">AI-Powered Efficiency</h4>
                    <p className="text-slate-400">Save hundreds of hours on research and documentation with our integrated Gemini AI.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Investor Ready</h4>
                    <p className="text-slate-400">Generate professional, standardized documents that investors trust and expect.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <LayoutGrid className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">All-in-One Platform</h4>
                    <p className="text-slate-400">Stop switching between spreadhseets, docs, and diverse tools. Manage everything in one place.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 flex items-center justify-center border border-slate-600/50 min-h-[300px]">
               <div className="text-center">
                  <BarChart3 className="w-24 h-24 text-slate-300 mx-auto mb-4 opacity-80" />
                  <p className="text-slate-300 font-medium">Interactive Dashboards & Analytics</p>
               </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience these features?</h2>
          <Button 
            size="lg" 
            variant="primary" 
            onClick={() => onNavigate(Page.START, SubPage.MINDSET)}
            className="rounded-full px-8 py-4 text-lg"
          >
            Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
