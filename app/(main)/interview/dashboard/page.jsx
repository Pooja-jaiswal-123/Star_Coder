import React from "react";
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "../_components/CreateOptions";
import LatestInterviewsList from "../_components/LatestInterviewsList";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-6 overflow-hidden ">
      <WelcomeContainer /> 
      <h2 className="font-bold text-2xl">Dashboard Overview</h2>
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  );
};

export default Dashboard;