"use client";

import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterviewDataContext } from "@/context/interviewDataContext";
import { Clock, List, Mic, Video, Info } from "lucide-react";
import StartInterview from "./StartInterview";

const AlertConfirmation = () => {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [candidateName, setCandidateName] = useState("");
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const interview = interviewInfo?.interviewData;

  const handleStart = () => {
    if (!candidateName.trim()) {
      setError("Please enter your name to continue.");
      return;
    }
    setError("");
    setStarted(true);
  };

  // Interview shuru ho gaya
  if (started) {
    return <StartInterview candidateName={candidateName} />;
  }

  if (!interview) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading interview details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 px-8 py-6 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Video className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">AI Interview</h1>
          <p className="text-indigo-200 text-sm mt-1">{interview.jobPosition}</p>
        </div>

        {/* Interview Details */}
        <div className="px-8 py-5 bg-indigo-50 border-b border-indigo-100">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-5 h-5 text-indigo-500" />
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-semibold text-sm">{interview.duration} min</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <List className="w-5 h-5 text-indigo-500" />
              <p className="text-xs text-gray-500">Questions</p>
              <p className="font-semibold text-sm">{interview.questionList?.length || 0}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Mic className="w-5 h-5 text-indigo-500" />
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-semibold text-sm">{interview.interviewType}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <div className="flex gap-3 p-3 bg-blue-50 rounded-xl mb-5 text-sm text-blue-700">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Please allow microphone access when prompted. Make sure you are in a quiet place.</p>
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Your Full Name
            </label>
            <Input
              placeholder="Enter your name..."
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="h-11"
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <Button
            onClick={handleStart}
            className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700"
          >
            Start Interview →
          </Button>

          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to be recorded during this session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertConfirmation;