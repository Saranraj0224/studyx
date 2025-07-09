import React from 'react';
import { motion } from 'framer-motion';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  icon,
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
          backdrop-blur-md text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50
          transition-all duration-200
          ${icon ? 'pl-10' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
    </motion.div>
  );
};