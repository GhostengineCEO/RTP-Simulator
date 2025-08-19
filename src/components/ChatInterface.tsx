import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, ArrowLeft, User, Bot, Clock, CheckCircle, AlertTriangle, Target, TrendingUp, Award, Monitor, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scenario, ChatMessage, ClientMood, ScenarioState } from '../types';
import { conversationSteps } from '../data/scenarios';
import { ScenarioStateManager } from '../utils/stateManager';

interface ChatInterfaceProps {
  scenario: Scenario;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onBack: () => void;
  onToolAccess?: (toolType: 'prtg' | 'putty') => void;
}

interface ResponseOption {
  id: string;
  text: string;
  type: 'professional' | 'empathetic' | 'technical' | 'escalation';
  actionType: 'response' | 'tool_access' | 'diagnosis' | 'escalation';
  scoreModifier?: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  scenario,
  messages: initialMessages,
  onSendMessage,
  onBack,
  onToolAccess
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showResponseOptions, setShowResponseOptions] = useState(false);
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);
  const [scenarioCompleted, setScenarioCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize State Manager
  const stateManager = useMemo(() => {
    const steps = conversationSteps[scenario.id] || [];
    return new ScenarioStateManager(scenario, steps);
  }, [scenario]);

  const [currentState, setCurrentState] = useState<ScenarioState>(stateManager.getCurrentState());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1]
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize conversation with client's initial problem
    const steps = conversationSteps[scenario.id];
    if (steps && steps.length > 0) {
      setTimeout(() => {
        const initialClientMessage: ChatMessage = {
          id: 'client-1',
          type: 'client',
          content: steps[0].clientResponse,
          timestamp: new Date(),
          sender: 'Client',
          mood: currentState.clientMood
        };
        setMessages([initialClientMessage]);
        
        // Show response options after client's initial message
        setTimeout(() => {
          setShowResponseOptions(true);
          setResponseOptions(generateSmartResponseOptions());
        }, 1500);
      }, 1000);
    }
  }, [scenario.id]);

  const generateSmartResponseOptions = (): ResponseOption[] => {
    const nextOptimal = stateManager.getNextOptimalAction();
    const progress = stateManager.getProgress();
    
    if (progress < 25) {
      // Initial assessment phase
      return [
        {
          id: 'assess-professional',
          text: 'I understand this is urgent. Let me gather some information to help resolve this quickly.',
          type: 'professional',
          actionType: 'response',
          scoreModifier: 10
        },
        {
          id: 'assess-empathetic',
          text: 'I can see how frustrating this must be. I\'m here to help get this fixed as quickly as possible.',
          type: 'empathetic', 
          actionType: 'response',
          scoreModifier: 8
        },
        {
          id: 'assess-technical',
          text: 'Let me start by checking our monitoring systems to identify the scope of this issue.',
          type: 'technical',
          actionType: 'tool_access',
          scoreModifier: nextOptimal?.type === 'tool_access' ? 15 : 5
        },
        {
          id: 'assess-escalate',
          text: 'This sounds critical. I\'ll escalate this immediately while investigating.',
          type: 'escalation',
          actionType: 'escalation',
          scoreModifier: scenario.severity === 'emergency' ? 12 : -5
        }
      ];
    } else if (progress < 50) {
      // Investigation phase
      return [
        {
          id: 'investigate-prtg',
          text: 'Let me check the PRTG monitoring system to see what\'s happening.',
          type: 'technical',
          actionType: 'tool_access',
          scoreModifier: nextOptimal?.id === 'check_prtg' || nextOptimal?.id === 'check_prtg_radius' || nextOptimal?.id === 'check_prtg_poe' || nextOptimal?.id === 'emergency_prtg' ? 20 : 5
        },
        {
          id: 'investigate-scope',
          text: 'Can you tell me exactly which systems or users are affected?',
          type: 'professional',
          actionType: 'response',
          scoreModifier: 10
        },
        {
          id: 'investigate-timeline',
          text: 'When did you first notice this issue? Any recent changes?',
          type: 'technical',
          actionType: 'response',
          scoreModifier: 8
        },
        {
          id: 'investigate-escalate',
          text: 'I\'m going to involve our Level 2 team immediately given the business impact.',
          type: 'escalation',
          actionType: 'escalation',
          scoreModifier: currentState.currentStep < 2 ? -10 : 15
        }
      ];
    } else if (progress < 75) {
      // Diagnosis phase
      return [
        {
          id: 'diagnose-putty',
          text: 'I need to access the system directly via terminal for detailed diagnostics.',
          type: 'technical',
          actionType: 'tool_access',
          scoreModifier: nextOptimal?.type === 'tool_access' && currentState.toolsAccessed.prtgChecked ? 25 : 5
        },
        {
          id: 'diagnose-analysis',
          text: 'Based on the monitoring data, I can see the root cause. Let me investigate further.',
          type: 'professional',
          actionType: 'diagnosis',
          scoreModifier: currentState.toolsAccessed.prtgChecked ? 15 : -5
        },
        {
          id: 'diagnose-explain',
          text: 'I can see what\'s wrong. This appears to be a hardware/infrastructure issue.',
          type: 'empathetic',
          actionType: 'diagnosis', 
          scoreModifier: 10
        },
        {
          id: 'diagnose-escalate',
          text: 'I\'ve identified the issue and need to escalate to the appropriate team for resolution.',
          type: 'escalation',
          actionType: 'escalation',
          scoreModifier: nextOptimal?.type === 'escalation' ? 20 : 0
        }
      ];
    } else {
      // Resolution/Escalation phase
      return [
        {
          id: 'resolve-escalate',
          text: 'I\'ve completed the diagnosis. This requires hardware replacement - escalating to Level 2.',
          type: 'escalation',
          actionType: 'escalation',
          scoreModifier: 25
        },
        {
          id: 'resolve-timeline',
          text: 'I can provide you with a timeline for resolution and will monitor progress closely.',
          type: 'professional',
          actionType: 'response',
          scoreModifier: 15
        },
        {
          id: 'resolve-workaround',
          text: 'While we work on the permanent fix, let me see if there are any temporary workarounds.',
          type: 'empathetic',
          actionType: 'diagnosis',
          scoreModifier: 12
        },
        {
          id: 'resolve-complete',
          text: 'I\'ve documented everything and initiated the repair process. You\'ll receive updates.',
          type: 'professional',
          actionType: 'escalation',
          scoreModifier: 20
        }
      ];
    }
  };

  const handleResponseOption = (option: ResponseOption) => {
    // Process the user action through state manager
    const result = stateManager.processUserAction(option.text, option.actionType);
    
    // Add tech response message
    const techMessage: ChatMessage = {
      id: `tech-${Date.now()}`,
      type: 'user',
      content: option.text,
      timestamp: new Date(),
      sender: 'IT Support Tech',
      scoreImpact: result.scoreChange,
      isOptimal: result.scoreChange > 0
    };

    setMessages(prev => [...prev, techMessage]);
    setShowResponseOptions(false);

    // Show feedback if there were mistakes
    if (result.mistakes.length > 0) {
      const feedbackMessage: ChatMessage = {
        id: `feedback-${Date.now()}`,
        type: 'system',
        content: `⚠️ ${result.feedback} (Score: ${result.scoreChange > 0 ? '+' : ''}${result.scoreChange})`,
        timestamp: new Date(),
        sender: 'Training System'
      };
      setMessages(prev => [...prev, feedbackMessage]);
    }

    // Update current state
    const newState = stateManager.getCurrentState();
    setCurrentState(newState);

    // Show typing indicator
    setIsTyping(true);

    // Get next conversation step
    const nextStep = stateManager.advanceConversationStep();
    
    if (nextStep) {
      setTimeout(() => {
        setIsTyping(false);
        
        const clientResponse: ChatMessage = {
          id: `client-${Date.now()}`,
          type: 'client',
          content: nextStep.clientResponse,
          timestamp: new Date(),
          sender: 'Client',
          mood: newState.clientMood
        };

        setMessages(prev => [...prev, clientResponse]);

        // Check if scenario is complete
        const progress = stateManager.getProgress();
        if (progress >= 100) {
          // Complete the scenario
          const completionStatus = stateManager.completeScenario();
          setScenarioCompleted(true);
          
          // Show completion message
          setTimeout(() => {
            const completionMessage: ChatMessage = {
              id: `completion-${Date.now()}`,
              type: 'system',
              content: `🎉 Scenario Complete!\nFinal Score: ${completionStatus.finalScore}\nBadges Earned: ${completionStatus.badgesEarned.map(b => b.name).join(', ') || 'None'}\n\n${completionStatus.feedback.summary}`,
              timestamp: new Date(),
              sender: 'Training System'
            };
            setMessages(prev => [...prev, completionMessage]);
          }, 1000);
        } else {
          // Show next response options
          setTimeout(() => {
            setShowResponseOptions(true);
            setResponseOptions(generateSmartResponseOptions());
          }, 2000);
        }
      }, 1500 + Math.random() * 1500);
    }
  };

  const handleToolAccess = (toolType: 'prtg' | 'putty') => {
    const result = stateManager.accessTool(toolType);
    
    // Show tool access feedback
    const toolMessage: ChatMessage = {
      id: `tool-${Date.now()}`,
      type: 'system',
      content: `🔧 Accessed ${toolType.toUpperCase()} - ${result.feedback} (Score: ${result.scoreChange > 0 ? '+' : ''}${result.scoreChange})`,
      timestamp: new Date(),
      sender: 'System'
    };
    
    setMessages(prev => [...prev, toolMessage]);
    setCurrentState(stateManager.getCurrentState());
    
    // Trigger tool access callback if provided
    if (onToolAccess) {
      onToolAccess(toolType);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageAlignment = (type: string) => {
    switch (type) {
      case 'client': return 'justify-start';
      case 'user': return 'justify-end';
      case 'system': return 'justify-center';
      default: return 'justify-start';
    }
  };

  const getMessageBubbleStyle = (type: string, mood?: string) => {
    switch (type) {
      case 'client':
        const moodColor = mood === 'angry' || mood === 'panicked' ? 'bg-error' :
                         mood === 'frustrated' ? 'bg-warning text-black' :
                         mood === 'satisfied' || mood === 'grateful' ? 'bg-success' :
                         'bg-pink-600';
        return `max-w-sm lg:max-w-xl px-4 py-3 rounded-2xl ${moodColor} text-white`;
      case 'user':
        return 'max-w-sm lg:max-w-xl px-4 py-3 rounded-2xl bg-info text-white';
      case 'system':
        return 'max-w-xl px-4 py-3 rounded-2xl bg-primary-600 text-white text-center';
      default:
        return 'max-w-sm lg:max-w-xl px-4 py-3 rounded-2xl bg-primary-700 text-white';
    }
  };

  const getMoodIcon = (mood?: string) => {
    const iconProps = { className: "h-4 w-4 flex-shrink-0" };
    
    switch (mood) {
      case 'angry':
      case 'panicked':
        return (
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <span className="text-lg">😡</span>
          </motion.div>
        );
      case 'frustrated':
        return <span className="text-lg">😤</span>;
      case 'neutral':
        return <span className="text-lg">😐</span>;
      case 'cooperative':
        return <span className="text-lg">🙂</span>;
      case 'satisfied':
        return <span className="text-lg">😊</span>;
      case 'grateful':
        return (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-lg">😍</span>
          </motion.div>
        );
      default:
        return <User {...iconProps} />;
    }
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'panicked': return '😱';
      case 'angry': return '😡';
      case 'frustrated': return '😤';
      case 'neutral': return '😐';
      case 'cooperative': return '🙂';
      case 'satisfied': return '😊';
      case 'grateful': return '😍';
      default: return '😐';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-success';
    if (score >= 10) return 'text-info';
    if (score >= 0) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-6rem)]">
      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-primary-900/50 border border-primary-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-primary-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scenarios
            </button>
            <div className="flex items-center text-primary-400">
              <Clock className="h-4 w-4 mr-2" />
              {scenario.estimatedTime}
            </div>
          </div>
          
          <h1 className="text-xl font-bold mb-2">{scenario.title}</h1>
          <p className="text-primary-300 text-sm mb-3">{scenario.description}</p>
          
          {/* Severity and Impact Indicators */}
          <div className="flex items-center space-x-4 mb-3">
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              scenario.severity === 'emergency' ? 'bg-error text-white animate-pulse' :
              scenario.severity === 'critical' ? 'bg-error/80 text-white' :
              scenario.severity === 'high' ? 'bg-warning text-black' :
              'bg-info text-white'
            }`}>
              {scenario.severity.toUpperCase()}
            </div>
            <div className="text-sm text-primary-300">
              <strong>Affected:</strong> {scenario.usersAffected}
            </div>
            <div className="text-sm text-primary-300">
              <strong>Mood:</strong> 
              <span className={`ml-2 capitalize ${
                currentState.clientMood === 'angry' || currentState.clientMood === 'panicked' ? 'text-error' :
                currentState.clientMood === 'frustrated' ? 'text-warning' :
                currentState.clientMood === 'satisfied' || currentState.clientMood === 'grateful' ? 'text-success' :
                'text-info'
              }`}>
                {currentState.clientMood}
              </span>
            </div>
          </div>

          {/* Real-time Progress and Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-primary-300">Progress: </span>
                <span className="text-info font-bold">{Math.round(stateManager.getProgress())}%</span>
              </div>
              <div className="text-sm">
                <span className="text-primary-300">Score: </span>
                <span className={`font-bold ${getScoreColor(currentState.score.total)}`}>
                  {currentState.score.total}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-primary-300">Client Satisfaction: </span>
                <span className="text-info font-bold">
                  {currentState.score.clientSatisfactionRating.toFixed(1)}/5.0
                </span>
              </div>
            </div>
            
            {/* Tool Access Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleToolAccess('prtg')}
                className="flex items-center px-3 py-1 text-xs bg-primary-600 hover:bg-primary-500 rounded transition-colors"
                disabled={!stateManager.canAccessTool('prtg')}
              >
                <Monitor className="h-3 w-3 mr-1" />
                PRTG
              </button>
              <button
                onClick={() => handleToolAccess('putty')}
                className="flex items-center px-3 py-1 text-xs bg-primary-600 hover:bg-primary-500 rounded transition-colors"
                disabled={!stateManager.canAccessTool('putty')}
              >
                <Terminal className="h-3 w-3 mr-1" />
                PuTTY
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-primary-900/50 border border-primary-700 rounded-lg overflow-hidden flex flex-col min-h-[70vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[65vh]">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div 
                  key={message.id} 
                  className={`flex ${getMessageAlignment(message.type)}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="flex flex-col space-y-1 max-w-full">
                    <motion.div 
                      className={getMessageBubbleStyle(message.type, message.mood)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'client' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {getMoodIcon(message.mood)}
                          </motion.div>
                        )}
                        <div className="flex-1">
                          <motion.p 
                            className="text-sm leading-relaxed whitespace-pre-line"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {message.content}
                          </motion.p>
                          {message.scoreImpact && (
                            <motion.div 
                              className={`text-xs mt-1 ${getScoreColor(message.scoreImpact)}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              Score: {message.scoreImpact > 0 ? '+' : ''}{message.scoreImpact}
                              {message.isOptimal && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.5, type: "spring" }}
                                >
                                  {' ✓'}
                                </motion.span>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className={`text-xs text-primary-400 px-2 ${
                        message.type === 'user' ? 'text-right' : message.type === 'system' ? 'text-center' : 'text-left'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {message.sender} • {formatTime(message.timestamp)}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  className="flex justify-start"
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div 
                    className="bg-pink-600 max-w-xs px-4 py-3 rounded-2xl"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <motion.div 
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                        />
                      </div>
                      <span className="text-xs text-white opacity-75">Client is typing...</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Response Options */}
            <AnimatePresence>
              {showResponseOptions && !scenarioCompleted && (
                <motion.div 
                  className="flex justify-center"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div 
                    className="bg-warning max-w-2xl px-4 py-3 rounded-2xl text-black shadow-2xl"
                    animate={pulseVariants.pulse}
                  >
                    <motion.div 
                      className="text-sm font-medium mb-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Choose your response:
                      {stateManager.getNextOptimalAction() && (
                        <motion.div 
                          className="text-xs text-primary-700 mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          💡 Hint: Consider {stateManager.getNextOptimalAction()?.action.toLowerCase()}
                        </motion.div>
                      )}
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {responseOptions.map((option, index) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleResponseOption(option)}
                          className={`p-3 rounded-lg text-left text-sm transition-all duration-200 hover:shadow-lg active:scale-95 ${
                            option.type === 'professional' ? 'bg-info text-white hover:bg-info/80' :
                            option.type === 'empathetic' ? 'bg-success text-white hover:bg-success/80' :
                            option.type === 'technical' ? 'bg-primary-600 text-white hover:bg-primary-500' :
                            'bg-error text-white hover:bg-error/80'
                          }`}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex-1 pr-2">{option.text}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs opacity-75 capitalize whitespace-nowrap">
                                {option.type}
                              </span>
                              {option.scoreModifier && (
                                <motion.span 
                                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                                    option.scoreModifier > 10 ? 'bg-success/20 text-success' :
                                    option.scoreModifier > 0 ? 'bg-info/20 text-info' :
                                    'bg-error/20 text-error'
                                  }`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                                >
                                  {option.scoreModifier > 0 ? '+' : ''}{option.scoreModifier}
                                </motion.span>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scenario Complete Options */}
            <AnimatePresence>
              {scenarioCompleted && (
                <motion.div 
                  className="flex justify-center"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div 
                    className="bg-success max-w-lg px-4 py-3 rounded-2xl text-white shadow-2xl"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(34, 197, 94, 0.4)",
                        "0 0 0 10px rgba(34, 197, 94, 0)",
                        "0 0 0 0 rgba(34, 197, 94, 0)"
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      >
                        <Award className="h-8 w-8 mx-auto mb-2" />
                      </motion.div>
                      <motion.div 
                        className="text-lg font-bold mb-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        Scenario Complete! 🎉
                      </motion.div>
                      <motion.button
                        onClick={onBack}
                        className="bg-white text-success px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Return to Scenarios
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Sidebar - Real-time Analytics */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Current State Panel */}
        <div className="bg-primary-900/50 border border-primary-700 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Current Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-300">Tools Used:</span>
              <div className="flex space-x-1">
                <span className={`px-2 py-1 rounded text-xs ${
                  currentState.toolsAccessed.prtgChecked ? 'bg-success text-white' : 'bg-primary-600 text-primary-300'
                }`}>PRTG</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  currentState.toolsAccessed.puttyChecked ? 'bg-success text-white' : 'bg-primary-600 text-primary-300'
                }`}>PuTTY</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-300">Resolution:</span>
              <span className="capitalize text-info">{currentState.resolutionStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-300">Escalation:</span>
              <span className="capitalize text-warning">{currentState.escalationStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-300">Mistakes:</span>
              <span className={currentState.mistakesMade.length > 0 ? 'text-error' : 'text-success'}>
                {currentState.mistakesMade.length}
              </span>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-primary-900/50 border border-primary-700 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Score Breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(currentState.score.breakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-primary-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className={getScoreColor(value)}>{Math.round(value)}</span>
              </div>
            ))}
            <hr className="border-primary-600 my-2" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className={getScoreColor(currentState.score.total)}>
                {Math.round(currentState.score.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary-900/50 border border-primary-700 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">Next Steps</h3>
          <div className="space-y-2">
            {scenario.optimalPath.map((step, index) => (
              <div key={step.id} className={`flex items-center text-sm p-2 rounded ${
                index < currentState.currentStep ? 'bg-success/20 text-success' :
                index === currentState.currentStep ? 'bg-warning/20 text-warning' :
                'bg-primary-700/50 text-primary-300'
              }`}>
                {index < currentState.currentStep ? (
                  <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                ) : index === currentState.currentStep ? (
                  <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 mr-2 flex-shrink-0 rounded-full border-2 border-primary-500" />
                )}
                <span className="text-xs">{step.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
