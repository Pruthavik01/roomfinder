import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon } from './Icons';
import { Home, LogIn, UserPlus, PlusCircle, Upload, Settings, Mail, MapPin, Shield, FileText } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white mt-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <LogoIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RoomFinder</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Find rental rooms easily or list your property for tenants.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <Home className="w-3 h-3" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <LogIn className="w-3 h-3" />
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <UserPlus className="w-3 h-3" />
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              For Owners
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-1.5">
                <PlusCircle className="w-3 h-3" />
                Add Listings
              </li>
              <li className="flex items-center gap-1.5">
                <Upload className="w-3 h-3" />
                Upload Images
              </li>
              <li className="flex items-center gap-1.5">
                <Settings className="w-3 h-3" />
                Manage Rooms
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Contact
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                support@roomfinder.com
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                India
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">© {year} RoomFinder. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Privacy
            </span>
            <span className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
