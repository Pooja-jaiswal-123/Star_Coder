"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionListContainer from "./QuestionListContainer";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

const QuestionList = ({ formData, onCreateLink }) => {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState(null);

  // ✅ generate questions
  useEffect(() => {
    if (!formData?.jobPosition) return;
    generateQuestionList();
  }, [formData]);

  const generateQuestionList = async () => {
    try {
      setLoading(true);

      const result = await axios.post("/api/ai-model", formData);

      console.log("API RESPONSE:", result.data);

      // ✅ FIXED (NO JSON.parse)
      const questionsArray = result.data.questions || [];

      setQuestionList(questionsArray);

      toast.success("Questions Generated Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Server Error, Try Again!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAVE INTERVIEW
  const onFinish = async () => {
    setSaveLoading(true);

    if (!questionList.length) {
      toast.error("No questions to save!");
      setSaveLoading(false);
      return;
    }

    const interview_id = uuidv4();
    setGeneratedId(interview_id);

    const payload = {
      jobPosition: formData.jobPosition,
      jobDescription: formData.jobDescription,
      duration: formData.duration.toString(),
      interviewType: Array.isArray(formData.interviewType)
        ? formData.interviewType.join(", ")
        : formData.interviewType,
      questionList,
      userEmail: user?.email || "",
      interview_id,
    };

    const { error } = await supabase
      .from("interviews")
      .insert([payload]);

    if (error) {
      toast.error("Error saving interview!");
    } else {
      toast.success("Interview saved successfully!");
      onCreateLink(interview_id);
    }

    setSaveLoading(false);
  };

  const copyLink = () => {
    const link = `${process.env.NEXT_PUBLIC_HOST_URL}/interview/${generatedId}`;
    navigator.clipboard.writeText(link);
    toast.success("Interview link copied!");
  };

  return (
    <div>
      {/* LOADING */}
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl flex gap-5 items-center">
          <Loader2 className="animate-spin" />
          <div>
            <h1 className="font-medium">
              Generating Interview Questions...
            </h1>
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {!loading && questionList.length > 0 && (
        <div className="mt-5 p-5 bg-white rounded-xl shadow border">
          <QuestionListContainer questionlist={questionList} />
        </div>
      )}

      {/* FINISH BUTTON */}
      <div className="mt-5 flex justify-end">
        <Button onClick={onFinish} disabled={saveLoading}>
          {saveLoading && (
            <Loader2 className="animate-spin mr-2" />
          )}
          Create Interview Link & Finish
        </Button>
      </div>

      {/* LINK */}
      {generatedId && (
        <div className="mt-5 p-4 bg-gray-100 rounded-xl border">
          <p>
            <strong>Interview ID:</strong> {generatedId}
          </p>

          <Button onClick={copyLink} className="mt-3">
            <Copy size={16} /> Copy Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;