import React from 'react';
import { Page, SubPage } from '../../types';
import { Footer } from '../Footer';
import { Users, MessageSquare, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '../common/Button';

interface CommunityPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const events = [
  {
    title: "Addis Tech Meetup",
    date: "Nov 15, 2025",
    type: "Networking",
    location: "Orbit Innovation Hub"
  },
  {
    title: "Pitch Perfect Workshop",
    date: "Nov 22, 2025",
    type: "Workshop",
    location: "Online (Zoom)"
  },
  {
    title: "Founder Stories: Coffee Chat",
    date: "Dec 05, 2025",
    type: "AMA Session",
    location: "Tomoca Coffee, Bole"
  }
];

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          
          <div className="text-center mb-16 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Capkit <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Community</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Connect with 500+ ambitious Ethiopian founders, mentors, and investors. Build your network, find your co-founder, and grow together.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Users, label: "Active Members", value: "500+" },
              { icon: MessageSquare, label: "Daily Messages", value: "2.5k" },
              { icon: Calendar, label: "Monthly Events", value: "4+" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center backdrop-blur-sm hover:border-blue-500/30 transition-colors">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Discord/Slack CTA */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-blue-500/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              <h3 className="text-2xl font-bold mb-4 text-white">Join our Discord</h3>
              <p className="text-slate-400 mb-8">
                The heartbeat of our community. Channels for #fundraising, #hiring, #tech-talk, and localized city chapters.
              </p>
              <Button className="w-full sm:w-auto" leftIcon={<ExternalLink className="w-4 h-4"/>}>
                Launch Discord
              </Button>
            </div>

            {/* Telegram CTA */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-sky-500/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              <h3 className="text-2xl font-bold mb-4 text-white">Telegram Channel</h3>
              <p className="text-slate-400 mb-8">
                Get daily startup news, grant opportunities, and quick updates delivered straight to your phone.
              </p>
              <Button variant="outline" className="w-full sm:w-auto" leftIcon={<ExternalLink className="w-4 h-4"/>}>
                Join Channel
              </Button>
            </div>
          </div>

          {/* Events */}
          <div className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
              <button className="text-blue-400 hover:underline text-sm font-medium">View Calendar</button>
            </div>
            
            <div className="grid gap-4">
              {events.map((event, i) => (
                <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/50 transition-colors backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-900 p-3 rounded-lg text-center min-w-[70px] border border-slate-700">
                      <span className="block text-xs text-slate-500 uppercase font-bold">{event.date.split(' ')[0]}</span>
                      <span className="block text-xl font-bold text-white">{event.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs border border-blue-500/20">{event.type}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-4 h-4"/>}>Register</Button>
                </div>
              ))}
            </div>
          </div>

        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};