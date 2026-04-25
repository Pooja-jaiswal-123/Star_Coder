"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Globe,
  Camera,
  Loader2,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const { user } = useUser() || {
    user: { name: "Rakesh Maurya", email: "rakesh@example.com" },
  };

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    jobTitle: "Software Developer",
  });

  const [notifications, setNotifications] = useState({
    interviewReminders: true,
    weeklyReports: true,
    productUpdates: false,
  });

  const handleSave = () => {
    setIsSaving(true);
    setShowSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "preferences", label: "Preferences", icon: <Globe size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header & Success Toast */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Action Button & Toast */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            <div
              className={`flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200 transition-all duration-500 absolute md:relative right-4 md:right-auto top-20 md:top-auto z-50 ${showSuccess ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
            >
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-semibold">Saved successfully</span>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 h-10 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 w-full md:w-auto"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full animate-in fade-in zoom-in duration-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="pb-10">
          {/* --- PROFILE TAB --- */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Avatar Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 flex items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase ring-1 ring-gray-100 shadow-inner">
                    {profileData.firstName[0]}
                    {profileData.lastName[0] || ""}
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-2 bg-white border border-gray-200 text-gray-700 rounded-full shadow-sm hover:bg-gray-50 transition-all group-hover:scale-105">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Profile Picture
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG or JPG no larger than 5MB.
                  </p>
                </div>
              </div>

              {/* Personal Info Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-base font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your basic profile details.
                  </p>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Current Role
                    </label>
                    <input
                      type="text"
                      value={profileData.jobTitle}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          jobTitle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-base font-bold text-gray-900">
                    Email Address
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    The email associated with your account.
                  </p>
                </div>
                <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {profileData.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Verified primary email
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-sm text-gray-600 rounded-xl h-9"
                  >
                    Change Email
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* --- PREFERENCES TAB --- */}
          {activeTab === "preferences" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-base font-bold text-gray-900">
                    Regional Settings
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize your language and timezone.
                  </p>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Language
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50/50 focus:bg-white text-sm">
                      <option>English (US)</option>
                      <option>Hindi (IN)</option>
                      <option>Spanish (ES)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Timezone
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50/50 focus:bg-white text-sm">
                      <option>(GMT+05:30) Indian Standard Time</option>
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- NOTIFICATIONS TAB --- */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-base font-bold text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Choose what updates you want to receive.
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="p-6 md:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="pr-4">
                      <h3 className="text-sm font-bold text-gray-900">
                        Interview Reminders
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Get an email 1 hour before scheduled interviews.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.interviewReminders}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            interviewReminders:
                              !notifications.interviewReminders,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="p-6 md:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="pr-4">
                      <h3 className="text-sm font-bold text-gray-900">
                        Weekly Performance Report
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive a weekly summary of your interview scores.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.weeklyReports}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            weeklyReports: !notifications.weeklyReports,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="p-6 md:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="pr-4">
                      <h3 className="text-sm font-bold text-gray-900">
                        Product Updates
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Hear about new features and interview tips.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.productUpdates}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            productUpdates: !notifications.productUpdates,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SECURITY TAB --- */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-base font-bold text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ensure your account is using a long, random password.
                  </p>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full md:max-w-md px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50/50 focus:bg-white"
                    />
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

export default SettingsPage;
