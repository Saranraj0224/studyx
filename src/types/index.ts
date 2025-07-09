export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
  topics: Topic[];
  createdAt: Date;
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date;
}

export interface TimerSession {
  id: string;
  type: 'focus' | 'pomodoro' | 'custom';
  duration: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  subjectId?: string;
}

export interface TimerSettings {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  autoStart: boolean;
  soundEnabled: boolean;
  fullscreenMode: boolean;
  notificationSound: string;
}

export interface UserStats {
  totalStudyTime: number;
  sessionsCompleted: number;
  streakDays: number;
  subjectsCompleted: number;
  averageSessionLength: number;
}