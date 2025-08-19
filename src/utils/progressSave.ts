import React from 'react';
import { GameState, ProgressSaveData, ChatMessage } from '../types';

const STORAGE_KEY = 'rtp_simulator_progress';
const CURRENT_VERSION = '1.0.0';

export class ProgressSaveManager {
  static saveProgress(
    gameState: GameState,
    chatMessages?: ChatMessage[],
    scenarioId?: string,
    stepIndex?: number
  ): boolean {
    try {
      const saveData: ProgressSaveData = {
        timestamp: new Date(),
        gameState: {
          ...gameState,
          // Don't save the current scenario state in the global save
          currentScenario: null
        },
        currentScenarioProgress: scenarioId ? {
          scenarioId,
          stepIndex: stepIndex || 0,
          chatMessages: chatMessages || [],
          timeElapsed: gameState.currentScenario ? 
            Math.floor((Date.now() - gameState.currentScenario.startTime.getTime()) / 1000) : 0
        } : undefined,
        version: CURRENT_VERSION
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }

  static loadProgress(): ProgressSaveData | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const data = JSON.parse(saved) as ProgressSaveData;
      
      // Check version compatibility
      if (!data.version || data.version !== CURRENT_VERSION) {
        console.warn('Progress save version mismatch. Clearing save data.');
        this.clearProgress();
        return null;
      }

      // Convert string dates back to Date objects
      data.timestamp = new Date(data.timestamp);
      if (data.currentScenarioProgress?.chatMessages) {
        data.currentScenarioProgress.chatMessages = data.currentScenarioProgress.chatMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }

      return data;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return null;
    }
  }

  static clearProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static hasProgress(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  static clearScenarioProgress(): boolean {
    try {
      const data = this.loadProgress();
      if (!data) return false;

      const updatedData: ProgressSaveData = {
        ...data,
        currentScenarioProgress: undefined
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Failed to clear scenario progress:', error);
      return false;
    }
  }

  static exportProgress(): string {
    const data = this.loadProgress();
    if (!data) throw new Error('No progress data to export');
    
    return JSON.stringify(data, null, 2);
  }

  static importProgress(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as ProgressSaveData;
      
      // Basic validation
      if (!data.gameState || !data.version || !data.timestamp) {
        throw new Error('Invalid progress data format');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }

  static getAutoSaveInterval(): number {
    return 30000; // 30 seconds
  }

  static autoSave(
    gameState: GameState,
    chatMessages?: ChatMessage[],
    scenarioId?: string,
    stepIndex?: number
  ): void {
    // Only auto-save if there's meaningful progress
    if (gameState.sessionStats.sessionsCompleted > 0 || 
        gameState.userProgress.completedScenarios.length > 0 ||
        (scenarioId && chatMessages && chatMessages.length > 3)) {
      this.saveProgress(gameState, chatMessages, scenarioId, stepIndex);
    }
  }
}

// Auto-save hook for React components
export const useAutoSave = (
  gameState: GameState,
  chatMessages?: ChatMessage[],
  scenarioId?: string,
  stepIndex?: number
) => {
  React.useEffect(() => {
    const interval = setInterval(() => {
      ProgressSaveManager.autoSave(gameState, chatMessages, scenarioId, stepIndex);
    }, ProgressSaveManager.getAutoSaveInterval());

    return () => clearInterval(interval);
  }, [gameState, chatMessages, scenarioId, stepIndex]);
};
