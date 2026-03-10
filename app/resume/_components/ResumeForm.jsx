import React, { useState, useEffect } from "react";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Palette, 
  FileText, 
  LayoutList, 
  FolderGit2, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Trash2
} from "lucide-react";

const ResumeForm = ({ resumeData, setResumeData }) => {
  const [activeSection, setActiveSection] = useState(1);

  // Initialize projects array if it doesn't exist
  useEffect(() => {
    if (!resumeData.projects || !Array.isArray(resumeData.projects)) {
      setResumeData(prev => ({ ...prev, projects: [] }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Dynamic Projects Handlers ---
  const handleAddProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { title: "", tech: "", desc: "" } // New Empty Project
      ]
    }));
  };

  const handleRemoveProject = (index) => {
    const newProjects = [...resumeData.projects];
    newProjects.splice(index, 1);
    setResumeData(prev => ({ ...prev, projects: newProjects }));
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...(resumeData.projects || [])];
    // Ensure the object exists at this index
    if (!newProjects[index]) newProjects[index] = { title: "", tech: "", desc: "" };
    
    newProjects[index][field] = value;
    setResumeData(prev => ({ ...prev, projects: newProjects }));
  };
  // ---------------------------------

  const SectionHeader = ({ id, title, icon: Icon }) => (
    <button 
      onClick={() => setActiveSection(activeSection === id ? 0 : id)}
      className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex items-center gap-3">
         <div className={`p-2 rounded-lg transition-colors ${activeSection === id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
            <Icon className="w-4 h-4" />
         </div>
         <span className="font-semibold text-gray-700">{title}</span>
      </div>
      {activeSection === id ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* Theme Color */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/30">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4"/> Theme Color
        </h3>
        <div className="flex gap-3">
            {['#000000', '#4F46E5', '#E11D48', '#059669', '#D97706'].map((color) => (
                <div 
                    key={color}
                    onClick={() => setResumeData(prev => ({...prev, themeColor: color}))}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${resumeData.themeColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        
        {/* 1. Personal Details */}
        <SectionHeader id={1} title="Personal Details" icon={User} />
        {activeSection === 1 && (
            <div className="p-5 grid grid-cols-2 gap-4 bg-gray-50/50 animate-in slide-in-from-top-2">
                <div><label className="lbl">First Name</label><input type="text" name="firstName" onChange={handleChange} defaultValue={resumeData.firstName} className="input" placeholder="Sebastian" /></div>
                <div><label className="lbl">Last Name</label><input type="text" name="lastName" onChange={handleChange} defaultValue={resumeData.lastName} className="input" placeholder="Bennett" /></div>
                <div className="col-span-2"><label className="lbl">Job Title</label><input type="text" name="jobTitle" onChange={handleChange} defaultValue={resumeData.jobTitle} className="input" placeholder="Professional Accountant" /></div>
                <div className="col-span-2"><label className="lbl">Address</label><input type="text" name="address" onChange={handleChange} defaultValue={resumeData.address} className="input" placeholder="123 Anywhere St., Any City" /></div>
                <div><label className="lbl">Phone</label><input type="text" name="phone" onChange={handleChange} defaultValue={resumeData.phone} className="input" placeholder="+123-456-7890" /></div>
                <div><label className="lbl">Email</label><input type="email" name="email" onChange={handleChange} defaultValue={resumeData.email} className="input" placeholder="hello@reallygreatsite.com" /></div>
            </div>
        )}

        {/* 2. About Me */}
        <SectionHeader id={2} title="About Me" icon={FileText} />
        {activeSection === 2 && (
             <div className="p-5 bg-gray-50/50">
                <textarea name="summary" rows="4" onChange={handleChange} defaultValue={resumeData.summary} className="input" placeholder="Lorem ipsum dolor sit amet..." />
            </div>
        )}

        {/* 3. Education */}
        <SectionHeader id={3} title="Education" icon={GraduationCap} />
        {activeSection === 3 && (
            <div className="p-5 bg-gray-50/50 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase">Latest Degree</p>
                <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="University Name" name="edu1_school" onChange={handleChange} className="input" />
                    <input type="text" placeholder="Date (e.g. 2026-2030)" name="edu1_date" onChange={handleChange} className="input" />
                    <input type="text" placeholder="Degree / Title" name="edu1_degree" onChange={handleChange} className="input col-span-2" />
                    <textarea placeholder="Short description..." name="edu1_desc" onChange={handleChange} className="input col-span-2 text-sm" rows="2" />
                </div>
            </div>
        )}

        {/* 4. Experience */}
        <SectionHeader id={4} title="Work Experience" icon={Briefcase} />
        {activeSection === 4 && (
            <div className="p-5 bg-gray-50/50 space-y-3">
                 <p className="text-xs font-bold text-gray-500 uppercase">Latest Job</p>
                 <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Company Name" name="exp1_company" onChange={handleChange} className="input" />
                    <input type="text" placeholder="Date (e.g. 2023-Present)" name="exp1_date" onChange={handleChange} className="input" />
                    <input type="text" placeholder="Position Title" name="exp1_role" onChange={handleChange} className="input col-span-2" />
                    <textarea placeholder="Job Responsibilities..." name="exp1_desc" onChange={handleChange} className="input col-span-2 text-sm" rows="3" />
                </div>
            </div>
        )}

        {/* 5. Projects (DYNAMIC MULTIPLE) */}
        <SectionHeader id={6} title="Projects" icon={FolderGit2} />
        {activeSection === 6 && (
            <div className="p-5 bg-gray-50/50 space-y-4">
                 
                 {/* List Existing Projects */}
                 {resumeData.projects && resumeData.projects.map((proj, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg bg-white relative group">
                        <div className="absolute top-2 right-2">
                             <button onClick={() => handleRemoveProject(index)} className="text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Project {index + 1}</p>
                        <div className="grid grid-cols-2 gap-3">
                            <input 
                                type="text" 
                                placeholder="Project Title" 
                                value={proj.title}
                                onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                                className="input col-span-2" 
                            />
                            <input 
                                type="text" 
                                placeholder="Tech Stack (e.g. React, Node)" 
                                value={proj.tech}
                                onChange={(e) => handleProjectChange(index, "tech", e.target.value)}
                                className="input col-span-2" 
                            />
                            <textarea 
                                placeholder="Description..." 
                                value={proj.desc}
                                onChange={(e) => handleProjectChange(index, "desc", e.target.value)}
                                className="input col-span-2 text-sm" 
                                rows="2" 
                            />
                        </div>
                    </div>
                 ))}

                 {/* Add New Button */}
                 <button 
                    onClick={handleAddProject}
                    className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-black hover:text-black transition-all font-medium text-sm"
                 >
                    <Plus className="w-4 h-4" /> Add Project
                 </button>
            </div>
        )}

        {/* 6. Skills */}
        <SectionHeader id={5} title="Skills" icon={LayoutList} />
        {activeSection === 5 && (
            <div className="p-5 bg-gray-50/50">
                <label className="lbl">Skills (Comma Separated)</label>
                <textarea name="skills" rows="3" onChange={handleChange} defaultValue={resumeData.skills} className="input" placeholder="Auditing, Financial Reporting, Accounting..." />
            </div>
        )}

      </div>

      <style jsx>{`
        .lbl { font-size: 0.75rem; font-weight: 600; color: #6b7280; margin-bottom: 2px; display: block; }
        .input { width: 100%; padding: 0.6rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; outline: none; font-size: 0.875rem; background: white; }
        .input:focus { border-color: black; ring: 1px black; }
      `}</style>
    </div>
  );
};

export default ResumeForm;