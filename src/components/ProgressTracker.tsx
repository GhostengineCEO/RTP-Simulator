import React from 'react';
import { X, Trophy, Award, Star, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { UserProgress, Scenario } from '../types';

interface ProgressTrackerProps {
  userProgress: UserProgress;
  scenarios: Scenario[];
  onClose: () => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  userProgress, 
  scenarios, 
  onClose 
}) => {
  const completedCount = userProgress.completedScenarios.length;
  const totalCount = scenarios.length;
  const completionPercentage = (completedCount / totalCount) * 100;

  const getSkillColor = (level: number) => {
    if (level >= 80) return 'text-success bg-success/10';
    if (level >= 60) return 'text-warning bg-warning/10';
    if (level >= 40) return 'text-info bg-info/10';
    return 'text-error bg-error/10';
  };

  const getSkillLevel = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 70) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    if (level >= 30) return 'Beginner';
    return 'Novice';
  };

  const achievements = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first scenario',
      icon: Star,
      unlocked: completedCount >= 1,
      progress: Math.min(completedCount, 1),
      target: 1
    },
    {
      id: 'problem-solver',
      title: 'Problem Solver',
      description: 'Complete 3 scenarios',
      icon: CheckCircle,
      unlocked: completedCount >= 3,
      progress: Math.min(completedCount, 3),
      target: 3
    },
    {
      id: 'it-specialist',
      title: 'IT Specialist',
      description: 'Complete 5 scenarios',
      icon: Award,
      unlocked: completedCount >= 5,
      progress: Math.min(completedCount, 5),
      target: 5
    },
    {
      id: 'network-guru',
      title: 'Network Guru',
      description: 'Reach 80% skill level in Network',
      icon: TrendingUp,
      unlocked: userProgress.skillLevels.network >= 80,
      progress: userProgress.skillLevels.network,
      target: 80
    },
    {
      id: 'security-expert',
      title: 'Security Expert',
      description: 'Reach 80% skill level in Security',
      icon: Trophy,
      unlocked: userProgress.skillLevels.security >= 80,
      progress: userProgress.skillLevels.security,
      target: 80
    },
    {
      id: 'hardware-master',
      title: 'Hardware Master',
      description: 'Reach 80% skill level in Hardware',
      icon: Trophy,
      unlocked: userProgress.skillLevels.hardware >= 80,
      progress: userProgress.skillLevels.hardware,
      target: 80
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-primary-900 border border-primary-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-700">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-success" />
              Progress Tracker
            </h2>
            <p className="text-primary-400 text-sm mt-1">Track your learning progress and achievements</p>
          </div>
          <button
            onClick={onClose}
            className="text-primary-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-thin space-y-6">
          {/* Overall Progress */}
          <div className="bg-primary-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">{completedCount}</div>
                <div className="text-primary-300">Completed Scenarios</div>
                <div className="text-sm text-primary-400">out of {totalCount}</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-warning mb-2">{userProgress.totalScore}</div>
                <div className="text-primary-300">Total Score</div>
                <div className="text-sm text-primary-400">points earned</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-info mb-2">{completionPercentage.toFixed(0)}%</div>
                <div className="text-primary-300">Completion Rate</div>
                <div className="w-full bg-primary-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-info h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Levels */}
          <div className="bg-primary-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Skill Levels</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(userProgress.skillLevels).map(([skill, level]) => (
                <div key={skill} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{skill}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getSkillColor(level)}`}>
                        {getSkillLevel(level)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{level}%</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-primary-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        level >= 80 ? 'bg-success' : 
                        level >= 60 ? 'bg-warning' : 
                        level >= 40 ? 'bg-info' : 'bg-error'
                      }`}
                      style={{ width: `${level}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-primary-400">
                    Next milestone: {level < 100 ? Math.ceil(level / 10) * 10 : 100}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-primary-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                const progressPercentage = achievement.target > 0 ? (achievement.progress / achievement.target) * 100 : 0;
                
                return (
                  <div
                    key={achievement.id}
                    className={`border rounded-lg p-4 transition-all ${
                      achievement.unlocked 
                        ? 'border-success/50 bg-success/5' 
                        : 'border-primary-600 bg-primary-800/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked ? 'bg-success/20' : 'bg-primary-700'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          achievement.unlocked ? 'text-success' : 'text-primary-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          achievement.unlocked ? 'text-success' : 'text-primary-300'
                        }`}>
                          {achievement.title}
                        </div>
                        <div className="text-sm text-primary-400 mb-2">
                          {achievement.description}
                        </div>
                        
                        {!achievement.unlocked && (
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.target}</span>
                            </div>
                            <div className="w-full bg-primary-700 rounded-full h-2">
                              <div
                                className="bg-warning h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {achievement.unlocked && (
                          <div className="flex items-center text-xs text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Unlocked!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-primary-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            
            <div className="space-y-3">
              {scenarios.filter(s => userProgress.completedScenarios.includes(s.id)).map((scenario, index) => (
                <div key={scenario.id} className="flex items-center space-x-3 p-3 bg-primary-700/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div className="flex-1">
                    <div className="font-medium">{scenario.title}</div>
                    <div className="text-sm text-primary-400">
                      Completed • {scenario.category} • {scenario.difficulty}
                    </div>
                  </div>
                  <div className="text-xs text-primary-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {scenario.estimatedTime}
                  </div>
                </div>
              ))}
              
              {completedCount === 0 && (
                <div className="text-center text-primary-400 py-6">
                  No completed scenarios yet. Start your first scenario to begin tracking your progress!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
