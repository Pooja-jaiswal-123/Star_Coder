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

  // ✅ FIX: Yeh component load hote hi automatically sahi URL utha lega (chahe localhost ho ya Vercel)
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
    <div className="flex flex-col items-center py-10 px-4 w-full">
      <Image
        src="/cheak.png"
        alt="Checked"
        width={55}
        height={55}
        className="mb-3"
      />

      <h2 className="font-semibold text-2xl text-center">
        Your AI Interview is Ready!
      </h2>

      <p className="mt-2 text-gray-500 text-center text-sm max-w-sm">
        Share this link with your candidate to start the interview.
      </p>

      {/* CARD */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border px-6 py-8 mt-8">
        {/* HEADER FIXED RESPONSIVE */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-2">
          <h3 className="font-medium text-lg">Interview Link</h3>
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            Valid 30 Days
          </span>
        </div>

        {/* URL + COPY FIXED */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={GetInterviewUrl()}
            readOnly
            className="text-sm bg-gray-100 border rounded-md px-3 py-2 w-full focus:outline-none"
          />

          <Button
            size="sm"
            className={`text-xs px-3 h-10 w-full sm:w-auto ${
              copied ? "bg-green-600 hover:bg-green-700 text-white" : ""
            }`}
            onClick={handleCopy}
          >
            {copied ? (
              "Copied!"
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </>
            )}
          </Button>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-3 mt-5 text-xs text-gray-600 gap-2 text-center sm:text-left">
          <p className="flex items-center gap-1 justify-center sm:justify-start">
            <Clock className="h-3 w-3" /> {formData?.duration}m
          </p>
          <p className="flex items-center gap-1 justify-center sm:justify-start">
            <List className="h-3 w-3" /> {formData?.questions}
          </p>
          <p className="flex items-center gap-1 justify-center sm:justify-start">
            <Calendar className="h-3 w-3" /> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SHARE SECTION */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border px-6 py-8 mt-6">
        <h3 className="font-medium text-base mb-3 text-center">Share Via</h3>

        {/* SHARE BUTTONS FIXED — GRID ALWAYS STABLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-9"
            onClick={shareEmail}
          >
            <Mail className="h-3 w-3 mr-1" /> Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-9"
            onClick={shareSlack}
          >
            <Send className="h-3 w-3 mr-1" /> Slack
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-9"
            onClick={shareWhatsApp}
          >
            <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
          </Button>
        </div>
      </div>

      {/* BOTTOM BUTTONS — PERFECT RESPONSIVE FIX */}
      <div className="flex flex-col sm:flex-row w-full max-w-xl gap-3 mt-7">
        <Link href="/dashboard" className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-9 flex items-center justify-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </Button>
        </Link>

        <Link href="/create-interview" className="flex-1">
          <Button
            size="sm"
            className="w-full text-xs h-9 flex items-center justify-center gap-1"
          >
            <Plus className="h-3 w-3" /> New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewLink;
