// import { PaystackButton } from "react-paystack"

// const ReusablePaystackButton = ({
//   email,
//   amount,
//   currency = "NGN",
//   metadata = {},
//   onSuccess,
//   onClose,
//   text = "Pay Now",
//   className = "",
//   disabled = false,
//   ...otherProps
// }) => {
//     const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

//   const componentProps = {
//     email,
//     amount: amount * 100, // Convert to kobo
//     currency,
//     metadata,
//     publicKey,
//     text,
//     onSuccess: (reference) => {
//       console.log("Payment successful!", reference)
//       if (onSuccess) {
//         onSuccess(reference)
//       }
//     },
//     onClose: () => {
//       console.log("Payment dialog closed")
//       if (onClose) {
//         onClose()
//       }
//     },
//     ...otherProps,
//   }

//   if (!publicKey) {
//     console.error("Paystack public key is not set")
//     return (
//       <button disabled className={`bg-red-500 text-white px-4 py-2 rounded ${className}`}>
//         Paystack key not configured
//       </button>
//     )
//   }

//   if (!email || !amount) {
//     return (
//       <button disabled className={`bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed ${className}`}>
//         {text}
//       </button>
//     )
//   }

//   return (
//     <PaystackButton
//       {...componentProps}
//       className={`  text-white font-bold py-2 px-4 rounded transition duration-200 ${className} ${
//         disabled ? "opacity-50 cursor-not-allowed" : ""
//       }`}
//       disabled={disabled}
//     />
//   )
// }

// export default ReusablePaystackButton

"use client";

import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "none",
  borderRadius:4,
  boxShadow: 24,
  p: 4,
};

const ReusablePaystackButton = ({
  email,
  amount,
  currency = "NGN",
  metadata = {},
  onSuccess,
  onClose,
  text = "Pay Now",
  className = "",
  disabled = false,
  autoCloseDelay = 60000,
  afterClose,
  ...otherProps
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [autoCloseEnabled, setAutoCloseEnabled] = useState(true);

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  // Auto-close countdown effect
  useEffect(() => {
    if (!showSuccessModal || !autoCloseEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleCloseSuccessModal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showSuccessModal, autoCloseEnabled]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    afterClose();
    setPaymentData(null);
    setCountdown(0);
    setAutoCloseEnabled(true);
  };

  const componentProps = {
    email,
    amount: amount * 100, // Convert to kobo
    currency,
    metadata,
    publicKey,
    text,
    onSuccess: (reference) => {
      console.log("Payment successful!", reference);
      setShowSuccessModal(true);

      // Store payment data for the success modal
      setPaymentData({
        reference: reference.reference,
        amount: amount,
        email: email,
        transactionId: reference.trans,
        metadata: metadata,
      });

      // Set countdown and show modal
      setCountdown(autoCloseDelay / 1000);

      // Call external onSuccess if provided
      if (onSuccess) {
        onSuccess(reference);
      }
    },
    onClose: () => {
      console.log("Payment dialog closed");
      if (onClose) {
        onClose();
      }
    },
    ...otherProps,
  };

  if (!publicKey) {
    console.error("Paystack public key is not set");
    return (
      <button
        disabled
        className={`bg-red-500 text-white px-4 py-2 rounded ${className}`}
      >
        Paystack key not configured
      </button>
    );
  }

  if (!email || !amount) {
    return (
      <button
        disabled
        className={`bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed ${className}`}
      >
        {text}
      </button>
    );
  }

  return (
    <>
      <PaystackButton
        {...componentProps}
        className={` text-white font-bold py-2 px-4 rounded transition duration-200 ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal
          open={true}
          onClose={null}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your payment has been processed successfully.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">
                    {currency} {paymentData?.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{paymentData?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-semibold text-sm">
                    {paymentData?.reference}
                  </span>
                </div>
                {paymentData?.metadata?.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold">
                      {paymentData.metadata.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {autoCloseEnabled && countdown > 0 && (
              <div className="text-center mb-4">
                <p className="text-sm mt-4 text-gray-600">
                  This modal will close automatically in {countdown} seconds
                </p>
                <button
                  onClick={() => setAutoCloseEnabled(false)}
                  className="text-blue-600 font-semibold mt-4 hover:text-blue-800 text-sm underline"
                >
                  Cancel auto-close
                </button>
              </div>
            )}

            <div className="flex mt-16 flex-col gap-3">
              <button
                onClick={handleCloseSuccessModal}
                className="flex-1 border border-green-600 text-green-600 hover:bg-[#c4fad6]  font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Copy reference to clipboard
                  navigator.clipboard.writeText(paymentData?.reference || "");
                  toast.info("Payment reference copied to clipboard!");
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Copy Reference
              </button>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ReusablePaystackButton;
