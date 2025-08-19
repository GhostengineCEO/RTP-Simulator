import { 
  ScenarioState, 
  UserDecision, 
  ClientMood, 
  ScenarioScore, 
  Mistake, 
  CompletionStatus, 
  CompletionBadge, 
  MoodChange,
  DecisionStep,
  Scenario,
  ConversationStep,
  UserProgress
} from '../types';

export class ScenarioStateManager {
  private scenarioState: ScenarioState;
  private scenario: Scenario;
  private conversationSteps: ConversationStep[];

  constructor(scenario: Scenario, conversationSteps: ConversationStep[]) {
    this.scenario = scenario;
    this.conversationSteps = conversationSteps;
    this.scenarioState = this.initializeState(scenario);
  }

  private initializeState(scenario: Scenario): ScenarioState {
    return {
      scenarioId: scenario.id,
      currentStep: 0,
      conversationStepId: 1,
      toolsAccessed: {
        prtgChecked: false,
        puttyChecked: false,
        diagnosticsRun: []
      },
      clientMood: 'frustrated',
      moodHistory: [],
      resolutionStatus: 'investigating',
      escalationStatus: 'none',
      conversationHistory: [],
      decisionHistory: [],
      startTime: new Date(),
      lastActivity: new Date(),
      score: {
        total: 0,
        breakdown: {
          efficiency: 0,
          accuracy: 0,
          clientSatisfaction: 0,
          toolUtilization: 0,
          escalationTiming: 0,
          bestPractices: 0
        },
        timeToResolution: 0,
        optimalPathPercentage: 0,
        clientSatisfactionRating: 2.0
      },
      mistakesMade: [],
      hintsUsed: 0,
      completionStatus: {
        isCompleted: false,
        finalScore: 0,
        badgesEarned: [],
        feedback: {
          summary: '',
          strengths: [],
          improvements: [],
          recommendedTraining: [],
          nextScenarios: []
        }
      }
    };
  }

  // Decision Tree Logic
  public processUserAction(action: string, actionType: 'response' | 'tool_access' | 'diagnosis' | 'escalation'): {
    moodChange: ClientMood;
    scoreChange: number;
    mistakes: Mistake[];
    feedback: string;
    nextStepEnabled: boolean;
  } {
    const currentTime = new Date();
    const optimalStep = this.scenario.optimalPath.find(step => step.order === this.scenarioState.currentStep + 1);
    
    let isOptimal = false;
    let scoreChange = 0;
    let newMood = this.scenarioState.clientMood;
    let mistakes: Mistake[] = [];
    let feedback = '';

    // Check if action follows optimal path
    if (optimalStep && optimalStep.type === actionType) {
      // Check prerequisites
      const prerequisitesMet = this.checkPrerequisites(optimalStep);
      
      if (prerequisitesMet) {
        isOptimal = true;
        scoreChange = optimalStep.scoreImpact;
        newMood = this.applyMoodChange(this.scenarioState.clientMood, optimalStep.moodImpact);
        feedback = `Great! ${optimalStep.moodImpact.reason}`;
        this.scenarioState.currentStep++;
      } else {
        // Action is correct but prerequisites not met
        const missingPrereqs = optimalStep.expectedBefore?.filter(prereq => 
          !this.scenarioState.decisionHistory.some(decision => decision.stepId === prereq)
        ) || [];
        
        mistakes.push({
          type: 'wrong_order',
          description: `${action} attempted without completing: ${missingPrereqs.join(', ')}`,
          timestamp: currentTime,
          scoreImpact: -10,
          consequence: 'Client becomes more frustrated due to incomplete investigation'
        });
        
        scoreChange = -10;
        newMood = this.worsenMood(this.scenarioState.clientMood);
        feedback = `You should complete other diagnostic steps first. Missing: ${missingPrereqs.join(', ')}`;
      }
    } else {
      // Non-optimal action
      mistakes.push({
        type: 'missed_step',
        description: `Expected ${optimalStep?.action || 'different action'} but got ${action}`,
        timestamp: currentTime,
        scoreImpact: -5,
        consequence: 'Deviating from optimal troubleshooting methodology'
      });
      
      scoreChange = -5;
      newMood = this.scenarioState.clientMood === 'panicked' ? 'panicked' : 'frustrated';
      feedback = 'Consider following a more systematic troubleshooting approach.';
    }

    // Record the decision
    const decision: UserDecision = {
      timestamp: currentTime,
      stepId: optimalStep?.id || `step_${this.scenarioState.currentStep}`,
      action,
      wasOptimal: isOptimal,
      scoreImpact: scoreChange,
      moodImpact: {
        change: newMood !== this.scenarioState.clientMood ? 'improve' : 'maintain',
        severity: Math.abs(scoreChange) > 15 ? 'major' : 'minor',
        reason: feedback
      },
      consequences: mistakes.map(m => m.consequence)
    };

    this.scenarioState.decisionHistory.push(decision);
    this.scenarioState.mistakesMade.push(...mistakes);
    this.updateMood(newMood, action);
    this.updateScore(scoreChange, actionType);
    this.scenarioState.lastActivity = currentTime;

    return {
      moodChange: newMood,
      scoreChange,
      mistakes,
      feedback,
      nextStepEnabled: isOptimal
    };
  }

  private checkPrerequisites(step: DecisionStep): boolean {
    if (!step.expectedBefore) return true;
    
    return step.expectedBefore.every(prereq => 
      this.scenarioState.decisionHistory.some(decision => decision.stepId === prereq)
    );
  }

  private applyMoodChange(currentMood: ClientMood, moodImpact: any): ClientMood {
    const moodHierarchy: ClientMood[] = ['grateful', 'satisfied', 'cooperative', 'neutral', 'frustrated', 'angry', 'panicked'];
    const currentIndex = moodHierarchy.indexOf(currentMood);
    
    if (moodImpact.change === 'improve') {
      const improvement = moodImpact.severity === 'major' ? 2 : 1;
      return moodHierarchy[Math.max(0, currentIndex - improvement)];
    } else if (moodImpact.change === 'worsen') {
      const deterioration = moodImpact.severity === 'major' ? 2 : 1;
      return moodHierarchy[Math.min(moodHierarchy.length - 1, currentIndex + deterioration)];
    }
    
    return currentMood;
  }

  private worsenMood(currentMood: ClientMood): ClientMood {
    const moodProgression: Record<ClientMood, ClientMood> = {
      'grateful': 'satisfied',
      'satisfied': 'neutral',
      'cooperative': 'frustrated',
      'neutral': 'frustrated',
      'frustrated': 'angry',
      'angry': 'panicked',
      'panicked': 'panicked'
    };
    
    return moodProgression[currentMood] || 'frustrated';
  }

  private updateMood(newMood: ClientMood, trigger: string) {
    if (newMood !== this.scenarioState.clientMood) {
      const moodChange: MoodChange = {
        from: this.scenarioState.clientMood,
        to: newMood,
        reason: `Action: ${trigger}`,
        timestamp: new Date(),
        trigger
      };
      
      this.scenarioState.moodHistory.push(moodChange);
      this.scenarioState.clientMood = newMood;
    }
  }

  // Scoring System
  private updateScore(scoreChange: number, actionType: string) {
    this.scenarioState.score.total += scoreChange;
    
    // Update breakdown based on action type
    switch (actionType) {
      case 'tool_access':
        this.scenarioState.score.breakdown.toolUtilization += scoreChange * 0.4;
        this.scenarioState.score.breakdown.efficiency += scoreChange * 0.3;
        break;
      case 'diagnosis':
        this.scenarioState.score.breakdown.accuracy += scoreChange * 0.5;
        this.scenarioState.score.breakdown.bestPractices += scoreChange * 0.3;
        break;
      case 'escalation':
        this.scenarioState.score.breakdown.escalationTiming += scoreChange * 0.6;
        this.scenarioState.score.breakdown.efficiency += scoreChange * 0.2;
        break;
      case 'response':
        this.scenarioState.score.breakdown.clientSatisfaction += scoreChange * 0.5;
        break;
    }

    // Update client satisfaction rating based on mood
    const moodRatings: Record<ClientMood, number> = {
      'panicked': 1.0,
      'angry': 1.5,
      'frustrated': 2.0,
      'neutral': 3.0,
      'cooperative': 3.5,
      'satisfied': 4.0,
      'grateful': 5.0
    };
    
    this.scenarioState.score.clientSatisfactionRating = moodRatings[this.scenarioState.clientMood];

    // Calculate optimal path percentage
    const completedOptimalSteps = this.scenarioState.decisionHistory.filter(d => d.wasOptimal).length;
    const totalOptimalSteps = this.scenario.optimalPath.length;
    this.scenarioState.score.optimalPathPercentage = (completedOptimalSteps / totalOptimalSteps) * 100;
  }

  // Tool Access Tracking
  public accessTool(toolType: 'prtg' | 'putty', diagnostics?: string[]) {
    this.scenarioState.lastActivity = new Date();
    
    if (toolType === 'prtg') {
      if (!this.scenarioState.toolsAccessed.prtgChecked) {
        this.scenarioState.toolsAccessed.prtgChecked = true;
        this.scenarioState.toolsAccessed.prtgTimestamp = new Date();
        return this.processUserAction('Check PRTG monitoring system', 'tool_access');
      } else {
        return this.processUserAction('Review PRTG data again', 'tool_access');
      }
    } else if (toolType === 'putty') {
      if (!this.scenarioState.toolsAccessed.puttyChecked) {
        this.scenarioState.toolsAccessed.puttyChecked = true;
        this.scenarioState.toolsAccessed.puttyTimestamp = new Date();
        if (diagnostics) {
          this.scenarioState.toolsAccessed.diagnosticsRun.push(...diagnostics);
        }
        return this.processUserAction('Access system via PuTTY for diagnostics', 'tool_access');
      } else {
        if (diagnostics) {
          this.scenarioState.toolsAccessed.diagnosticsRun.push(...diagnostics);
        }
        return this.processUserAction('Run additional diagnostic commands', 'diagnosis');
      }
    }

    return {
      moodChange: this.scenarioState.clientMood,
      scoreChange: 0,
      mistakes: [],
      feedback: 'Tool accessed',
      nextStepEnabled: false
    };
  }

  // Completion and Badge System
  public completeScenario(): CompletionStatus {
    const endTime = new Date();
    const timeToResolution = (endTime.getTime() - this.scenarioState.startTime.getTime()) / (1000 * 60); // minutes
    
    this.scenarioState.score.timeToResolution = timeToResolution;
    this.scenarioState.completionStatus.isCompleted = true;
    this.scenarioState.completionStatus.completionTime = endTime;
    this.scenarioState.completionStatus.finalScore = Math.max(0, this.scenarioState.score.total);

    // Check for earned badges
    const earnedBadges = this.evaluateBadges();
    this.scenarioState.completionStatus.badgesEarned = earnedBadges;

    // Generate completion feedback
    this.scenarioState.completionStatus.feedback = this.generateCompletionFeedback();

    return this.scenarioState.completionStatus;
  }

  private evaluateBadges(): CompletionBadge[] {
    const earnedBadges: CompletionBadge[] = [];
    
    for (const badge of this.scenario.completionBadges) {
      if (this.meetsBadgeCriteria(badge)) {
        earnedBadges.push(badge);
      }
    }
    
    return earnedBadges;
  }

  private meetsBadgeCriteria(badge: CompletionBadge): boolean {
    const criteria = badge.criteria;
    const state = this.scenarioState;
    
    // Check minimum score
    if (criteria.minScore && state.score.total < criteria.minScore) {
      return false;
    }
    
    // Check maximum time
    if (criteria.maxTime && state.score.timeToResolution > criteria.maxTime) {
      return false;
    }
    
    // Check perfect path
    if (criteria.perfectPath && state.score.optimalPathPercentage < 100) {
      return false;
    }
    
    // Check client satisfaction
    if (criteria.clientSatisfaction && state.score.clientSatisfactionRating < criteria.clientSatisfaction) {
      return false;
    }
    
    // Check no mistakes
    if (criteria.noMistakes && state.mistakesMade.length > 0) {
      return false;
    }
    
    // Check specific actions
    if (criteria.specificActions) {
      const completedActions = state.decisionHistory.map(d => d.stepId);
      if (!criteria.specificActions.every(action => completedActions.includes(action))) {
        return false;
      }
    }
    
    return true;
  }

  private generateCompletionFeedback(): any {
    const state = this.scenarioState;
    const score = state.score.total;
    
    let summary = '';
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendedTraining: string[] = [];
    const nextScenarios: string[] = [];

    // Generate summary based on performance
    if (score >= 90) {
      summary = 'Outstanding performance! You demonstrated expert-level troubleshooting skills and maintained excellent client communication throughout the scenario.';
    } else if (score >= 70) {
      summary = 'Good performance overall. You successfully resolved the issue with solid technical skills and reasonable client interaction.';
    } else if (score >= 50) {
      summary = 'Adequate performance. The issue was resolved but there\'s room for improvement in methodology and client communication.';
    } else {
      summary = 'Performance needs improvement. Consider reviewing troubleshooting best practices and client communication techniques.';
    }

    // Identify strengths
    if (state.score.breakdown.toolUtilization > 15) {
      strengths.push('Effective use of diagnostic tools');
    }
    if (state.score.breakdown.clientSatisfaction > 10) {
      strengths.push('Strong client communication skills');
    }
    if (state.score.breakdown.escalationTiming > 15) {
      strengths.push('Appropriate escalation timing');
    }
    if (state.mistakesMade.length === 0) {
      strengths.push('Error-free troubleshooting approach');
    }

    // Identify improvements
    if (state.score.breakdown.efficiency < 10) {
      improvements.push('Work on troubleshooting efficiency');
      recommendedTraining.push('Time management in IT support');
    }
    if (state.score.breakdown.accuracy < 10) {
      improvements.push('Focus on diagnostic accuracy');
      recommendedTraining.push('Advanced diagnostic techniques');
    }
    if (state.score.clientSatisfactionRating < 3.0) {
      improvements.push('Enhance client communication skills');
      recommendedTraining.push('Customer service excellence');
    }

    // Suggest next scenarios
    const currentCategory = this.scenario.category;
    const difficulty = this.scenario.difficulty;
    
    if (score >= 80) {
      nextScenarios.push(`Advanced ${currentCategory} scenarios`, 'Multi-system failure scenarios');
    } else if (score >= 60) {
      nextScenarios.push(`Intermediate ${currentCategory} scenarios`, 'Cross-departmental issues');
    } else {
      nextScenarios.push(`Basic ${currentCategory} scenarios`, 'Fundamental troubleshooting');
    }

    return {
      summary,
      strengths,
      improvements,
      recommendedTraining,
      nextScenarios
    };
  }

  // Getters
  public getCurrentState(): ScenarioState {
    return { ...this.scenarioState };
  }

  public getProgress(): number {
    return (this.scenarioState.currentStep / this.scenario.optimalPath.length) * 100;
  }

  public getNextOptimalAction(): DecisionStep | null {
    return this.scenario.optimalPath.find(step => step.order === this.scenarioState.currentStep + 1) || null;
  }

  public canAccessTool(toolType: 'prtg' | 'putty'): boolean {
    // Logic to determine if tools should be enabled based on current state
    const currentStep = this.getNextOptimalAction();
    if (!currentStep) return true; // Allow access if no specific step required
    
    return currentStep.type === 'tool_access' || this.scenarioState.currentStep > 0;
  }

  // State updates
  public advanceConversationStep(): ConversationStep | null {
    if (this.scenarioState.conversationStepId < this.conversationSteps.length) {
      this.scenarioState.conversationStepId++;
      return this.conversationSteps[this.scenarioState.conversationStepId - 1];
    }
    return null;
  }
}

// Utility functions for managing user progress
export class ProgressManager {
  public static updateUserProgress(
    currentProgress: UserProgress, 
    completedScenario: Scenario,
    scenarioState: ScenarioState
  ): UserProgress {
    const updatedProgress = { ...currentProgress };
    
    // Add to completed scenarios if not already there
    if (!updatedProgress.completedScenarios.includes(completedScenario.id)) {
      updatedProgress.completedScenarios.push(completedScenario.id);
    }
    
    // Update total score
    updatedProgress.totalScore += Math.max(0, scenarioState.score.total);
    
    // Update skill levels based on scenario category
    const skillCategory = completedScenario.category as keyof typeof updatedProgress.skillLevels;
    const skillIncrease = Math.max(1, Math.floor(scenarioState.score.total / 10));
    updatedProgress.skillLevels[skillCategory] = Math.min(100, 
      updatedProgress.skillLevels[skillCategory] + skillIncrease
    );
    
    // Update achievements
    updatedProgress.achievements.push(...scenarioState.completionStatus.badgesEarned);
    
    // Update timing and satisfaction metrics
    updatedProgress.totalTimeSpent += scenarioState.score.timeToResolution;
    updatedProgress.averageResolutionTime = updatedProgress.totalTimeSpent / updatedProgress.completedScenarios.length;
    
    // Update satisfaction average
    const totalSatisfaction = updatedProgress.clientSatisfactionAverage * (updatedProgress.completedScenarios.length - 1);
    updatedProgress.clientSatisfactionAverage = (totalSatisfaction + scenarioState.score.clientSatisfactionRating) / updatedProgress.completedScenarios.length;
    
    // Update best practices score
    const bestPracticesScore = scenarioState.score.breakdown.bestPractices;
    updatedProgress.bestPracticesScore = (updatedProgress.bestPracticesScore + bestPracticesScore) / 2;
    
    // Update escalation accuracy (simplified calculation)
    const escalationScore = scenarioState.score.breakdown.escalationTiming;
    updatedProgress.escalationAccuracy = (updatedProgress.escalationAccuracy + Math.max(0, escalationScore)) / 2;
    
    return updatedProgress;
  }
}
