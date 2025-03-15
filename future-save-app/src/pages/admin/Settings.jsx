import React, { useState } from 'react'

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
    {name: "Subscription", Icon: SubscriptionIcon, component: <Subscription />}
  ];

  return (
    <div>Settings</div>
  )
}

export default Settings