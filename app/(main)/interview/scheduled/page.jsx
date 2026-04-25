"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Trophy,
  Search,
  Loader2,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/app/provider";
import { supabase } from "@/lib/supabaseClient";

const ScheduledPage = () => {
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
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("userEmail", user.email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setInterviews(data);
    } catch (error) {
      console.error("Database Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter((item) =>
    (item.jobPosition || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Interview History
          </h1>
          <p className="text-gray-500 text-sm">
            Your past AI interview performances
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-gray-400 text-sm italic">Loading history...</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center bg-white p-16 rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">No interviews found.</p>
          <Link
            href="/dashboard"
            className="text-indigo-600 font-bold hover:underline"
          >
            Start New Interview
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((item) => {
            const interviewId = item.mockId || item.id;

            return (
              <Link
                // UPDATE: Aapke naye folder structure ke hisaab se path fix kiya
                href={`/interview/${interviewId}/feedback`}
                key={interviewId}
                className="block group"
              >
                <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all duration-200 relative overflow-hidden h-full">
                  {/* Badge Score (Top Right) */}
                  <div className="absolute top-4 right-4 text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase">
                      Score
                    </div>
                    <div className="text-xl font-black text-indigo-600">
                      {item.overallScore || 0}
                      <span className="text-[10px] text-gray-400">/10</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Briefcase size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 capitalize group-hover:text-indigo-600 transition-colors">
                      {item.jobPosition}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} className="text-gray-400" />
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("en-IN")
                        : "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} className="text-gray-400" />
                      {item.jobExperience} Years Exp.
                    </div>
                  </div>

                  <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(item.overallScore || 0) * 10}%` }}
                    ></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduledPage;
