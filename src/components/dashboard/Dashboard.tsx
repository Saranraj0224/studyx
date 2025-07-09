import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, BarChart3, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStudy } from '../../contexts/StudyContext';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DashboardStats } from './DashboardStats';
import { SubjectCard } from './SubjectCard';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { subjects, addSubject } = useStudy();
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  const handleAddSubject = async () => {
    if (subjectName.trim()) {
      await addSubject(subjectName.trim());
      setSubjectName('');
      setShowAddSubject(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 relative overflow-hidden">
      {/* Enhanced Animated background with multiple moving elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary moving ring */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360],
            x: [0, 100, -50, 0],
            y: [0, -80, 120, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
        
        {/* Secondary moving ring */}
        <motion.div
          animate={{
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 0],
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white/3 rounded-full blur-3xl"
        />
        
        {/* Tertiary moving element */}
        <motion.div
          animate={{
            scale: [0.8, 1.5, 0.8],
            rotate: [0, -360],
            x: [0, 150, -100, 0],
            y: [0, -120, 90, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-white/4 rounded-full blur-2xl"
        />
        
        {/* Additional floating elements */}
        <motion.div
          animate={{
            x: [0, 200, -150, 0],
            y: [0, -100, 150, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/6 left-1/2 w-32 h-32 bg-white/6 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{
            x: [0, -180, 120, 0],
            y: [0, 130, -90, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/6 left-1/3 w-48 h-48 bg-white/4 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-gray-300">Ready to continue your learning journey?</p>
        </motion.div>

        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <GlassCard hover onClick={() => onNavigate('timer')}>
            <div className="flex items-center">
              <Clock size={24} className="text-white mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-white">Study Timer</h3>
                <p className="text-gray-400 text-sm">Start a focus session</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover onClick={() => onNavigate('analytics')}>
            <div className="flex items-center">
              <BarChart3 size={24} className="text-white mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-white">Analytics</h3>
                <p className="text-gray-400 text-sm">View your progress</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover onClick={() => setShowAddSubject(true)}>
            <div className="flex items-center">
              <Plus size={24} className="text-white mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-white">Add Subject</h3>
                <p className="text-gray-400 text-sm">Create new subject</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Add Subject Modal */}
        {showAddSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddSubject(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4"
            >
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Add New Subject</h3>
                <Input
                  placeholder="Subject name"
                  value={subjectName}
                  onChange={setSubjectName}
                  className="mb-4"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddSubject}
                    variant="primary"
                    className="flex-1"
                  >
                    Add Subject
                  </Button>
                  <Button
                    onClick={() => setShowAddSubject(false)}
                    variant="ghost"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}

        {/* Subjects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Subjects</h2>
            <Button
              onClick={() => setShowAddSubject(true)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Subject
            </Button>
          </div>

          {subjects.length === 0 ? (
            <GlassCard>
              <div className="text-center py-8">
                <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No subjects yet
                </h3>
                <p className="text-gray-400 mb-4">
                  Create your first subject to start tracking your progress
                </p>
                <Button
                  onClick={() => setShowAddSubject(true)}
                  variant="primary"
                >
                  <Plus size={18} className="mr-2" />
                  Add Subject
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={() => onNavigate('checklist', subject)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};