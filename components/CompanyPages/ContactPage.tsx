
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface ContactPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset status after a delay
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <div className="text-center mb-16 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Touch</span></h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Have questions about Capkit or Fanaye Technologies? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center gap-6 backdrop-blur-sm hover:border-blue-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Email Us</h3>
                  <a href="mailto:cappkit@gmail.com" className="text-slate-400 hover:text-blue-400 transition-colors">cappkit@gmail.com</a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center gap-6 backdrop-blur-sm hover:border-green-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Call Us</h3>
                  <a href="tel:+251923214663" className="text-slate-400 hover:text-green-400 transition-colors">0923214663</a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center gap-6 backdrop-blur-sm hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">WhatsApp</h3>
                  <a href="https://wa.me/251923214663" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">Chat on WhatsApp (0923214663)</a>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center gap-6 backdrop-blur-sm hover:border-purple-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                  <p className="text-slate-400">Addis Ababa, Ethiopia</p>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 p-8 rounded-2xl border border-slate-700 h-full"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Send a Message</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Your name" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="your@email.com" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="How can we help you?" 
                    required
                  />
                </div>
                <Button 
                  className="w-full" 
                  size="lg" 
                  variant={formStatus === 'success' ? 'primary' : 'primary'}
                  type="submit"
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                >
                  {formStatus === 'submitting' ? (
                    'Sending...'
                  ) : formStatus === 'success' ? (
                    <>Message Sent <CheckCircle className="ml-2 w-4 h-4" /></>
                  ) : (
                    <>Send Message <Send className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};
