"use client";

import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ResumeForm from "./_components/ResumeForm";
import ResumePreview from "./_components/ResumePreview";
import { Eye, Edit, Download, Sparkles } from "lucide-react";

const ResumeBuilder = () => {
  const [showPreview, setShowPreview] = useState(false);
  const componentRef = useRef();

  const [resumeData, setResumeData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
    themeColor: "#4F46E5",
    summary: "",
    experience: [], 
    education: [],
    skills: "",
    projects: []
  });

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${resumeData.firstName || "Resume"}_CV`,
    onAfterPrint: () => console.log("Printed successfully"),
  });

  return (
    // 'pl-72' aur 'pt-24' hata diya gaya hai taaki Layout.js ise handle kare
    <div className="w-full font-sans animate-in fade-in duration-700">
      
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100">
        <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                {showPreview ? "Resume Preview" : "Resume Builder"}
              </h1>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {showPreview ? "Review your document before downloading" : "Craft your professional story"}
            </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
            {/* Toggle Button */}
            <button 
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 bg-white border border-gray-200 text-gray-600 hover:border-indigo-600 hover:text-indigo-600 shadow-sm"
            >
                {showPreview ? (
                    <> <Edit className="w-3.5 h-3.5" /> Edit Mode </>
                ) : (
                    <> <Eye className="w-3.5 h-3.5" /> Preview Mode </>
                )}
            </button>

            {/* Download Button */}
            {showPreview && (
                <button 
                    onClick={handlePrint}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
                >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
            )}
        </div>
      </div>

      <div className="w-full">
        
        {/* FORM VIEW */}
        {!showPreview && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ResumeForm 
                    resumeData={resumeData} 
                    setResumeData={setResumeData} 
                />
            </div>
        )}

        {/* PREVIEW VIEW */}
        {showPreview && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex justify-center pb-10">
                 {/* A4 Sheet Simulation: 
                   Sidebar choda hai isliye preview ko center karne ke liye shadow aur padding manage ki hai 
                 */}
                 <div ref={componentRef} className="bg-white shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-none rounded-lg">
                    <ResumePreview resumeData={resumeData} />
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ResumeBuilder;