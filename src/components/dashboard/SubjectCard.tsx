import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, MoreHorizontal } from 'lucide-react';
import { Subject } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { ProgressBar } from '../ui/ProgressBar';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  const completedTopics = subject.topics.filter(topic => topic.completed).length;
  const totalTopics = subject.topics.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <GlassCard hover onClick={onClick}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-white/10 mr-3">
              <BookOpen size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{subject.name}</h3>
          </div>
          <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progress</span>
            <span>{completedTopics}/{totalTopics} topics</span>
          </div>
          <ProgressBar progress={subject.progress} showLabel={false} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {totalTopics === 0 ? 'No topics yet' : `${completedTopics} completed`}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-white hover:text-gray-200 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add Topic
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
};