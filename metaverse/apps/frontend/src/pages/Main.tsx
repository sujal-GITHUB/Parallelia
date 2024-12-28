import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access the state
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import Arena from "./Arena"; // Assuming Arena is in the same folder or correctly imported

const Main: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  // Use useLocation to retrieve space data passed from the SpacePage
  const location = useLocation();
  const spaceData = location.state?.spaceData // Default to null if no spaceData is found
  console.log(spaceData);
    
  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for large screens */}
      <div className="hidden md:block fixed top-0 left-0 h-full bg-gray-200">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Navbar for small screens */}
      <div className="md:hidden fixed w-full top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      {/* Main content */}
      <div
        className={`flex-1 mt-16 md:mt-0 overflow-y-auto bg-gray-200 transition-all duration-300 ease-in-out ${collapsed ? "md:ml-16" : "md:ml-[220px]"}`}
      >
        {/* Pass spaceData to Arena component */}
        <Arena spaceData={spaceData} />
      </div>
    </main>
  );
};

export default Main;
