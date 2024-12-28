import React, { useState, Dispatch, SetStateAction } from "react";
import {
  UserCircleIcon,        // Icon for Profile
  PencilIcon,            // Icon for Update Metadata
  UsersIcon,             // Icon for Show All Users
  LifebuoyIcon,          // Icon for Support
  ArrowLeftOnRectangleIcon, // Icon for Logout
  FlagIcon,              // Icon for Arena
} from "@heroicons/react/24/solid";

// Define the SidebarProps interface to accept collapsed and setCollapsed as props
interface SidebarProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

interface ListProps {
  children: React.ReactNode;
  className?: string;
}

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const List: React.FC<ListProps> = ({ children, className = "" }) => {
  return <ul className={`space-y-2 ${className}`}>{children}</ul>;
};

const ListItem: React.FC<ListItemProps> = ({ children, className = "", onClick }) => {
  return (
    <li
      className={`flex items-center p-2 m-2 cursor-pointer transition-all rounded-lg ${className}`}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

const ListItemPrefix: React.FC<ListProps> = ({ children }) => {
  return <span className="mr-3">{children}</span>;
};

// Sidebar component now accepts props `collapsed` and `setCollapsed`
const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const [activeItem, setActiveItem] = useState<string>("arena"); // Set Arena as default active item

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    console.log(`Clicked on: ${item}`);
  };

  const isActive = (item: string) => activeItem === item;

  return (
    <div className="relative">
      {/* Sidebar Container */}
      <div
        className={`h-screen bg-[#15072d] text-white fixed z-10 transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-56"}`}
        onMouseEnter={() => setCollapsed(false)} // Expand on hover
        onMouseLeave={() => setCollapsed(true)} // Collapse on mouse leave
      >
        {/* Always show Logo */}
        <div className="flex justify-center items-center gap-4 p-4 pt-10">
          <img src="logo.png" alt="brand" width={50} />
        </div>

        {/* Navigation List */}
        <div className="p-2 flex flex-col h-[calc(100%-120px)]">
          {/* Main Navigation Items */}
          <List>
          <ListItem
              className={`font-inter hover:bg-[#651edd] font-semibold text-sm ${isActive("arena") ? `bg-[#7525ff] pr-7 text-white ${collapsed ? "rounded-full" : ""}` : ""}`}
              onClick={() => handleItemClick("arena")}
            >
              <ListItemPrefix>
                <FlagIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className={`transition-opacity duration-300 ease-in-out ${collapsed ? "opacity-0" : "opacity-100"}`}>
                Arena
              </span>
            </ListItem>
            <ListItem
              className={`font-inter hover:bg-[#651edd] font-semibold text-sm ${isActive("profile") ? `bg-[#7525ff] rounded-full pr-7 text-white ${collapsed ? "rounded-full" : ""}` : ""}`}
              onClick={() => handleItemClick("profile")}
            >
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className={`transition-opacity duration-300 ease-in-out ${collapsed ? "opacity-0" : "opacity-100"}`}>
                Profile
              </span>
            </ListItem>
            <ListItem
              className={`font-inter hover:bg-[#651edd] font-semibold text-sm ${isActive("update-metadata") ? `bg-[#7525ff] text-white ${collapsed ? "rounded-full" : ""}` : ""}`}
              onClick={() => handleItemClick("update-metadata")}
            >
              <ListItemPrefix>
                <PencilIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className={`transition-opacity duration-300 ease-in-out ${collapsed ? "opacity-0" : "opacity-100"}`}>
                Update
              </span>
            </ListItem>
            <ListItem
              className={`font-inter hover:bg-[#651edd] font-semibold text-sm ${isActive("show-all-users") ? `bg-[#7525ff] pr-7 text-white ${collapsed ? "rounded-full" : ""}` : ""}`}
              onClick={() => handleItemClick("show-all-users")}
            >
              <ListItemPrefix>
                <UsersIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className={`transition-opacity duration-300 ease-in-out ${collapsed ? "opacity-0" : "opacity-100"}`}>
                Show
              </span>
            </ListItem>
          </List>

          {/* Push Support and Logout to the bottom */}
          <div className="flex-grow"></div> {/* This div pushes the next section down */}

          {/* Support and Logout at the Bottom */}
          <List>
            <ListItem
              className={`font-inter hover:bg-[#651edd] font-semibold text-sm ${isActive("support") ? `bg-[#7525ff] text-white pr-7 ${collapsed ? "rounded-full" : ""}` : ""}`}
              onClick={() => handleItemClick("support")}
            >
              <ListItemPrefix>
                <LifebuoyIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className={`transition-opacity duration-300 ease-in-out ${collapsed ? "opacity-0" : "opacity-100"}`}>
                Support
              </span>
            </ListItem>
            <ListItem
              className={`font-inter hover:bg-red-500 hover:text-white font-semibold text-sm ${isActive("logout") ? `bg-red-500 text-white pr-7 ${collapsed ? "rounded-full" : ""}` : ""}`}
              onClick={() => handleItemClick("logout")}
            >
              <ListItemPrefix>
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className={`transition-opacity duration-300 ease-in-out ${collapsed ? "opacity-0" : "opacity-100"}`}>
                Logout
              </span>
            </ListItem>
          </List>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
