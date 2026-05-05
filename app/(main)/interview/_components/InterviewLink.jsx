"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  MessageCircle,
  Send,
  Plus,
} from "lucide-react";

const InterviewLink = ({ interview_id, formData }) => {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  // ✅ FIX: Yeh component load hote hi automatically sahi URL utha lega
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const GetInterviewUrl = () => {
    return `${origin}/interview/${interview_id}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(GetInterviewUrl());
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  const shareEmail = () => {
    const subject = "AI Interview Invitation";
    const body = `Hello,\n\nPlease attend the AI interview using this link: ${GetInterviewUrl()}\n\nBest regards,`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body,
      )}`,
      "_blank",
    );
  };

  const shareWhatsApp = () => {
    const msg = `Your AI Interview link: ${GetInterviewUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const shareSlack = () => {
    toast.info("Slack integration coming soon!");
  };

  return (
    // 📱 RESPONSIVE: py-6 for mobile, py-10 for desktop
    <div className="flex flex-col items-center py-6 sm:py-10 px-4 w-full">
      <Image
        src="/cheak.png"
        alt="Checked"
        // 📱 RESPONSIVE: Image size slightly smaller on mobile
        width={45}
        height={45}
        className="mb-3 sm:w-[55px] sm:h-[55px]"
      />

      {/* 📱 RESPONSIVE: Text size adjusted */}
      <h2 className="font-semibold text-xl sm:text-2xl text-center">
        Your AI Interview is Ready!
      </h2>

      <p className="mt-2 text-gray-500 text-center text-xs sm:text-sm max-w-sm">
        Share this link with your candidate to start the interview.
      </p>

      {/* CARD 1 */}
      {/* 📱 RESPONSIVE: Padding px-4 py-6 for mobile, larger for desktop */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border px-4 py-6 sm:px-6 sm:py-8 mt-6 sm:mt-8">
        {/* HEADER */}
        <div className="flex flex-row justify-between items-center mb-4 sm:mb-5 gap-2">
          <h3 className="font-medium text-base sm:text-lg">Interview Link</h3>
          <span className="text-[10px] sm:text-xs px-2 py-1 sm:px-3 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
            Valid 30 Days
          </span>
        </div>

        {/* URL + COPY */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            value={GetInterviewUrl()}
            readOnly
            className="text-xs sm:text-sm bg-gray-100 border rounded-md px-3 py-2.5 w-full focus:outline-none truncate"
          />

          <Button
            size="sm"
            className={`text-xs px-3 h-10 w-full sm:w-auto transition-colors duration-200 ${
              copied ? "bg-green-600 hover:bg-green-700 text-white" : ""
            }`}
            onClick={handleCopy}
          >
            {copied ? (
              "Copied!"
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
              </>
            )}
          </Button>
        </div>

        {/* DETAILS */}
        {/* 📱 RESPONSIVE: flex-wrap ensures it looks good even on very small screens */}
        <div className="flex flex-wrap justify-between sm:grid sm:grid-cols-3 mt-5 text-[11px] sm:text-xs text-gray-600 gap-3 text-center sm:text-left bg-gray-50 p-3 rounded-lg border">
          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Clock className="h-3.5 w-3.5 text-gray-500" /> {formData?.duration}
            m
          </p>
          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
            <List className="h-3.5 w-3.5 text-gray-500" />{" "}
            {formData?.questions || "N/A"} Qs
          </p>
          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
            <Calendar className="h-3.5 w-3.5 text-gray-500" />{" "}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SHARE SECTION */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border px-4 py-6 sm:px-6 sm:py-8 mt-5 sm:mt-6">
        <h3 className="font-medium text-sm sm:text-base mb-4 text-center">
          Share Via
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-10 sm:h-9 hover:bg-gray-50"
            onClick={shareEmail}
          >
            <Mail className="h-4 w-4 sm:h-3 sm:w-3 mr-2 sm:mr-1" /> Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-10 sm:h-9 hover:bg-gray-50"
            onClick={shareSlack}
          >
            <Send className="h-4 w-4 sm:h-3 sm:w-3 mr-2 sm:mr-1" /> Slack
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-10 sm:h-9 hover:bg-[#25D366] hover:text-white transition-colors"
            onClick={shareWhatsApp}
          >
            <MessageCircle className="h-4 w-4 sm:h-3 sm:w-3 mr-2 sm:mr-1" />{" "}
            WhatsApp
          </Button>
        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex flex-col-reverse sm:flex-row w-full max-w-xl gap-3 mt-6 sm:mt-7">
        <Link href="/dashboard" className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-10 sm:h-9 flex items-center justify-center gap-2 sm:gap-1"
          >
            <ArrowLeft className="h-4 w-4 sm:h-3 sm:w-3" /> Back to Dashboard
          </Button>
        </Link>

        <Link href="/create-interview" className="flex-1">
          <Button
            size="sm"
            className="w-full text-xs h-10 sm:h-9 flex items-center justify-center gap-2 sm:gap-1"
          >
            <Plus className="h-4 w-4 sm:h-3 sm:w-3" /> New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewLink;
