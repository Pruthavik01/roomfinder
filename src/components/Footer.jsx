import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-8 pt-6 text-sm text-gray-500">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              RoomFinder
            </h2>
            <p className="text-sm text-gray-600">
              Find rental rooms easily or list your property for tenants.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          {/* For Owners */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              For Owners
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Add Room Listings</li>
              <li>Upload Room Images</li>
              <li>Manage Your Rooms</li>
            </ul>
          </div>
          {/* Contact / Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@roomfinder.com</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {year} RoomFinder. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <span className="hover:text-blue-600 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-blue-600 cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
