import React from 'react';
import { motion } from 'framer-motion';
import { Home, Clock, BarChart3, User, Brain } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user } = useAuth();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'timer', label: 'Timer', icon: Clock },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="backdrop-blur-md bg-black/80 border-t border-white/10 px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            
            return (
              <motion.button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export const DesktopSidebar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user } = useAuth();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'timer', label: 'Timer', icon: Clock },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-md border-r border-white/10 z-40"
    >
      <div className="flex flex-col w-full p-6">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="p-2 rounded-lg bg-white/10 mr-3">
            <Brain size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">STUDYX</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.key;
              
              return (
                <li key={item.key}>
                  <motion.button
                    onClick={() => onNavigate(item.key)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mr-3">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};