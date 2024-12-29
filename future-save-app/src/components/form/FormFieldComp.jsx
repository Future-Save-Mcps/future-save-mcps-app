import React, { useEffect, useState } from "react";

const FormFieldComp = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  validation,
  errors,
  options = [],
  icon,
}) => {
  const [showError, setShowError] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // For custom dropdown
  const [selectedValue, setSelectedValue] = useState(""); // For custom dropdown

  // useEffect(() => {
  //   if (errors[name]) {
  //     setShowError(true);
  //     const timer = setTimeout(() => setShowError(false), 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [errors, name]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
      <div className="relative">
        {type === "select" ? (
          <div>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-2 py-3 rounded-lg border cursor-pointer focus:outline-none"
            >
              {selectedValue || `Select ${label}`}
            </div>
            {isOpen && (
              <ul className="absolute w-full bg-white border mt-1 rounded-lg shadow-md z-10">
                {options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(option.value)}
                    className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
            <input
              {...register(name, validation)}
              type="hidden"
              value={selectedValue}
              name={name}
            />
          </div>
        ) : (
          <input
            type={type}
            {...register(name, validation)}
            placeholder={placeholder}
            className={`w-full px-2 py-3 rounded-lg border focus:outline-none ${
              icon ? "pr-10" : ""
            }`}
          />
        )}
        {icon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 mt-1 text-[12px]">{errors[name].message}</p>
      )}
    </div>
  );
};

export default FormFieldComp;
