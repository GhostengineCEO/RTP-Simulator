import React from 'react';
import { Play, Clock, Award, CheckCircle, Circle, Monitor, Shield, HardDrive, Code } from 'lucide-react';
import { Scenario, UserProgress } from '../types';
import clsx from 'clsx';

interface ScenarioSelectionProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  userProgress: UserProgress;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'text-success bg-success/10 border-success/20';
    case 'intermediate': return 'text-warning bg-warning/10 border-warning/20';
    case 'advanced': return 'text-error bg-error/10 border-error/20';
    default: return 'text-info bg-info/10 border-info/20';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'text-success bg-success/10';
    case 'medium': return 'text-info bg-info/10';
    case 'high': return 'text-warning bg-warning/10';
    case 'critical': return 'text-error bg-error/10';
    case 'emergency': return 'text-error bg-error/20 animate-pulse';
    default: return 'text-primary-400 bg-primary-400/10';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'network': return Monitor;
    case 'security': return Shield;
    case 'hardware': return HardDrive;
    case 'software': return Code;
    default: return Monitor;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'network': return 'text-info bg-info/10';
    case 'security': return 'text-error bg-error/10';
    case 'hardware': return 'text-warning bg-warning/10';
    case 'software': return 'text-success bg-success/10';
    default: return 'text-info bg-info/10';
  }
};

const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ 
  scenarios, 
  onSelectScenario, 
  userProgress 
}) => {
  const completedCount = userProgress.completedScenarios.length;
  const totalCount = scenarios.length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to IT Support Training
        </h1>
        <p className="text-primary-300 text-lg mb-6">
          Choose a scenario to practice your IT support skills
        </p>
        
        {/* Progress Overview */}
        <div className="bg-primary-900/50 rounded-lg p-6 mb-8 border border-primary-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">{completedCount}</div>
              <div className="text-primary-300 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-info">{totalCount - completedCount}</div>
              <div className="text-primary-300 text-sm">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{userProgress.totalScore}</div>
              <div className="text-primary-300 text-sm">Total Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-300">{userProgress.achievements.length}</div>
              <div className="text-primary-300 text-sm">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => {
          const CategoryIcon = getCategoryIcon(scenario.category);
          const isCompleted = userProgress.completedScenarios.includes(scenario.id);
          
          return (
            <div
              key={scenario.id}
              className="bg-primary-900/50 border border-primary-700 rounded-lg p-6 hover:bg-primary-800/50 transition-colors cursor-pointer group"
              onClick={() => onSelectScenario(scenario)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={clsx(
                  'p-2 rounded-lg',
                  getCategoryColor(scenario.category)
                )}>
                  <CategoryIcon className="h-5 w-5" />
                </div>
                <div className="flex items-center space-x-2">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-primary-400" />
                  )}
                </div>
              </div>

              {/* Title and Description */}
              <h3 className="text-lg font-semibold mb-2 group-hover:text-success transition-colors">
                {scenario.title}
              </h3>
              <p className="text-primary-300 text-sm mb-4 line-clamp-3">
                {scenario.description}
              </p>

              {/* Metadata */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium border',
                    getDifficultyColor(scenario.difficulty)
                  )}>
                    {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                  </span>
                  <div className="flex items-center text-primary-400 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {scenario.estimatedTime}
                  </div>
                </div>

                {/* Objectives */}
                <div>
                  <div className="text-xs text-primary-400 mb-2">Objectives:</div>
                  <div className="space-y-1">
                    {scenario.objectives.slice(0, 2).map((objective, index) => (
                      <div key={index} className="text-xs text-primary-300 flex items-center">
                        <div className="h-1 w-1 bg-primary-400 rounded-full mr-2"></div>
                        {objective}
                      </div>
                    ))}
                    {scenario.objectives.length > 2 && (
                      <div className="text-xs text-primary-400">
                        +{scenario.objectives.length - 2} more...
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Button */}
                <button className="w-full mt-4 bg-success hover:bg-success/80 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                  <Play className="h-4 w-4 mr-2" />
                  {isCompleted ? 'Retry Scenario' : 'Start Scenario'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Levels */}
      <div className="bg-primary-900/50 rounded-lg p-6 border border-primary-700">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-warning" />
          Skill Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(userProgress.skillLevels).map(([skill, level]) => (
            <div key={skill} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{skill}</span>
                <span className="text-sm text-primary-300">{level}%</span>
              </div>
              <div className="w-full bg-primary-800 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelection;
