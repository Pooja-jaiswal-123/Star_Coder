"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Star, ThumbsUp, ThumbsDown, Award } from "lucide-react";
import { useRouter } from "next/navigation";

const recommendationConfig = {
  "Strongly Recommended": { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: <Award className="w-5 h-5 text-green-600" /> },
  "Recommended": { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: <ThumbsUp className="w-5 h-5 text-blue-600" /> },
  "Needs Improvement": { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: <ThumbsDown className="w-5 h-5 text-yellow-600" /> },
  "Not Recommended": { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: <XCircle className="w-5 h-5 text-red-600" /> },
};

const FeedbackPage = ({ feedback, candidateName, answers }) => {
  const router = useRouter();
  const config = recommendationConfig[feedback?.hiringRecommendation] || recommendationConfig["Recommended"];
  const score = feedback?.overallScore || 0;

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-blue-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border p-8 text-center">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">Interview Complete!</h1>
          <p className="text-gray-500 mt-1">Here's the feedback for <span className="font-semibold text-indigo-600">{candidateName}</span></p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-3xl shadow-xl border p-8">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Overall Score
          </h2>
          <div className="flex items-center gap-6">
            <div className={`text-6xl font-black ${getScoreColor(score)}`}>
              {score}<span className="text-2xl text-gray-400">/10</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${score >= 8 ? "bg-green-500" : score >= 6 ? "bg-blue-500" : score >= 4 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${score * 10}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{feedback?.summary}</p>
            </div>
          </div>
        </div>

        {/* Hiring Recommendation */}
        <div className={`rounded-3xl shadow-xl border p-6 ${config.bg} ${config.border}`}>
          <h2 className="font-bold text-lg text-gray-800 mb-3">Hiring Recommendation</h2>
          <div className="flex items-center gap-3">
            {config.icon}
            <span className={`text-xl font-bold ${config.color}`}>{feedback?.hiringRecommendation}</span>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-500" /> Strengths
            </h2>
            <ul className="space-y-2">
              {feedback?.strengths?.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-3xl shadow-xl border p-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-400" /> Areas to Improve
            </h2>
            <ul className="space-y-2">
              {feedback?.weaknesses?.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Q&A Summary */}
        <div className="bg-white rounded-3xl shadow-xl border p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Your Answers</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {answers?.map((a, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-sm">
                <p className="font-semibold text-indigo-600 mb-1">Q{i + 1}: {a.question}</p>
                <p className="text-gray-600">{a.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <Button
          className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-2xl"
          onClick={() => router.push("/")}
        >
          Go to Home
        </Button>

      </div>
    </div>
  );
};

export default FeedbackPage;