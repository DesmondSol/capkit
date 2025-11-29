import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import {
  Search,
  LayoutGrid,
  Calculator,
  UserCircle,
  Users,
  FileText,
  Target,
  Calendar,
  Kanban,
  PieChart,
  Briefcase,
  MessageSquare,
  Lightbulb,
  Rocket,
  Database,
  BarChart3,
  ArrowRight
} from 'lucide-react';

interface ToolsPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const allTools = [
  { icon: LayoutGrid, name: "Business Canvas", category: "Strategy", description: "Map out your entire business model on one page.", linkPage: Page.START, linkSubPage: SubPage.STRATEGY },
  { icon: Calculator, name: "Financial Projections", category: "Finance", description: "Generate 3-month forecasts and track burn rate.", linkPage: Page.BUILD, linkSubPage: SubPage.ECONOMICS },
  { icon: UserCircle, name: "Persona Builder", category: "Marketing", description: "Create detailed profiles of your ideal customers.", linkPage: Page.START, linkSubPage: SubPage.STRATEGY },
  { icon: Users, name: "Investor CRM", category: "Fundraising", description: "Track investor relationships and funding stages.", linkPage: Page.GROW, linkSubPage: SubPage.INVESTMENT },
  { icon: Search, name: "Market Research", category: "Strategy", description: "Validate your market with AI-generated questions.", linkPage: Page.START, linkSubPage: SubPage.RESEARCH },
  { icon: FileText, name: "Legal Docs", category: "Legal", description: "Automate NDAs, contracts, and agreements.", linkPage: Page.GROW, linkSubPage: SubPage.LEGAL },
  { icon: Target, name: "Pitch Refiner", category: "Fundraising", description: "Craft compelling pitches for investors.", linkPage: Page.START, linkSubPage: SubPage.COPYWRITING },
  { icon: Calendar, name: "Marketing Planner", category: "Marketing", description: "Schedule social media posts and campaigns.", linkPage: Page.START, linkSubPage: SubPage.COPYWRITING },
  { icon: Kanban, name: "Action Board", category: "Operations", description: "Manage product development tasks visually.", linkPage: Page.BUILD, linkSubPage: SubPage.PRODUCT_DESIGN },
  { icon: PieChart, name: "Sales Pipeline", category: "Sales", description: "Visualize and manage your sales leads.", linkPage: Page.BUILD, linkSubPage: SubPage.SALES },
  { icon: Briefcase, name: "Cap Table", category: "Finance", description: "Manage equity distribution and shareholders.", linkPage: Page.GROW, linkSubPage: SubPage.INVESTMENT },
  { icon: MessageSquare, name: "AI Co-Founder", category: "Strategy", description: "Get 24/7 advice on any business topic.", linkPage: Page.START, linkSubPage: SubPage.MINDSET },
  { icon: Lightbulb, name: "Idea Validator", category: "Strategy", description: "Test your assumptions before building.", linkPage: Page.START, linkSubPage: SubPage.MINDSET },
  { icon: Rocket, name: "Launch Checklist", category: "Operations", description: "Ensure nothing is missed before launch.", linkPage: Page.GROW, linkSubPage: SubPage.CHECKLISTS },
  { icon: Database, name: "Data Room", category: "Fundraising", description: "Organize documents for due diligence.", linkPage: Page.GROW, linkSubPage: SubPage.INVESTMENT },
  { icon: BarChart3, name: "Unit Economics", category: "Finance", description: "Calculate CAC, LTV, and margins.", linkPage: Page.BUILD, linkSubPage: SubPage.ECONOMICS },
];

const categories = ["All", "Strategy", "Finance", "Marketing", "Operations", "Legal", "Fundraising", "Sales"];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          <div className="text-center mb-12 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">The Toolkit</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Explore our collection of 30+ tools designed to help you build, launch, and grow your startup.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 hover:shadow-lg transition-all group flex flex-col h-full backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-slate-300">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-700/50 rounded-md text-slate-400 border border-slate-600">
                    {tool.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors text-white">{tool.name}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{tool.description}</p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(tool.linkPage, tool.linkSubPage)}
                  className="w-full justify-between group-hover:border-blue-500/50 group-hover:text-blue-300"
                >
                  Launch Tool <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-xl">No tools found matching your criteria.</p>
              <button
                onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
                className="text-blue-400 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};