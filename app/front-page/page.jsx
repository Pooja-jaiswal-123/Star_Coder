"use client";

import { useState, useRef } from "react";
import {
  Download,
  FileText,
  School,
  User,
  BookOpen,
  Calendar,
  LayoutTemplate,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export default function FrontPageGenerator() {
  const [formData, setFormData] = useState({
    collegeName: "",
    assignmentTitle: "",
    subject: "",
    teamLeader: "",
    leaderRoll: "",
    teamMembers: [],
    submittedTo: "",
    date: new Date().toISOString().split("T")[0],
    logoUrl: null,
    themeColor: "#4f46e5",
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", roll: "" }],
    }));
  };

  const removeMember = (index) => {
    const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col xl:flex-row gap-8">
      {/* 🟢 PRINT CSS FIX: Strict Single Page Enforcement */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { 
            size: A4; 
            margin: 0 !important; 
          }
          html, body { 
            margin: 0 !important; 
            padding: 0 !important;
            height: 297mm !important;
            width: 210mm !important;
            overflow: hidden !important;
          }
          .no-print { display: none !important; }
          .print-area {
            position: relative !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          .content-wrapper { 
            transform: scale(0.92); /* Shrink more to prevent 2nd page */
            transform-origin: top center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }
      `,
        }}
      />

      {/* LEFT SIDE: FORM */}
      <div className="w-full xl:w-1/3 bg-white p-6 rounded-2xl shadow-sm no-print h-[90vh] overflow-y-auto">
        <h1 className="text-xl font-bold mb-6 flex items-center gap-2 italic">
          <LayoutTemplate className="text-indigo-600" /> Front Page Pro
        </h1>

        <div className="space-y-4 text-sm">
          <div
            className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleLogoUpload}
            />
            {formData.logoUrl ? (
              <img src={formData.logoUrl} className="h-10 mx-auto" />
            ) : (
              <p className="text-gray-500 font-semibold">Upload Logo</p>
            )}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              name="collegeName"
              placeholder="College Name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="assignmentTitle"
              placeholder="Project Title"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject Name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg space-y-3">
            <p className="font-bold text-gray-700">Team Members</p>
            <div className="flex gap-2">
              <input
                type="text"
                name="teamLeader"
                placeholder="Leader"
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                name="leaderRoll"
                placeholder="Roll"
                onChange={handleChange}
                className="w-1/2 p-2 border rounded"
              />
            </div>
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Member ${index + 1}`}
                  value={member.name}
                  onChange={(e) =>
                    handleMemberChange(index, "name", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Roll"
                  value={member.roll}
                  onChange={(e) =>
                    handleMemberChange(index, "roll", e.target.value)
                  }
                  className="w-1/3 p-2 border rounded"
                />
                <button
                  onClick={() => removeMember(index)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addMember}
              className="w-full py-1 border-2 border-dashed border-indigo-200 rounded text-indigo-600 text-xs"
            >
              + Add Member
            </button>
          </div>

          <input
            type="text"
            name="submittedTo"
            placeholder="To (Teacher Name)"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={() => window.print()}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: PREVIEW */}
      <div className="flex-1 flex justify-center bg-gray-300 p-4 md:p-8 overflow-auto print:p-0 print:bg-white">
        <div className="print-area w-[210mm] h-[297mm] bg-white shadow-2xl relative flex flex-col items-center justify-between py-12 px-12 box-border overflow-hidden">
          <div className="content-wrapper w-full h-full">
            {/* Border & Watermark */}
            <div
              className="absolute inset-0 border-[8px] border-double pointer-events-none"
              style={{ borderColor: formData.themeColor }}
            ></div>
            {formData.logoUrl && (
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
                <img
                  src={formData.logoUrl}
                  className="w-[80%] object-contain grayscale"
                />
              </div>
            )}

            {/* Top */}
            <div className="z-10 text-center pt-8">
              {formData.logoUrl && (
                <img
                  src={formData.logoUrl}
                  className="h-24 object-contain mb-4 mx-auto"
                />
              )}
              <h1
                className="text-3xl font-black uppercase tracking-widest leading-tight"
                style={{ color: formData.themeColor }}
              >
                {formData.collegeName || "COLLEGE NAME"}
              </h1>
              <div
                className="w-32 h-1 mx-auto mt-2"
                style={{ backgroundColor: formData.themeColor }}
              ></div>
            </div>

            {/* Middle */}
            <div className="z-10 text-center py-6">
              <h2 className="text-md font-bold text-gray-400 uppercase tracking-[0.4em] mb-2">
                Assignment On
              </h2>
              <h3 className="text-4xl font-black text-gray-900 leading-tight uppercase mb-6 px-4">
                {formData.assignmentTitle || "PROJECT TITLE"}
              </h3>
              <p className="text-xl font-bold text-gray-700">
                Subject:{" "}
                <span className="text-black border-b-2 border-gray-300">
                  {formData.subject || "Subject Name"}
                </span>
              </p>
            </div>

            {/* Bottom Info */}
            <div className="z-10 w-full flex justify-between items-start px-8 mb-4">
              <div className="text-left space-y-4">
                <p
                  className="text-sm font-black uppercase underline"
                  style={{ color: formData.themeColor }}
                >
                  Submitted By:
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900 uppercase">
                      {formData.teamLeader || "Leader Name"}
                    </p>
                    <p className="text-xs font-semibold text-gray-600 italic">
                      Roll No: {formData.leaderRoll || "0000"} (Leader)
                    </p>
                  </div>
                  {formData.teamMembers.map(
                    (m, i) =>
                      m.name && (
                        <div key={i}>
                          <p className="text-lg font-bold text-gray-900 uppercase">
                            {m.name}
                          </p>
                          <p className="text-xs font-semibold text-gray-600">
                            Roll No: {m.roll || "0000"}
                          </p>
                        </div>
                      ),
                  )}
                </div>
              </div>

              <div className="text-right">
                <p
                  className="text-sm font-black uppercase underline"
                  style={{ color: formData.themeColor }}
                >
                  Submitted To:
                </p>
                <p className="text-lg font-bold text-gray-900 uppercase">
                  {formData.submittedTo || "TEACHER NAME"}
                </p>
              </div>
            </div>

            {/* Date - Raised Up */}
            <div className="z-10 text-center mb-12">
              <p className="text-lg font-bold text-gray-800">
                Submission Date:{" "}
                <span style={{ color: formData.themeColor }}>
                  {formData.date}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
