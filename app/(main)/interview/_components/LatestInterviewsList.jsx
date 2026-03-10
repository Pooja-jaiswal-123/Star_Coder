"use client";

import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link"; // ✅ Import Link

const LatestInterviewsList = () => {
  const [interviewsList] = useState([]);

  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl">Previously Created Interviews</h2>

      {interviewsList.length === 0 && (
        <div className="p-6 flex flex-col items-center text-center gap-4 bg-white shadow rounded-xl mt-5 w-[420px] mx-auto">
          <Video className="h-10 w-10 text-primary" />

          <h2 className="font-medium text-gray-700 text-base">
            You don't have any interview created
          </h2>

          {/* ✅ Navigation Link Added */}
          <Link href={"/interview/create-interview"}>
            <Button size="sm" className="px-5 py-2 text-base font-medium">
              + Create New Interview
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestInterviewsList;