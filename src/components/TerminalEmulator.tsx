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

  const executeCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) return;

    // Add command to history
    setHistory(prev => [...prev, { content: `${currentConfig.hostname}# ${trimmedInput}`, color: 'white' }]);

    if (trimmedInput === 'exit') {
      setHistory(prev => [...prev, 
        { content: '', color: 'green' },
        { content: 'Connection to host lost.', color: 'yellow' },
        { content: 'PuTTY session terminated.', color: 'green' }
      ]);
      setTimeout(() => onClose(), 1500);
      return;
    }

    const command = currentConfig.commands[trimmedInput as keyof typeof currentConfig.commands];
    if (command) {
      const result = command();
      setHistory(prev => [...prev, ...result, { content: '', color: 'green' }]);
    } else {
      setHistory(prev => [...prev, 
        { content: `Command '${trimmedInput}' not recognized`, color: 'red' },
        { content: 'Type "help" for available commands', color: 'yellow' },
        { content: '', color: 'green' }
      ]);
    }
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
                  <span className="text-green-400">{currentConfig.hostname}# </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
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
