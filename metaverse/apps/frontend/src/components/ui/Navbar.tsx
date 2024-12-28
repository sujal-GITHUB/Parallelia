import React, { useState } from "react";
import {
  UserCircleIcon,        // Icon for Profile
  PencilIcon,            // Icon for Update Metadata
  UsersIcon,             // Icon for Show All Users
  LifebuoyIcon,          // Icon for Support
  ArrowLeftOnRectangleIcon, // Icon for Logout
  FlagIcon,              // Icon for Arena
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    console.log(`Clicked on: ${item}`);
    setIsOpen(false);
  };

  const isActive = (item: string): boolean => activeItem === item;

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-[#15072d] shadow-md w-full">
        <div className="flex justify-between items-center px-5 h-16">
          <div className="flex items-center">
            <img src="logo.png" alt="brand" className="h-8 w-auto" />
          </div>

          {/* Burger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="focus:outline-none text-white"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        {isOpen && (
          <div className="">
            <ul className="md:hidden bg-[#15072d] text-white w-full space-y-2 pb-5 ps-5 pt-2 shadow-lg">
              <li
                className={`flex items-center font-semibold p-1 text-sm ${
                  isActive("arena")
                    ? "bg-blue-500 text-white rounded-md"
                    : "hover:bg-gray-100 active:bg-blue-500 active:text-white hover:cursor-pointer rounded-md"
                }`}
                onClick={() => handleItemClick("arena")}
              >
                <FlagIcon className="h-5 w-5 mr-2" />
                Arena
              </li>
              <li
                className={`flex items-center font-semibold p-1 text-sm ${
                  isActive("profile")
                    ? "bg-blue-500 text-white rounded-md"
                    : "hover:bg-gray-100 active:bg-blue-500 active:text-white hover:cursor-pointer rounded-md"
                }`}
                onClick={() => handleItemClick("profile")}
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Profile
              </li>
              <li
                className={`flex items-center font-semibold p-1 text-sm ${
                  isActive("update")
                    ? "bg-blue-500 text-white rounded-md"
                    : "hover:bg-gray-100 active:bg-blue-500 active:text-white hover:cursor-pointer rounded-md"
                }`}
                onClick={() => handleItemClick("update")}
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Update
              </li>
              <li
                className={`flex items-center font-semibold p-1 text-sm ${
                  isActive("show")
                    ? "bg-blue-500 text-white rounded-md"
                    : "hover:bg-gray-100 active:bg-blue-500 active:text-white hover:cursor-pointer rounded-md"
                }`}
                onClick={() => handleItemClick("show")}
              >
                <UsersIcon className="h-5 w-5 mr-2" />
                Show
              </li>
              <li
                className={`flex items-center font-semibold p-1 text-sm ${
                  isActive("support")
                    ? "bg-blue-500 text-white rounded-md"
                    : "hover:bg-gray-100 active:bg-blue-500 active:text-white hover:cursor-pointer rounded-md"
                }`}
                onClick={() => handleItemClick("support")}
              >
                <LifebuoyIcon className="h-5 w-5 mr-2" />
                Support
              </li>
              <li
                className={`flex items-center font-semibold p-1 text-sm ${
                  isActive("logout")
                    ? "bg-red-500 text-white rounded-md"
                    : "hover:bg-gray-100 active:bg-red-500 active:text-white hover:cursor-pointer rounded-md"
                }`}
                onClick={() => handleItemClick("logout")}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
