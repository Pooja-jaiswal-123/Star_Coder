"use client";

import React, { useState } from "react";
import { 
  UploadCloud, 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  X,
  Sparkles
} from "lucide-react";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDesc) {
      alert("Please upload a resume and add a job description.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      
      // Strict Prompt for Correct Percentage and Match Status
      const prompt = `
        Analyze the following resume against the Job Description.
        Job Description: ${jobDesc}
        Resume: (File Name: ${file.name})

        Rules for Scoring:
        1. "score" must be a whole number between 0 and 100 representing the match percentage.
        2. "matchStatus" must be: "Poor Match" (if score < 40), "Average Match" (40-69), "Good Match" (70-85), or "Excellent Match" (above 85).
        
        Return ONLY this JSON object:
        {
          "score": number,
          "matchStatus": "string",
          "summary": "brief feedback",
          "missingKeywords": ["word1", "word2"],
          "strengths": ["point1", "point2"],
          "improvements": ["point1", "point2"]
        }
      `;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a professional ATS analyzer. You provide strict integer-based scores from 0 to 100." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1
        }),
      });

      const data = await response.json();
      let analysis = JSON.parse(data.choices[0].message.content);
      
      // Logic Fix: Agar AI galti se decimal de (like 0.7), toh use 100 se multiply karo
      if (analysis.score < 1 && analysis.score > 0) {
        analysis.score = Math.round(analysis.score * 100);
      }

      setResult(analysis);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze. Check your API key or connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function for color styling based on score
  const getScoreStyles = (score) => {
    if (score >= 80) return { color: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-100", stroke: "text-emerald-500" };
    if (score >= 50) return { color: "text-amber-600", bg: "bg-amber-50/50", border: "border-amber-100", stroke: "text-amber-500" };
    return { color: "text-red-600", bg: "bg-red-50/50", border: "border-red-100", stroke: "text-red-500" };
  };

  return (
    <div className="w-full font-sans animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight uppercase">
          <Search className="w-8 h-8 text-indigo-600" />
          AI Resume Analyzer
        </h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">Real-time ATS Scoring with Groq AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Inputs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
               <FileText className="w-4 h-4 text-indigo-500" /> Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job requirements here..."
              className="w-full h-56 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none text-sm font-medium transition-all"
            />
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
               <UploadCloud className="w-4 h-4 text-indigo-500" /> Upload Resume
            </label>
            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer relative group">
               <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               {file ? (
                 <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-md border border-indigo-100 animate-in zoom-in-95">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    <span className="text-sm font-black text-gray-700 truncate max-w-[150px]">{file.name}</span>
                    <button onClick={(e) => {e.preventDefault(); setFile(null)}} className="p-1 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                 </div>
               ) : (
                 <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-indigo-100"><UploadCloud className="w-6 h-6" /></div>
                    <p className="text-xs font-black text-gray-700 uppercase tracking-widest">Click to upload PDF</p>
                 </div>
               )}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file || !jobDesc}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isAnalyzing || !file || !jobDesc ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100"
            }`}
          >
            {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4" /> Scan Resume</>}
          </button>
        </div>

        {/* Right Side: Results */}
        <div className="space-y-6">
          {!result && !isAnalyzing && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100 text-center p-12">
              <Search className="w-12 h-12 text-gray-100 mb-4" />
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Ready to Analyze</h3>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[2rem] border border-gray-100 p-12">
              <div className="relative w-20 h-20 mb-8 animate-pulse"><div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div></div>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Processing Assets...</h3>
            </div>
          )}

          {result && (
            <div className={`bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-right-8 duration-700`}>
                {/* Dynamic Header based on Score */}
                <div className={`p-10 text-center ${getScoreStyles(result.score).bg}`}>
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * result.score) / 100} className={`${getScoreStyles(result.score).stroke} transition-all duration-1000 ease-out`} />
                        </svg>
                        <span className={`absolute text-3xl font-black ${getScoreStyles(result.score).color}`}>{result.score}%</span>
                    </div>
                    <h2 className={`text-xl font-black mt-6 uppercase tracking-widest ${getScoreStyles(result.score).color}`}>{result.matchStatus}</h2>
                    <p className="text-gray-500 mt-3 text-xs font-medium max-w-sm mx-auto leading-relaxed">{result.summary}</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Missing Keywords Section */}
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" /> Critical Gaps
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {result.missingKeywords?.map((keyword, i) => (
                                <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-100 uppercase tracking-wider">{keyword}</span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Strengths */}
                        <div className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-50">
                            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Match Strengths</h4>
                            <ul className="space-y-2">
                                {result.strengths?.map((item, i) => (
                                    <li key={i} className="text-[11px] font-bold text-gray-700 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Improvements */}
                        <div className="p-5 bg-amber-50/30 rounded-2xl border border-amber-50">
                            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Growth Areas</h4>
                            <ul className="space-y-2">
                                {result.improvements?.map((item, i) => (
                                    <li key={i} className="text-[11px] font-bold text-gray-700 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;