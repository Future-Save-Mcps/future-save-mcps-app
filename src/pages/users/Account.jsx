import React, { useState } from "react";
import ProfileContent from "../../components/AccountPages/ProfileContent";
import AccountSettings from "../../components/AccountPages/AccountSettings";
import BankAndWithdrawal from "../../components/AccountPages/BankAndWithdrawal";
import ReferAndEarn from "../../components/AccountPages/ReferAndEarn";
import ContactUs from "../../components/AccountPages/ContactUs";
import { LoanIcon } from "../../components/icons/Icons";
import { Icon } from "@mui/material";
import Profile from "../../assets/profile.svg";
import ReferIcon from "../../assets/referIcon.svg";
import AccountIcon from "../../assets/account.svg";
import Contact from "../../assets/contact.svg";
import SubscriptionIcon from "../../assets/subIcon.svg";
import Bank from "../../assets/bank.svg";
import { useApiGet } from "../../hooks/useApi";
import Subscription from "../../components/AccountPages/Subscription";

const Account = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  // const userData = getUserData();

  const { data: userData, isLoading, error, refetch } = useApiGet("user");

  const tabs = [
    {
      name: "Profile",
      Icon: Profile,
      component: <ProfileContent refetch={refetch} userData={userData} />,
    },
    {
      name: "Account Settings",
      Icon: AccountIcon,
      component: <AccountSettings />,
    },
    {
      name: "Bank & Withdrawal",
      Icon: Bank,
      component: <BankAndWithdrawal refetch={refetch} userData={userData} />,
    },
    { name: "Refer and Earn", Icon: ReferIcon, component: <ReferAndEarn /> },
    { name: "Contact Us", Icon: Contact, component: <ContactUs /> },
    {
      name: "Subscription",
      Icon: SubscriptionIcon,
      component: <Subscription />,
    },
  ];

  const renderContent = () => {
    const active = tabs.find((tab) => tab.name === activeTab);
    return active ? active.component : <ProfileContent userData={userData} />;
  };

  return (
    <div className="flex md:flex-row flex-col gap-6 ">
      <div className="md:w-1/4 h-fit  w-[100%] md:h-[70vh] min-w-[220px] rounded-xl bg-gray-100 p-4">
        <ul className="md:space-y-8  w-[100%] md:block flex flex-wrap flex-row">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={`p-3 cursor-pointer flex gap-3 items-center rounded-lg ${
                activeTab === tab.name ? "bg-[#fff] text-[#777]" : "text-[#777]"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <img src={tab.Icon} alt="" /> {tab.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4  min-h-[75vh]">{renderContent()}</div>
    </div>
  );
};

export default Account;
