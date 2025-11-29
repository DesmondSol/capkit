import React from 'react';
import { Button } from '../common/Button';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
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

          <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
          <div className="text-sm text-slate-400 mb-8">Last Updated: October 2023</div>

          <div className="space-y-8 text-slate-300 leading-relaxed bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm mb-20">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>Welcome to Capkit. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Data We Collect</h2>
              <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
              <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: support@capkit.et</p>
            </section>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};