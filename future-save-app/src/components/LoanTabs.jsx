import React, { useState } from "react";
import PaymentBarChart from "./charts/PaymentBarChart";
import {
  ContributionIcon,
  LoanIcon,
  PercentIcon,
} from "../components/icons/Icons";
import formatTimeAgo from "../utils/formatTimeAgo";

const LoanTabs = ({ activities = [] }) => {
  const [activeTab, setActiveTab] = useState("activities");

  // const activities = [
  //   { icon: "👤", text: "Your 1st Guarantor accepted", time: "1 hour ago" },
  //   { icon: "👤", text: "Your 2nd Guarantor accepted", time: "1 day ago" },
  //   { icon: "🎯", text: "You applied for a loan", time: "1 week ago" },
  // ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg bg-white">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => handleTabClick("activities")}
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "activities"
              ? "border-b-2 border-primary text-black"
              : "text-gray-400"
          }`}
        >
          Activities
        </button>
        <button
          onClick={() => handleTabClick("payment")}
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "payment"
              ? "border-b-2 border-primary text-black"
              : "text-gray-400"
          }`}
        >
          Payment History/Tracking
        </button>
      </div>

      {/* Content */}
      {activeTab === "activities" && (
        <div className="mt-4 space-y-4">
          {activities?.slice().reverse().map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 text-white">
                <ContributionIcon color="white" />
              </div>
              <div>
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "payment" && (
        <div className="mt-4">
          <div className="flex items-center space-x-6 mt-4 text-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 mr-2"></div>
              <span style={{ fontSize: "14px" }}>Timely Payment</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
              <span style={{ fontSize: "14px" }}>Weekend Payment</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-2"></div>
              <span style={{ fontSize: "14px" }}>Advanced Payment</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-2"></div>
              <span style={{ fontSize: "14px" }}>Defaulted Payment</span>
            </div>
          </div>
          <div className="overflow-x-scroll">
            <PaymentBarChart />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanTabs;
