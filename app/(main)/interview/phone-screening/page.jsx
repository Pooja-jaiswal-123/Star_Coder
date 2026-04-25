"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  User,
  FileText,
  Loader2,
  PhoneOff,
  Mic,
  Plus,
  MessageSquare,
  Layout,
  Maximize,
  Heart,
  Menu,
} from "lucide-react";

const PhoneScreeningPage = () => {
  // States: 'idle', 'dialing', 'connected'
  const [callStatus, setCallStatus] = useState("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [formData, setFormData] = useState({
    candidateName: "",
    phoneNumber: "",
    backgroundContext: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Timer sirf tab chalega jab call 'connected' hogi
  useEffect(() => {
    let interval;
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startScreeningCall = async (e) => {
    e.preventDefault();

    // Step 1: Call initiate karte hi 'dialing' state me daalo (Ringing animation dikhega)
    setCallStatus("dialing");

    try {
      // Yahan actual backend API call hogi
      // Abhi hum 3 second ka fake delay de rahe hain (Ringing simulate karne ke liye)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Step 2: 3 Second baad call connect ho jayegi
      setCallStatus("connected");
    } catch (error) {
      console.error("Error:", error);
      setCallStatus("idle");
    }
  };

  const endCall = () => {
    setCallStatus("idle");
    setFormData({ candidateName: "", phoneNumber: "", backgroundContext: "" });
  };

  // ----------------------------------------------------
  // UI 2: ACTIVE CALL SCREEN (Dynamic UI)
  // ----------------------------------------------------
  if (callStatus !== "idle") {
    return (
      <div className="w-full h-full bg-[#f0f2f5] p-4 flex items-center justify-center min-h-[80vh] rounded-xl relative overflow-hidden border border-slate-200">
        {/* Top Window Controls */}
        <div className="absolute top-6 left-6 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <div className="w-3 h-3 rounded-full bg-slate-400"></div>
        </div>

        {/* Top Right Avatars */}
        <div className="absolute top-6 right-6 flex items-center gap-3 text-slate-400">
          <span className="font-bold pb-2 tracking-widest">...</span>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>

        {/* Center Calling Info */}
        <div className="flex flex-col items-center z-10">
          {/* DYNAMIC AVATAR WITH PULSE ANIMATION WHEN CONNECTED */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Pulsing rings (Only visible when connected) */}
            {callStatus === "connected" && (
              <>
                <div className="absolute w-48 h-48 bg-slate-200/50 rounded-full animate-ping opacity-75"></div>
                <div className="absolute w-56 h-56 bg-slate-200/30 rounded-full animate-pulse"></div>
              </>
            )}
            <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg shadow-slate-200/50 z-10">
              <User size={80} className="text-slate-300" />
            </div>
          </div>

          {/* DYNAMIC NAME & STATUS */}
          <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-wide">
            {formData.candidateName || "Candidate"}
          </h2>

          <p
            className={`text-lg font-medium mb-10 transition-colors ${callStatus === "dialing" ? "text-blue-500 animate-pulse" : "text-slate-500"}`}
          >
            {callStatus === "dialing" ? "Ringing..." : formatTime(callDuration)}
          </p>

          {/* Call Controls (Video Removed, Buttons Centered) */}
          <div className="flex items-center gap-6">
            <button className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-md transition-colors text-white">
              <Plus size={24} />
            </button>
            <button className="w-14 h-14 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md transition-colors text-slate-500">
              <Mic size={24} />
            </button>
            <button
              onClick={endCall}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 text-white"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>

        {/* Bottom Left Icon */}
        <div className="absolute bottom-6 left-6 text-slate-400 relative">
          <MessageSquare size={24} />
          <div className="w-2 h-2 rounded-full bg-red-500 absolute -top-1 -right-1 border border-white"></div>
        </div>

        {/* Bottom Right Icons */}
        <div className="absolute bottom-6 right-6 flex gap-4 text-slate-400 hidden sm:flex">
          <Layout size={20} />
          <Maximize size={20} />
          <Heart size={20} className="text-red-400" />
          <Menu size={20} />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // UI 1: INITIAL FORM SCREEN (Remains same)
  // ----------------------------------------------------
  return (
    <div className="w-full h-full bg-slate-50 p-4 md:p-8 flex flex-col items-center pt-10">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              Phone Screening Call
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Initiate an AI-powered technical interview.
            </p>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Phone size={18} />
          </div>
        </div>

        <form onSubmit={startScreeningCall} className="p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" /> Candidate Name
                </label>
                <input
                  type="text"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-slate-400" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="+91 90000 00000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText size={14} className="text-slate-400" /> Context & Job
                Description
              </label>
              <textarea
                name="backgroundContext"
                value={formData.backgroundContext}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Enter skills and job requirements. The AI will use this to ask relevant questions."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
            <div className="h-6 flex items-center">
              <span className="text-xs text-slate-400">
                Calls are limited to 5 minutes.
              </span>
            </div>

            <button
              type="submit"
              disabled={callStatus === "dialing"}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-5 rounded-md transition-colors flex justify-center items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed min-w-[130px]"
            >
              {callStatus === "dialing" ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Connecting...
                </>
              ) : (
                "Initiate Call"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneScreeningPage;
