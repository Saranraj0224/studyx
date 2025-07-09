import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Volume2, VolumeX, Maximize, Bell, Music, Zap } from 'lucide-react';
import { useStudy } from '../../contexts/StudyContext';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TimerSettingsProps {
  onClose: () => void;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({ onClose }) => {
  const { timerSettings, updateTimerSettings } = useStudy();
  const [tempSettings, setTempSettings] = useState(timerSettings);

  const handleSave = async () => {
    await updateTimerSettings(tempSettings);
    onClose();
  };

  const soundOptions = [
    { value: 'bell', label: 'Bell', icon: Bell },
    { value: 'chime', label: 'Chime', icon: Music },
    { value: 'beep', label: 'Beep', icon: Zap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Timer Settings</h2>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X size={18} />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Timer Durations */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Timer Durations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Focus Time (minutes)
                  </label>
                  <Input
                    type="number"
                    value={tempSettings.focusTime.toString()}
                    onChange={(value) => setTempSettings({
                      ...tempSettings,
                      focusTime: Math.max(1, parseInt(value) || 25)
                    })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Break (minutes)
                  </label>
                  <Input
                    type="number"
                    value={tempSettings.shortBreak.toString()}
                    onChange={(value) => setTempSettings({
                      ...tempSettings,
                      shortBreak: Math.max(1, parseInt(value) || 5)
                    })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Long Break (minutes)
                  </label>
                  <Input
                    type="number"
                    value={tempSettings.longBreak.toString()}
                    onChange={(value) => setTempSettings({
                      ...tempSettings,
                      longBreak: Math.max(1, parseInt(value) || 15)
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Auto-start Settings */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <span className="text-white font-medium">Auto-start breaks</span>
                <p className="text-sm text-gray-400">Automatically start break timers after focus sessions</p>
              </div>
              <button
                onClick={() => setTempSettings({
                  ...tempSettings,
                  autoStart: !tempSettings.autoStart
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.autoStart ? 'bg-white' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                    tempSettings.autoStart ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sound Settings */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Sound Settings</h3>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg mb-4">
                <div className="flex items-center">
                  {tempSettings.soundEnabled ? (
                    <Volume2 size={20} className="text-white mr-3" />
                  ) : (
                    <VolumeX size={20} className="text-gray-400 mr-3" />
                  )}
                  <div>
                    <span className="text-white font-medium">Sound notifications</span>
                    <p className="text-sm text-gray-400">Play sound when timer ends</p>
                  </div>
                </div>
                <button
                  onClick={() => setTempSettings({
                    ...tempSettings,
                    soundEnabled: !tempSettings.soundEnabled
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tempSettings.soundEnabled ? 'bg-white' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      tempSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {tempSettings.soundEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Notification Sound
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {soundOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setTempSettings({
                            ...tempSettings,
                            notificationSound: option.value
                          })}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            tempSettings.notificationSound === option.value
                              ? 'bg-white text-black border-white'
                              : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <Icon size={20} className="mx-auto mb-2" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Mode */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center">
                <Maximize size={20} className="text-white mr-3" />
                <div>
                  <span className="text-white font-medium">Fullscreen mode</span>
                  <p className="text-sm text-gray-400">Enable fullscreen timer by default</p>
                </div>
              </div>
              <button
                onClick={() => setTempSettings({
                  ...tempSettings,
                  fullscreenMode: !tempSettings.fullscreenMode
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.fullscreenMode ? 'bg-white' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                    tempSettings.fullscreenMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Preset Configurations */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setTempSettings({
                    ...tempSettings,
                    focusTime: 25,
                    shortBreak: 5,
                    longBreak: 15,
                  })}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <div className="font-medium">Pomodoro Classic</div>
                  <div className="text-sm text-gray-400">25/5/15 minutes</div>
                </button>
                
                <button
                  onClick={() => setTempSettings({
                    ...tempSettings,
                    focusTime: 50,
                    shortBreak: 10,
                    longBreak: 30,
                  })}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <div className="font-medium">Extended Focus</div>
                  <div className="text-sm text-gray-400">50/10/30 minutes</div>
                </button>
                
                <button
                  onClick={() => setTempSettings({
                    ...tempSettings,
                    focusTime: 15,
                    shortBreak: 3,
                    longBreak: 10,
                  })}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <div className="font-medium">Quick Sessions</div>
                  <div className="text-sm text-gray-400">15/3/10 minutes</div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Settings
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};