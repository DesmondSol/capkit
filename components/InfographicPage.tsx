
// ... existing code ...
// (Only adding the export default at the very end if not present, or replacing the component definition slightly if simpler)

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from "framer-motion";
import { Button } from './common/Button';
import { TranslationKey, Language, Page, SubPage } from '../types';
import { Footer } from './Footer';
import {
  ArrowRight,
  Play,
  Rocket,
  Users,
  TrendingUp,
  Clock,
  Wrench,
  Zap,
  Shield,
  Globe,
  Search,
  LineChart,
  FileCheck,
  LayoutGrid,
  Calculator,
  UserCircle,
  FileText,
  Target,
  Calendar,
  Kanban,
  PieChart,
  Briefcase,
  MessageSquare,
  Lightbulb,
  Hammer,
  Database,
  BarChart3,
  Check,
  Quote,
  Heart,
  Sparkles
} from "lucide-react";
import { SEO } from './SEO';

// Declare Chart.js global variable
declare var Chart: any;

interface InfographicPageProps {
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  onNavigate: (page: Page | null, subPage: SubPage | null) => void;
}

// ==================== ANIMATED COUNTER ====================
function AnimatedCounter({ end, suffix = "", duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ==================== DATA ====================
const stats = [
  { value: 30, suffix: "+", label: "AI-Powered Tools" },
  { value: 500, suffix: "+", label: "Founders Empowered" },
  { value: 6, suffix: " months", label: "Idea to Launch" },
  { value: 98, suffix: "%", label: "Success Rate" },
];

const features = [
  {
    icon: Clock,
    title: "Save Time & Money",
    description: "Go from 0 to 1 faster. Our AI-powered tools replace expensive consultants and weeks of manual research.",
    highlight: "10x faster",
  },
  {
    icon: Wrench,
    title: "A Complete Toolkit",
    description: "From business canvases and financial models to legal docs and CRM, everything you need is in one place.",
    highlight: "30+ tools",
  },
  {
    icon: Users,
    title: "Community & Network",
    description: "You're not alone. Connect with fellow founders, mentors, and investors in the Capkit ecosystem.",
    highlight: "500+ founders",
  },
  {
    icon: Zap,
    title: "AI Co-Founder",
    description: "Get expert guidance 24/7 with our AI-powered assistant trained on successful startup frameworks.",
    highlight: "Always on",
  },
  {
    icon: Shield,
    title: "Investor Ready",
    description: "Generate professional pitch decks, financial projections, and due diligence documents in minutes.",
    highlight: "Fundable",
  },
  {
    icon: Globe,
    title: "Local Expertise",
    description: "Built specifically for the Ethiopian market with localized templates, regulations, and insights.",
    highlight: "Ethiopia-first",
  },
];

const investorFeatures = [
  {
    icon: Search,
    title: "Find Startups from Day One",
    description: "Discover promising Ethiopian startups at the earliest stages and get first-mover advantage.",
  },
  {
    icon: LineChart,
    title: "Track Progress in Real-Time",
    description: "Monitor startup milestones, metrics, and achievements through our comprehensive dashboard.",
  },
  {
    icon: FileCheck,
    title: "Documented Startup Profiles",
    description: "Access verified, real-time startup profiles curated and tracked by our team.",
  },
  {
    icon: Shield,
    title: "Derisk Your Investment",
    description: "Make informed decisions with transparent data and progress tracking.",
  },
];

const tools = [
  { icon: LayoutGrid, name: "Business Canvas", category: "Strategy" },
  { icon: Calculator, name: "Financial Projections", category: "Finance" },
  { icon: UserCircle, name: "Persona Builder", category: "Marketing" },
  { icon: Users, name: "Investor CRM", category: "Fundraising" },
  { icon: Search, name: "Market Research", category: "Strategy" },
  { icon: FileText, name: "Legal Docs", category: "Legal" },
  { icon: Target, name: "Pitch Refiner", category: "Fundraising" },
  { icon: Calendar, name: "Marketing Planner", category: "Marketing" },
  { icon: Kanban, name: "Project Tracking", category: "Operations" },
  { icon: PieChart, name: "Sales Pipeline", category: "Sales" },
  { icon: Briefcase, name: "Cap Table", category: "Finance" },
  { icon: MessageSquare, name: "AI Co-Founder", category: "Strategy" },
  { icon: Lightbulb, name: "Idea Validator", category: "Strategy" },
  { icon: Rocket, name: "Launch Checklist", category: "Operations" },
  { icon: Database, name: "Data Room", category: "Fundraising" },
  { icon: BarChart3, name: "KPI Dashboard", category: "Analytics" },
];

const journeySteps = [
  {
    step: 1,
    name: "Start",
    icon: Lightbulb,
    duration: "Month 1-2",
    tagline: "Validate Your Idea",
    description: "Lay the foundation. Validate your idea, understand your market, and define your business model.",
    features: [
      "Business Canvas Builder",
      "Idea Validation Workshop",
      "Market Research Basics",
      "Founder Mindset Assessment",
      "Community Access",
      "Weekly Group Sessions",
    ],
    outcome: "Clear business model & validated problem",
  },
  {
    step: 2,
    name: "Build",
    icon: Hammer,
    duration: "Month 3-4",
    tagline: "Build Your Foundation",
    description: "Execute on your vision. Build your MVP, create financial projections, and prepare investor materials.",
    features: [
      "Everything from Start",
      "Financial Projections Tool",
      "MVP Development Guide",
      "Pitch Deck Builder",
      "Legal Doc Templates",
      "Mentor Matching",
      "Investor CRM Access",
    ],
    outcome: "Working MVP & investor-ready materials",
  },
  {
    step: 3,
    name: "Launch",
    icon: Rocket,
    duration: "Month 5-6",
    tagline: "Go to Market",
    description: "Launch with confidence. Get your first customers, refine your pitch, and connect with investors.",
    features: [
      "Everything from Build",
      "Go-to-Market Strategy",
      "Sales Pipeline Setup",
      "Investor Introductions",
      "1-on-1 Founder Coaching",
      "Data Room Setup",
      "Demo Day Participation",
    ],
    outcome: "Live product & investor connections",
  },
];

const testimonials = [
  {
    quote: "The Business Canvas tool was a game-changer for us. It forced us to think critically about every aspect of our model and iterate until we got it right.",
    author: "Eden B.",
    role: "Founder, Sheba Fresh",
    avatar: "EB",
  },
  {
    quote: "The Market Research module saved us weeks of work. The AI-generated questions were incredibly insightful and helped us understand our customers deeply.",
    author: "Fatima H.",
    role: "CEO, Kafa Coffee Tech",
    avatar: "FH",
  },
  {
    quote: "As a technical founder, the Mindset assessment was surprisingly valuable. It highlighted my strengths and showed me the gaps I needed to fill.",
    author: "Yared M.",
    role: "CTO, Tana Deliveries",
    avatar: "YM",
  },
  {
    quote: "Capkit provided the structure and tools we needed to go from a simple idea to a fundable business plan. The platform is exactly what Ethiopian founders need.",
    author: "Tigist B.",
    role: "Co-founder, Injera Labs",
    avatar: "TB",
  },
];

export const InfographicPage: React.FC<InfographicPageProps> = ({ language, t, onNavigate }) => {
  const handleStart = () => {
    onNavigate(Page.START, SubPage.MINDSET);
  };

  const progressChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (progressChartRef.current && typeof Chart !== 'undefined') {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = progressChartRef.current.getContext('2d');
      if (ctx) {
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(17, 138, 178, 0.4)'); // Primary color #118AB2
        gradient.addColorStop(1, 'rgba(17, 138, 178, 0)');

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
            datasets: [{
              label: 'Growth',
              data: [40, 65, 45, 80, 55, 90, 75, 95],
              borderColor: '#118AB2', // Primary
              backgroundColor: gradient,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { 
                enabled: true,
                intersect: false,
                mode: 'index',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#e2e8f0',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(30, 41, 59, 0.5)',
                borderWidth: 1,
              }
            },
            scales: {
              x: { display: false },
              y: { display: false, min: 0, max: 100 }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden -m-4 md:-m-8">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        <SEO 
            title="Capkit - Start, Build, Grow" 
            description="The all-in-one platform for Ethiopian entrepreneurs. Validate ideas, build products, and prepare for investment."
        />
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-10 px-6">
          <div className="absolute top-40 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
          <div
            className="absolute bottom-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float"
            style={{ animationDelay: "-3s" }}
          />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-primary font-medium">Built by founders, for founders in Ethiopia</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">From Idea to</span>
              <br />
              <span className="gradient-text">Investment.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Your Founder Co-pilot. Capkit provides <span className="text-foreground font-semibold">30+ tools</span>, a
              supportive community, and direct connections to investors and mentors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg font-semibold group animate-pulse-glow"
              >
                Start Building for Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-border hover:bg-secondary group bg-transparent text-slate-200"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="relative">
                <div className="glass-card rounded-2xl p-8 border border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      className="md:col-span-2 bg-secondary/10 rounded-xl p-6 border border-border"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Startup Progress</span>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">+24%</span>
                      </div>
                      <div className="h-32 w-full relative">
                        <canvas ref={progressChartRef}></canvas>
                      </div>
                    </motion.div>

                    <div className="space-y-4">
                      <motion.div
                        className="bg-secondary/10 rounded-xl p-4 border border-border"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Rocket className="w-6 h-6 text-primary mb-2" />
                        <div className="text-2xl font-bold text-foreground">30+</div>
                        <div className="text-xs text-muted-foreground">Tools Available</div>
                      </motion.div>
                      <motion.div
                        className="bg-secondary/10 rounded-xl p-4 border border-border"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Users className="w-6 h-6 text-primary mb-2" />
                        <div className="text-2xl font-bold text-foreground">500+</div>
                        <div className="text-xs text-muted-foreground">Founders</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute -left-8 top-1/4 glass-card rounded-xl p-4 border border-primary/30 hidden lg:block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <TrendingUp className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== STATS BAR ==================== */}
        <section className="py-16 px-6 border-y border-border/50 bg-secondary/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">Why Capkit</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                The All-in-One Platform for
                <br />
                <span className="gradient-text">Ambitious Founders</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to validate, build, and scale your startup—all in one powerful platform.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card rounded-2xl p-8 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>

                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
                      {feature.highlight}
                    </span>

                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== INVESTOR SECTION ==================== */}
        <section id="for-investors" className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                  For Investors & Mentors
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Derisk Your Investment.
                  <br />
                  <span className="gradient-text">Find the Next Big Thing.</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Get exclusive access to vetted Ethiopian startups, track their progress from day one, and make
                  data-driven investment decisions.
                </p>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground group bg-transparent"
                >
                  Register as Investor
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investorFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-card rounded-xl p-6 border border-border/50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TOOLKIT SECTION ==================== */}
        <section id="tools" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                Your Toolkit
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">30+ Tools</span> to Build Your Empire
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A comprehensive suite of AI-powered tools designed to guide you through every stage of your startup
                journey.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="aspect-square glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <tool.icon className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-foreground leading-tight">{tool.name}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <span className="text-muted-foreground">And 14+ more tools...</span>
            </motion.div>
          </div>
        </section>

        {/* ==================== JOURNEY SECTION ==================== */}
        <section id="journey" className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                Your Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                From Idea to Investment in
                <br />
                <span className="gradient-text">6 Months — Completely Free</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A structured, action-based incubation program where your execution is all that matters. Progress through
                each stage with expert guidance.
              </p>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:flex items-center justify-center gap-0 mb-16 px-20"
            >
              {journeySteps.map((step, index) => (
                <div key={step.name} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <span className="text-primary font-bold">{step.step}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">{step.duration}</span>
                  </div>
                  {index < journeySteps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 mx-2">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                        className="h-full bg-primary origin-left"
                      />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Journey Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -10 }}
                  className="relative rounded-2xl p-8 bg-secondary/10 border border-border group hover:border-primary/50 transition-colors"
                >
                  <div className="absolute -top-4 left-6">
                    <span className="bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                      Step {step.step}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2 mt-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{step.name}</h3>
                      <span className="text-sm text-primary">{step.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold text-foreground">{step.tagline}</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">FREE</span>
                  </div>

                  <p className="text-muted-foreground mb-6 text-sm">{step.description}</p>

                  <ul className="space-y-2 mb-6">
                    {step.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-6">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Outcome</span>
                    <p className="text-sm text-foreground font-medium">{step.outcome}</p>
                  </div>

                  {index < journeySteps.length - 1 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <Button
                size="lg"
                onClick={handleStart}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg glow-button"
              >
                Start Your Journey — It&apos;s Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-muted-foreground mt-4 text-sm">
                No credit card required. Start with Step 1 and progress at your own pace.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS SECTION ==================== */}
        <section id="testimonials" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What Founders Are
                <br />
                <span className="gradient-text">Saying</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card rounded-2xl p-8 relative"
                >
                  <Quote className="w-10 h-10 text-primary/30 absolute top-6 right-6" />

                  <p className="text-lg text-foreground mb-6 leading-relaxed relative z-10">"{testimonial.quote}"</p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== MISSION SECTION ==================== */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-8"
              >
                <Heart className="w-10 h-10 text-primary" />
              </motion.div>

              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                Our Mission
              </span>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                By Founders,
                <br />
                <span className="gradient-text">For Founders</span>
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                We've been in your shoes. We know the challenges of building a business from scratch in this unique
                ecosystem. That's why we built Capkit.
              </p>

              <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
                <div className="flex items-start gap-4">
                  <Target className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <p className="text-lg text-foreground leading-relaxed text-left">
                    Our mission is to empower the next generation of Ethiopian entrepreneurs with the tools, knowledge,
                    and network to build successful, scalable ventures—and find the investment they deserve.
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mt-8 text-muted-foreground"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm">Built with love in Addis Ababa, Ethiopia</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-32 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-400 to-primary animate-border-flow rounded-3xl p-[2px]">
                <div className="absolute inset-[2px] bg-background rounded-3xl" />
              </div>

              <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8"
                >
                  <Rocket className="w-8 h-8 text-primary-foreground" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Ready to Build Your
                  <br />
                  <span className="gradient-text">Legacy?</span>
                </h2>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  Join hundreds of Ethiopian founders who are building the future. Start for free and upgrade as you
                  grow.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleStart}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-7 text-lg font-semibold group animate-pulse-glow"
                  >
                    Start Building for Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10 py-7 text-lg border-border hover:bg-secondary group bg-transparent text-slate-200"
                  >
                    <Users className="mr-2 w-5 h-5" />
                    Register as Investor
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default InfographicPage;
