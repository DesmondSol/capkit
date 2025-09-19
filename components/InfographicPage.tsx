

import React, { useState } from 'react';
import { TranslationKey, Testimonial } from '../types';
import { Language } from '../types';
import { TESTIMONIALS_DATA } from '../constants';
import { Modal } from './common/Modal';
import { Button } from './common/Button';

interface InfographicPageProps {
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

const InfographicPage: React.FC<InfographicPageProps> = ({ language, t }) => {
  const [selectedItem, setSelectedItem] = useState<{ type: 'testimonial', data: Testimonial } | null>(null);

  const renderModalContent = () => {
    if (!selectedItem) return null;
    const testimonial = selectedItem.data;
    return (
        <div>
            <div className="flex flex-col items-center text-center mb-4">
            <img src={testimonial.photoUrl} alt={testimonial.authorName} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-slate-600" />
            <h4 className="text-xl font-bold text-slate-100">{testimonial.authorName}</h4>
            <p className="text-sm font-medium text-slate-400">{testimonial.authorTitle}</p>
            </div>
            <blockquote className="text-lg italic text-slate-300 border-l-4 border-blue-500 pl-4 py-2">
            "{testimonial.quote}"
            </blockquote>
        </div>
    );
  };

  const features = [
    { icon: '🚀', titleKey: 'capkit_feature_1_title', descKey: 'capkit_feature_1_desc' },
    { icon: '🛠️', titleKey: 'capkit_feature_2_title', descKey: 'capkit_feature_2_desc' },
    { icon: '🤝', titleKey: 'capkit_feature_3_title', descKey: 'capkit_feature_3_desc' },
  ];
  
  const tools = ["Business Canvas", "Financial Projections", "Persona Builder", "Investor CRM", "Market Research", "Legal Docs", "Pitch Refiner", "Sales Pipeline", "And 20+ more..."];

  return (
    <div className="text-slate-100 font-inter w-full overflow-y-auto h-full bg-slate-900 -m-4 md:-m-8">
      <div className="relative">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 px-4 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(7, 59, 76, 0.8), rgba(7, 59, 76, 1)), url(https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop)` }}>
          <div className="container mx-auto max-w-4xl">
            {/* FIX: Casted string literal to TranslationKey type */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{t('capkit_hero_title' as TranslationKey)}</h1>
            {/* FIX: Casted string literal to TranslationKey type */}
            <p className="text-lg md:text-xl font-light text-slate-200 mb-8">{t('capkit_hero_subtitle' as TranslationKey)}</p>
            {/* FIX: Casted string literal to TranslationKey type */}
            <Button variant="primary" size="lg">{t('capkit_hero_cta' as TranslationKey)}</Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-slate-800/50">
          <div className="container mx-auto px-4 text-center">
            {/* FIX: Casted string literal to TranslationKey type */}
            <h2 className="text-3xl font-bold text-white mb-12">{t('capkit_why_title' as TranslationKey)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map(feature => (
                  <div key={feature.titleKey} className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 hover:border-blue-500 hover:-translate-y-2 transition-transform">
                      <div className="text-5xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-slate-100 mb-2">{t(feature.titleKey as TranslationKey)}</h3>
                      <p className="text-slate-400">{t(feature.descKey as TranslationKey)}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Toolkit Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                {/* FIX: Casted string literal to TranslationKey type */}
                <h2 className="text-3xl font-bold text-white mb-4">{t('capkit_toolkit_title' as TranslationKey)}</h2>
                {/* FIX: Casted string literal to TranslationKey type */}
                <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">{t('capkit_toolkit_subtitle' as TranslationKey)}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {tools.map(tool => (
                        <span key={tool} className="bg-slate-700 text-slate-200 px-4 py-2 rounded-full text-sm font-medium">{tool}</span>
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-slate-800/50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">{t('infographic_testimonials_title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {TESTIMONIALS_DATA.map(testimonial => (
                    <div key={testimonial.id} className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105" onClick={() => setSelectedItem({ type: 'testimonial', data: testimonial })}>
                    <img src={testimonial.photoUrl} alt={testimonial.authorName} className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-slate-600" />
                    <blockquote className="text-slate-300 italic flex-grow">
                        "{testimonial.quote.substring(0, 120)}..."
                    </blockquote>
                    <div className="mt-4 font-bold text-slate-100">{testimonial.authorName}</div>
                    <div className="text-sm text-slate-400">{testimonial.authorTitle}</div>
                    </div>
                ))}
                </div>
            </div>
        </section>

        {/* By Founders, For Founders Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    {/* FIX: Casted string literal to TranslationKey type */}
                    <h2 className="text-3xl font-bold text-white mb-4">{t('capkit_byfounder_title' as TranslationKey)}</h2>
                    {/* FIX: Casted string literal to TranslationKey type */}
                    <p className="text-lg text-slate-400 mb-4">{t('capkit_byfounder_desc1' as TranslationKey)}</p>
                    {/* FIX: Casted string literal to TranslationKey type */}
                    <p className="text-lg text-slate-400">{t('capkit_byfounder_desc2' as TranslationKey)}</p>
                </div>
                 <div className="flex justify-center">
                    <img src="https://images.unsplash.com/photo-1618499092419-8b0b0a88483a?q=80&w=1887&auto=format&fit=crop" alt="Founder working" className="rounded-xl shadow-2xl object-cover h-80 w-80 border-4 border-slate-700"/>
                 </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-[#118AB2] to-[#06D6A0]">
            <div className="container mx-auto px-4 text-center">
                {/* FIX: Casted string literal to TranslationKey type */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('capkit_finalcta_title' as TranslationKey)}</h2>
                {/* FIX: Casted string literal to TranslationKey type */}
                <Button variant="secondary" size="lg" className="bg-white text-slate-900 hover:bg-slate-200">{t('capkit_hero_cta' as TranslationKey)}</Button>
            </div>
        </section>

        <footer className="text-center py-8">
            <div className="text-2xl font-bold text-white tracking-wider cursor-pointer mb-2">Capkit</div>
            <p className="text-slate-400 text-sm">{t('infographic_footer_copyright')}</p>
            <p className="text-slate-400 text-sm">{t('infographic_footer_address')}</p>
        </footer>
      </div>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={t('testimonial_modal_title')} size="lg">
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default InfographicPage;
