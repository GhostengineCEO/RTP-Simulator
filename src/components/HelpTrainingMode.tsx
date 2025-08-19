import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, BookOpen, Lightbulb, Target, Zap, 
  X, ChevronDown, ChevronUp, Search, Info,
  CheckCircle, AlertTriangle, Clock, Users,
  Building, Shield, FileText
} from 'lucide-react';
import { HintData, RealWorldContext, TechnicalGlossary, TrainingMode } from '../types';

interface HelpTrainingModeProps {
  isOpen: boolean;
  onClose: () => void;
  currentScenarioId: string;
  currentStep?: number;
  trainingMode: TrainingMode;
  onToggleTrainingMode: (mode: Partial<TrainingMode>) => void;
  onRequestHint: (type: string) => void;
}

const HelpTrainingMode: React.FC<HelpTrainingModeProps> = ({
  isOpen,
  onClose,
  currentScenarioId,
  currentStep,
  trainingMode,
  onToggleTrainingMode,
  onRequestHint
}) => {
  const [activeTab, setActiveTab] = useState<'hints' | 'context' | 'glossary' | 'settings'>('hints');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Sample data - in a real app, these would come from props or API
  const hints: HintData[] = [
    {
      id: 'h1',
      scenarioId: currentScenarioId,
      stepId: currentStep?.toString(),
      type: 'best_practice',
      title: 'Always Gather Information First',
      content: 'Before jumping into solutions, always gather comprehensive information about the problem. Ask clarifying questions and use monitoring tools to understand the full scope of the issue.',
      when_to_show: 'always',
      related_concepts: ['troubleshooting', 'diagnostics', 'methodology']
    },
    {
      id: 'h2',
      scenarioId: currentScenarioId,
      type: 'methodology',
      title: 'Systematic Troubleshooting Approach',
      content: 'Follow a structured approach: 1) Define the problem, 2) Gather information, 3) Identify possible causes, 4) Test solutions, 5) Implement and monitor. This reduces resolution time and improves success rates.',
      when_to_show: 'on_mistake',
      related_concepts: ['methodology', 'best_practice']
    },
    {
      id: 'h3',
      scenarioId: currentScenarioId,
      type: 'tool_usage',
      title: 'PRTG Monitoring Best Practices',
      content: 'When using PRTG, check sensor history for patterns, review thresholds, and correlate multiple sensors. Red sensors indicate critical issues, yellow shows warnings, and green means normal operation.',
      when_to_show: 'always',
      related_concepts: ['prtg', 'monitoring', 'network']
    },
    {
      id: 'h4',
      scenarioId: currentScenarioId,
      type: 'communication',
      title: 'Managing Client Expectations',
      content: 'Keep clients informed throughout the process. Acknowledge their concerns, provide realistic timeframes, and explain your troubleshooting steps in simple terms. This builds trust and reduces anxiety.',
      when_to_show: 'always',
      related_concepts: ['communication', 'client_management']
    },
    {
      id: 'h5',
      scenarioId: currentScenarioId,
      type: 'escalation',
      title: 'When to Escalate Issues',
      content: 'Escalate when: the issue is beyond your skill level, requires specialized access/tools, impacts critical business functions, or when your troubleshooting attempts could cause more damage.',
      when_to_show: 'on_delay',
      related_concepts: ['escalation', 'risk_management']
    }
  ];

  const realWorldContext: RealWorldContext = {
    scenarioId: currentScenarioId,
    background: 'You are working as a Level 1 IT Support technician at a medium-sized accounting firm during tax season.',
    industryContext: 'Accounting firms have strict compliance requirements and operate under intense time pressure during tax season. Network issues can result in missed deadlines and potential regulatory violations.',
    businessImpact: [
      'Revenue loss: $500-2000 per hour during outages',
      'Compliance risk: IRS filing deadlines cannot be missed',
      'Client trust: Accounting firms must maintain high reliability',
      'Staff productivity: 200+ users affected by network issues'
    ],
    stakeholders: [
      'Partners (highest priority, direct client responsibility)',
      'Senior Managers (project oversight)',
      'Staff Accountants (end users)',
      'IT Manager (your direct supervisor)',
      'Clients (external, indirectly affected)'
    ],
    escalationPath: [
      'Level 1 Support (You) → Level 2 Support',
      'Level 2 Support → IT Manager',
      'IT Manager → External IT Consultant',
      'Emergency: Direct to IT Manager'
    ],
    complianceConsiderations: [
      'SOX compliance for financial data',
      'Client confidentiality requirements',
      'Data backup and recovery procedures',
      'Change management documentation'
    ]
  };

  const glossary: TechnicalGlossary = {
    'PRTG': {
      definition: 'Paessler Router Traffic Grapher - A network monitoring software that tracks network performance, bandwidth usage, and system uptime.',
      examples: ['Monitoring server CPU usage', 'Tracking network bandwidth', 'Alert notifications for downtime'],
      relatedTerms: ['SNMP', 'Network Monitoring', 'Sensors'],
      category: 'network'
    },
    'PuTTY': {
      definition: 'A free and open-source terminal emulator, serial console, and network file transfer application that supports SSH, Telnet, and other protocols.',
      examples: ['SSH connections to Linux servers', 'Serial console access', 'Telnet sessions'],
      relatedTerms: ['SSH', 'Telnet', 'Terminal', 'Remote Access'],
      category: 'software'
    },
    'SLA': {
      definition: 'Service Level Agreement - A contract between a service provider and client that defines expected service levels, response times, and remedies for non-compliance.',
      examples: ['99.9% uptime guarantee', '4-hour response time', 'Maximum 2-hour resolution time'],
      relatedTerms: ['Uptime', 'Response Time', 'Availability'],
      category: 'general'
    },
    'RTO': {
      definition: 'Recovery Time Objective - The maximum acceptable length of time that a computer, system, network, or application can be down after a failure occurs.',
      examples: ['Email system RTO: 2 hours', 'Critical database RTO: 30 minutes', 'File server RTO: 4 hours'],
      relatedTerms: ['RPO', 'Disaster Recovery', 'Business Continuity'],
      category: 'general'
    },
    'Escalation': {
      definition: 'The process of transferring a support ticket to a higher level of support when the current level cannot resolve the issue within defined parameters.',
      examples: ['Hardware failure requiring replacement', 'Complex network routing issues', 'Security incidents'],
      relatedTerms: ['Tiers', 'Support Levels', 'Handoff'],
      category: 'general'
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const filteredGlossary = Object.entries(glossary).filter(([term, data]) =>
    term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHintIcon = (type: HintData['type']) => {
    switch (type) {
      case 'best_practice': return <CheckCircle className="h-4 w-4" />;
      case 'methodology': return <Target className="h-4 w-4" />;
      case 'tool_usage': return <Zap className="h-4 w-4" />;
      case 'communication': return <Users className="h-4 w-4" />;
      case 'escalation': return <AlertTriangle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getHintColor = (type: HintData['type']) => {
    switch (type) {
      case 'best_practice': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'methodology': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'tool_usage': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'communication': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'escalation': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-primary-400 bg-primary-500/10 border-primary-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-primary-900 border border-primary-700 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-primary-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-xl font-bold text-white">Help & Training Mode</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-primary-400 hover:text-white transition-colors rounded-lg hover:bg-primary-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mt-6">
            {[
              { key: 'hints', label: 'Hints & Tips', icon: Lightbulb },
              { key: 'context', label: 'Real-World Context', icon: Building },
              { key: 'glossary', label: 'Technical Glossary', icon: BookOpen },
              { key: 'settings', label: 'Training Settings', icon: Info }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === key
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'hints' && (
              <motion.div
                key="hints"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Available Hints</h3>
                  <p className="text-primary-300 text-sm">
                    These hints can help you improve your troubleshooting approach and learn best practices.
                  </p>
                </div>

                {hints.map((hint) => (
                  <motion.div
                    key={hint.id}
                    className={`p-4 rounded-lg border ${getHintColor(hint.type)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * hints.indexOf(hint) }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getHintIcon(hint.type)}
                        <h4 className="font-medium text-white ml-2">{hint.title}</h4>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-700 text-primary-300 capitalize">
                        {hint.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-primary-100 text-sm mb-3">{hint.content}</p>
                    {hint.related_concepts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {hint.related_concepts.map((concept) => (
                          <span
                            key={concept}
                            className="text-xs px-2 py-1 bg-primary-600 text-primary-200 rounded-full"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'context' && (
              <motion.div
                key="context"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-400" />
                    Scenario Background
                  </h3>
                  <p className="text-primary-200 bg-primary-800 p-4 rounded-lg border border-primary-600">
                    {realWorldContext.background}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-green-400" />
                    Industry Context
                  </h3>
                  <p className="text-primary-200 bg-primary-800 p-4 rounded-lg border border-primary-600">
                    {realWorldContext.industryContext}
                  </p>
                </div>

                {/* Business Impact */}
                <div>
                  <button
                    onClick={() => toggleSection('business-impact')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                      Business Impact
                    </h3>
                    {expandedSections['business-impact'] ? 
                      <ChevronUp className="h-4 w-4 text-primary-400" /> : 
                      <ChevronDown className="h-4 w-4 text-primary-400" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections['business-impact'] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {realWorldContext.businessImpact.map((impact, index) => (
                          <div key={index} className="flex items-start p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <AlertTriangle className="h-4 w-4 mt-1 mr-3 text-yellow-400 flex-shrink-0" />
                            <span className="text-yellow-100 text-sm">{impact}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stakeholders */}
                <div>
                  <button
                    onClick={() => toggleSection('stakeholders')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Users className="h-5 w-5 mr-2 text-purple-400" />
                      Key Stakeholders
                    </h3>
                    {expandedSections['stakeholders'] ? 
                      <ChevronUp className="h-4 w-4 text-primary-400" /> : 
                      <ChevronDown className="h-4 w-4 text-primary-400" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections['stakeholders'] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {realWorldContext.stakeholders.map((stakeholder, index) => (
                          <div key={index} className="flex items-start p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <Users className="h-4 w-4 mt-1 mr-3 text-purple-400 flex-shrink-0" />
                            <span className="text-purple-100 text-sm">{stakeholder}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Escalation Path */}
                <div>
                  <button
                    onClick={() => toggleSection('escalation')}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-400" />
                      Escalation Path
                    </h3>
                    {expandedSections['escalation'] ? 
                      <ChevronUp className="h-4 w-4 text-primary-400" /> : 
                      <ChevronDown className="h-4 w-4 text-primary-400" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections['escalation'] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {realWorldContext.escalationPath.map((path, index) => (
                          <div key={index} className="flex items-start p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="h-6 w-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-blue-100 text-sm">{path}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'glossary' && (
              <motion.div
                key="glossary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-4 w-4 text-primary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search terms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-primary-800 border border-primary-600 rounded-lg text-white placeholder-primary-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredGlossary.map(([term, data]) => (
                    <motion.div
                      key={term}
                      className="p-4 bg-primary-800 border border-primary-600 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-lg">{term}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-blue-100 capitalize">
                          {data.category}
                        </span>
                      </div>
                      <p className="text-primary-200 mb-3">{data.definition}</p>
                      
                      {data.examples.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-primary-300 mb-1">Examples:</h5>
                          <ul className="text-sm text-primary-200 space-y-1">
                            {data.examples.map((example, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-400 mr-2">•</span>
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {data.relatedTerms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-primary-300">Related:</span>
                          {data.relatedTerms.map((relatedTerm) => (
                            <span
                              key={relatedTerm}
                              className="text-xs px-2 py-1 bg-primary-600 text-primary-200 rounded-full"
                            >
                              {relatedTerm}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {filteredGlossary.length === 0 && (
                  <div className="text-center py-8 text-primary-400">
                    No terms found matching "{searchTerm}"
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Training Mode Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary-800 border border-primary-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Enable Training Mode</h4>
                        <p className="text-sm text-primary-300">Show additional help and explanations throughout scenarios</p>
                      </div>
                      <button
                        onClick={() => onToggleTrainingMode({ enabled: !trainingMode.enabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          trainingMode.enabled ? 'bg-blue-600' : 'bg-primary-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          trainingMode.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary-800 border border-primary-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Show Hints</h4>
                        <p className="text-sm text-primary-300">Display contextual hints based on your actions</p>
                      </div>
                      <button
                        onClick={() => onToggleTrainingMode({ showHints: !trainingMode.showHints })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          trainingMode.showHints ? 'bg-blue-600' : 'bg-primary-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          trainingMode.showHints ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary-800 border border-primary-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Explain Choices</h4>
                        <p className="text-sm text-primary-300">Show why certain choices are better than others</p>
                      </div>
                      <button
                        onClick={() => onToggleTrainingMode({ explainChoices: !trainingMode.explainChoices })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          trainingMode.explainChoices ? 'bg-blue-600' : 'bg-primary-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          trainingMode.explainChoices ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary-800 border border-primary-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Real-World Context</h4>
                        <p className="text-sm text-primary-300">Display background information about the scenario</p>
                      </div>
                      <button
                        onClick={() => onToggleTrainingMode({ showRealWorldContext: !trainingMode.showRealWorldContext })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          trainingMode.showRealWorldContext ? 'bg-blue-600' : 'bg-primary-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          trainingMode.showRealWorldContext ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary-800 border border-primary-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Pause on Mistakes</h4>
                        <p className="text-sm text-primary-300">Pause the scenario to explain when you make a mistake</p>
                      </div>
                      <button
                        onClick={() => onToggleTrainingMode({ pauseOnMistakes: !trainingMode.pauseOnMistakes })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          trainingMode.pauseOnMistakes ? 'bg-blue-600' : 'bg-primary-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          trainingMode.pauseOnMistakes ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpTrainingMode;
