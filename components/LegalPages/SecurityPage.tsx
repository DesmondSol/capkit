import React from 'react';
import { Button } from '../common/Button';
import { Page, SubPage } from '../../types';
import { ArrowLeft, Shield, Lock, Server } from 'lucide-react';

interface SecurityPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => onNavigate(null, null)} 
          className="mb-8"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Home
        </Button>
        
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Shield className="w-10 h-10 text-emerald-400" /> Security
        </h1>
        <p className="text-xl text-slate-400 mb-12">
          At Capkit, we take the security of your data seriously. We use industry-standard security measures to protect your information.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <Lock className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Data Encryption</h3>
            <p className="text-slate-400">All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher. Data at rest is encrypted using AES-256 standards.</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <Server className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Infrastructure</h3>
            <p className="text-slate-400">Our servers are hosted in world-class data centers provided by Google Cloud Platform, ensuring high availability and physical security.</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Access Control</h2>
            <p>Access to production data is strictly limited to authorized personnel who need it to perform their job duties. We use multi-factor authentication (MFA) for all internal access.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Regular Audits</h2>
            <p>We perform regular security audits and vulnerability assessments to identify and address potential risks. We also use automated tools to monitor our infrastructure for suspicious activity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Backup</h2>
            <p>We perform regular backups of your data to ensure it can be restored in the event of a disaster. Backups are stored in a secure, geographically separate location.</p>
          </section>
          
          <section className="bg-blue-900/20 p-6 rounded-xl border border-blue-800/50 mt-8">
            <h2 className="text-xl font-semibold text-white mb-2">Reporting Security Issues</h2>
            <p>If you believe you have found a security vulnerability in Capkit, please contact us immediately at <a href="mailto:security@capkit.et" className="text-blue-400 hover:underline">security@capkit.et</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};