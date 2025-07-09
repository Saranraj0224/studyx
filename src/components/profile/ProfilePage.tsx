import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, LogOut, Edit2, Save, X, Camera, Shield, Bell, Palette, Download, Trash2, Award, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStudy } from '../../contexts/StudyContext';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const { userStats, subjects, timerSessions } = useStudy();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const handleSaveProfile = async () => {
    // In a real app, this would update the user profile in the database
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleExportData = () => {
    const data = {
      user,
      subjects,
      timerSessions,
      userStats,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyx-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would delete the user account
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 relative overflow-hidden">
      {/* Enhanced Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, -30, 0],
            y: [0, -40, 60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/4 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.1, 0.9, 1.1],
            rotate: [360, 0],
            x: [0, -60, 40, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white/3 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="ghost"
                    size="sm"
                  >
                    {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                  </Button>
                </div>

                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mr-6">
                      <User size={32} className="text-white" />
                    </div>
                    <button className="absolute bottom-0 right-4 p-1 bg-white rounded-full hover:bg-gray-100 transition-colors">
                      <Camera size={12} className="text-black" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
                    <p className="text-gray-400">Student</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <User size={20} className="text-gray-400 mr-3" />
                    {isEditing ? (
                      <Input
                        value={editName}
                        onChange={setEditName}
                        placeholder="Your name"
                        className="flex-1"
                      />
                    ) : (
                      <div>
                        <span className="text-white font-medium">{user?.name}</span>
                        <p className="text-sm text-gray-400">Full Name</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Mail size={20} className="text-gray-400 mr-3" />
                    {isEditing ? (
                      <Input
                        value={editEmail}
                        onChange={setEditEmail}
                        placeholder="Your email"
                        className="flex-1"
                      />
                    ) : (
                      <div>
                        <span className="text-white font-medium">{user?.email}</span>
                        <p className="text-sm text-gray-400">Email Address</p>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        variant="primary"
                        size="sm"
                       className="flex items-center gap-2"
                      >
                       <Save size={16} />
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard>
                <h2 className="text-xl font-semibold text-white mb-6">Account Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Bell size={20} className="text-white mr-3" />
                      <div>
                        <span className="text-white font-medium">Push Notifications</span>
                        <p className="text-sm text-gray-400">Get notified about study reminders</p>
                      </div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-white">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-black translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Shield size={20} className="text-white mr-3" />
                      <div>
                        <span className="text-white font-medium">Privacy Mode</span>
                        <p className="text-sm text-gray-400">Hide your activity from others</p>
                      </div>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-black translate-x-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Palette size={20} className="text-white mr-3" />
                      <div>
                        <span className="text-white font-medium">Theme</span>
                        <p className="text-sm text-gray-400">Dark theme (default)</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Change
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlassCard>
                <h2 className="text-xl font-semibold text-white mb-6">Data Management</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Download size={20} className="text-white mr-3" />
                      <div>
                        <span className="text-white font-medium">Export Data</span>
                        <p className="text-sm text-gray-400">Download all your study data</p>
                      </div>
                    </div>
                    <Button onClick={handleExportData} variant="ghost" size="sm">
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center">
                      <Trash2 size={20} className="text-red-400 mr-3" />
                      <div>
                        <span className="text-red-400 font-medium">Delete Account</span>
                        <p className="text-sm text-red-300/70">Permanently delete your account and data</p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleDeleteAccount}
                      variant="ghost" 
                      size="sm"
                      className="text-red-400 hover:text-red-300 border-red-400/20 hover:border-red-300/20"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard>
                <h2 className="text-xl font-semibold text-white mb-6">Quick Stats</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award size={16} className="text-white mr-2" />
                      <span className="text-gray-300">Study Time</span>
                    </div>
                    <span className="text-white font-bold">
                      {Math.floor(userStats.totalStudyTime / 60)}h {userStats.totalStudyTime % 60}m
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-white mr-2" />
                      <span className="text-gray-300">Streak</span>
                    </div>
                    <span className="text-white font-bold">{userStats.streakDays} days</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User size={16} className="text-white mr-2" />
                      <span className="text-gray-300">Sessions</span>
                    </div>
                    <span className="text-white font-bold">{userStats.sessionsCompleted}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlassCard>
                <h2 className="text-xl font-semibold text-white mb-6">Account</h2>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => onNavigate('analytics')}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    View Analytics
                  </Button>
                  
                  <Button
                    onClick={() => onNavigate('timer')}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    Timer Settings
                  </Button>
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 border-red-400/20 hover:border-red-300/20 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Member Since */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Member Since</h3>
                  <p className="text-gray-300">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};