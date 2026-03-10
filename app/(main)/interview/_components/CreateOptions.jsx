import { Phone, Video } from "lucide-react";
import React from "react";
import Link from "next/link";

const CreateOptions = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      {/* CARD 1 */}
      <Link href="/dashboard/create-interview" className="block">
        <div className="bg-white cursor-pointer border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-start gap-3">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Video className="text-blue-600" />
          </div>
          <h2 className="font-bold text-gray-800">Create New Interview</h2>
          <p className="text-gray-500 text-sm">
            Create AI interviews and schedule them with candidates.
          </p>
        </div>
      </Link>

      {/* CARD 2 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-start gap-3">
        <div className="p-3 bg-green-50 rounded-xl">
          <Phone className="text-green-600" />
        </div>
        <h2 className="font-bold text-gray-800">Create Phone Screening Call</h2>
        <p className="text-gray-500 text-sm">
          Schedule phone screening call with candidates.
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;
