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
    <div className="p-5 bg-white rounded-2xl border shadow-sm">
      {/* Job Position */}
      <div>
        <h2 className="text-sm font-medium text-gray-700">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          onChange={(e) => onHandleInputChange?.("jobPosition", e.target.value)}
        />
      </div>

      {/* Job Description */}
      <div className="mt-4">
        <h2 className="text-sm font-medium text-gray-700">Job Description</h2>
        <Textarea
          placeholder="Enter detailed job description, tech stack, and requirements..."
          className="h-[150px] mt-2 resize-none"
          onChange={(e) =>
            onHandleInputChange?.("jobDescription", e.target.value)
          }
        />
      </div>

      {/* Interview Duration */}
      <div className="mt-5">
        <h2 className="text-sm font-medium text-gray-700">
          Interview Duration
        </h2>
        <Select
          onValueChange={(value) => onHandleInputChange?.("duration", value)}
        >
          <SelectTrigger className="w-full mt-2">
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
        <h2 className="text-sm font-semibold text-gray-700">Interview Type</h2>

        <div className="flex gap-4 flex-wrap mt-3">
          {InterviewType.map((type, index) => {
            const isSelected = selectedTypes.includes(type.title);

            return (
              <div
                key={index}
                onClick={() => handleInterviewTypeClick(type)}
                className={`flex items-center gap-3 cursor-pointer p-3 px-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md
                  ${
                    isSelected
                      ? "bg-primary text-white border-primary ring-2 ring-primary ring-offset-1"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
                  }
                `}
              >
                {/* Render Icon if it exists */}
                {type.icon && <type.icon className="h-5 w-5" />}
                <span className="text-sm font-medium">{type.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Button */}
      <div className="mt-8 flex justify-end">
        <Button
          className="cursor-pointer flex items-center gap-2"
          onClick={GoToNext}
          disabled={selectedTypes.length === 0} // Optional: Disable if no type selected
        >
          Generate Question <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;
