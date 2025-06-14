import React, { useState } from "react";
import SettingCard from "../SettingsCard";
import ProfileModal from "../ProfileModal";
import PasswordModal from "../PasswordModal";

export default function AccountSettings() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const openModal = (type) => {
    if (type === "profile") setIsProfileModalOpen(true);
    if (type === "password") setIsPasswordModalOpen(true);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingCard
          type="profile"
          label="Profile settings"
          onClick={() => openModal("profile")}
        />
        <SettingCard
          type="password"
          label="Password settings"
          onClick={() => openModal("password")}
        />
      </div>

      {isProfileModalOpen && (
        <ProfileModal
          open={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isPasswordModalOpen && (
        <PasswordModal
          open={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}
