"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  Loader2,
  Plus,
  Briefcase,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/app/provider";
import { supabase } from "@/lib/supabaseClient";

const AllInterviewsPage = () => {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetchInterviews();
    } else {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("userEmail", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch interviews:", error.message);
      } else if (data) {
        setInterviews(data);
      }
    } catch (error) {
      console.error("Error connecting to database:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const roleName = item.jobPosition || "";
    return roleName.toLowerCase().includes(searchLower);
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              All Interviews
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track your past performance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
              />
            </div>
            <Link href="/dashboard">
              <button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm">
                <Plus size={18} /> New Interview
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-5">Interview Details</div>
            <div className="col-span-3">Date & Time</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Overall Score</div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                <p className="text-gray-500 text-sm italic">
                  Syncing records...
                </p>
              </div>
            ) : filteredInterviews.length === 0 ? (
              <div className="text-center py-20 px-4">
                <p className="text-gray-400 text-sm">No interviews found.</p>
              </div>
            ) : (
              filteredInterviews.map((item) => {
                const targetId = item.mockId || item.id;
                return (
                  <Link
                    // SIRF YE LINE UPDATE KI HAI: Folder path ke matching
                    href={`/interview/${targetId}/feedback`}
                    key={item.id || item.mockId}
                    className="block group hover:bg-blue-50/30 transition-all cursor-pointer"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 items-center">
                      <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors capitalize">
                            {item.jobPosition}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-tighter font-medium">
                            AI Session
                          </p>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-3 flex items-center gap-4 md:gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-300" />
                          <span>
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString(
                                  "en-IN",
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <span className="md:hidden text-gray-200">|</span>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-300" />
                          <span>{item.duration || "15m"}</span>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-tight">
                          {item.status || "Completed"}
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center md:justify-end gap-1.5">
                        <Star
                          size={14}
                          className={`${
                            item.overallScore >= 7
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                        <span className="font-black text-gray-900 text-lg">
                          {item.overallScore || 0}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          / 10
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInterviewsPage;
