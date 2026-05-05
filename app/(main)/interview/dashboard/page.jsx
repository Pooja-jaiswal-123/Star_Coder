import React from "react";
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "../_components/CreateOptions";
import LatestInterviewsList from "../_components/LatestInterviewsList";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 overflow-hidden p-4 sm:p-6 lg:p-8">
      <WelcomeContainer />
      <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">
        Dashboard Overview
      </h2>
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  );
};

export default Dashboard;
