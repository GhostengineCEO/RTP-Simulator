import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Clock, Star, TrendingUp, Target, Award, 
  CheckCircle, XCircle, AlertTriangle, ArrowRight,
  RotateCcw, Home, BookOpen, Play, Medal, Zap
} from 'lucide-react';
import { ScenarioCompletion, PathComparisonResult, PerformanceSummary } from '../types';

interface ScenarioCompleteProps {
  completion: ScenarioCompletion;
  onTryAgain: () => void;
  onNextScenario: () => void;
  onReturnHome: () => void;
  availableNextScenarios: { id: string; title: string; difficulty: string }[];
}

const ScenarioComplete: React.FC<ScenarioCompleteProps> = ({
  completion,
  onTryAgain,
  onNextScenario,
  onReturnHome,
  availableNextScenarios
}) => {
  const [currentView, setCurrentView] = useState<'summary' | 'details' | 'comparison'>('summary');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Show celebration animation for high scores
    if (completion.finalScore >= 80) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [completion.finalScore]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceBg = (score: number): string => {
    if (score >= 90) return 'bg-green-500/10 border-green-500/20';
    if (score >= 70) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getGradeEmoji = (score: number): string => {
    if (score >= 95) return '🏆';
    if (score >= 90) return '🥇';
    if (score >= 80) return '🥈';
    if (score >= 70) return '🥉';
    if (score >= 60) return '⭐';
    return '📝';
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-primary-900 border border-primary-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div 
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: '100%',
                    rotate: 0,
                    opacity: 1
                  }}
                  animate={{
                    y: '-20%',
                    rotate: 360,
                    opacity: 0
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {['🎉', '🎊', '⭐', '🏆', '🥇'][i % 5]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="p-6 border-b border-primary-700">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl mb-2">{getGradeEmoji(completion.finalScore)}</div>
            <h2 className="text-2xl font-bold text-white mb-2">Scenario Complete!</h2>
            <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(completion.finalScore)}`}>
              {completion.finalScore}/100
            </div>
            <div className="text-primary-300">
              {completion.performanceSummary.overall === 'excellent' ? 'Outstanding Performance!' :
               completion.performanceSummary.overall === 'good' ? 'Great Job!' :
               completion.performanceSummary.overall === 'satisfactory' ? 'Well Done!' :
               completion.performanceSummary.overall === 'needs_improvement' ? 'Keep Learning!' :
               'Try Again!'}
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-4 mt-6">
            {[
              { key: 'summary', label: 'Summary', icon: Trophy },
              { key: 'details', label: 'Details', icon: Target },
              { key: 'comparison', label: 'Path Analysis', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as any)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentView === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-primary-700 text-primary-300 hover:bg-primary-600 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentView === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg border ${getPerformanceBg(completion.finalScore)}`}>
                    <Trophy className="h-8 w-8 mb-2 text-yellow-400" />
                    <div className="text-sm text-primary-300">Final Score</div>
                    <div className={`text-2xl font-bold ${getPerformanceColor(completion.finalScore)}`}>
                      {completion.finalScore}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-500/20">
                    <Clock className="h-8 w-8 mb-2 text-blue-400" />
                    <div className="text-sm text-primary-300">Time Taken</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {formatTime(completion.totalTimeElapsed)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-purple-500/10 border-purple-500/20">
                    <Star className="h-8 w-8 mb-2 text-purple-400" />
                    <div className="text-sm text-primary-300">Client Satisfaction</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {completion.clientSatisfactionScore}/5
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border bg-green-500/10 border-green-500/20">
                    <Target className="h-8 w-8 mb-2 text-green-400" />
                    <div className="text-sm text-primary-300">Efficiency</div>
                    <div className="text-2xl font-bold text-green-400">
                      {completion.optimalPathComparison.efficiencyPercentage}%
                    </div>
                  </div>
                </div>

                {/* Badges Earned */}
                {completion.badges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Medal className="h-5 w-5 mr-2 text-yellow-400" />
                      Badges Earned
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {completion.badges.map((badge) => (
                        <motion.div
                          key={badge.id}
                          className="flex items-center p-3 bg-primary-800 border border-primary-600 rounded-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * completion.badges.indexOf(badge) }}
                        >
                          <div className="text-2xl mr-3">{badge.icon}</div>
                          <div>
                            <div className="font-medium text-white">{badge.name}</div>
                            <div className="text-sm text-primary-300">{badge.description}</div>
                            <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                              badge.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                              badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                              badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                              badge.rarity === 'uncommon' ? 'bg-green-500/20 text-green-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-400" />
                    Performance Breakdown
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-primary-300">Communication</span>
                          <span className="text-sm text-white">{completion.performanceSummary.communicationScore}%</span>
                        </div>
                        <div className="w-full bg-primary-700 rounded-full h-2">
                          <motion.div 
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completion.performanceSummary.communicationScore}%` }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-primary-300">Technical Accuracy</span>
                          <span className="text-sm text-white">{completion.performanceSummary.technicalAccuracy}%</span>
                        </div>
                        <div className="w-full bg-primary-700 rounded-full h-2">
                          <motion.div 
                            className="bg-green-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completion.performanceSummary.technicalAccuracy}%` }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-primary-300">Time Efficiency</span>
                          <span className="text-sm text-white">{completion.performanceSummary.timeEfficiency}%</span>
                        </div>
                        <div className="w-full bg-primary-700 rounded-full h-2">
                          <motion.div 
                            className="bg-yellow-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completion.performanceSummary.timeEfficiency}%` }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-primary-300">Troubleshooting</span>
                          <span className="text-sm text-white">{completion.performanceSummary.troubleshootingMethodology}%</span>
                        </div>
                        <div className="w-full bg-primary-700 rounded-full h-2">
                          <motion.div 
                            className="bg-purple-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${completion.performanceSummary.troubleshootingMethodology}%` }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    What You Did Well
                  </h3>
                  <div className="space-y-2">
                    {completion.performanceSummary.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <CheckCircle className="h-4 w-4 mt-1 mr-3 text-green-400 flex-shrink-0" />
                        <span className="text-green-100">{strength}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {completion.areasForImprovement.map((improvement, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <AlertTriangle className="h-4 w-4 mt-1 mr-3 text-yellow-400 flex-shrink-0" />
                        <span className="text-yellow-100">{improvement}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {completion.nextRecommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                      Recommended Next Steps
                    </h3>
                    <div className="space-y-2">
                      {completion.nextRecommendations.map((recommendation, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <ArrowRight className="h-4 w-4 mt-1 mr-3 text-blue-400 flex-shrink-0" />
                          <span className="text-blue-100">{recommendation}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentView === 'comparison' && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Path Efficiency */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-400" />
                    Path Efficiency Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary-800 border border-primary-600 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {completion.optimalPathComparison.totalSteps}
                      </div>
                      <div className="text-sm text-primary-300">Your Steps</div>
                    </div>
                    <div className="p-4 bg-primary-800 border border-primary-600 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {completion.optimalPathComparison.optimalSteps}
                      </div>
                      <div className="text-sm text-primary-300">Optimal Steps</div>
                    </div>
                    <div className="p-4 bg-primary-800 border border-primary-600 rounded-lg text-center">
                      <div className={`text-2xl font-bold ${getPerformanceColor(completion.optimalPathComparison.efficiencyPercentage)}`}>
                        {completion.optimalPathComparison.efficiencyPercentage}%
                      </div>
                      <div className="text-sm text-primary-300">Efficiency</div>
                    </div>
                  </div>
                </div>

                {/* Missed Optimal Choices */}
                {completion.optimalPathComparison.missedOptimalChoices.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <XCircle className="h-5 w-5 mr-2 text-red-400" />
                      Missed Opportunities
                    </h3>
                    <div className="space-y-3">
                      {completion.optimalPathComparison.missedOptimalChoices.map((choice, index) => (
                        <motion.div
                          key={choice.stepId}
                          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-red-200">Better Choice Available</div>
                            <div className="text-sm text-red-400 font-medium">
                              {choice.scoreImpact > 0 ? '+' : ''}{choice.scoreImpact} points
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-primary-300 mb-1">Your Choice:</div>
                              <div className="text-red-200">{choice.userChoice}</div>
                            </div>
                            <div>
                              <div className="text-primary-300 mb-1">Optimal Choice:</div>
                              <div className="text-green-200">{choice.optimalChoice}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-primary-200">
                            {choice.impactDescription}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-primary-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={onTryAgain}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </motion.button>
            
            {availableNextScenarios.length > 0 && (
              <motion.button
                onClick={onNextScenario}
                className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="h-4 w-4 mr-2" />
                Next Scenario
              </motion.button>
            )}
            
            <motion.button
              onClick={onReturnHome}
              className="flex items-center justify-center px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Menu
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScenarioComplete;
