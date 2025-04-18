import React from "react";
import { WarningIcon } from "../icons/Icons";

const Warning = ({ WarningType, text }) => {
  return (
    <div
      className={` p-3 flex gap-4 items-center rounded-lg mb-4 ${
        WarningType === "Red"
          ? "bg-[#FB03001A] text-[#FB0300]"
          : WarningType === "Yellow"
          ? "bg-[#FFBF001A] text-[#FFBF00]"
          : WarningType === "Green"
          ? "bg-[#34C7591A] text-[#34C759]"
          : null
      }`}
    >
      <WarningIcon /> {text}
    </div>
  );
};

export default Warning;
