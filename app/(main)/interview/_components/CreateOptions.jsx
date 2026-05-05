import { Phone, Video } from "lucide-react";
import React from "react";
import Link from "next/link";

const CreateOptions = () => {
  return (
    // 📱 RESPONSIVE CHANGES:
    // grid-cols-1 (mobile ke liye 1 column) -> sm:grid-cols-2 (badi screen par 2 columns)
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {/* CARD 1 */}
      <Link href="/interview/create-interview" className="block">
        {/* Mobile par padding thodi kam (p-4) rakhi hai */}
        <div className="bg-white cursor-pointer border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col items-start gap-3">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Video className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="font-bold text-gray-800 text-base sm:text-lg">
            Create New Interview
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            Create AI interviews and schedule them with candidates.
          </p>
        </div>
      </Link>

      {/* CARD 2 - Updated with Link */}
      <Link href="/interview/phone-screening" className="block">
        <div className="bg-white cursor-pointer border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col items-start gap-3">
          <div className="p-3 bg-green-50 rounded-xl">
            <Phone className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="font-bold text-gray-800 text-base sm:text-lg">
            Create Phone Screening Call
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            Schedule phone screening call with candidates.
          </p>
        </div>
      </Link>
    </div>
  );
};
export default CreateOptions;
