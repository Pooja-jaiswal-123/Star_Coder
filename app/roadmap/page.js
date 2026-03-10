"use client";

import React, { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import { 
  Map, Search, CheckCircle2, Loader2, BookOpen, Code, Sparkles, AlertCircle, Terminal
} from "lucide-react";

// Initializing with the environment variable
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const CareerRoadmap = () => {
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!role || !process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) setError("API Key missing in .env");
      return;
    }
    
    setIsLoading(true);
    setRoadmap(null);
    setError(null);

    const prompt = `Act as a senior career counselor. Create a high-level 4-phase learning roadmap for a "${role}".
    You MUST return ONLY a JSON array. No preamble, no explanation.
    Structure:
    [
      {
        "title": "Phase Name",
        "duration": "e.g. Weeks 1-4",
        "description": "Brief objective",
        "topics": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
      }
    ]`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2, // Kept low for structured data accuracy
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "";
      
      // Improved Regex to find the JSON array even if the AI adds text around it
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']') + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);

      if (jsonString) {
        setRoadmap(JSON.parse(jsonString));
      } else {
        throw new Error("AI failed to provide a valid roadmap format.");
      }
    } catch (err) {
      console.error("Roadmap Generation Error:", err);
      setError("Could not generate roadmap. Please check your connection or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full font-sans animate-in fade-in duration-700 max-w-5xl mx-auto p-6">
      
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Map className="w-8 h-8 text-white" />
          </div>
          Career Path Designer
        </h1>
        <p className="text-slate-500 mt-3 font-medium max-w-2xl text-base leading-relaxed">
          Powered by Llama 3.3. Enter any professional role to generate a structured, 
          industry-standard learning trajectory.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 mb-12">
         <div className="flex flex-col md:flex-row gap-2 items-center p-2">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Enter role (e.g. DevOps Engineer, Product Manager...)"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-800"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading || !role}
                className={`h-[60px] px-10 rounded-[2rem] font-black text-sm uppercase tracking-widest text-white shadow-lg flex items-center gap-3 transition-all active:scale-95 ${
                    isLoading || !role
                    ? "bg-slate-200 cursor-not-allowed shadow-none"
                    : "bg-slate-900 hover:bg-black shadow-slate-200"
                }`}
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
                {isLoading ? "Analyzing..." : "Build Roadmap"}
            </button>
         </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Result UI (Using your existing layout) */}
      {isLoading ? (
          <div className="text-center py-20">
            <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Designing Curriculum</h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">Fetching the latest skill requirements for <b>{role}</b></p>
          </div>
      ) : roadmap && (
        <div className="animate-in slide-in-from-bottom-10 duration-1000">
            <div className="flex items-center gap-4 mb-12">
                <div className="h-px flex-1 bg-slate-200"></div>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                  Roadmap for <span className="text-indigo-600">{role}</span>
                </h2>
                <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <div className="relative border-l-4 border-slate-100 ml-6 space-y-12 pb-12">
                {roadmap.map((step, index) => (
                    <div key={index} className="relative pl-12 group">
                        <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white border-[5px] border-slate-900 rounded-full group-hover:border-indigo-600 transition-colors z-10"></div>
                        
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group-hover:shadow-xl group-hover:shadow-indigo-50/50 group-hover:border-indigo-100 transition-all duration-500">
                            <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                                        PHASE 0{index + 1}
                                    </span>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{step.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-500 border border-slate-100 uppercase tracking-tighter">
                                    {step.duration}
                                </div>
                            </div>

                            <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium italic">
                                "{step.description}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {step.topics.map((topic, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:border-indigo-50 transition-all">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                                          {i % 2 === 0 ? <BookOpen className="w-4 h-4 text-indigo-500" /> : <Code className="w-4 h-4 text-indigo-500" />}
                                        </div>
                                        <span className="text-sm font-black text-slate-700">{topic}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="relative pl-12">
                     <div className="absolute -left-[14px] top-0 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg animate-pulse"></div>
                     <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 inline-flex items-center gap-4 shadow-sm shadow-emerald-100">
                        <div className="p-3 bg-emerald-500 rounded-xl shadow-md">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-black text-emerald-900 text-xs uppercase tracking-widest">Mastery Achieved</h4>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">Ready for Industry Roles</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmap;