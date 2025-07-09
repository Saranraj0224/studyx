import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, ArrowLeft, Maximize, Volume2, VolumeX } from 'lucide-react';
import { useStudy } from '../../contexts/StudyContext';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { CircularProgress } from '../ui/CircularProgress';
import { TimerSettings } from './TimerSettings';

interface TimerPageProps {
  onNavigate: (page: string) => void;
}

export const TimerPage: React.FC<TimerPageProps> = ({ onNavigate }) => {
  const { timerSettings, addTimerSession } = useStudy();
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(timerSettings.focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(timerSettings.soundEnabled);
  const audioRef = useRef<HTMLAudioElement>(null);

  const getModeTime = () => {
    switch (mode) {
      case 'focus':
        return timerSettings.focusTime * 60;
      case 'short':
        return timerSettings.shortBreak * 60;
      case 'long':
        return timerSettings.longBreak * 60;
      default:
        return timerSettings.focusTime * 60;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'focus':
        return 'Focus Session';
      case 'short':
        return 'Short Break';
      case 'long':
        return 'Long Break';
      default:
        return 'Focus Session';
    }
  };

  useEffect(() => {
    if (!sessionStarted) {
      setTimeLeft(getModeTime());
    }
  }, [mode, timerSettings, sessionStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && sessionStarted) {
      // Session completed
      addTimerSession({
        type: mode === 'focus' ? 'focus' : 'custom',
        duration: getModeTime() / 60,
        completed: true,
        startTime: new Date(),
        endTime: new Date(),
      });
      
      // Play notification sound
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
      
      setIsRunning(false);
      setSessionStarted(false);
      
      // Auto-start next session if enabled
      if (timerSettings.autoStart) {
        setTimeout(() => {
          const nextMode = mode === 'focus' ? 'short' : 'focus';
          setMode(nextMode);
          setTimeLeft(nextMode === 'focus' ? timerSettings.focusTime * 60 : timerSettings.shortBreak * 60);
          setIsRunning(true);
          setSessionStarted(true);
        }, 2000);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionStarted, mode, timerSettings, soundEnabled, addTimerSession]);

  const handleStart = () => {
    setIsRunning(true);
    setSessionStarted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionStarted(false);
    setTimeLeft(getModeTime());
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(console.error);
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(console.error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((getModeTime() - timeLeft) / getModeTime()) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 relative overflow-hidden">
      {/* Enhanced Animated background with moving rings like Merlin */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary animated ring */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"
        />
        
        {/* Secondary animated ring */}
        <motion.div
          animate={{
            scale: [1.2, 0.8, 1.2],
            rotate: [360, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/8 rounded-full"
        />
        
        {/* Tertiary animated ring */}
        <motion.div
          animate={{
            scale: [0.8, 1.6, 0.8],
            rotate: [0, -360],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/6 rounded-full"
        />
        
        {/* Pulsing background elements */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-white/4 rounded-full blur-2xl"
        />
      </div>

      {/* Audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification-bell.mp3" type="audio/mpeg" />
        <source src="/notification-bell.wav" type="audio/wav" />
      </audio>

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
            <h1 className="text-3xl font-bold text-white">Study Timer</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="ghost" 
              size="sm"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>
            <Button 
              onClick={toggleFullscreen}
              variant="ghost" 
              size="sm"
            >
              <Maximize size={18} />
            </Button>
            <Button 
              onClick={() => setShowSettings(true)}
              variant="ghost" 
              size="sm"
            >
              <Settings size={18} />
            </Button>
          </div>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard>
            <div className="flex justify-center space-x-4">
              {[
                { key: 'focus', label: 'Focus', time: timerSettings.focusTime },
                { key: 'short', label: 'Short Break', time: timerSettings.shortBreak },
                { key: 'long', label: 'Long Break', time: timerSettings.longBreak },
              ].map((item) => (
                <motion.button
                  key={item.key}
                  onClick={() => !sessionStarted && setMode(item.key as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    mode === item.key
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } ${sessionStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={sessionStarted}
                  whileHover={!sessionStarted ? { scale: 1.05 } : {}}
                  whileTap={!sessionStarted ? { scale: 0.95 } : {}}
                >
                  <div className="text-center">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm opacity-75">{item.time}m</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="text-center">
            <h2 className="text-xl font-semibold text-white mb-8">
              {getModeLabel()}
            </h2>
            
            <div className="flex justify-center mb-8 relative">
              {/* Animated progress ring */}
              <motion.div
                animate={isRunning ? {
                  rotate: [0, 360],
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{
                  rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative"
              >
                <CircularProgress
                  progress={progress}
                  size={240}
                  strokeWidth={8}
                  showLabel={false}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl font-bold text-white"
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center space-x-4">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  variant="primary"
                  size="lg"
                  className="px-8"
                >
                  <Play size={20} className="mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="secondary"
                  size="lg"
                  className="px-8"
                >
                  <Pause size={20} className="mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={handleReset}
                variant="ghost"
                size="lg"
                className="px-8"
              >
                <RotateCcw size={20} className="mr-2" />
                Reset
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Session Info */}
        {sessionStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Current Session
                </h3>
                <p className="text-gray-300">
                  {isRunning ? 'Session in progress...' : 'Session paused'}
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Progress: {Math.round(progress)}%
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-2 w-2 h-2 bg-white rounded-full mx-auto"
                />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>

      {/* Timer Settings Modal */}
      {showSettings && (
        <TimerSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};