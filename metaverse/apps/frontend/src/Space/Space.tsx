import React from "react";
import Sidebar from "../components/ui/Sidebar";
import Dashboard from "../components/Dashboard/Dashboard";
import Navbar from "../components/ui/Navbar";

const Space: React.FC = () => {
  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for large screens */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-[220px] bg-gray-200">
        <Sidebar />
      </div>

      {/* Navbar for small screens */}
      <div className="md:hidden fixed w-full top-0 left-0 right-0 z-10">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-[220px] mt-16 md:mt-0 overflow-y-auto bg-gray-200">
        <Dashboard />
      </div>
    </main>
  );
};

export default Space;
