import React, { useState } from 'react'
import LockIcon from "../../assets/lockIcon.svg"
import Security from '@/components/SettingsPages/Security';
const Settings = () => {
  const [activeTab, setActiveTab] = useState("Security Settings");

  const tabs = [
    // {
    //   name: "Profile",
    //   Icon: Profile,
    //   component: <ProfileContent refetch={refetch} userData={userData} />,
    // },
    {
      name: "Account Settings",
      Icon: LockIcon,
      component: <Security />,
    },



    // {
    //   name: "Bank & Withdrawal",
    //   Icon: Bank,
    //   component: <BankAndWithdrawal refetch={refetch} userData={userData} />,
    // },
    // { name: "Refer and Earn", Icon: ReferIcon, component: <ReferAndEarn /> },
    // { name: "Contact Us", Icon: Contact, component: <ContactUs /> },
    // {name: "Subscription", Icon: SubscriptionIcon, component: <Subscription />}
  ];
  const renderContent = () => {
    const active = tabs.find((tab) => tab.name === activeTab);
    return active ? active.component : <Security />;
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
  )
}

export default Settings