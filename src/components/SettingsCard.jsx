import React from 'react';
import Profile from "../assets/profile.svg"
import Password from "../assets/Lock.svg"
const icons = {
  profile: Profile,
  password: Password,
};

export default function SettingCard({ type, label, onClick }) {
    const Icon = icons[type];
  
    return (
      <div
        className="flex items-center p-4 border rounded-lg cursor-pointer hover:shadow-md transition"
        onClick={onClick}
      >
        <img src={Icon} alt={`${type} icon`} className="w-6 h-6 mr-3" />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
    );
  }
  