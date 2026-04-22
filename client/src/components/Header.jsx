import React from 'react';
import { Search } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Header = () => {
  return (
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-8 justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search alumni, jobs, or events..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationBell />
      </div>
    </header>
  );
};

export default Header;
