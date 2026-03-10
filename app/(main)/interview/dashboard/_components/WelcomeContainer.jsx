"use client";
import { useUser } from "@/app/provider";
import Image from "next/image";
import React from "react";

const WelcomeContainer = () => {
  const { user } = useUser();
  return (
    <div className="bg-white p-5 rounded-2xl w-full shadow-md border border-gray-200 flex justify-between items-center">
      {/* LEFT SIDE TEXT */}
      <div>
        <h2 className="text-lg font-bold">Welcome Back, {user?.name}</h2>
        <h2 className="text-gray-600 text-sm">
          AI-Driven Interview, Hassle-Free Hiring
        </h2>
      </div>

      {/* RIGHT SIDE IMAGE */}
      {user && (
        <Image
          src={user.picture}
          alt="userAvatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
    </div>
  );
};

export default WelcomeContainer;
