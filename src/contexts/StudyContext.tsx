import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Subject, Topic, TimerSession, TimerSettings, UserStats } from '../types';

interface StudyContextType {
  subjects: Subject[];
  timerSessions: TimerSession[];
  timerSettings: TimerSettings;
  userStats: UserStats;
  addSubject: (name: string) => Promise<void>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addTopic: (subjectId: string, title: string) => Promise<void>;
  updateTopic: (subjectId: string, topicId: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (subjectId: string, topicId: string) => Promise<void>;
  toggleTopicComplete: (subjectId: string, topicId: string) => Promise<void>;
  reorderTopics: (subjectId: string, topics: Topic[]) => Promise<void>;
  addTimerSession: (session: Omit<TimerSession, 'id'>) => Promise<void>;
  updateTimerSettings: (settings: Partial<TimerSettings>) => Promise<void>;
  calculateStats: () => void;
  refreshData: () => Promise<void>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

interface StudyProviderProps {
  children: ReactNode;
}

export const StudyProvider: React.FC<StudyProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timerSessions, setTimerSessions] = useState<TimerSession[]>([]);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStart: false,
    soundEnabled: true,
    fullscreenMode: false,
    notificationSound: 'bell',
  });
  const [userStats, setUserStats] = useState<UserStats>({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    streakDays: 0,
    subjectsCompleted: 0,
    averageSessionLength: 0,
  });

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;

    try {
      // Fetch subjects with topics
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select(`
          *,
          topics (*)
        `)
        .eq('user_id', user.id)
        .order('created_at');

      if (subjectsData) {
        const formattedSubjects: Subject[] = subjectsData.map(subject => ({
          id: subject.id,
          name: subject.name,
          color: subject.color,
          progress: subject.progress,
          topics: subject.topics?.map((topic: any) => ({
            id: topic.id,
            title: topic.title,
            completed: topic.completed,
            order: topic.order,
            createdAt: new Date(topic.created_at),
          })).sort((a: Topic, b: Topic) => a.order - b.order) || [],
          createdAt: new Date(subject.created_at),
        }));
        setSubjects(formattedSubjects);
      }

      // Fetch timer sessions
      const { data: sessionsData } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsData) {
        const formattedSessions: TimerSession[] = sessionsData.map(session => ({
          id: session.id,
          type: session.type as 'focus' | 'pomodoro' | 'custom',
          duration: session.duration,
          completed: session.completed,
          startTime: new Date(session.start_time),
          endTime: session.end_time ? new Date(session.end_time) : undefined,
          subjectId: session.subject_id,
        }));
        setTimerSessions(formattedSessions);
      }

      // Fetch user settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsData) {
        setTimerSettings({
          focusTime: settingsData.focus_time,
          shortBreak: settingsData.short_break,
          longBreak: settingsData.long_break,
          autoStart: settingsData.auto_start,
          soundEnabled: settingsData.sound_enabled,
          fullscreenMode: settingsData.fullscreen_mode,
          notificationSound: settingsData.notification_sound,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addSubject = async (name: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          user_id: user.id,
          name,
          color: '#ffffff',
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const newSubject: Subject = {
        id: data.id,
        name: data.name,
        color: data.color,
        progress: data.progress,
        topics: [],
        createdAt: new Date(data.created_at),
      };

      setSubjects(prev => [...prev, newSubject]);
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .update({
          name: updates.name,
          color: updates.color,
          progress: updates.progress,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setSubjects(prev => prev.map(subject => 
        subject.id === id ? { ...subject, ...updates } : subject
      ));
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubjects(prev => prev.filter(subject => subject.id !== id));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const addTopic = async (subjectId: string, title: string) => {
    try {
      const subject = subjects.find(s => s.id === subjectId);
      if (!subject) return;

      const { data, error } = await supabase
        .from('topics')
        .insert({
          subject_id: subjectId,
          title,
          completed: false,
          order: subject.topics.length,
        })
        .select()
        .single();

      if (error) throw error;

      const newTopic: Topic = {
        id: data.id,
        title: data.title,
        completed: data.completed,
        order: data.order,
        createdAt: new Date(data.created_at),
      };

      setSubjects(prev => prev.map(subject => {
        if (subject.id === subjectId) {
          return { ...subject, topics: [...subject.topics, newTopic] };
        }
        return subject;
      }));
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const updateTopic = async (subjectId: string, topicId: string, updates: Partial<Topic>) => {
    try {
      const { error } = await supabase
        .from('topics')
        .update({
          title: updates.title,
          completed: updates.completed,
          order: updates.order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', topicId);

      if (error) throw error;

      setSubjects(prev => prev.map(subject => {
        if (subject.id === subjectId) {
          const updatedTopics = subject.topics.map(topic =>
            topic.id === topicId ? { ...topic, ...updates } : topic
          );
          return { ...subject, topics: updatedTopics };
        }
        return subject;
      }));
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const deleteTopic = async (subjectId: string, topicId: string) => {
    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);

      if (error) throw error;

      setSubjects(prev => prev.map(subject => {
        if (subject.id === subjectId) {
          const filteredTopics = subject.topics.filter(topic => topic.id !== topicId);
          const progress = filteredTopics.length > 0 
            ? (filteredTopics.filter(t => t.completed).length / filteredTopics.length) * 100 
            : 0;
          
          // Update progress in database
          updateSubject(subjectId, { progress });
          
          return { ...subject, topics: filteredTopics, progress };
        }
        return subject;
      }));
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const toggleTopicComplete = async (subjectId: string, topicId: string) => {
    try {
      const subject = subjects.find(s => s.id === subjectId);
      const topic = subject?.topics.find(t => t.id === topicId);
      if (!topic) return;

      const newCompleted = !topic.completed;

      const { error } = await supabase
        .from('topics')
        .update({
          completed: newCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('id', topicId);

      if (error) throw error;

      setSubjects(prev => prev.map(subject => {
        if (subject.id === subjectId) {
          const updatedTopics = subject.topics.map(topic =>
            topic.id === topicId ? { ...topic, completed: newCompleted } : topic
          );
          const progress = updatedTopics.length > 0 
            ? (updatedTopics.filter(t => t.completed).length / updatedTopics.length) * 100 
            : 0;
          
          // Update progress in database
          updateSubject(subjectId, { progress });
          
          return { ...subject, topics: updatedTopics, progress };
        }
        return subject;
      }));
    } catch (error) {
      console.error('Error toggling topic:', error);
    }
  };

  const reorderTopics = async (subjectId: string, topics: Topic[]) => {
    try {
      const updates = topics.map((topic, index) => ({
        id: topic.id,
        order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('topics')
          .update({ order: update.order })
          .eq('id', update.id);
      }

      setSubjects(prev => prev.map(subject => {
        if (subject.id === subjectId) {
          const reorderedTopics = topics.map((topic, index) => ({
            ...topic,
            order: index,
          }));
          return { ...subject, topics: reorderedTopics };
        }
        return subject;
      }));
    } catch (error) {
      console.error('Error reordering topics:', error);
    }
  };

  const addTimerSession = async (session: Omit<TimerSession, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .insert({
          user_id: user.id,
          type: session.type,
          duration: session.duration,
          completed: session.completed,
          start_time: session.startTime.toISOString(),
          end_time: session.endTime?.toISOString(),
          subject_id: session.subjectId,
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: TimerSession = {
        id: data.id,
        type: data.type,
        duration: data.duration,
        completed: data.completed,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        subjectId: data.subject_id,
      };

      setTimerSessions(prev => [newSession, ...prev]);
    } catch (error) {
      console.error('Error adding timer session:', error);
    }
  };

  const updateTimerSettings = async (settings: Partial<TimerSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          focus_time: settings.focusTime,
          short_break: settings.shortBreak,
          long_break: settings.longBreak,
          auto_start: settings.autoStart,
          sound_enabled: settings.soundEnabled,
          fullscreen_mode: settings.fullscreenMode,
          notification_sound: settings.notificationSound,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setTimerSettings(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Error updating timer settings:', error);
    }
  };

  const calculateStats = () => {
    const totalTime = timerSessions.reduce((acc, session) => {
      return acc + (session.completed ? session.duration : 0);
    }, 0);

    const completedSessions = timerSessions.filter(session => session.completed).length;
    const completedSubjects = subjects.filter(subject => subject.progress === 100).length;
    const avgSessionLength = completedSessions > 0 ? totalTime / completedSessions : 0;

    // Calculate streak (simplified - in real app would be more complex)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasStudiedToday = timerSessions.some(session => 
      session.completed && 
      new Date(session.startTime).toDateString() === today.toDateString()
    );
    
    const hasStudiedYesterday = timerSessions.some(session => 
      session.completed && 
      new Date(session.startTime).toDateString() === yesterday.toDateString()
    );

    let streakDays = 0;
    if (hasStudiedToday) {
      streakDays = 1;
      if (hasStudiedYesterday) {
        streakDays = 2; // Simplified - would need more complex logic for longer streaks
      }
    }

    setUserStats({
      totalStudyTime: totalTime,
      sessionsCompleted: completedSessions,
      streakDays,
      subjectsCompleted: completedSubjects,
      averageSessionLength: avgSessionLength,
    });
  };

  useEffect(() => {
    calculateStats();
  }, [subjects, timerSessions]);

  return (
    <StudyContext.Provider value={{
      subjects,
      timerSessions,
      timerSettings,
      userStats,
      addSubject,
      updateSubject,
      deleteSubject,
      addTopic,
      updateTopic,
      deleteTopic,
      toggleTopicComplete,
      reorderTopics,
      addTimerSession,
      updateTimerSettings,
      calculateStats,
      refreshData,
    }}>
      {children}
    </StudyContext.Provider>
  );
};