import React from 'react';
import { Button } from '../common/Button';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-6 md:p-12">
          <Button
            variant="outline"
            onClick={() => onNavigate(null, null)}
            className="mb-8"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Home
          </Button>

          <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
          <div className="text-sm text-slate-400 mb-8">Last Updated: October 2023</div>

          <div className="space-y-8 text-slate-300 leading-relaxed bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm mb-20">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Capkit (“we,” “us” or “our”), concerning your access to and use of the Capkit website and application.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Intellectual Property Rights</h2>
              <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Representations</h2>
              <p>By using the Site, you represent and warrant that:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                <li>You are not a minor in the jurisdiction in which you reside.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Prohibited Activities</h2>
              <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Disclaimer</h2>
              <p>THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF.</p>
            </section>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};