import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './common/Button';
import { Page, SubPage } from '../types';
import {
  Rocket,
  MapPin,
  TrendingUp,
  Users,
  ArrowRight,
  ExternalLink,
  Search
} from 'lucide-react';

interface StartupsPageProps {
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

const startupsData = [
  {
    id: 1,
    name: "Sheba Fresh",
    tagline: "Farm to table in 24 hours",
    description: "Connecting rural farmers directly with urban consumers through an AI-powered logistics platform.",
    sector: "AgriTech",
    stage: "Seed",
    location: "Addis Ababa",
    logoColor: "bg-green-500",
    initials: "SF"
  },
  {
    id: 2,
    name: "Kafa Pay",
    tagline: "Digital payments for the unbanked",
    description: "Mobile-first payment gateway enabling merchants to accept payments via QR codes offline.",
    sector: "Fintech",
    stage: "Series A",
    location: "Addis Ababa",
    logoColor: "bg-blue-500",
    initials: "KP"
  },
  {
    id: 3,
    name: "Tana Logistics",
    tagline: "Last-mile delivery solved",
    description: "Crowdsourced delivery network for e-commerce businesses operating in East Africa.",
    sector: "Logistics",
    stage: "Pre-Seed",
    location: "Bahir Dar",
    logoColor: "bg-orange-500",
    initials: "TL"
  },
  {
    id: 4,
    name: "Medina Health",
    tagline: "Telemedicine for everyone",
    description: "Video consultations and prescription delivery for remote communities.",
    sector: "HealthTech",
    stage: "Seed",
    location: "Addis Ababa",
    logoColor: "bg-red-500",
    initials: "MH"
  },
  {
    id: 5,
    name: "Fidel AI",
    tagline: "Amharic NLP models",
    description: "Building the foundational large language models for Ethiopian languages.",
    sector: "AI / Deep Tech",
    stage: "Stealth",
    location: "Addis Ababa",
    logoColor: "bg-purple-500",
    initials: "FA"
  },
  {
    id: 6,
    name: "Gebeta Energy",
    tagline: "Solar solutions for SMEs",
    description: "Pay-as-you-go solar kits for small businesses facing power interruptions.",
    sector: "CleanTech",
    stage: "Pre-Seed",
    location: "Adama",
    logoColor: "bg-yellow-500",
    initials: "GE"
  }
];

const sectors = ["All", "Fintech", "AgriTech", "HealthTech", "Logistics", "AI / Deep Tech", "CleanTech"];

export const StartupsPage: React.FC<StartupsPageProps> = ({ onNavigate }) => {
  const [activeSector, setActiveSector] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStartups = startupsData.filter(startup => {
    const matchesSector = activeSector === "All" || startup.sector === activeSector;
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

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
            <span className="text-blue-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Capkit Ecosystem</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ethiopia's Rising <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Startups</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Discover the innovative companies building the future of Ethiopia. Backed by the Capkit community.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => onNavigate(Page.START, SubPage.MINDSET)} variant="primary" size="lg" className="rounded-full">
                Add Your Startup <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {sectors.map(sector => (
              <button
                key={sector}
                onClick={() => setActiveSector(sector)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSector === sector
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup, index) => (
            <motion.div
              key={startup.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-xl group flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${startup.logoColor}`}>
                    {startup.initials}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border
                    ${startup.stage === 'Seed' || startup.stage === 'Series A'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-700 text-slate-400 border-slate-600'
                    }`}
                  >
                    {startup.stage}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-1">{startup.name}</h3>
                <p className="text-blue-400 text-sm font-medium mb-3">{startup.tagline}</p>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{startup.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md">
                    <TrendingUp className="w-3 h-3 mr-1" /> {startup.sector}
                  </span>
                  <span className="flex items-center text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md">
                    <MapPin className="w-3 h-3 mr-1" /> {startup.location}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700 flex justify-between items-center group-hover:bg-slate-700/30 transition-colors">
                <span className="text-xs text-slate-500">Backed by Capkit</span>
                <button className="text-sm font-medium text-slate-300 group-hover:text-white flex items-center transition-colors">
                  View Profile <ExternalLink className="ml-1 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl">No startups found.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveSector("All"); }}
              className="text-blue-400 hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};