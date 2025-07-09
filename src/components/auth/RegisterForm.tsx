import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      return;
    }
    
    if (password.length < 6) {
      return;
    }
    
    const success = await register(name, email, password);
    if (success) {
      // Registration successful, user will be redirected automatically
    }
  };

  const isFormValid = name.trim() && email.trim() && password.length >= 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <GlassCard>
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Join STUDYX
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300"
          >
            Create your account to start studying
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center"
          >
            <AlertCircle size={18} className="text-red-400 mr-3 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={setName}
            icon={<User size={18} />}
            disabled={isLoading}
          />

          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
            icon={<Mail size={18} />}
            disabled={isLoading}
          />

          <div>
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={setPassword}
              icon={<Lock size={18} />}
              disabled={isLoading}
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-red-400 text-xs mt-2">Password must be at least 6 characters</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || !isFormValid}
            className="w-full"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
              />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <span className="text-gray-300">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-white font-medium hover:underline transition-all duration-200"
            disabled={isLoading}
          >
            Sign in
          </button>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
};