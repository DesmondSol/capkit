
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { ArrowRight, Target, Heart, Zap, Globe } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          {/* Hero Section */}
          <div className="text-center mb-20 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Who We Are</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Fanaye Technologies</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Building the digital infrastructure for the next generation of Ethiopian entrepreneurs.
              </p>
            </motion.div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
              <p className="text-slate-400 leading-relaxed">
                To democratize access to world-class business tools and knowledge for Ethiopian founders. We believe that talent is equally distributed, but opportunity is not. Fanaye Technologies exists to bridge that gap through innovation and education.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
              <p className="text-slate-400 leading-relaxed">
                A thriving, self-sustaining Ethiopian startup ecosystem where anyone with a great idea has the resources, mentorship, and technology to turn it into a global business.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: "Founder First", desc: "We build everything with the entrepreneur's journey in mind. Your success is our success." },
                { icon: Zap, title: "Speed & Agility", desc: "The market moves fast, and so do we. We iterate quickly to bring you the best tools." },
                { icon: Globe, title: "Local Context", desc: "Global standards, locally applied. We understand the unique challenges of the Ethiopian market." }
              ].map((value, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center hover:bg-slate-800 transition-colors"
                >
                  <div className="w-10 h-10 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-white">{value.title}</h4>
                  <p className="text-slate-400 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team CTA */}
          <div className="text-center bg-slate-800/50 p-12 rounded-3xl border border-blue-500/20 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-white">Join the Movement</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              Whether you are a founder, investor, or partner, there is a place for you in the Fanaye Technologies ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => onNavigate(Page.CONTACT, null)} variant="primary" size="lg" className="rounded-full">
                Contact Us <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button onClick={() => onNavigate(Page.START, SubPage.MINDSET)} variant="outline" size="lg" className="rounded-full">
                Start Building
              </Button>
            </div>
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};
