"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/lib/services/Constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FormContainer = ({ onHandleInputChange, GoToNext }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  // ✅ FIX: Calculate Logic First, Then Update State & Parent
  const handleInterviewTypeClick = (type) => {
    // 1. Calculate what the new selection will be
    const isAlreadySelected = selectedTypes.includes(type.title);
    let newSelection;

    if (isAlreadySelected) {
      newSelection = selectedTypes.filter((t) => t !== type.title);
    } else {
      newSelection = [...selectedTypes, type.title];
    }

    // 2. Update Local State
    setSelectedTypes(newSelection);

    // 3. Update Parent State (Safe execution)
    if (onHandleInputChange) {
      onHandleInputChange("interviewType", newSelection);
    }
  };

  return (
    // 📱 RESPONSIVE: p-4 on mobile, sm:p-6 on desktop
    <div className="p-4 sm:p-6 bg-white rounded-2xl border shadow-sm">
      {/* Job Position */}
      <div>
        <h2 className="text-sm sm:text-base font-medium text-gray-700">
          Job Position
        </h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2 text-sm sm:text-base"
          onChange={(e) => onHandleInputChange?.("jobPosition", e.target.value)}
        />
      </div>

      {/* Job Description */}
      <div className="mt-4">
        <h2 className="text-sm sm:text-base font-medium text-gray-700">
          Job Description
        </h2>
        <Textarea
          placeholder="Enter detailed job description, tech stack, and requirements..."
          // 📱 RESPONSIVE: Height reduced on mobile (h-[120px]) so it doesn't cover the whole screen
          className="h-[120px] sm:h-[150px] mt-2 resize-none text-sm sm:text-base"
          onChange={(e) =>
            onHandleInputChange?.("jobDescription", e.target.value)
          }
        />
      </div>

      {/* Interview Duration */}
      <div className="mt-5">
        <h2 className="text-sm sm:text-base font-medium text-gray-700">
          Interview Duration
        </h2>
        <Select
          onValueChange={(value) => onHandleInputChange?.("duration", value)}
        >
          <SelectTrigger className="w-full mt-2 text-sm sm:text-base">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Min</SelectItem>
            <SelectItem value="15">15 Min</SelectItem>
            <SelectItem value="30">30 Min</SelectItem>
            <SelectItem value="45">45 Min</SelectItem>
            <SelectItem value="60">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interview Type */}
      <div className="mt-5">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700">
          Interview Type
        </h2>

        {/* 📱 RESPONSIVE: Gap reduced on mobile (gap-2) to fit more tags */}
        <div className="flex gap-2 sm:gap-4 flex-wrap mt-3">
          {InterviewType.map((type, index) => {
            const isSelected = selectedTypes.includes(type.title);

            return (
              <div
                key={index}
                onClick={() => handleInterviewTypeClick(type)}
                // 📱 RESPONSIVE: Padding and font size adjusted for mobile
                className={`flex items-center gap-2 sm:gap-3 cursor-pointer p-2 px-3 sm:p-3 sm:px-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md
                  ${
                    isSelected
                      ? "bg-primary text-white border-primary ring-2 ring-primary ring-offset-1"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
                  }
                `}
              >
                {/* Render Icon if it exists - Size adjusted for mobile */}
                {type.icon && <type.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                <span className="text-xs sm:text-sm font-medium">
                  {type.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Button */}
      {/* 📱 RESPONSIVE: Full width button on mobile (w-full), auto width & right-aligned on desktop */}
      <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
        <Button
          className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
          onClick={GoToNext}
          disabled={selectedTypes.length === 0}
        >
          Generate Question <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;
