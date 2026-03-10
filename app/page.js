"use client";

import React from 'react';
import { Sparkles, ArrowRight, PlayCircle, BookOpen, Lightbulb, Zap } from 'lucide-react';

export default function Home() {
  return (
    // 'w-full' ensures content fills the remaining space from Layout.js
    <div className="w-full font-sans text-slate-800 animate-in fade-in duration-700">
      
      {/* NOTE: Yahan se <aside> tag hata diya gaya hai kyunki 
         layout.js mein sidebar pehle se hi fixed hai.
      */}

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="max-w-7xl mx-auto">
        
        {/* 1. THE LIGHT POSTER */}
        <div className="relative w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-[2.5rem] p-8 md:p-14 border border-indigo-100/50 shadow-sm mb-10 overflow-hidden group">
          
          {/* Subtle Decorative Shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-indigo-300/20 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-[60px] -ml-12 -mb-12"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-700 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
                <Sparkles size={12} className="animate-pulse" />
                AI-Driven Career Excellence
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
                Elevate your <br />
                <span className="text-indigo-600">Professional Identity.</span>
              </h1>
              
              <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 max-w-md font-medium">
                Welcome back! Let's turn your career goals into reality. 
                What would you like to master today?
              </p>
              
              <div className="flex gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-3">
                  Get Started <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="hidden lg:block relative">
               <div className="absolute inset-0 bg-indigo-400 blur-3xl opacity-20 animate-pulse"></div>
               <div className="relative bg-white p-8 rounded-[2rem] border border-indigo-50 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Zap size={32} className="text-white fill-white" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 2. DAILY CONTENT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Action Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PlayCircle size={24} />
              </div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Today's Practice</h3>
            </div>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
              Experience a 5-minute rapid-fire interview round specifically 
              tailored for your target job role.
            </p>
            <button className="w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition shadow-lg active:scale-95">
              Launch AI Practice
            </button>
          </div>

          {/* Wisdom Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Lightbulb size={120} className="text-amber-600" />
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-6">
              <Lightbulb size={24} />
            </div>
            <p className="text-lg md:text-xl font-bold text-slate-800 italic leading-relaxed relative z-10 tracking-tight">
              "Focus on <span className="text-indigo-600">'How'</span> you solved a problem, not just 'What' you did. 
              Impact matters more than activity."
            </p>
            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              — Career Coach Insight
            </p>
          </div>
        </div>

        {/* 3. QUICK NAVIGATION */}
        <div className="pt-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 ml-1">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mock Sessions', 'Resume Vault', 'Skill Gap', 'Pathways'].map((item) => (
              <div key={item} className="p-4 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                  <BookOpen size={18} className="text-slate-400 group-hover:text-white transition" />
                </div>
                <span className="font-black text-slate-600 text-[10px] uppercase tracking-widest group-hover:text-indigo-700 transition">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}