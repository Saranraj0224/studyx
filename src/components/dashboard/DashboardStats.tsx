import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Zap, TrendingUp } from 'lucide-react';
import { useStudy } from '../../contexts/StudyContext';
import { GlassCard } from '../ui/GlassCard';

export const DashboardStats: React.FC = () => {
  const { userStats } = useStudy();

  const stats = [
    {
      icon: <Clock size={24} />,
      label: 'Total Study Time',
      value: `${Math.floor(userStats.totalStudyTime / 60)}h ${userStats.totalStudyTime % 60}m`,
      color: 'from-white to-gray-300',
    },
    {
      icon: <Target size={24} />,
      label: 'Sessions Completed',
      value: userStats.sessionsCompleted,
      color: 'from-gray-200 to-white',
    },
    {
      icon: <Zap size={24} />,
      label: 'Current Streak',
      value: `${userStats.streakDays} days`,
      color: 'from-white to-gray-200',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Subjects Completed',
      value: userStats.subjectsCompleted,
      color: 'from-gray-300 to-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <GlassCard hover className="text-center">
            <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${stat.color} mb-4`}>
              <span className="text-black">{stat.icon}</span>
            </div>
            <motion.h3
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="text-2xl font-bold text-white mb-1"
            >
              {stat.value}
            </motion.h3>
            <p className="text-gray-300 text-sm">{stat.label}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};