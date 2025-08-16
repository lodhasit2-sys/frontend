import React from "react";

function Navbar() {
  return (
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-2">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Emblem_of_India.svg/2048px-Emblem_of_India.svg.png" alt="Logo" className="h-8" />
        <h1 className="font-semibold text-lg text-gray-700">Government Portal</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Admin User</span>
        <img src="https://via.placeholder.com/32" alt="profile" className="rounded-full h-8 w-8" />
      </div>
    </header>
  );
}

export default Navbar;
