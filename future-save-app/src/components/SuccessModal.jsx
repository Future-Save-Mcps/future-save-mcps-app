import React from "react";
import success from "../assets/success.gif";
import { motion } from "framer-motion";

const SuccessModal = ({ open, setOpen }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white px-8 py-4 rounded-lg shadow-lg text-center w-[550px] max-w-[90%]" // Wider, shorter modal
      >
        <img src={success} alt="Success" className="w-48 mx-auto" /> {/* Smaller GIF */}
        <h2 className="text-2xl font-semibold mt-4 text-[#171717]">Success!</h2>
        <p className="text-[#939393] mt-2 text-lg">
          You have successfully added a user. A password and the link to the
          user's portal have been sent.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="mt-4 bg-[#F8F8FA] w-full text-[#171717] px-6 py-3 rounded-md text-lg font-medium"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessModal;
