"use client";

import React from "react";
import {
  CheckCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const FeedbackPage = () => {
  const router = useRouter();

  // --- CLEAN STATIC DATA ---
  const data = {
    jobPosition: "Full Stack Developer",
    overallScore: 8,
    feedbackData: {
      summary:
        "Excellent problem-solving skills with a clear understanding of React and Node.js fundamentals.",
      strengths: ["Strong Logic", "Clear Communication", "React Optimization"],
      weaknesses: ["Deep SQL Indexing", "System Design Scalability"],
      hiringRecommendation: "Strongly Recommended",
    },
    qna: [
      {
        question: "Explain the difference between state and props.",
        answer:
          "State is local to the component, while props are passed from parent to child.",
      },
      {
        question: "How do you optimize a React application?",
        answer:
          "By using memoization, lazy loading, and avoiding unnecessary re-renders.",
      },
      {
        question: "What is your approach to database normalization?",
        answer:
          "I focus on reducing redundancy while maintaining query performance.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Simple Top Nav */}
        <div className="flex items-center justify-between border-b pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Static Report
          </span>
        </div>

        {/* Hero Section */}
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            {data.jobPosition}
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Interview Summary & Results
          </p>
        </div>

        {/* Score & Verdict Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center">
            <div className="text-5xl font-black text-indigo-600 leading-none">
              {data.overallScore}
            </div>
            <div className="text-[9px] font-bold text-slate-400 mt-2 tracking-widest uppercase">
              Overall Score
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase mb-2 tracking-widest">
              Final Verdict
            </span>
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              {data.feedbackData.hiringRecommendation}
            </div>
          </div>
        </div>

        {/* Analysis: Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 ml-1">
              <ThumbsUp size={12} className="text-emerald-500" /> Key Strengths
            </h3>
            {data.feedbackData.strengths.map((s, i) => (
              <div
                key={i}
                className="text-[11px] p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-slate-700 font-medium leading-relaxed"
              >
                {s}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 ml-1">
              <ThumbsDown size={12} className="text-rose-400" /> To Improve
            </h3>
            {data.feedbackData.weaknesses.map((w, i) => (
              <div
                key={i}
                className="text-[11px] p-3 bg-rose-50/30 border border-rose-100 rounded-xl text-slate-700 font-medium leading-relaxed"
              >
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Q&A Transcript */}
        <div className="space-y-3 pt-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">
            Detailed Transcript
          </h3>
          {data.qna.map((item, index) => (
            <div
              key={index}
              className="border border-slate-100 rounded-2xl p-4 bg-white hover:border-slate-200 transition-colors"
            >
              <p className="text-[11px] font-bold text-indigo-600 mb-2 flex gap-2">
                <span className="text-slate-300">Q{index + 1}.</span>{" "}
                {item.question}
              </p>
              <div className="pl-4 border-l-2 border-slate-100">
                <p className="text-[11px] text-slate-600 leading-relaxed italic">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-6">
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] h-10 font-bold tracking-wide"
          >
            Done & Return
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="px-5 border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all"
          >
            <Download size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
