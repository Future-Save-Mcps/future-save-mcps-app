

import React, { useState, useEffect, useRef } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const FormFieldComp = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  setValue,
  setBank,
  validation,
  errors,
  options = [],
  icon,
  readOnly = false,
  searchable = false,
  defaultValueAttachment = "",
  onchange,
  setOnChangeValue,
  big
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValueAttachment);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update selected value when defaultValueAttachment changes
  useEffect(() => {
    if (defaultValueAttachment) {
      setSelectedValue(defaultValueAttachment);
      setValue(name, defaultValueAttachment);
    }
  }, [defaultValueAttachment, setValue, name]);

  const handleSelect = (value, label) => {
    setSelectedValue(label);
    setValue(name, value);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSelectBank = (value, label, bank) => {
    setBank(bank);
    setSelectedValue(label);
    setValue(name, value);
    setIsOpen(false);
    setSearchQuery("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#939393] mb-1">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        {type === "Bank" ? (
          <div>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-2 py-3 rounded-lg border cursor-pointer focus:outline-none flex items-center justify-between"
            >
              <span>{selectedValue || `Select ${label}`}</span>
              <span className="text-gray-400">
                {isOpen ? (
                  <KeyboardArrowUpOutlinedIcon />
                ) : (
                  <KeyboardArrowDownOutlinedIcon />
                )}
              </span>
            </div>
            {isOpen && (
              <div className="absolute w-full bg-white border mt-1 rounded-lg shadow-md z-10">
                {searchable && (
                  <div className="p-2">
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-2 py-2 rounded-lg border focus:outline-none pr-8"
                      />
                      <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                )}
                <ul className="max-h-[200px] overflow-auto">
                  {filteredOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleSelectBank(option.value, option.label, option)
                      }
                      className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
                    >
                      {option.label}
                    </li>
                  ))}
                  {searchable && filteredOptions.length === 0 && (
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
            <input
              type="hidden"
              {...register(name, validation)}
              value={selectedValue}
              name={name}
            />
          </div>
        ) : type === "select" ? (
          <div>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-2 py-3 rounded-lg border cursor-pointer focus:outline-none flex items-center justify-between"
            >
              <span>{selectedValue || `Select ${label}`}</span>
              <span className="text-gray-400">
                {isOpen ? (
                  <KeyboardArrowUpOutlinedIcon />
                ) : (
                  <KeyboardArrowDownOutlinedIcon />
                )}
              </span>
            </div>
            {isOpen && (
              <div className="absolute w-full bg-white border mt-1 rounded-lg shadow-md z-10">
                {searchable && (
                  <div className="p-2">
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-2 py-2 rounded-lg border focus:outline-none pr-8"
                      />
                      <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                )}
                <ul className="max-h-[200px] overflow-auto">
                  {filteredOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(option.value, option.label)}
                      className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white focus:bg-primary focus:text-white"
                    >
                      {option.label}
                    </li>
                  ))}
                  {searchable && filteredOptions.length === 0 && (
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  )}
                </ul>
              </div>
            )}
            <input
              type="hidden"
              {...register(name, validation)}
              value={selectedValue}
              name={name}
            />
          </div>
        ) : (
          <input
            readOnly={readOnly}
            type={type === "password" && showPassword ? "text" : type}
            {...register(name, validation)}
            placeholder={placeholder}
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              onchange && setOnChangeValue(e.target.value);
            }}
            className={`w-full px-2 py-3 ${big && "h-24 text-3xl font-medium text-center"} rounded-lg border focus:outline-none ${
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
