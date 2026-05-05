"use client";

import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import FormContainer from "../../interview/_components/FormContainer";
import QuestionList from "../../interview/_components/QuestionList";
import { toast } from "sonner";
import InterviewLink from "../../interview/_components/InterviewLink";

const CreateInterview = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [interview_id, setInterview_id] = useState();
  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDescription: "",
    duration: "",
    interviewType: [],
  });

  // ✅ CRITICAL FIX: Wrapped in useCallback to prevent Infinite Loop
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      // Optimization: If value hasn't changed, don't update state
      if (prev[field] === value) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  // 🔹 Step 1 validation before going to Step 2
  const handleNextStep = () => {
    if (
      !formData.jobPosition?.trim() ||
      !formData.jobDescription?.trim() ||
      !formData.duration ||
      formData.interviewType.length === 0
    ) {
      toast.warning("⚠️ Please fill all fields");
      return;
    }

    setStep(2); // Move to Question Generation
  };

  // 🔹 Step 2 → Step 3 transition with interview ID
  const onCreateLink = (id) => {
    setInterview_id(id);
    setStep(3); // Move to final link display
  };

  return (
    // 📱 RESPONSIVE CHANGES HERE:
    // mt-6 (mobile) -> sm:mt-10 (tablet/desktop)
    // px-4 (mobile) -> sm:px-10 -> md, lg, xl same as before
    <div className="mt-6 sm:mt-10 px-4 sm:px-10 md:px-24 lg:px-44 xl:px-56">
      {/* Back Button + Title */}
      <div className="flex gap-3 sm:gap-5 items-center">
        {/* Icon size slightly smaller on mobile if needed, though default is usually fine */}
        <ArrowLeft
          onClick={() => router.back()}
          className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
        />
        {/* text-xl for mobile, text-2xl for bigger screens */}
        <h2 className="font-bold text-xl sm:text-2xl">Create New Interview</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={step * 50} className="my-4 sm:my-5" />

      {/* Step 1 → Form */}
      {step === 1 && (
        <FormContainer
          onHandleInputChange={handleInputChange}
          GoToNext={handleNextStep}
        />
      )}

      {/* Step 2 → Questions */}
      {step === 2 && (
        <QuestionList formData={formData} onCreateLink={onCreateLink} />
      )}

      {/* Step 3 → Final Link */}
      {step === 3 && (
        <InterviewLink interview_id={interview_id} formData={formData} />
      )}
    </div>
  );
};

export default CreateInterview;
