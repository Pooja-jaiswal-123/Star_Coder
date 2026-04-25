"use client";

import React from 'react';
import { 
  ArrowRight, 
  Video, 
  FileText, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  Play,
  Zap,
  Star,
  Mic,
  Settings,
  Circle,
  MoreHorizontal
} from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full bg-white text-slate-900 font-sans min-h-screen selection:bg-blue-100 relative overflow-hidden px-6 md:px-12 py-10">
      
      {/* --- 1. GRAPH PAPER BACKGROUND (BLUEPRINT STYLE) --- */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(#000 1px, transparent 1px), 
            linear-gradient(90deg, #000 1px, transparent 1px),
            linear-gradient(#000 0.5px, transparent 0.5px), 
            linear-gradient(90deg, #000 0.5px, transparent 0.5px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
        }} 
      />

      <div className="relative z-10">
        {/* --- 2. HERO SECTION: BOLD & CATCHY --- */}
        <section className="max-w-4xl mb-24 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> AI Protocol Active
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
            Optimize <br />
            <span className="text-blue-600">Your Future.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-xl mb-12 leading-relaxed font-medium">
            The engineering standard for high-stakes career moves. Practice with proprietary AI agents and secure your place in the 1%.
          </p>

          <div className="flex flex-wrap gap-5">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-2xl shadow-blue-900/20 flex items-center gap-3 group active:scale-95">
              Launch Simulator <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              View Analytics
            </button>
          </div>
        </section>

        {/* --- 3. THE REFINED VIDEO INTERFACE (WINDOW STYLE) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl">
          
          <div className="lg:col-span-8 group relative">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[3.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="relative bg-white border border-slate-200 rounded-[3rem] p-4 md:p-6 shadow-xl transition-all duration-500">
              
              {/* Browser/Window Style Header */}
              <div className="flex items-center justify-between px-6 py-4 mb-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="flex items-center gap-2">
                   <Circle size={10} fill="#f87171" className="text-red-400" />
                   <Circle size={10} fill="#fbbf24" className="text-amber-400" />
                   <Circle size={10} fill="#34d399" className="text-emerald-400" />
                   <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Session — Agent_Alpha</span>
                 </div>
                 <MoreHorizontal size={16} className="text-slate-300" />
              </div>

              {/* Video Content Window (Rounded Window) */}
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 border-2 border-white ring-1 ring-slate-200">
                 {/* Image Window (Instead of simple rectangle) */}
                 <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80" 
                    alt="AI Interviewer"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                 
                 {/* Floating Play Control */}
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-all duration-500 cursor-pointer shadow-2xl">
                     <Play size={28} className="text-white ml-1" fill="white" />
                   </div>
                 </div>

                 {/* Interactive Dashboard Overlay */}
                 <div className="absolute bottom-6 inset-x-6 flex justify-between items-end">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] text-white w-64 shadow-2xl">
                       <div className="flex justify-between items-center mb-3">
                         <p className="text-[9px] font-black uppercase tracking-widest text-blue-400">Communication Flow</p>
                         <span className="text-[10px] font-black">9.4</span>
                       </div>
                       <div className="flex gap-1 h-8 items-end mb-1">
                          {[0.4, 0.8, 0.5, 0.9, 0.7, 0.3, 0.6, 0.8, 0.4].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-500/40 rounded-t-sm" style={{ height: `${h * 100}%` }} />
                          ))}
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                          <Mic size={22} />
                       </div>
                       <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl hover:bg-blue-500 transition-all cursor-pointer ring-4 ring-blue-600/20">
                          <ShieldCheck size={22} />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* SIDE PANEL: ANALYTICS PREVIEW */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-slate-950 rounded-[3.5rem] p-10 text-white relative overflow-hidden group border border-slate-800 shadow-2xl">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
               <Star className="text-blue-500 mb-8 animate-pulse" size={32} fill="currentColor" />
               <h3 className="text-2xl font-black mb-2 tracking-tight">Performance <br/> Analysis</h3>
               <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed italic">"Technically sound, but needs more emphasis on soft-leadership skills."</p>
               
               <div className="space-y-6">
                  {['Body Language', 'Knowledge', 'Clarity'].map((label, idx) => (
                    <div key={label} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{label}</span>
                          <span className="text-blue-500">{95 - (idx * 5)}%</span>
                       </div>
                       <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${95 - (idx * 5)}%` }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* --- 4. THE TOOLKIT (CLEAN GRID) --- */}
        <section className="py-24 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: 'Resume Kernel', icon: <FileText size={24}/>, desc: 'Deep-scan your resume against top-tier tech rubrics.' },
              { title: 'Smart Roadmap', icon: <Target size={24}/>, desc: 'AI-generated strategy to reach senior levels faster.' },
              { title: 'Growth Engine', icon: <BarChart3 size={24}/>, desc: 'Visual daily logs of your evolution and fluency.' },
            ].map((item, i) => (
              <div key={i} className="group p-10 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 cursor-pointer">
                <div className="w-14 h-14 bg-white border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="text-xl font-black mb-3 text-slate-900 tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 5. FOOTER --- */}
        <footer className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
          <p className="text-[9px] font-black uppercase tracking-[0.5em]">System.Core.Career-AI-2026</p>
          <div className="flex gap-10">
            <span className="text-[9px] font-black uppercase tracking-widest hover:text-blue-600 cursor-pointer transition-colors">Neural Hub</span>
            <span className="text-[9px] font-black uppercase tracking-widest hover:text-blue-600 cursor-pointer transition-colors">Documentation</span>
          </div>
        </footer>
      </div>
    </div>
  );
}