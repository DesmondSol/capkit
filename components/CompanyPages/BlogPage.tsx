
import React from 'react';
import { motion } from 'framer-motion';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const blogPosts = [
  {
    id: 1,
    title: "Navigating the Ethiopian Startup Ecosystem in 2025",
    excerpt: "A comprehensive guide to the regulatory changes, funding opportunities, and emerging hubs in Addis Ababa.",
    author: "Solomon T.",
    date: "Oct 15, 2025",
    category: "Ecosystem"
  },
  {
    id: 2,
    title: "5 Common Mistakes Early-Stage Founders Make",
    excerpt: "We analyzed data from over 500 startups on Capkit to find out why some fail while others scale.",
    author: "Fanaye Team",
    date: "Sep 28, 2025",
    category: "Advice"
  },
  {
    id: 3,
    title: "Understanding Unit Economics for Fintechs",
    excerpt: "Why CAC and LTV matter more than vanity metrics when you are pitching to serious investors.",
    author: "Liya K.",
    date: "Sep 10, 2025",
    category: "Finance"
  },
  {
    id: 4,
    title: "The Rise of AgriTech in East Africa",
    excerpt: "How technology is transforming the agricultural value chain and creating new opportunities for innovation.",
    author: "Fanaye Team",
    date: "Aug 22, 2025",
    category: "Trends"
  },
  {
    id: 5,
    title: "Product-Market Fit: The Ethiopia Edition",
    excerpt: "Applying global lean startup methodologies to the unique constraints and behaviors of the Ethiopian consumer.",
    author: "Solomon T.",
    date: "Aug 05, 2025",
    category: "Product"
  },
  {
    id: 6,
    title: "Capkit V2.0 Release Notes",
    excerpt: "Introducing AI-powered pitch refinement, automated legal docs, and more features to supercharge your workflow.",
    author: "Engineering Team",
    date: "Jul 15, 2025",
    category: "Product Update"
  }
];

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  
  const handleReadArticle = (title: string) => {
    alert(`Full article "${title}" coming soon!`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <div className="text-center mb-16 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fanaye <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Insights</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              News, strategies, and stories for the Ethiopian entrepreneur.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-xl group flex flex-col h-full"
              >
                <div className="h-48 bg-slate-700/50 relative overflow-hidden group-hover:bg-slate-700 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                  <span className="absolute top-4 right-4 bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-blue-500/20">
                    {post.category}
                  </span>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <button 
                    onClick={() => handleReadArticle(post.title)}
                    className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all mt-auto cursor-pointer"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};
