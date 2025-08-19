import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { testingScenarios, TestResult } from '../utils/testingScenarios';

interface TestingInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TestingInterface: React.FC<TestingInterfaceProps> = ({ isVisible, onClose }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  if (!isVisible) return null;

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const results = await testingScenarios.runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runTestsByType = async (testType: 'optimal' | 'suboptimal' | 'edge_case') => {
    setIsRunning(true);
    setTestResults([]);
    setCurrentTest(testType);
    
    try {
      const results = await testingScenarios.runTestsByType(testType);
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runEdgeTests = () => {
    const invalidCommandResults = testingScenarios.testInvalidCommands();
    const rapidClickResults = testingScenarios.testRapidClicking();
    const modalResults = testingScenarios.testModalHandling();
    const refreshResults = testingScenarios.testBrowserRefresh();

    console.log('=== EDGE CASE TEST RESULTS ===');
    console.log('Invalid Commands:', invalidCommandResults);
    console.log('Rapid Clicking:', rapidClickResults);
    console.log('Modal Handling:', modalResults);
    console.log('Browser Refresh:', refreshResults);

    alert(`Edge case tests completed. Check console for detailed results.
    
Invalid Commands: ${invalidCommandResults.length} tests
Rapid Clicking: ${rapidClickResults.length} tests
Modal Handling: ${modalResults.length} tests
Browser Refresh: ${refreshResults.length} tests`);
  };

  const generateReport = () => {
    if (testResults.length === 0) {
      alert('No test results available. Run some tests first.');
      return;
    }

    const report = testingScenarios.generateTestReport(testResults);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] m-4 overflow-hidden">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-orange-400" />
            <div>
              <h2 className="text-xl font-semibold">Testing Interface</h2>
              <p className="text-sm text-gray-300">Automated scenario validation system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Control Panel */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Test Controls</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>All Tests</span>
              </button>
              
              <button
                onClick={() => runTestsByType('optimal')}
                disabled={isRunning}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Optimal</span>
              </button>
              
              <button
                onClick={() => runTestsByType('suboptimal')}
                disabled={isRunning}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                <span>Suboptimal</span>
              </button>
              
              <button
                onClick={runEdgeTests}
                disabled={isRunning}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Edge Cases</span>
              </button>
            </div>
            
            {testResults.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Results: {passedTests}/{totalTests} passed ({passRate}%)
                </div>
                <button
                  onClick={generateReport}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Download Report
                </button>
              </div>
            )}
          </div>

          {/* Running Indicator */}
          {isRunning && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500 animate-spin" />
                <div>
                  <p className="text-blue-700 font-medium">Running Tests...</p>
                  {currentTest && (
                    <p className="text-sm text-blue-600">Currently testing: {currentTest}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.passed)}
                      <div>
                        <h4 className="font-medium">{result.testCase.name}</h4>
                        <p className="text-sm text-gray-600">{result.testCase.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className={result.passed ? 'text-green-600' : 'text-red-600'}>
                        {result.passed ? 'PASSED' : 'FAILED'}
                      </div>
                      <div className="text-gray-500">{result.duration}ms</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Score:</span> {result.actualScore} 
                      <span className="text-gray-500">
                        (expected: {result.testCase.expectedScore})
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Mood:</span> {result.actualMood}
                      <span className="text-gray-500">
                        (expected: {result.testCase.expectedMood})
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Badges:</span> {result.actualBadges.length}
                      {result.actualBadges.length > 0 && (
                        <span className="text-gray-500">
                          ({result.actualBadges.join(', ')})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {result.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-red-600 mb-2">Errors:</p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {result.errors.map((error, errorIndex) => (
                          <li key={errorIndex} className="pl-2 border-l-2 border-red-300">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Testing Guide</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Optimal Tests:</strong> Verify perfect troubleshooting methodology and scoring</p>
              <p><strong>Suboptimal Tests:</strong> Test consequences of poor decisions and early escalation</p>
              <p><strong>Edge Cases:</strong> Validate handling of invalid inputs and UI interactions</p>
              <p><strong>All Tests:</strong> Comprehensive validation of all scenarios and paths</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
