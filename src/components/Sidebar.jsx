import React from "react";
import { FiHome, FiUsers, FiFileText, FiSettings } from "react-icons/fi";

function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-4 font-bold text-xl border-b border-blue-700">Portal Menu</div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
          <FiHome /> <span>Dashboard</span>
        </a>
        <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
          <FiUsers /> <span>Beneficiaries</span>
        </a>
        <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
          <FiFileText /> <span>Reports</span>
        </a>
        <a href="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-700">
          <FiSettings /> <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
