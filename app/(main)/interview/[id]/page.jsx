"use client";

import React, { useEffect, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { InterviewDataContext } from "@/context/interviewDataContext";
import StartInterview from "./_components/AlertConfirmation";
import { Loader2 } from "lucide-react";

const InterviewPage = () => {
  const { id } = useParams();
  const { setInterviewInfo } = useContext(InterviewDataContext);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", id)
      .single();

    if (error || !data) {
      console.error("Fetch Error:", error);
      setNotFound(true);
      setLoading(false);
      return;
    }

    setInterviewInfo({
      userName: "Guest",
      interviewData: data,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="h-screen flex justify-center items-center flex-col gap-4">
        <h2 className="text-xl font-bold text-red-500">Interview Not Found</h2>
        <p>This interview link is invalid or expired.</p>
      </div>
    );
  }

  return <StartInterview />;
};

export default InterviewPage;
