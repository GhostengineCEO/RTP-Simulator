export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  category: 'network' | 'security' | 'hardware' | 'software' | 'telephony' | 'infrastructure';
  estimatedTime: string;
  objectives: string[];
  completed: boolean;
  usersAffected: string;
  rootCause: string;
  solutionPath: string[];
  requiredTools: ('prtg' | 'putty' | 'both')[];
  optimalPath: DecisionStep[];
  completionBadges: CompletionBadge[];
}

export interface ScenarioState {
  scenarioId: string;
  currentStep: number;
  conversationStepId: number;
  toolsAccessed: {
    prtgChecked: boolean;
    puttyChecked: boolean;
    prtgTimestamp?: Date;
    puttyTimestamp?: Date;
    diagnosticsRun: string[];
  };
  clientMood: ClientMood;
  moodHistory: MoodChange[];
  resolutionStatus: ResolutionStatus;
  escalationStatus: EscalationStatus;
  conversationHistory: ChatMessage[];
  decisionHistory: UserDecision[];
  startTime: Date;
  lastActivity: Date;
  score: ScenarioScore;
  mistakesMade: Mistake[];
  hintsUsed: number;
  completionStatus: CompletionStatus;
}

export interface DecisionStep {
  id: string;
  type: 'tool_access' | 'diagnosis' | 'response' | 'escalation';
  action: string;
  expectedBefore?: string[];
  moodImpact: MoodImpact;
  scoreImpact: number;
  required: boolean;
  order?: number;
}

export interface DecisionTree {
  scenarioId: string;
  steps: DecisionNode[];
}

export interface DecisionNode {
  id: string;
  condition: string;
  action: string;
  outcomes: DecisionOutcome[];
  prerequisites?: string[];
  scoreModifier: number;
  moodEffect: MoodEffect;
}

export interface DecisionOutcome {
  condition: string;
  nextStepId?: string;
  clientResponse: string;
  moodChange: ClientMood;
  scoreChange: number;
  toolsUnlocked?: ('prtg' | 'putty')[];
}

export interface UserDecision {
  timestamp: Date;
  stepId: string;
  action: string;
  wasOptimal: boolean;
  scoreImpact: number;
  moodImpact: MoodImpact;
  consequences: string[];
}

export interface ScenarioScore {
  total: number;
  breakdown: {
    efficiency: number;
    accuracy: number;
    clientSatisfaction: number;
    toolUtilization: number;
    escalationTiming: number;
    bestPractices: number;
  };
  timeToResolution: number;
  optimalPathPercentage: number;
  clientSatisfactionRating: number;
}

export interface Mistake {
  type: 'wrong_order' | 'missed_step' | 'inappropriate_escalation' | 'poor_communication' | 'tool_misuse';
  description: string;
  timestamp: Date;
  scoreImpact: number;
  consequence: string;
}

export interface CompletionStatus {
  isCompleted: boolean;
  completionTime?: Date;
  finalScore: number;
  badgesEarned: CompletionBadge[];
  certification?: CertificationLevel;
  feedback: CompletionFeedback;
}

export interface CompletionBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: BadgeCriteria;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface BadgeCriteria {
  minScore?: number;
  maxTime?: number;
  perfectPath?: boolean;
  clientSatisfaction?: number;
  noMistakes?: boolean;
  specificActions?: string[];
}

export interface CompletionFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendedTraining: string[];
  nextScenarios: string[];
}

export interface CertificationLevel {
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'expert';
  requirements: string[];
  earned: boolean;
}

export type ClientMood = 'angry' | 'frustrated' | 'neutral' | 'satisfied' | 'cooperative' | 'panicked' | 'grateful';

export type ResolutionStatus = 'investigating' | 'diagnosing' | 'implementing' | 'testing' | 'resolved' | 'escalated' | 'failed';

export type EscalationStatus = 'none' | 'level1' | 'level2' | 'level3' | 'emergency' | 'crisis_management';

export interface MoodChange {
  from: ClientMood;
  to: ClientMood;
  reason: string;
  timestamp: Date;
  trigger: string;
}

export interface MoodImpact {
  change: 'improve' | 'worsen' | 'maintain';
  severity: 'minor' | 'moderate' | 'major';
  reason: string;
}

export interface MoodEffect {
  positive: ClientMood[];
  negative: ClientMood[];
  neutral: ClientMood[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'assistant' | 'client';
  content: string;
  timestamp: Date;
  sender?: string;
  mood?: ClientMood;
  toolHint?: string;
  responseOptions?: ResponseOption[];
  scoreImpact?: number;
  isOptimal?: boolean;
}

export interface ResponseOption {
  id: string;
  text: string;
  type: 'professional' | 'empathetic' | 'technical' | 'escalation';
  consequences: ResponseConsequence;
  scoreModifier: number;
  unlockTools?: ('prtg' | 'putty')[];
}

export interface ResponseConsequence {
  moodChange: ClientMood;
  clientResponse: string;
  nextAction?: string;
  toolsEnabled?: string[];
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'server' | 'switch' | 'router' | 'workstation' | 'printer' | 'phone' | 'firewall' | 'storage';
  ip: string;
  status: 'online' | 'offline' | 'warning' | 'critical' | 'unknown';
  uptime: string;
  cpu: number;
  memory: number;
  ping: number;
  location?: string;
  model?: string;
}

export interface TerminalSession {
  id: string;
  host: string;
  connected: boolean;
  history: string[];
  currentPath: string;
}

export interface UserProgress {
  completedScenarios: string[];
  totalScore: number;
  skillLevels: {
    network: number;
    security: number;
    hardware: number;
    software: number;
    telephony: number;
    infrastructure: number;
  };
  achievements: CompletionBadge[];
  certifications: CertificationLevel[];
  totalTimeSpent: number;
  averageResolutionTime: number;
  bestPracticesScore: number;
  clientSatisfactionAverage: number;
  escalationAccuracy: number;
}

export interface ConversationStep {
  id: number;
  description: string;
  expectedUserAction: string;
  clientResponse: string;
  toolSuggestion?: 'prtg' | 'putty' | 'both' | 'none';
  moodChange?: 'improve' | 'worsen' | 'neutral' | 'frustrated' | 'panicked';
  optimalResponses?: ResponseOption[];
  prerequisites?: string[];
  scoreWeight: number;
}

export interface PRTGSensor {
  id: string;
  name: string;
  type: 'network' | 'server' | 'power' | 'storage' | 'phone' | 'security' | 'internet';
  status: 'UP' | 'DOWN' | 'WARNING' | 'CRITICAL' | 'TIMEOUT' | 'OFFLINE';
  value: string;
  message: string;
  icon: string;
  lastCheck: Date;
  downtime?: string;
}

export interface PRTGAlert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  sensor: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface PRTGScenarioData {
  scenarioId: string;
  sensors: PRTGSensor[];
  alerts: PRTGAlert[];
  title: string;
}

export interface GameState {
  currentScenario: ScenarioState | null;
  userProgress: UserProgress;
  globalSettings: {
    hintsEnabled: boolean;
    timerEnabled: boolean;
    difficultyMode: 'learning' | 'assessment' | 'expert';
  };
  sessionStats: {
    sessionsCompleted: number;
    totalTime: number;
    averageScore: number;
  };
}

// Additional types for new enhancement features
export interface ScenarioCompletion {
  scenarioId: string;
  completionTime: Date;
  totalTimeElapsed: number; // in seconds
  finalScore: number;
  clientSatisfactionScore: number;
  pathTaken: UserDecision[];
  optimalPathComparison: PathComparisonResult;
  performanceSummary: PerformanceSummary;
  areasForImprovement: string[];
  badges: CompletionBadge[];
  nextRecommendations: string[];
}

export interface PathComparisonResult {
  totalSteps: number;
  optimalSteps: number;
  efficiencyPercentage: number;
  missedOptimalChoices: OptimalChoice[];
  extraStepsReason: string[];
}

export interface OptimalChoice {
  stepId: string;
  userChoice: string;
  optimalChoice: string;
  impactDescription: string;
  scoreImpact: number;
}

export interface PerformanceSummary {
  overall: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'poor';
  strengths: string[];
  weaknesses: string[];
  timeEfficiency: number; // percentage
  communicationScore: number;
  technicalAccuracy: number;
  troubleshootingMethodology: number;
}

export interface HintData {
  id: string;
  scenarioId: string;
  stepId?: string;
  type: 'best_practice' | 'methodology' | 'tool_usage' | 'communication' | 'escalation';
  title: string;
  content: string;
  when_to_show: 'always' | 'on_mistake' | 'on_delay' | 'on_request';
  related_concepts: string[];
}

export interface TrainingMode {
  enabled: boolean;
  showHints: boolean;
  explainChoices: boolean;
  showRealWorldContext: boolean;
  pauseOnMistakes: boolean;
}

export interface RealWorldContext {
  scenarioId: string;
  background: string;
  industryContext: string;
  businessImpact: string[];
  stakeholders: string[];
  escalationPath: string[];
  complianceConsiderations: string[];
}

export interface TechnicalGlossary {
  [term: string]: {
    definition: string;
    examples: string[];
    relatedTerms: string[];
    category: 'network' | 'security' | 'hardware' | 'software' | 'telephony' | 'general';
  };
}

export interface UrgencyIndicator {
  level: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  description: string;
  sla: string; // Service Level Agreement time
  escalationTime: string;
  businessImpact: string;
  indicators: string[]; // Visual/audio cues
}

export interface RealisticTerminalOutput {
  command: string;
  output: string[];
  exitCode: number;
  executionTime: number; // milliseconds
  warnings?: string[];
  errors?: string[];
}

export interface NetworkDiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'timeout' | 'error';
  details: string;
  timestamp: Date;
  technicalDetails: string[];
  suggestedActions: string[];
}

export interface ConfirmationDialog {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant: 'danger' | 'warning' | 'info';
}

export interface ProgressSaveData {
  timestamp: Date;
  gameState: GameState;
  currentScenarioProgress?: {
    scenarioId: string;
    stepIndex: number;
    chatMessages: ChatMessage[];
    timeElapsed: number;
  };
  version: string; // for data migration purposes
}
