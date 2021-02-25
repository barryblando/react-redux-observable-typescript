import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => (
  <nav className="bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              <NavLink
                exact
                to="/"
                activeClassName="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium active:bg-gray-900 active:text-white"
              >
                Dashboard
              </NavLink>
              <NavLink to="/beer" 
                  activeClassName="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Beer
                </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default NavBar;
