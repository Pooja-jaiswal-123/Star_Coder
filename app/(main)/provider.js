"use client";
import React, { useState } from 'react';
import { InterviewDataContext } from "@/context/interviewDataContext";

const DashboardProvider = ({ children }) => {
  // Yahan state define karni zaroori hai
  const [interviewInfo, setInterviewInfo] = useState(null);

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className="min-h-screen w-full bg-[#F4F6FA]">
        <div className="p-10">
          {children}
        </div>
      </div>
    </InterviewDataContext.Provider>
  );
};

export default DashboardProvider;