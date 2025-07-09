import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, GripVertical, Check, X, Edit2, Trash2 } from 'lucide-react';
import { Subject, Topic } from '../../types';
import { useStudy } from '../../contexts/StudyContext';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProgressBar } from '../ui/ProgressBar';

interface ChecklistPageProps {
  subject: Subject;
  onNavigate: (page: string) => void;
}

export const ChecklistPage: React.FC<ChecklistPageProps> = ({ subject, onNavigate }) => {
  const { addTopic, updateTopic, deleteTopic, toggleTopicComplete } = useStudy();
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      addTopic(subject.id, newTopicTitle.trim());
      setNewTopicTitle('');
      setShowAddTopic(false);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic.id);
    setEditTitle(topic.title);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editingTopic) {
      updateTopic(subject.id, editingTopic, { title: editTitle.trim() });
      setEditingTopic(null);
      setEditTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
    setEditTitle('');
  };

  const completedTopics = subject.topics.filter(topic => topic.completed).length;
  const totalTopics = subject.topics.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-white/3 rounded-full blur-3xl"
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
            <div>
              <h1 className="text-3xl font-bold text-white">{subject.name}</h1>
              <p className="text-gray-300">
                {completedTopics}/{totalTopics} topics completed
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddTopic(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Topic
          </Button>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Progress Overview</h2>
              <span className="text-2xl font-bold text-white">
                {Math.round(subject.progress)}%
              </span>
            </div>
            <ProgressBar progress={subject.progress} showLabel={false} />
          </GlassCard>
        </motion.div>

        {/* Add Topic Modal */}
        {showAddTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddTopic(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4"
            >
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Add New Topic</h3>
                <Input
                  placeholder="Topic title"
                  value={newTopicTitle}
                  onChange={setNewTopicTitle}
                  className="mb-4"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddTopic}
                    variant="primary"
                    className="flex-1"
                  >
                    Add Topic
                  </Button>
                  <Button
                    onClick={() => setShowAddTopic(false)}
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

        {/* Topics List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Topics</h2>
          </div>

          {subject.topics.length === 0 ? (
            <GlassCard>
              <div className="text-center py-8">
                <Check size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No topics yet
                </h3>
                <p className="text-gray-400 mb-4">
                  Add your first topic to start tracking progress
                </p>
                <Button
                  onClick={() => setShowAddTopic(true)}
                  variant="primary"
                >
                  <Plus size={18} className="mr-2" />
                  Add Topic
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {subject.topics
                .sort((a, b) => a.order - b.order)
                .map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <GlassCard className="group">
                      <div className="flex items-center">
                        <div className="flex items-center mr-4 cursor-grab">
                          <GripVertical size={16} className="text-gray-400" />
                        </div>
                        
                        <motion.button
                          onClick={() => toggleTopicComplete(subject.id, topic.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                            topic.completed
                              ? 'bg-white border-white'
                              : 'border-gray-400 hover:border-white'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {topic.completed && (
                            <Check size={14} className="text-black" />
                          )}
                        </motion.button>

                        <div className="flex-1">
                          {editingTopic === topic.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editTitle}
                                onChange={setEditTitle}
                                className="flex-1"
                              />
                              <Button
                                onClick={handleSaveEdit}
                                variant="ghost"
                                size="sm"
                              >
                                <Check size={16} />
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                variant="ghost"
                                size="sm"
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <span
                              className={`text-lg ${
                                topic.completed
                                  ? 'line-through text-gray-400'
                                  : 'text-white'
                              }`}
                            >
                              {topic.title}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => handleEditTopic(topic)}
                            variant="ghost"
                            size="sm"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            onClick={() => deleteTopic(subject.id, topic.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};