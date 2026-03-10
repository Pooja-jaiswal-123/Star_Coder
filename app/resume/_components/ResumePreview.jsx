import React from "react";
import { Phone, Mail, MapPin, Linkedin, Globe } from "lucide-react";

const ResumePreview = ({ resumeData }) => {
  const themeColor = resumeData?.themeColor || "#000000";

  // Helper to split skills into an array
  const skillsArray = resumeData?.skills?.length > 0 
    ? resumeData.skills.toString().split(",") 
    : [];

  return (
    <div 
      className="bg-white min-h-[1123px] w-[794px] p-14 shadow-2xl mx-auto"
      // Sans-serif font for clean, modern look
      style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }} 
    >
      
      {/* === HEADER === */}
      <div className="text-center mb-10">
        <h1 
            className="text-5xl font-extrabold uppercase tracking-wide mb-2"
            style={{ color: themeColor }}
        >
          {resumeData?.firstName || "Sebastian"} {resumeData?.lastName || "Bennett"}
        </h1>
        <p className="text-gray-500 font-medium text-xl uppercase tracking-widest mb-6">
          {resumeData?.jobTitle || "Professional Accountant"}
        </p>
        
        {/* Contact Divider Line */}
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600 font-medium border-t-2 border-gray-100 pt-5">
            {resumeData?.phone && (
                <div className="flex items-center gap-2 hover:text-black transition-colors">
                    <Phone className="w-4 h-4" style={{color: themeColor}} /> {resumeData.phone}
                </div>
            )}
            {resumeData?.email && (
                <div className="flex items-center gap-2 hover:text-black transition-colors">
                    <Mail className="w-4 h-4" style={{color: themeColor}} /> {resumeData.email}
                </div>
            )}
            {resumeData?.address && (
                <div className="flex items-center gap-2 hover:text-black transition-colors">
                    <MapPin className="w-4 h-4" style={{color: themeColor}} /> {resumeData.address}
                </div>
            )}
        </div>
      </div>

      {/* === ABOUT ME === */}
      <div className="mb-10">
        <h2 
            className="text-sm font-bold uppercase tracking-[0.2em] mb-4 border-b-2 border-gray-200 pb-2 text-gray-800"
            style={{ color: themeColor }}
        >
            About Me
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-justify">
            {resumeData?.summary || "I am a passionate professional with strong experience in my field. I enjoy building scalable solutions and collaborating with teams to deliver high-quality results. Currently, I am expanding my skills to stay aligned with industry trends."}
        </p>
      </div>

      {/* === EDUCATION === */}
      <div className="mb-10">
        <h2 
            className="text-sm font-bold uppercase tracking-[0.2em] mb-5 border-b-2 border-gray-200 pb-2 text-gray-800"
            style={{ color: themeColor }}
        >
            Education
        </h2>
        
        <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
                <h3 className="font-bold text-gray-900 text-lg">
                    {resumeData?.edu1_school || "Borcelle University"}
                </h3>
                <span className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">
                    {resumeData?.edu1_date || "2026 - 2030"}
                </span>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
                {resumeData?.edu1_degree || "Bachelor's Degree in Accounting"}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed italic">
                {resumeData?.edu1_desc || "Relevant coursework in Auditing, Financial Reporting, and Business Law."}
            </p>
        </div>
      </div>

      {/* === WORK EXPERIENCE === */}
      <div className="mb-10">
        <h2 
            className="text-sm font-bold uppercase tracking-[0.2em] mb-5 border-b-2 border-gray-200 pb-2 text-gray-800"
            style={{ color: themeColor }}
        >
            Work Experience
        </h2>

        {/* Item 1 */}
        <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
                 <h3 className="font-bold text-gray-900 text-lg">
                    {resumeData?.exp1_role || "Senior Accountant"}
                 </h3>
                 <span className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">
                    {resumeData?.exp1_date || "2023 - Present"}
                 </span>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
                {resumeData?.exp1_company || "Salford & Co."}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {resumeData?.exp1_desc || "Managed financial reports, conducted audits, and ensured compliance with regulations. Collaborated with cross-functional teams to streamline accounting processes."}
            </p>
        </div>
      </div>

      {/* === PROJECTS (NEWLY ADDED) === */}
      {/* Check if projects exist before rendering the section */}
      {resumeData?.projects && resumeData.projects.length > 0 && (
        <div className="mb-10">
            <h2 
                className="text-sm font-bold uppercase tracking-[0.2em] mb-5 border-b-2 border-gray-200 pb-2 text-gray-800"
                style={{ color: themeColor }}
            >
                Projects
            </h2>
            
            <div className="space-y-6">
                {resumeData.projects.map((proj, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {proj.title || "Project Title"}
                            </h3>
                            {proj.tech && (
                                <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase tracking-wide">
                                    {proj.tech}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed text-justify">
                            {proj.desc || "Description of the project goes here..."}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* === SKILLS === */}
      <div>
        <h2 
            className="text-sm font-bold uppercase tracking-[0.2em] mb-5 border-b-2 border-gray-200 pb-2 text-gray-800"
            style={{ color: themeColor }}
        >
            Skills
        </h2>
        <div className="grid grid-cols-3 gap-y-3 gap-x-6">
            {skillsArray.length > 0 ? (
                skillsArray.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span 
                            className="w-2 h-2 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: themeColor }}
                        ></span>
                        <span className="text-sm text-gray-700 font-medium">{skill.trim()}</span>
                    </div>
                ))
            ) : (
                <>
                    {/* Dummy Skills for Preview */}
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span><span className="text-sm text-gray-700">Financial Modeling</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span><span className="text-sm text-gray-700">Auditing</span></div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"></span><span className="text-sm text-gray-700">Data Analysis</span></div>
                </>
            )}
        </div>
      </div>

    </div>
  );
};

export default ResumePreview;