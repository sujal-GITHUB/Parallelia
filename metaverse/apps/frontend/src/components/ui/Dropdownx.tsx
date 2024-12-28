import React, { useState } from "react";

const Dropdownx: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => setIsOpen(!isOpen);

  return (
    <div className="relative w-full px-5 inline-block text-left">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-black border-2 border-gray-200 bg-white rounded-md"
      >
        Sujal Kumar
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div
            className="py-1 font-inter"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              href="#/action-1"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Profile
            </a>
            <a
              href="#/action-2"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Edit
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdownx;
