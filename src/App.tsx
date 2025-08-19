import { useState, useEffect, useRef } from 'react';
import { Monitor, Terminal, Settings, Home, BarChart3, Clock, Trophy, Target, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScenarioSelection from './components/ScenarioSelection';
import ChatInterface from './components/ChatInterface';
import PRTGDashboard from './components/PRTGDashboard';
import TerminalEmulator from './components/TerminalEmulator';
import ProgressTracker from './components/ProgressTracker';
import ScenarioComplete from './components/ScenarioComplete';
import HelpTrainingMode from './components/HelpTrainingMode';
import ConfirmationDialog from './components/ConfirmationDialog';
import { 
  Scenario, ChatMessage, GameState, ClientMood, CompletionStatus, TrainingMode,
  ConfirmationDialog as ConfirmationDialogType, ScenarioCompletion, PathComparisonResult,
  PerformanceSummary
} from './types';
import { scenarios, conversationSteps } from './data/scenarios';
import { ScenarioStateManager, ProgressManager } from './utils/stateManager';
import { ProgressSaveManager, useAutoSave } from './utils/progressSave';

type View = 'home' | 'scenario' | 'chat';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showPRTGDashboard, setShowPRTGDashboard] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showScenarioComplete, setShowScenarioComplete] = useState(false);
  const [showHelpTraining, setShowHelpTraining] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [scenarioCompletion, setScenarioCompletion] = useState<ScenarioCompletion | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialogType>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
    variant: 'info'
  });
  const [trainingMode, setTrainingMode] = useState<TrainingMode>({
    enabled: true,
    showHints: true,
    explainChoices: true,
    showRealWorldContext: true,
    pauseOnMistakes: false
  });

  const stateManagerRef = useRef<ScenarioStateManager | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentScenario: null,
    userProgress: {
      completedScenarios: ['3'],
      totalScore: 85,
      skillLevels: {
        network: 75,
        security: 60,
        hardware: 90,
        software: 70,
        telephony: 85,
        infrastructure: 65
      },
      achievements: [
        {
          id: 'first_steps',
          name: 'First Steps',
          description: 'Completed your first IT support scenario',
          icon: '🚀',
          criteria: { minScore: 50 },
          rarity: 'common'
        },
        {
          id: 'hardware_expert',
          name: 'Hardware Expert',
          description: 'Successfully diagnosed hardware failures',
          icon: '🔧',
          criteria: { minScore: 70, specificActions: ['hardware_diagnosis'] },
          rarity: 'uncommon'
        }
      ],
      certifications: [
        {
          level: 'bronze',
          requirements: ['Complete 3 scenarios with 70+ score'],
          earned: true
        }
      ],
      totalTimeSpent: 240,
      averageResolutionTime: 25,
      bestPracticesScore: 78,
      clientSatisfactionAverage: 4.2,
      escalationAccuracy: 85
    },
    globalSettings: {
      hintsEnabled: true,
      timerEnabled: true,
      difficultyMode: 'learning'
    },
    sessionStats: {
      sessionsCompleted: 3,
      totalTime: 240,
      averageScore: 75
    }
  });

  // Real-time scenario state updates
  const [scenarioProgress, setScenarioProgress] = useState(0);
  const [clientMood, setClientMood] = useState<ClientMood>('neutral');
  const [currentScore, setCurrentScore] = useState(0);
  const [toolsAccessible, setToolsAccessible] = useState({ prtg: false, putty: false });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const startScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentView('chat');
    
    // Initialize state manager for the scenario
    const scenarioConversationSteps = conversationSteps[scenario.id] || [];
    const stateManager = new ScenarioStateManager(scenario, scenarioConversationSteps);
    stateManagerRef.current = stateManager;
    
    // Initialize scenario state
    const initialState = stateManager.getCurrentState();
    setGameState(prev => ({
      ...prev,
      currentScenario: initialState
    }));
    
    // Initialize UI state
    setScenarioProgress(stateManager.getProgress());
    setClientMood(initialState.clientMood);
    setCurrentScore(initialState.score.total);
    setToolsAccessible({
      prtg: stateManager.canAccessTool('prtg'),
      putty: stateManager.canAccessTool('putty')
    });
    
    // Initialize chat with first conversation step
    const firstStep = scenarioConversationSteps[0];
    setChatMessages([
      {
        id: '1',
        type: 'system',
        content: `🎯 SCENARIO: "${scenario.title}" | Difficulty: ${scenario.difficulty.toUpperCase()} | Users Affected: ${scenario.usersAffected}`,
        timestamp: new Date(),
        sender: 'System'
      },
      {
        id: '2',
        type: 'system',
        content: `📋 OBJECTIVES: ${scenario.objectives.join(', ')}`,
        timestamp: new Date(),
        sender: 'System'
      },
      {
        id: '3',
        type: 'client',
        content: firstStep?.clientResponse || scenario.description,
        timestamp: new Date(),
        sender: 'Client',
        mood: initialState.clientMood,
        toolHint: firstStep?.toolSuggestion !== 'none' ? `Suggested tool: ${firstStep?.toolSuggestion}` : undefined
      }
    ]);
  };

  const sendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      sender: 'You'
    };

    setChatMessages(prev => [...prev, newMessage]);

    if (!stateManagerRef.current || !selectedScenario) return;

    // Process user response through state manager
    const result = stateManagerRef.current.processUserAction(content, 'response');
    
    // Update UI state
    const updatedState = stateManagerRef.current.getCurrentState();
    setGameState(prev => ({
      ...prev,
      currentScenario: updatedState
    }));
    
    setScenarioProgress(stateManagerRef.current.getProgress());
    setClientMood(result.moodChange);
    setCurrentScore(updatedState.score.total);
    setToolsAccessible({
      prtg: stateManagerRef.current.canAccessTool('prtg'),
      putty: stateManagerRef.current.canAccessTool('putty')
    });

    // Get next conversation step
    const nextStep = stateManagerRef.current.advanceConversationStep();
    
    setTimeout(() => {
      let responseContent = result.feedback;
      let toolHint: string | undefined;
      
      if (nextStep) {
        responseContent = nextStep.clientResponse;
        toolHint = nextStep.toolSuggestion !== 'none' ? `Suggested tool: ${nextStep.toolSuggestion}` : undefined;
      }

      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'client',
        content: responseContent,
        timestamp: new Date(),
        sender: 'Client',
        mood: result.moodChange,
        toolHint,
        scoreImpact: result.scoreChange,
        isOptimal: result.scoreChange > 0
      };

      setChatMessages(prev => [...prev, response]);

      // Check if scenario should be completed
      if (stateManagerRef.current && stateManagerRef.current.getProgress() >= 100) {
        setTimeout(() => {
          const completionStatus = stateManagerRef.current!.completeScenario();
          handleScenarioCompletion(completionStatus);
        }, 2000);
      }
    }, 1500);
  };

  // Handle tool access with state management
  const handleToolAccess = (toolType: 'prtg' | 'putty', diagnostics?: string[]) => {
    if (!stateManagerRef.current) return;

    const result = stateManagerRef.current.accessTool(toolType, diagnostics);
    
    // Update state
    const updatedState = stateManagerRef.current.getCurrentState();
    setGameState(prev => ({
      ...prev,
      currentScenario: updatedState
    }));
    
    setScenarioProgress(stateManagerRef.current.getProgress());
    setClientMood(result.moodChange);
    setCurrentScore(updatedState.score.total);
    setToolsAccessible({
      prtg: stateManagerRef.current.canAccessTool('prtg'),
      putty: stateManagerRef.current.canAccessTool('putty')
    });

    // Add tool access message to chat
    const toolMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `🔧 Tool accessed: ${toolType.toUpperCase()} | Score impact: ${result.scoreChange > 0 ? '+' : ''}${result.scoreChange}`,
      timestamp: new Date(),
      sender: 'System',
      scoreImpact: result.scoreChange,
      isOptimal: result.scoreChange > 0
    };

    setChatMessages(prev => [...prev, toolMessage]);

    if (result.feedback) {
      setTimeout(() => {
        const feedbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.feedback,
          timestamp: new Date(),
          sender: 'IT Support'
        };
        setChatMessages(prev => [...prev, feedbackMessage]);
      }, 1000);
    }
  };

  // Handle scenario completion
  const handleScenarioCompletion = (completionStatus: CompletionStatus) => {
    if (!selectedScenario || !stateManagerRef.current) return;

    // Create enhanced scenario completion data
    const currentState = stateManagerRef.current.getCurrentState();
    const timeElapsed = Math.floor((Date.now() - currentState.startTime.getTime()) / 1000);
    
    // Generate path comparison
    const pathComparison: PathComparisonResult = {
      totalSteps: currentState.decisionHistory.length,
      optimalSteps: selectedScenario.optimalPath.length,
      efficiencyPercentage: Math.round((selectedScenario.optimalPath.length / Math.max(currentState.decisionHistory.length, 1)) * 100),
      missedOptimalChoices: currentState.decisionHistory
        .filter(decision => !decision.wasOptimal)
        .slice(0, 3) // Show top 3 missed opportunities
        .map(decision => ({
          stepId: decision.stepId,
          userChoice: decision.action,
          optimalChoice: selectedScenario.optimalPath.find(step => step.id === decision.stepId)?.action || 'Unknown',
          impactDescription: `This choice resulted in ${decision.scoreImpact} point impact and ${decision.consequences.join(', ')}`,
          scoreImpact: decision.scoreImpact
        })),
      extraStepsReason: currentState.mistakesMade.map(mistake => mistake.description)
    };

    // Generate performance summary
    const performanceSummary: PerformanceSummary = {
      overall: completionStatus.finalScore >= 90 ? 'excellent' :
               completionStatus.finalScore >= 75 ? 'good' :
               completionStatus.finalScore >= 60 ? 'satisfactory' :
               completionStatus.finalScore >= 40 ? 'needs_improvement' : 'poor',
      strengths: completionStatus.feedback.strengths,
      weaknesses: completionStatus.feedback.improvements,
      timeEfficiency: Math.min(100, Math.round((300 / Math.max(timeElapsed, 1)) * 100)), // Assume 5 min optimal
      communicationScore: Math.round(currentState.score.breakdown.clientSatisfaction),
      technicalAccuracy: Math.round(currentState.score.breakdown.accuracy),
      troubleshootingMethodology: Math.round(currentState.score.breakdown.efficiency)
    };

    const completion: ScenarioCompletion = {
      scenarioId: selectedScenario.id,
      completionTime: new Date(),
      totalTimeElapsed: timeElapsed,
      finalScore: completionStatus.finalScore,
      clientSatisfactionScore: Math.round(currentState.score.breakdown.clientSatisfaction / 20), // Convert to 5-point scale
      pathTaken: currentState.decisionHistory,
      optimalPathComparison: pathComparison,
      performanceSummary,
      areasForImprovement: completionStatus.feedback.improvements,
      badges: completionStatus.badgesEarned,
      nextRecommendations: completionStatus.feedback.recommendedTraining
    };

    setScenarioCompletion(completion);
    setShowScenarioComplete(true);

    // Update user progress
    const updatedProgress = ProgressManager.updateUserProgress(
      gameState.userProgress,
      selectedScenario,
      currentState
    );

    setGameState(prev => ({
      ...prev,
      userProgress: updatedProgress,
      currentScenario: null
    }));

    // Save progress
    ProgressSaveManager.saveProgress(gameState, chatMessages, selectedScenario.id);
  };

  // Handle end scenario
  const handleEndScenario = () => {
    if (!selectedScenario) return;

    setConfirmationDialog({
      isOpen: true,
      title: 'End Current Scenario?',
      message: `Are you sure you want to end "${selectedScenario.title}"? Your progress will be lost and you'll return to the scenario selection.`,
      confirmText: 'End Scenario',
      cancelText: 'Continue',
      variant: 'warning',
      onConfirm: () => {
        // Reset scenario state
        setSelectedScenario(null);
        setCurrentView('home');
        setChatMessages([]);
        setScenarioProgress(0);
        setCurrentScore(0);
        setClientMood('neutral');
        setToolsAccessible({ prtg: false, putty: false });
        stateManagerRef.current = null;
        
        setGameState(prev => ({
          ...prev,
          currentScenario: null
        }));

        // Clear scenario progress from localStorage
        ProgressSaveManager.clearScenarioProgress();

        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handle training mode changes
  const handleTrainingModeChange = (changes: Partial<TrainingMode>) => {
    setTrainingMode(prev => ({ ...prev, ...changes }));
  };

  // Handle hint requests
  const handleHintRequest = (type: string) => {
    if (!stateManagerRef.current || !selectedScenario) return;
    
    const hintMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `💡 HINT (${type.toUpperCase()}): Based on your current situation, consider checking the monitoring tools for additional information about the issue.`,
      timestamp: new Date(),
      sender: 'Training Assistant'
    };

    setChatMessages(prev => [...prev, hintMessage]);
  };

  // Handle scenario completion actions
  const handleTryAgain = () => {
    if (!selectedScenario) return;
    setShowScenarioComplete(false);
    setScenarioCompletion(null);
    startScenario(selectedScenario);
  };

  const handleNextScenario = () => {
    setShowScenarioComplete(false);
    setScenarioCompletion(null);
    setCurrentView('home');
  };

  const handleReturnHome = () => {
    setShowScenarioComplete(false);
    setScenarioCompletion(null);
    setCurrentView('home');
  };

  // Auto-save functionality
  useAutoSave(gameState, chatMessages, selectedScenario?.id, scenarioProgress);

  // Load saved progress on startup
  useEffect(() => {
    const savedProgress = ProgressSaveManager.loadProgress();
    if (savedProgress) {
      setGameState(prev => ({
        ...prev,
        ...savedProgress.gameState
      }));
      
      // Optionally restore scenario progress
      if (savedProgress.currentScenarioProgress) {
        // Could implement scenario restoration here
      }
    }
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <ScenarioSelection
            scenarios={scenarios}
            onSelectScenario={startScenario}
            userProgress={gameState.userProgress}
          />
        );
      case 'chat':
        return selectedScenario ? (
          <ChatInterface
            scenario={selectedScenario}
            messages={chatMessages}
            onSendMessage={sendMessage}
            onBack={() => setCurrentView('home')}
            onToolAccess={handleToolAccess}
          />
        ) : null;
      default:
        return (
          <ScenarioSelection
            scenarios={scenarios}
            onSelectScenario={startScenario}
            userProgress={gameState.userProgress}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-primary-900 border-b border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-success mr-3" />
              <h1 className="text-xl font-bold">IT Support Training Simulator</h1>
            </div>
            
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'home' 
                    ? 'bg-primary-700 text-white' 
                    : 'text-primary-300 hover:text-white hover:bg-primary-800'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Scenarios
              </button>
              
              {currentView === 'chat' && (
                <button
                  onClick={() => setShowPRTGDashboard(true)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-800 transition-colors"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  PRTG Monitor
                </button>
              )}
              
              {currentView === 'chat' && (
                <button
                  onClick={() => setShowTerminal(true)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-800 transition-colors"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Terminal
                </button>
              )}
              
              <button
                onClick={() => setShowProgress(true)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-800 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress
              </button>

              <button
                onClick={() => setShowHelpTraining(true)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-300 hover:text-white hover:bg-primary-800 transition-colors"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {currentView === 'chat' && selectedScenario && (
                <button
                  onClick={handleEndScenario}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  End Scenario
                </button>
              )}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-md text-primary-300 hover:text-white hover:bg-primary-800 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Scenario Status Bar */}
      <AnimatePresence>
        {currentView === 'chat' && gameState.currentScenario && (
          <motion.div 
            className="bg-primary-800 border-b border-primary-700"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 flex-1">
                  {/* Progress */}
                  <motion.div 
                    className="flex items-center space-x-2 min-w-0"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Target className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-primary-300 whitespace-nowrap">Progress:</span>
                    <div className="w-16 sm:w-24 bg-primary-700 rounded-full h-2 flex-shrink-0">
                      <motion.div 
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${scenarioProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <motion.span 
                      className="text-sm text-white font-medium tabular-nums"
                      key={scenarioProgress}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {Math.round(scenarioProgress)}%
                    </motion.span>
                  </motion.div>

                  {/* Client Mood */}
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div 
                      className={`h-3 w-3 rounded-full flex-shrink-0 ${
                        clientMood === 'panicked' ? 'bg-red-500' :
                        clientMood === 'angry' ? 'bg-red-400' :
                        clientMood === 'frustrated' ? 'bg-yellow-500' :
                        clientMood === 'neutral' ? 'bg-gray-400' :
                        clientMood === 'cooperative' ? 'bg-blue-400' :
                        clientMood === 'satisfied' ? 'bg-green-400' :
                        'bg-green-500'
                      }`}
                      animate={{ 
                        scale: clientMood === 'panicked' || clientMood === 'angry' ? [1, 1.2, 1] : 1 
                      }}
                      transition={{ 
                        repeat: clientMood === 'panicked' || clientMood === 'angry' ? Infinity : 0,
                        duration: 0.8 
                      }}
                    />
                    <span className="text-sm text-primary-300 whitespace-nowrap">Client:</span>
                    <motion.span 
                      className="text-sm text-white capitalize"
                      key={clientMood}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {clientMood}
                      <span className="ml-1">
                        {clientMood === 'panicked' ? '😱' :
                         clientMood === 'angry' ? '😡' :
                         clientMood === 'frustrated' ? '😤' :
                         clientMood === 'neutral' ? '😐' :
                         clientMood === 'cooperative' ? '🙂' :
                         clientMood === 'satisfied' ? '😊' :
                         clientMood === 'grateful' ? '😍' : '😐'}
                      </span>
                    </motion.span>
                  </motion.div>

                  {/* Score */}
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Trophy className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm text-primary-300 whitespace-nowrap">Score:</span>
                    <motion.span 
                      className={`text-sm font-medium tabular-nums ${
                        currentScore >= 70 ? 'text-green-400' :
                        currentScore >= 40 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}
                      key={currentScore}
                      initial={{ scale: 1.2, y: -5 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      {currentScore}
                    </motion.span>
                  </motion.div>

                  {/* Time */}
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Clock className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-primary-300 whitespace-nowrap">Time:</span>
                    <span className="text-sm text-white tabular-nums">
                      {gameState.currentScenario ? 
                        Math.floor((Date.now() - gameState.currentScenario.startTime.getTime()) / 60000) : 0}m
                    </span>
                  </motion.div>
                </div>

                {/* Tool Access Status */}
                <motion.div 
                  className="flex items-center space-x-2 flex-shrink-0"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-sm text-primary-300 whitespace-nowrap hidden sm:inline">Tools:</span>
                  <motion.button
                    onClick={() => toolsAccessible.prtg && handleToolAccess('prtg')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      toolsAccessible.prtg 
                        ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95' 
                        : 'bg-primary-600 text-primary-300 cursor-not-allowed'
                    }`}
                    disabled={!toolsAccessible.prtg}
                    whileHover={toolsAccessible.prtg ? { scale: 1.05 } : {}}
                    whileTap={toolsAccessible.prtg ? { scale: 0.95 } : {}}
                  >
                    PRTG
                    {toolsAccessible.prtg && gameState.currentScenario?.toolsAccessed.prtgChecked && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-1 text-green-200"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => toolsAccessible.putty && handleToolAccess('putty')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      toolsAccessible.putty 
                        ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95' 
                        : 'bg-primary-600 text-primary-300 cursor-not-allowed'
                    }`}
                    disabled={!toolsAccessible.putty}
                    whileHover={toolsAccessible.putty ? { scale: 1.05 } : {}}
                    whileTap={toolsAccessible.putty ? { scale: 0.95 } : {}}
                  >
                    PuTTY
                    {toolsAccessible.putty && gameState.currentScenario?.toolsAccessed.puttyChecked && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-1 text-green-200"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderCurrentView()}
      </main>

      {/* Popups */}
      {showPRTGDashboard && selectedScenario && (
        <PRTGDashboard 
          scenarioId={selectedScenario.id} 
          onClose={() => setShowPRTGDashboard(false)}
          onSensorClick={(sensor) => {
            // Add sensor click functionality to chat
            const sensorMessage: ChatMessage = {
              id: Date.now().toString(),
              type: 'system',
              content: `PRTG Alert: Clicked on sensor "${sensor.name}" - Status: ${sensor.status}, Value: ${sensor.value}. Message: ${sensor.message}`,
              timestamp: new Date(),
              sender: 'PRTG System'
            };
            setChatMessages(prev => [...prev, sensorMessage]);
            setShowPRTGDashboard(false);
          }}
        />
      )}
      
      {showTerminal && (
        <TerminalEmulator 
          onClose={() => setShowTerminal(false)} 
          scenarioId={selectedScenario?.id}
        />
      )}
      
      {showProgress && (
        <ProgressTracker 
          userProgress={gameState.userProgress} 
          scenarios={scenarios}
          onClose={() => setShowProgress(false)} 
        />
      )}

      {showScenarioComplete && scenarioCompletion && (
        <ScenarioComplete
          completion={scenarioCompletion}
          onTryAgain={handleTryAgain}
          onNextScenario={handleNextScenario}
          onReturnHome={handleReturnHome}
          availableNextScenarios={scenarios
            .filter(s => s.id !== selectedScenario?.id && !gameState.userProgress.completedScenarios.includes(s.id))
            .slice(0, 3)
            .map(s => ({ id: s.id, title: s.title, difficulty: s.difficulty }))
          }
        />
      )}

      {showHelpTraining && (
        <HelpTrainingMode
          isOpen={showHelpTraining}
          onClose={() => setShowHelpTraining(false)}
          currentScenarioId={selectedScenario?.id || ''}
          currentStep={scenarioProgress}
          trainingMode={trainingMode}
          onToggleTrainingMode={handleTrainingModeChange}
          onRequestHint={handleHintRequest}
        />
      )}

      <ConfirmationDialog dialog={confirmationDialog} />
    </div>
  );
}

export default App;
