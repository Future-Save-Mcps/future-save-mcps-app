import React from "react";

const FormButton = ({
  isLoading,
  text,
  onClick,
  width = "150px",
  disabled = false,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`mt-8 bg-primary border text-[#c7c7c7] py-2 px-4 rounded-lg disabled:bg-[#ffffff]  transition ${className}`}
      style={{ width }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-[#aaaaaa]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default FormButton;
