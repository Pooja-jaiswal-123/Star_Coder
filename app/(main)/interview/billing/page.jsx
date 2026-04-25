"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Download,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";

const BillingPage = () => {
  const { user } = useUser() || { user: { name: "User", credits: 10 } };
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for trying out the platform.",
      features: [
        "5 AI Interviews / month",
        "Basic Feedback Report",
        "Email Support",
        "No Credit Card Required",
      ],
      current: true,
      buttonText: "Current Plan",
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "15" : "12",
      description: "Best for active job seekers.",
      features: [
        "50 AI Interviews / month",
        "Detailed Analytics & Roadmap",
        "Priority Email Support",
        "Resume Analyzer Access",
      ],
      current: false,
      buttonText: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Elite",
      price: billingCycle === "monthly" ? "39" : "32",
      description: "For interview coaches & institutions.",
      features: [
        "Unlimited AI Interviews",
        "Custom Interview Questions",
        "24/7 Phone & Email Support",
        "White-label Reports",
      ],
      current: false,
      buttonText: "Upgrade to Elite",
    },
  ];

  const invoices = [
    {
      id: "INV-2026-001",
      date: "01 Apr 2026",
      amount: "$0.00",
      plan: "Free Tier",
      status: "Paid",
    },
    {
      id: "INV-2026-002",
      date: "01 Mar 2026",
      amount: "$0.00",
      plan: "Free Tier",
      status: "Paid",
    },
  ];

  // Logic for progress bar (Limits max width to 100%)
  const maxCredits = 5;
  const currentCredits = user?.credits || 0;
  const progressPercentage = Math.min((currentCredits / maxCredits) * 100, 100);

  return (
    // Top padding ko 0 kar diya hai (pt-0)
    <div className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 pt-0 bg-gray-50 min-h-screen font-sans animate-in fade-in duration-700 w-full overflow-x-hidden">
      {/* Negative margin (-mt-4 se -mt-8) lagaya hai taaki content upar pull ho jaye */}
      <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6 -mt-2 md:-mt-6 lg:-mt-8">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Billing & Subscription
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Manage your billing details, view invoices, and upgrade your plan.
          </p>
        </div>

        {/* 1. Current Plan Overview */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
              <Zap size={24} className="md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-medium text-gray-500 mb-0.5 uppercase tracking-wider">
                Your Current Plan
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Free Tier
              </h2>
              <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <ShieldCheck size={14} className="text-green-500 shrink-0" />{" "}
                Free forever, no hidden charges.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl md:rounded-2xl w-full lg:w-72 shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] md:text-xs font-semibold text-gray-700">
                Credits Available
              </span>
              <span className="text-sm md:text-base font-black text-blue-600">
                {currentCredits} / {maxCredits}
              </span>
            </div>
            {/* FIXED PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2 mb-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-[9px] md:text-[10px] text-gray-500 text-right">
              Resets on May 1st
            </p>
          </div>
        </div>

        {/* 2. Pricing Plans */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              Upgrade your plan
            </h2>

            {/* Monthly / Yearly Toggle */}
            <div className="bg-gray-100 p-1 rounded-lg flex items-center self-start sm:self-auto w-full sm:w-auto">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-[10px] md:text-xs font-semibold transition-all ${billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-[10px] md:text-xs font-semibold transition-all flex items-center justify-center gap-1 ${billingCycle === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Yearly{" "}
                <span className="hidden sm:inline-block bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl md:rounded-2xl p-5 md:p-6 border-2 transition-all duration-300 flex flex-col ${plan.popular ? "border-blue-600 shadow-lg lg:scale-105 z-10" : "border-gray-100 shadow-sm hover:border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5">
                  {plan.name}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500 mb-4 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="mb-5">
                  <span className="text-2xl md:text-3xl font-black text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/mo</span>
                </div>

                <ul className="space-y-2.5 md:space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[10px] md:text-xs text-gray-700"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-blue-500 shrink-0 mt-0.5"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-8 md:h-10 rounded-lg font-semibold text-xs transition-all ${plan.current ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}`}
                  disabled={plan.current}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Billing History */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-6">
          <div className="p-3 md:p-4 border-b border-gray-100 flex items-center gap-2">
            <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
            <h2 className="text-sm md:text-base font-bold text-gray-800">
              Billing History
            </h2>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-[9px] md:text-[10px] uppercase font-semibold">
                <tr>
                  <th className="px-3 md:px-5 py-2 md:py-3">Invoice ID</th>
                  <th className="px-3 md:px-5 py-2 md:py-3">Date</th>
                  <th className="px-3 md:px-5 py-2 md:py-3">Plan</th>
                  <th className="px-3 md:px-5 py-2 md:py-3">Amount</th>
                  <th className="px-3 md:px-5 py-2 md:py-3">Status</th>
                  <th className="px-3 md:px-5 py-2 md:py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-3 md:px-5 py-2.5 md:py-3.5 font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-3 md:px-5 py-2.5 md:py-3.5">
                      {invoice.date}
                    </td>
                    <td className="px-3 md:px-5 py-2.5 md:py-3.5">
                      {invoice.plan}
                    </td>
                    <td className="px-3 md:px-5 py-2.5 md:py-3.5 font-semibold text-gray-800">
                      {invoice.amount}
                    </td>
                    <td className="px-3 md:px-5 py-2.5 md:py-3.5">
                      <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-5 py-2.5 md:py-3.5 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors text-[10px] md:text-xs">
                        <Download size={12} />{" "}
                        <span className="hidden sm:inline">PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
