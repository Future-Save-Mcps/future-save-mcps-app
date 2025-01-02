import React, { useState, useEffect, useRef } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const FormFieldComp = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  setValue, // Manually set values in react-hook-form
  validation,
  errors,
  options = [],
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // For the dropdown
  const [selectedValue, setSelectedValue] = useState(""); // Dropdown selected value
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setSelectedValue(value); // Update local state
    setValue(name, value); // Update form state
    setIsOpen(false); // Close dropdown
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Close dropdown if clicked outside
    }
  };

  useEffect(() => {
    // Close dropdown on outside click
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Initialize field with an existing value if necessary
    if (selectedValue) {
      setValue(name, selectedValue);
    }
  }, [selectedValue, setValue, name]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#939393] mb-1">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
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
              type="hidden"
              {...register(name, validation)} // Connect hidden input to react-hook-form
              value={selectedValue}
              name={name}
            />
          </div>
        ) : (
          <input
            type={type === "password" && showPassword ? "text" : type}
            {...register(name, validation)}
            placeholder={placeholder}
            className={`w-full px-2 py-3 rounded-lg border focus:outline-none ${
              type === "password" ? "pr-10" : ""
            }`}
          />
        )}
        {type === "password" && (
          <span
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )}
          </span>
        )}
        {icon && type !== "password" && (
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
