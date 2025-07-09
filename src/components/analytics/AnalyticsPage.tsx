import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Clock, Target, Calendar } from 'lucide-react';
import { useStudy } from '../../contexts/StudyContext';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { CircularProgress } from '../ui/CircularProgress';
import { ProgressBar } from '../ui/ProgressBar';

interface AnalyticsPageProps {
  onNavigate: (page: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const { subjects, userStats, timerSessions } = useStudy();

  const recentSessions = timerSessions.slice(-7);
  const totalSubjects = subjects.length;
  const completedSubjects = subjects.filter(s => s.progress === 100).length;
  const averageProgress = subjects.length > 0 
    ? subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <TrendingUp size={24} />,
              title: 'Average Progress',
              value: `${Math.round(averageProgress)}%`,
              subtitle: 'Across all subjects',
            },
            {
              icon: <Target size={24} />,
              title: 'Completed Subjects',
              value: `${completedSubjects}/${totalSubjects}`,
              subtitle: 'Total completion',
            },
            {
              icon: <Clock size={24} />,
              title: 'Study Time',
              value: `${Math.floor(userStats.totalStudyTime / 60)}h`,
              subtitle: 'Total hours studied',
            },
            {
              icon: <Calendar size={24} />,
              title: 'Current Streak',
              value: `${userStats.streakDays}`,
              subtitle: 'Days in a row',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-white/10 mr-3">
                    <span className="text-white">{stat.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">{stat.title}</h3>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.subtitle}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Overall Progress</h2>
              <div className="flex items-center">
                <CircularProgress
                  progress={averageProgress}
                  size={80}
                  strokeWidth={6}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-300 mb-2">
                You're making great progress! Keep up the momentum.
              </p>
              <p className="text-sm text-gray-400">
                {completedSubjects} of {totalSubjects} subjects completed
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6">Subject Progress</h2>
            {subjects.length === 0 ? (
              <div className="text-center py-8">
                <Target size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No subjects to analyze yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-2">
                        {subject.name}
                      </h3>
                      <ProgressBar 
                        progress={subject.progress} 
                        showLabel={false}
                        className="w-full"
                      />
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-xl font-bold text-white">
                        {Math.round(subject.progress)}%
                      </span>
                      <p className="text-sm text-gray-400">
                        {subject.topics.filter(t => t.completed).length}/{subject.topics.length} topics
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Study Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <GlassCard>
            <h2 className="text-xl font-semibold text-white mb-6">Recent Study Sessions</h2>
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No study sessions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        session.completed ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                      <div>
                        <span className="text-white font-medium capitalize">
                          {session.type} Session
                        </span>
                        <p className="text-sm text-gray-400">
                          {new Date(session.startTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-medium">
                        {session.duration}m
                      </span>
                      <p className="text-sm text-gray-400">
                        {session.completed ? 'Completed' : 'Incomplete'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};