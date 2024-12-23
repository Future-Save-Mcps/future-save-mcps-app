import React, { useState } from "react";
import ProfileContent from "../../components/AccountPages/ProfileContent";
import AccountSettings from "../../components/AccountPages/AccountSettings";
import BankAndWithdrawal from "../../components/AccountPages/BankAndWithdrawal";
import ReferAndEarn from "../../components/AccountPages/ReferAndEarn";
import ContactUs from "../../components/AccountPages/ContactUs";
import { LoanIcon } from "../../components/icons/Icons";

const Account = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    { name: "Profile", component: <ProfileContent /> },
    { name: "Account Settings", component: <AccountSettings /> },
    { name: "Bank & Withdrawal", component: <BankAndWithdrawal /> },
    { name: "Refer and Earn", component: <ReferAndEarn /> },
    { name: "Contact Us", component: <ContactUs /> },
  ];

  const renderContent = () => {
    const active = tabs.find((tab) => tab.name === activeTab);
    return active ? active.component : <ProfileContent />;
  };

  return (
    <div className="flex md:flex-row flex-col gap-6 ">
      <div className="md:w-1/4 h-fit  w-[100%] md:h-[70vh] min-w-[220px] rounded-xl bg-gray-100 p-5">
        <ul className="md:space-y-8  w-[100%] md:block flex flex-wrap flex-row">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={`p-3 cursor-pointer flex gap-2 items-center rounded-lg ${
                activeTab === tab.name ? "bg-[#fff] black" : "text-[#777]"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <LoanIcon color="#777" /> {tab.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-8  min-h-[75vh]">{renderContent()}</div>
    </div>
  );
};

export default Account;
