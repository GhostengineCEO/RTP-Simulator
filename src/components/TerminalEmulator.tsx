import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal, Minimize2, Maximize2 } from 'lucide-react';

interface TerminalEmulatorProps {
  onClose: () => void;
  scenarioId?: string;
}

interface TerminalLine {
  content: string;
  color: 'green' | 'white' | 'red' | 'yellow';
}

const TerminalEmulator: React.FC<TerminalEmulatorProps> = ({ onClose, scenarioId = '1' }) => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentMode, setCurrentMode] = useState<'user' | 'privileged' | 'config'>('user');
  const [configContext, setConfigContext] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scenario-specific configurations
  const scenarioConfig = {
    '1': { // Network Outage - Cisco Core Switch
      ip: '192.168.1.1',
      hostname: 'CISCO-SW-CORE-01',
      device: 'Cisco Catalyst 2960-X',
      commands: {
        'show power': () => [
          { content: 'Power Supply Status:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'PS1: FAILED - No AC input detected', color: 'red' as const },
          { content: 'PS2: OK - Providing 740W', color: 'green' as const },
          { content: '', color: 'green' as const },
          { content: 'WARNING: Redundancy lost - Single power supply failure', color: 'yellow' as const },
          { content: 'System running on single power supply', color: 'yellow' as const }
        ],
        'show interfaces': () => [
          { content: 'Interface Status Summary:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'Gi0/1    err-disabled    Power failure detected', color: 'red' as const },
          { content: 'Gi0/2    err-disabled    Power failure detected', color: 'red' as const },
          { content: 'Gi0/3    err-disabled    Power failure detected', color: 'red' as const },
          { content: 'Gi0/4    err-disabled    Power failure detected', color: 'red' as const },
          { content: 'Gi0/5-24 err-disabled    Power failure detected', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'All user ports offline due to power subsystem failure', color: 'red' as const }
        ],
        'show log': () => [
          { content: 'System Log - Last 20 entries:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: '14:32:15: %POWER-3-SUPPLY_FAIL: Power supply 1 failed', color: 'red' as const },
          { content: '14:32:16: %LINEPROTO-5-UPDOWN: Line protocol on interfaces changed to down', color: 'yellow' as const },
          { content: '14:32:17: %LINK-3-UPDOWN: All access ports forced down', color: 'red' as const },
          { content: '14:32:18: %SYS-1-POWER_REDUNDANCY_LOST: Power redundancy lost', color: 'red' as const },
          { content: '14:32:19: %SNMP-3-AUTHFAIL: Authentication failure from PRTG monitor', color: 'yellow' as const },
          { content: '', color: 'green' as const },
          { content: 'CRITICAL: Hardware replacement required immediately', color: 'red' as const }
        ],
        'help': () => [
          { content: 'Available PuTTY Commands:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'show power      - Display power supply status', color: 'green' as const },
          { content: 'show interfaces - Show interface status', color: 'green' as const },
          { content: 'show log        - Display system log entries', color: 'green' as const },
          { content: 'help            - Show this help menu', color: 'green' as const },
          { content: 'exit            - Close PuTTY session', color: 'green' as const }
        ]
      }
    },
    '2': { // VPN Failure - Barracuda
      ip: '10.0.0.5',
      hostname: 'BARRACUDA-VPN-01',
      device: 'Barracuda CloudGen Firewall',
      commands: {
        'show sessions': () => [
          { content: 'VPN Session Status:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'Active Sessions: 0/50', color: 'red' as const },
          { content: 'Failed Authentications: 23 (last 10 minutes)', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'Recent Failed Connections:', color: 'yellow' as const },
          { content: 'user: jdoe@company.com - Auth failure at 14:28:33', color: 'red' as const },
          { content: 'user: msmith@company.com - Auth failure at 14:29:15', color: 'red' as const },
          { content: 'user: bwilson@company.com - Auth failure at 14:30:42', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'All authentication attempts failing to primary RADIUS', color: 'red' as const }
        ],
        'test radius': () => [
          { content: 'RADIUS Server Connectivity Test:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'Testing Primary RADIUS (172.16.1.20)...', color: 'yellow' as const },
          { content: 'FAILED - Connection timeout after 30 seconds', color: 'red' as const },
          { content: 'Primary RADIUS server is DOWN', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'Testing Backup RADIUS (172.16.1.21)...', color: 'yellow' as const },
          { content: 'SUCCESS - Authentication test passed', color: 'green' as const },
          { content: 'Backup RADIUS server is ONLINE', color: 'green' as const },
          { content: '', color: 'green' as const },
          { content: 'RECOMMENDATION: Switch to backup RADIUS server', color: 'yellow' as const }
        ],
        'help': () => [
          { content: 'Available PuTTY Commands:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'show sessions   - Display VPN session status', color: 'green' as const },
          { content: 'test radius     - Test RADIUS connectivity', color: 'green' as const },
          { content: 'help            - Show this help menu', color: 'green' as const },
          { content: 'exit            - Close PuTTY session', color: 'green' as const }
        ]
      }
    },
    '3': { // Mitel Phone System
      ip: '172.16.1.10',
      hostname: 'MITEL-PBX-01',
      device: 'Mitel MiVoice Business',
      commands: {
        'show phones': () => [
          { content: 'IP Phone Status by Department:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'ACCOUNTING DEPARTMENT:', color: 'yellow' as const },
          { content: 'Phone 2001 (Ext.201): OFFLINE - No PoE power', color: 'red' as const },
          { content: 'Phone 2002 (Ext.202): OFFLINE - No PoE power', color: 'red' as const },
          { content: 'Phone 2003 (Ext.203): OFFLINE - No PoE power', color: 'red' as const },
          { content: 'Phone 2004 (Ext.204): OFFLINE - No PoE power', color: 'red' as const },
          { content: 'Phone 2005 (Ext.205): OFFLINE - No PoE power', color: 'red' as const },
          { content: 'Phone 2006 (Ext.206): OFFLINE - No PoE power', color: 'red' as const },
          { content: 'Phone 2007 (Ext.207): OFFLINE - No PoE power', color: 'red' as const },
          { content: 'Phone 2008 (Ext.208): OFFLINE - No PoE power', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'All accounting phones offline - PoE module failure', color: 'red' as const }
        ],
        'show poe': () => [
          { content: 'Power over Ethernet Status:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'PoE Module 1: FAILED - Hardware fault detected', color: 'red' as const },
          { content: 'PoE Module 2: OK - Providing power to other departments', color: 'green' as const },
          { content: '', color: 'green' as const },
          { content: 'Module 1 Port Status (Accounting Dept):', color: 'yellow' as const },
          { content: 'Ports 1-8: NO POWER - Module failure', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'ERROR: PoE Module 1 requires replacement', color: 'red' as const },
          { content: 'Contact facilities team for hardware swap', color: 'yellow' as const }
        ],
        'help': () => [
          { content: 'Available PuTTY Commands:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'show phones     - List phone status by department', color: 'green' as const },
          { content: 'show poe        - Display PoE module status', color: 'green' as const },
          { content: 'help            - Show this help menu', color: 'green' as const },
          { content: 'exit            - Close PuTTY session', color: 'green' as const }
        ]
      }
    },
    '4': { // L3 Crisis - Domain Controller
      ip: '10.0.0.1',
      hostname: 'DC-PRIMARY-01',
      device: 'Windows Server 2019',
      commands: {
        'dcdiag': () => [
          { content: 'Domain Controller Diagnostic Tool', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'Testing server: DC-PRIMARY-01', color: 'yellow' as const },
          { content: '', color: 'green' as const },
          { content: 'Starting test: Connectivity', color: 'white' as const },
          { content: '   FAILED - Cannot connect to domain controller', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'Starting test: Advertising', color: 'white' as const },
          { content: '   FAILED - Not advertising as domain controller', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'Starting test: Services', color: 'white' as const },
          { content: '   FAILED - Critical AD services not responding', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'CRITICAL FAILURE: Domain Controller is completely offline', color: 'red' as const },
          { content: 'All domain authentication services unavailable', color: 'red' as const }
        ],
        'show storage': () => [
          { content: 'Storage Array Status Check:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'RAID Controller: LSI MegaRAID SAS 9361-8i', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'Virtual Drive 0: FAILED - Critical disk failure', color: 'red' as const },
          { content: 'Virtual Drive 1: DEGRADED - Multiple disk errors', color: 'red' as const },
          { content: '', color: 'green' as const },
          { content: 'Physical Disks:', color: 'yellow' as const },
          { content: 'Disk 0: FAILED - Unrecoverable read errors', color: 'red' as const },
          { content: 'Disk 1: FAILED - Drive not responding', color: 'red' as const },
          { content: 'Disk 2: PREDICTIVE FAILURE - Replace immediately', color: 'yellow' as const },
          { content: 'Disk 3: ONLINE - Good', color: 'green' as const },
          { content: '', color: 'green' as const },
          { content: 'EMERGENCY: Catastrophic storage failure detected', color: 'red' as const },
          { content: 'Data recovery procedures required immediately', color: 'red' as const }
        ],
        'help': () => [
          { content: 'Available PuTTY Commands:', color: 'white' as const },
          { content: '', color: 'green' as const },
          { content: 'dcdiag          - Run domain controller diagnostics', color: 'green' as const },
          { content: 'show storage    - Display RAID storage status', color: 'green' as const },
          { content: 'help            - Show this help menu', color: 'green' as const },
          { content: 'exit            - Close PuTTY session', color: 'green' as const }
        ]
      }
    }
  };

  const currentConfig = scenarioConfig[scenarioId as keyof typeof scenarioConfig] || scenarioConfig['1'];

  // Get current prompt based on mode
  const getCurrentPrompt = () => {
    const hostname = currentConfig.hostname;
    switch (currentMode) {
      case 'user':
        return `${hostname}>`;
      case 'config':
        return configContext ? `${hostname}(${configContext})#` : `${hostname}(config)#`;
      case 'privileged':
      default:
        return `${hostname}#`;
    }
  };

  // Cisco IOS command parser - supports abbreviations
  const parseCommand = (input: string): string | null => {
    const cmd = input.toLowerCase().trim();
    const parts = cmd.split(' ');
    
    // Available commands based on mode
    const userCommands = ['enable', 'show', 'ping', 'traceroute', 'help', '?', 'exit'];
    const privilegedCommands = ['show', 'configure', 'reload', 'clear', 'copy', 'disable', 'help', '?', 'exit'];
    const configCommands = ['interface', 'vlan', 'ip', 'exit', 'end', 'help', '?'];
    
    let availableCommands: string[];
    switch (currentMode) {
      case 'user': availableCommands = userCommands; break;
      case 'config': availableCommands = configCommands; break;
      default: availableCommands = privilegedCommands; break;
    }
    
    // Find matching command (supports abbreviations)
    const matches = availableCommands.filter(command => 
      command.startsWith(parts[0]) && parts[0].length >= 2
    );
    
    if (matches.length === 1) {
      return matches[0];
    } else if (matches.length > 1) {
      return 'ambiguous';
    }
    
    return null;
  };

  // Initialize connection on mount
  useEffect(() => {
    const initConnection = () => {
      setHistory([
        { content: 'PuTTY SSH Client v0.77', color: 'green' },
        { content: '', color: 'green' },
        { content: `Connecting to ${currentConfig.ip} port 22...`, color: 'yellow' },
        { content: 'Connection established.', color: 'green' },
        { content: '', color: 'green' },
        { content: `Connected to ${currentConfig.hostname}`, color: 'white' },
        { content: `Device: ${currentConfig.device}`, color: 'white' },
        { content: '', color: 'green' },
        { content: 'Authentication successful.', color: 'green' },
        { content: '', color: 'green' },
        { content: `${currentConfig.hostname}#`, color: 'green' }
      ]);
      setIsConnected(true);
    };

    const timer = setTimeout(initConnection, 500);
    return () => clearTimeout(timer);
  }, [currentConfig]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (inputRef.current && !isMinimized && isConnected) {
      inputRef.current.focus();
    }
  }, [isMinimized, isConnected]);

  // Get available commands for tab completion
  const getAvailableCommands = (): string[] => {
    const userCommands = ['enable', 'show', 'ping', 'traceroute', 'help', 'exit'];
    const privilegedCommands = ['show', 'configure', 'reload', 'clear', 'copy', 'disable', 'help', 'exit'];
    const configCommands = ['interface', 'vlan', 'ip', 'exit', 'end', 'help'];

    switch (currentMode) {
      case 'user': return userCommands;
      case 'config': return configCommands;
      default: return privilegedCommands;
    }
  };

  // Handle tab completion
  const handleTabCompletion = () => {
    const input = currentInput.trim();
    if (!input) {
      // Show available commands when pressing tab on empty input
      const availableCommands = getAvailableCommands();
      const commandList = availableCommands.map(cmd => `  ${cmd}`).join('\n');
      setHistory(prev => [...prev, 
        { content: `${getCurrentPrompt()} ${input}`, color: 'white' },
        { content: 'Available commands:', color: 'white' },
        { content: commandList, color: 'green' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    const parts = input.toLowerCase().split(' ');
    const baseCmd = parts[0];
    
    // Handle show command tab completion
    if (baseCmd === 'show' || baseCmd === 'sh') {
      if (parts.length === 1) {
        // Show available show commands
        const showCommands = [
          'running-config', 'version', 'ip', 'interfaces', 'power', 'log', 
          'phones', 'poe', 'sessions', 'storage'
        ];
        const commandList = showCommands.map(cmd => `  show ${cmd}`).join('\n');
        setHistory(prev => [...prev, 
          { content: `${getCurrentPrompt()} ${input}`, color: 'white' },
          { content: 'Available show commands:', color: 'white' },
          { content: commandList, color: 'green' },
          { content: '', color: 'green' }
        ]);
        return;
      }
    }

    // Find matching commands for completion
    const availableCommands = getAvailableCommands();
    const matches = availableCommands.filter(command => 
      command.startsWith(baseCmd) && baseCmd.length >= 1
    );

    if (matches.length === 1) {
      // Complete the command
      const completedCommand = matches[0];
      const remainingInput = parts.length > 1 ? ' ' + parts.slice(1).join(' ') : '';
      setCurrentInput(completedCommand + remainingInput);
    } else if (matches.length > 1) {
      // Show multiple matches
      const commandList = matches.map(cmd => `  ${cmd}`).join('\n');
      setHistory(prev => [...prev, 
        { content: `${getCurrentPrompt()} ${input}`, color: 'white' },
        { content: 'Possible completions:', color: 'white' },
        { content: commandList, color: 'green' },
        { content: '', color: 'green' }
      ]);
    } else {
      // No matches - show available commands
      const commandList = availableCommands.map(cmd => `  ${cmd}`).join('\n');
      setHistory(prev => [...prev, 
        { content: `${getCurrentPrompt()} ${input}`, color: 'white' },
        { content: 'Available commands:', color: 'white' },
        { content: commandList, color: 'green' },
        { content: '', color: 'green' }
      ]);
    }
  };

  // Clear terminal screen
  const clearScreen = () => {
    setHistory([
      { content: `${getCurrentPrompt()} clear`, color: 'white' },
      { content: '', color: 'green' }
    ]);
  };

  // Handle keyboard navigation for command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+C - Interrupt current command
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setCurrentInput('');
      setHistory(prev => [...prev, 
        { content: `${getCurrentPrompt()} ${currentInput}^C`, color: 'white' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    // Ctrl+L - Clear screen
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      clearScreen();
      return;
    }

    // Ctrl+A - Move cursor to beginning of line
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.setSelectionRange(0, 0);
      }
      return;
    }

    // Ctrl+E - Move cursor to end of line
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.setSelectionRange(currentInput.length, currentInput.length);
      }
      return;
    }

    // Ctrl+U - Clear line
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      setCurrentInput('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : commandHistory.length - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add command to command history
    if (trimmedInput !== commandHistory[commandHistory.length - 1]) {
      setCommandHistory(prev => [...prev, trimmedInput]);
    }
    setHistoryIndex(-1);

    // Add command to display history with current prompt
    setHistory(prev => [...prev, { content: `${getCurrentPrompt()} ${trimmedInput}`, color: 'white' }]);

    const cmd = trimmedInput.toLowerCase();
    const parts = cmd.split(' ');
    const baseCmd = parts[0];

    // Handle special exit commands
    if (cmd === 'exit' && currentMode === 'user') {
      setHistory(prev => [...prev, 
        { content: '', color: 'green' },
        { content: 'Connection to host lost.', color: 'yellow' },
        { content: 'PuTTY session terminated.', color: 'green' }
      ]);
      setTimeout(() => onClose(), 1500);
      return;
    }

    // Handle mode transitions
    if (cmd === 'enable' && currentMode === 'user') {
      setCurrentMode('privileged');
      setHistory(prev => [...prev, { content: '', color: 'green' }]);
      return;
    }

    if (cmd === 'disable' && currentMode === 'privileged') {
      setCurrentMode('user');
      setHistory(prev => [...prev, { content: '', color: 'green' }]);
      return;
    }

    if ((cmd === 'configure terminal' || cmd === 'conf t') && currentMode === 'privileged') {
      setCurrentMode('config');
      setConfigContext('');
      setHistory(prev => [...prev, 
        { content: 'Entering configuration mode. Commands may be abbreviated.', color: 'white' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    if (cmd === 'exit' && currentMode === 'config') {
      setCurrentMode('privileged');
      setConfigContext('');
      setHistory(prev => [...prev, { content: '', color: 'green' }]);
      return;
    }

    if (cmd === 'end' && currentMode === 'config') {
      setCurrentMode('privileged');
      setConfigContext('');
      setHistory(prev => [...prev, { content: '', color: 'green' }]);
      return;
    }

    // Handle help commands
    if (cmd === 'help' || cmd === '?') {
      const helpLines = getCiscoHelp();
      setHistory(prev => [...prev, ...helpLines, { content: '', color: 'green' }]);
      return;
    }

    // Parse and execute Cisco commands
    const parsedCmd = parseCommand(cmd);
    
    if (parsedCmd === 'ambiguous') {
      setHistory(prev => [...prev, 
        { content: '% Ambiguous command', color: 'red' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    if (!parsedCmd) {
      setHistory(prev => [...prev, 
        { content: `% Invalid input detected at '^' marker.`, color: 'red' },
        { content: `% Type "?" for help`, color: 'yellow' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    // Execute Cisco IOS commands
    executeCiscoCommand(parsedCmd, parts.slice(1));
  };

  const getCiscoHelp = (): TerminalLine[] => {
    const hostname = currentConfig.hostname;
    switch (currentMode) {
      case 'user':
        return [
          { content: 'Exec commands:', color: 'white' },
          { content: '  enable      Enter privileged EXEC mode', color: 'green' },
          { content: '  exit        Exit from the EXEC', color: 'green' },
          { content: '  help        Display help system', color: 'green' },
          { content: '  ping        Send echo messages', color: 'green' },
          { content: '  show        Show running system information', color: 'green' },
          { content: '  traceroute  Trace route to destination', color: 'green' }
        ];
      case 'config':
        return [
          { content: 'Configuration commands:', color: 'white' },
          { content: '  end         Exit configuration mode', color: 'green' },
          { content: '  exit        Exit from configuration mode', color: 'green' },
          { content: '  interface   Select interface to configure', color: 'green' },
          { content: '  ip          Global IP configuration commands', color: 'green' },
          { content: '  vlan        Configure VLAN parameters', color: 'green' }
        ];
      default: // privileged
        return [
          { content: 'Exec commands:', color: 'white' },
          { content: '  clear       Reset functions', color: 'green' },
          { content: '  configure   Configuration mode', color: 'green' },
          { content: '  copy        Copy configuration or files', color: 'green' },
          { content: '  disable     Turn off privileged commands', color: 'green' },
          { content: '  exit        Exit from the EXEC', color: 'green' },
          { content: '  reload      Halt and perform a cold restart', color: 'green' },
          { content: '  show        Show running system information', color: 'green' }
        ];
    }
  };

  const executeCiscoCommand = (command: string, args: string[]) => {
    // Handle show commands with scenario-specific data
    if (command === 'show') {
      const showCmd = args.join(' ');
      handleShowCommand(showCmd);
      return;
    }

    // Handle clear command
    if (command === 'clear') {
      clearScreen();
      return;
    }

    // Handle other commands
    setHistory(prev => [...prev, 
      { content: `% Command "${command}" not implemented in simulation`, color: 'yellow' },
      { content: '', color: 'green' }
    ]);
  };

  const handleShowCommand = (showCmd: string) => {
    const cmd = showCmd.replace(/^show\s*/, '').trim();
    
    // Handle Cisco IOS show commands
    if (cmd === 'running-config' || cmd === 'run') {
      setHistory(prev => [...prev, 
        { content: 'Building configuration...', color: 'white' },
        { content: '', color: 'green' },
        { content: 'Current configuration : 2048 bytes', color: 'white' },
        { content: '!', color: 'green' },
        { content: '! Last configuration change at 14:32:17 UTC', color: 'green' },
        { content: '!', color: 'green' },
        { content: 'version 15.2', color: 'white' },
        { content: `hostname ${currentConfig.hostname}`, color: 'white' },
        { content: '!', color: 'green' },
        { content: 'interface GigabitEthernet0/1', color: 'white' },
        { content: ' description Access Port', color: 'white' },
        { content: ' switchport mode access', color: 'white' },
        { content: ' switchport access vlan 10', color: 'white' },
        { content: '!', color: 'green' },
        { content: 'end', color: 'white' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    if (cmd === 'ip interface brief' || cmd === 'ip int br') {
      setHistory(prev => [...prev, 
        { content: 'Interface                  IP-Address      OK? Method Status                Protocol', color: 'white' },
        { content: 'GigabitEthernet0/1         unassigned      YES unset  up                    up      ', color: 'green' },
        { content: 'GigabitEthernet0/2         unassigned      YES unset  down                  down    ', color: 'red' },
        { content: 'Vlan1                      192.168.1.1     YES NVRAM  up                    up      ', color: 'green' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    if (cmd === 'version' || cmd === 'ver') {
      setHistory(prev => [...prev, 
        { content: `Cisco IOS Software, C2960X Software (C2960X-UNIVERSALK9-M), Version 15.2(7)E6`, color: 'white' },
        { content: 'Technical Support: http://www.cisco.com/techsupport', color: 'white' },
        { content: 'Copyright (c) 1986-2020 by Cisco Systems, Inc.', color: 'white' },
        { content: `Compiled Tuesday 17-Nov-20 18:40 by prod_rel_team`, color: 'white' },
        { content: '', color: 'green' },
        { content: `${currentConfig.hostname} uptime is 2 days, 14 hours, 32 minutes`, color: 'green' },
        { content: 'System returned to ROM by power-on', color: 'white' },
        { content: 'System restarted at 09:15:23 UTC Mon Nov 15 2023', color: 'white' },
        { content: '', color: 'green' },
        { content: 'cisco WS-C2960X-24TS-L (PowerPC405) processor (revision B0) with 131072K bytes of memory.', color: 'white' },
        { content: 'Processor board ID FCW1947C0LH', color: 'white' },
        { content: '', color: 'green' }
      ]);
      return;
    }

    // Check for legacy command compatibility
    const legacyCommandKey = `show ${cmd}` as keyof typeof currentConfig.commands;
    const legacyCommand = currentConfig.commands[legacyCommandKey];
    if (legacyCommand) {
      const result = legacyCommand();
      setHistory(prev => [...prev, ...result, { content: '', color: 'green' }]);
      return;
    }

    setHistory(prev => [...prev, 
      { content: `% Invalid input detected at '^' marker.`, color: 'red' },
      { content: '', color: 'green' }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    executeCommand(currentInput);
    setCurrentInput('');
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-400';
      case 'yellow': return 'text-yellow-400';
      case 'white': return 'text-white';
      case 'green':
      default: return 'text-green-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-black border-2 border-gray-600 rounded-lg shadow-2xl transition-all ${
        isMinimized ? 'w-96 h-16' : 'w-full max-w-5xl h-[85vh]'
      }`}>
        {/* PuTTY Title Bar */}
        <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-green-400" />
            <span className="text-white font-mono text-sm">
              {currentConfig.hostname} - PuTTY
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white transition-colors p-1 text-xs"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 text-xs"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        {!isMinimized && (
          <div className="flex flex-col h-[calc(85vh-48px)]">
            {/* Connection Header */}
            <div className="px-3 py-1 bg-gray-900 border-b border-gray-700">
              <span className="text-green-400 font-mono text-xs">
                SSH: {currentConfig.ip}:22 - Connected
              </span>
            </div>

            <div
              ref={terminalRef}
              className="flex-1 p-4 font-mono text-sm bg-black overflow-y-auto"
              style={{ 
                fontFamily: 'Consolas, "Courier New", monospace',
                backgroundColor: '#000000'
              }}
            >
              {history.map((line, index) => (
                <div key={index} className={`whitespace-pre-wrap ${getTextColor(line.color)}`}>
                  {line.content}
                </div>
              ))}
              
              {/* Current Input Line */}
              {isConnected && (
                <form onSubmit={handleSubmit} className="flex items-center">
                  <span className="text-green-400">{getCurrentPrompt()} </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-white outline-none ml-1"
                    style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalEmulator;
