import { RealisticTerminalOutput, NetworkDiagnosticResult } from '../types';

export class RealisticTerminalOutputGenerator {
  static generateOutput(command: string, scenarioId?: string): RealisticTerminalOutput {
    const cmd = command.toLowerCase().trim();
    const timestamp = new Date().toISOString();

    // Parse command and arguments
    const parts = cmd.split(' ');
    const baseCmd = parts[0];
    const args = parts.slice(1);

    switch (baseCmd) {
      case 'ping':
        return this.generatePingOutput(args[0] || 'google.com', scenarioId);
      case 'ipconfig':
      case 'ifconfig':
        return this.generateIpconfigOutput(args);
      case 'nslookup':
        return this.generateNslookupOutput(args[0] || 'google.com');
      case 'netstat':
        return this.generateNetstatOutput(args);
      case 'tracert':
      case 'traceroute':
        return this.generateTracerouteOutput(args[0] || 'google.com');
      case 'arp':
        return this.generateArpOutput(args);
      case 'systeminfo':
        return this.generateSystemInfoOutput();
      case 'netsh':
        return this.generateNetshOutput(args);
      case 'telnet':
        return this.generateTelnetOutput(args);
      case 'ssh':
        return this.generateSshOutput(args);
      case 'dir':
      case 'ls':
        return this.generateDirectoryListing();
      case 'tasklist':
      case 'ps':
        return this.generateProcessList();
      default:
        return this.generateUnknownCommand(command);
    }
  }

  private static generatePingOutput(target: string, scenarioId?: string): RealisticTerminalOutput {
    const isReachable = scenarioId !== '2'; // Scenario 2 has network issues
    const baseLatency = isReachable ? Math.random() * 20 + 5 : null;

    if (!isReachable) {
      return {
        command: `ping ${target}`,
        output: [
          '',
          `Pinging ${target} [${this.generateIP()}] with 32 bytes of data:`,
          'Request timed out.',
          'Request timed out.',
          'Request timed out.',
          'Request timed out.',
          '',
          `Ping statistics for ${this.generateIP()}:`,
          '    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),',
          ''
        ],
        exitCode: 1,
        executionTime: 4200,
        warnings: ['Network connectivity issues detected'],
        errors: ['100% packet loss - host unreachable']
      };
    }

    const ip = this.generateIP();
    return {
      command: `ping ${target}`,
      output: [
        '',
        `Pinging ${target} [${ip}] with 32 bytes of data:`,
        `Reply from ${ip}: bytes=32 time=${Math.round(baseLatency! + Math.random() * 5)}ms TTL=56`,
        `Reply from ${ip}: bytes=32 time=${Math.round(baseLatency! + Math.random() * 5)}ms TTL=56`,
        `Reply from ${ip}: bytes=32 time=${Math.round(baseLatency! + Math.random() * 5)}ms TTL=56`,
        `Reply from ${ip}: bytes=32 time=${Math.round(baseLatency! + Math.random() * 5)}ms TTL=56`,
        '',
        `Ping statistics for ${ip}:`,
        '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),',
        'Approximate round trip times in milli-seconds:',
        `    Minimum = ${Math.round(baseLatency!)}ms, Maximum = ${Math.round(baseLatency! + 8)}ms, Average = ${Math.round(baseLatency! + 3)}ms`,
        ''
      ],
      exitCode: 0,
      executionTime: 3100
    };
  }

  private static generateIpconfigOutput(args: string[]): RealisticTerminalOutput {
    const showAll = args.includes('/all');
    
    if (showAll) {
      return {
        command: `ipconfig ${args.join(' ')}`,
        output: [
          '',
          'Windows IP Configuration',
          '',
          '   Host Name . . . . . . . . . . . . : WORKSTATION-01',
          '   Primary Dns Suffix  . . . . . . . : corp.contoso.com',
          '   Node Type . . . . . . . . . . . . : Hybrid',
          '   IP Routing Enabled. . . . . . . . : No',
          '   WINS Proxy Enabled. . . . . . . . : No',
          '   DNS Suffix Search List. . . . . . : corp.contoso.com',
          '',
          'Ethernet adapter Local Area Connection:',
          '',
          '   Connection-specific DNS Suffix  . : corp.contoso.com',
          '   Description . . . . . . . . . . . : Intel(R) Ethernet Connection',
          '   Physical Address. . . . . . . . . : 00-1B-21-85-A3-C2',
          '   DHCP Enabled. . . . . . . . . . . : Yes',
          '   Autoconfiguration Enabled . . . . : Yes',
          '   IPv4 Address. . . . . . . . . . . : 192.168.1.100(Preferred)',
          '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
          '   Default Gateway . . . . . . . . . : 192.168.1.1',
          '   DHCP Server . . . . . . . . . . . : 192.168.1.1',
          '   DNS Servers . . . . . . . . . . . : 8.8.8.8',
          '                                       8.8.4.4',
          '   NetBIOS over Tcpip. . . . . . . . : Enabled',
          ''
        ],
        exitCode: 0,
        executionTime: 450
      };
    }

    return {
      command: `ipconfig ${args.join(' ')}`,
      output: [
        '',
        'Windows IP Configuration',
        '',
        'Ethernet adapter Local Area Connection:',
        '',
        '   Connection-specific DNS Suffix  . : corp.contoso.com',
        '   IPv4 Address. . . . . . . . . . . : 192.168.1.100',
        '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
        '   Default Gateway . . . . . . . . . : 192.168.1.1',
        ''
      ],
      exitCode: 0,
      executionTime: 320
    };
  }

  private static generateNslookupOutput(domain: string): RealisticTerminalOutput {
    const ip = this.generateIP();
    
    return {
      command: `nslookup ${domain}`,
      output: [
        `Server:  dns.corp.contoso.com`,
        `Address:  192.168.1.1`,
        '',
        `Non-authoritative answer:`,
        `Name:    ${domain}`,
        `Address:  ${ip}`,
        ''
      ],
      exitCode: 0,
      executionTime: 890
    };
  }

  private static generateNetstatOutput(args: string[]): RealisticTerminalOutput {
    const connections = [
      'TCP    192.168.1.100:49152   40.77.226.250:443     ESTABLISHED',
      'TCP    192.168.1.100:49153   52.97.144.85:443      ESTABLISHED',
      'TCP    192.168.1.100:49154   192.168.1.10:80       ESTABLISHED',
      'TCP    192.168.1.100:3389    0.0.0.0:0              LISTENING',
      'TCP    192.168.1.100:445     0.0.0.0:0              LISTENING',
      'TCP    192.168.1.100:135     0.0.0.0:0              LISTENING',
      'UDP    192.168.1.100:68      *:*                    ',
      'UDP    192.168.1.100:137     *:*                    ',
      'UDP    192.168.1.100:138     *:*                    '
    ];

    return {
      command: `netstat ${args.join(' ')}`,
      output: [
        '',
        'Active Connections',
        '',
        '  Proto  Local Address          Foreign Address        State',
        ...connections,
        ''
      ],
      exitCode: 0,
      executionTime: 670
    };
  }

  private static generateTracerouteOutput(target: string): RealisticTerminalOutput {
    const hops = [
      '  1    <1 ms    <1 ms    <1 ms  192.168.1.1',
      '  2     5 ms     4 ms     6 ms  10.0.0.1',
      '  3    12 ms    11 ms    13 ms  172.16.1.1',
      '  4    18 ms    16 ms    19 ms  203.0.113.1',
      '  5    25 ms    23 ms    27 ms  198.51.100.1',
      `  6    31 ms    29 ms    33 ms  ${this.generateIP()}`
    ];

    return {
      command: `tracert ${target}`,
      output: [
        '',
        `Tracing route to ${target} [${this.generateIP()}]`,
        'over a maximum of 30 hops:',
        '',
        ...hops,
        '',
        'Trace complete.',
        ''
      ],
      exitCode: 0,
      executionTime: 8300
    };
  }

  private static generateArpOutput(args: string[]): RealisticTerminalOutput {
    return {
      command: `arp ${args.join(' ')}`,
      output: [
        '',
        'Interface: 192.168.1.100 --- 0x2',
        '  Internet Address      Physical Address      Type',
        '  192.168.1.1           00-14-d1-a3-b5-7e     dynamic',
        '  192.168.1.10          00-1b-21-85-a3-c4     dynamic',
        '  192.168.1.15          08-00-27-12-34-56     dynamic',
        '  192.168.1.255         ff-ff-ff-ff-ff-ff     static',
        ''
      ],
      exitCode: 0,
      executionTime: 240
    };
  }

  private static generateSystemInfoOutput(): RealisticTerminalOutput {
    return {
      command: 'systeminfo',
      output: [
        '',
        'Host Name:                 WORKSTATION-01',
        'OS Name:                   Microsoft Windows 10 Pro',
        'OS Version:                10.0.19045 N/A Build 19045',
        'OS Manufacturer:           Microsoft Corporation',
        'System Manufacturer:       Dell Inc.',
        'System Model:              OptiPlex 7090',
        'System Type:               x64-based PC',
        'Processor(s):              1 Processor(s) Installed.',
        '                           [01]: Intel64 Family 6 Model 142 Stepping 12 GenuineIntel ~2808 Mhz',
        'Total Physical Memory:     16,384 MB',
        'Available Physical Memory: 8,192 MB',
        'Virtual Memory: Max Size:  32,768 MB',
        'Virtual Memory: Available: 16,384 MB',
        'Virtual Memory: In Use:    16,384 MB',
        'Network Card(s):           1 NIC(s) Installed.',
        '                           [01]: Intel(R) Ethernet Connection',
        '                                 Connection Name: Local Area Connection',
        '                                 DHCP Enabled:    Yes',
        '                                 IP address(es)',
        '                                 [01]: 192.168.1.100',
        ''
      ],
      exitCode: 0,
      executionTime: 2100
    };
  }

  private static generateNetshOutput(args: string[]): RealisticTerminalOutput {
    if (args.includes('wlan')) {
      return {
        command: `netsh ${args.join(' ')}`,
        output: [
          '',
          'Profiles on interface Wi-Fi:',
          '',
          'Group policy profiles (read only)',
          '---------------------------------',
          '    <None>',
          '',
          'User profiles',
          '-------------',
          '    All User Profile     : CorpNetwork',
          '    All User Profile     : GuestNetwork',
          ''
        ],
        exitCode: 0,
        executionTime: 1200
      };
    }

    return {
      command: `netsh ${args.join(' ')}`,
      output: [
        '',
        'The following commands are available:',
        '',
        'Commands in this context:',
        '?              - Displays a list of commands.',
        'add            - Adds a configuration entry to a table.',
        'delete         - Deletes a configuration entry from a table.',
        'dump           - Displays a configuration script.',
        'exec           - Runs a script file.',
        'help           - Displays a list of commands.',
        'interface      - Changes to the `netsh interface\' context.',
        'ipsec          - Changes to the `netsh ipsec\' context.',
        'wlan           - Changes to the `netsh wlan\' context.',
        ''
      ],
      exitCode: 0,
      executionTime: 560
    };
  }

  private static generateTelnetOutput(args: string[]): RealisticTerminalOutput {
    const host = args[0] || 'localhost';
    const port = args[1] || '23';

    return {
      command: `telnet ${args.join(' ')}`,
      output: [
        `Connecting to ${host}...`,
        `Could not open connection to the host, on port ${port}: Connect failed`
      ],
      exitCode: 1,
      executionTime: 5000,
      errors: ['Connection failed - service may be unavailable or blocked by firewall']
    };
  }

  private static generateSshOutput(args: string[]): RealisticTerminalOutput {
    const host = args[0] || 'server.corp.com';

    return {
      command: `ssh ${args.join(' ')}`,
      output: [
        `ssh: connect to host ${host} port 22: Connection timed out`
      ],
      exitCode: 255,
      executionTime: 30000,
      errors: ['SSH connection timeout - check network connectivity and firewall rules']
    };
  }

  private static generateDirectoryListing(): RealisticTerminalOutput {
    return {
      command: 'dir',
      output: [
        ' Volume in drive C has no label.',
        ' Volume Serial Number is 1A23-4B56',
        '',
        ' Directory of C:\\Users\\technician',
        '',
        '01/15/2024  09:30 AM    <DIR>          .',
        '01/15/2024  09:30 AM    <DIR>          ..',
        '01/12/2024  02:15 PM    <DIR>          Desktop',
        '01/10/2024  11:45 AM    <DIR>          Documents',
        '01/08/2024  08:30 AM    <DIR>          Downloads',
        '12/20/2023  04:22 PM             1,024 network_config.txt',
        '01/15/2024  10:15 AM             2,048 troubleshooting_log.txt',
        '               2 File(s)          3,072 bytes',
        '               5 Dir(s)  125,829,632,000 bytes free'
      ],
      exitCode: 0,
      executionTime: 180
    };
  }

  private static generateProcessList(): RealisticTerminalOutput {
    return {
      command: 'tasklist',
      output: [
        '',
        'Image Name                     PID Session Name        Session#    Mem Usage',
        '========================= ======== ================ =========== ============',
        'System Idle Process              0 Services                   0          8 K',
        'System                           4 Services                   0        228 K',
        'smss.exe                       384 Services                   0      1,024 K',
        'csrss.exe                      512 Services                   0      4,096 K',
        'wininit.exe                    588 Services                   0      3,456 K',
        'csrss.exe                      596 Console                    1      8,192 K',
        'winlogon.exe                   644 Console                    1      4,832 K',
        'services.exe                   688 Services                   0      8,960 K',
        'lsass.exe                      704 Services                   0     12,288 K',
        'svchost.exe                    812 Services                   0     16,384 K',
        'svchost.exe                    880 Services                   0      8,704 K',
        'explorer.exe                 2,156 Console                    1     32,768 K',
        'chrome.exe                   3,248 Console                    1    128,512 K',
        'notepad.exe                  4,392 Console                    1      2,048 K',
        ''
      ],
      exitCode: 0,
      executionTime: 890
    };
  }

  private static generateUnknownCommand(command: string): RealisticTerminalOutput {
    return {
      command,
      output: [
        `'${command}' is not recognized as an internal or external command,`,
        'operable program or batch file.'
      ],
      exitCode: 1,
      executionTime: 50,
      errors: ['Command not found']
    };
  }

  private static generateIP(): string {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  static generateNetworkDiagnostics(scenarioId: string): NetworkDiagnosticResult[] {
    const baseResults: NetworkDiagnosticResult[] = [
      {
        test: 'Network Adapter Status',
        status: 'pass',
        details: 'All network adapters are functioning normally',
        timestamp: new Date(),
        technicalDetails: [
          'Intel Ethernet Connection - Connected',
          'Link Speed: 1 Gbps',
          'Duplex: Full',
          'Driver Version: 27.3.1669.0'
        ],
        suggestedActions: ['Monitor adapter performance']
      },
      {
        test: 'IP Configuration',
        status: 'pass',
        details: 'IP address configuration is valid',
        timestamp: new Date(),
        technicalDetails: [
          'IPv4 Address: 192.168.1.100/24',
          'Default Gateway: 192.168.1.1',
          'DNS Servers: 8.8.8.8, 8.8.4.4',
          'DHCP Enabled: Yes'
        ],
        suggestedActions: ['Configuration appears correct']
      },
      {
        test: 'DNS Resolution',
        status: 'pass',
        details: 'DNS queries are resolving correctly',
        timestamp: new Date(),
        technicalDetails: [
          'Primary DNS: 8.8.8.8 (Response: 23ms)',
          'Secondary DNS: 8.8.4.4 (Response: 28ms)',
          'Test queries successful'
        ],
        suggestedActions: ['DNS configuration is optimal']
      }
    ];

    // Modify results based on scenario
    switch (scenarioId) {
      case '1': // Server outage
        baseResults.push({
          test: 'Server Connectivity',
          status: 'fail',
          details: 'Cannot reach critical file server',
          timestamp: new Date(),
          technicalDetails: [
            'File Server (192.168.1.10): Timeout',
            'Port 445 (SMB): No response',
            'Port 139 (NetBIOS): No response'
          ],
          suggestedActions: [
            'Check server power status',
            'Verify network connectivity to server',
            'Contact server administrator'
          ]
        });
        break;

      case '2': // Network connectivity
        baseResults[0].status = 'warning';
        baseResults[0].details = 'Intermittent connectivity detected';
        baseResults[0].technicalDetails.push('Packet loss: 15%');
        baseResults.push({
          test: 'Gateway Connectivity',
          status: 'fail',
          details: 'Cannot reach default gateway consistently',
          timestamp: new Date(),
          technicalDetails: [
            'Gateway (192.168.1.1): 60% packet loss',
            'Response times: 200-5000ms (high variance)',
            'Interface errors detected'
          ],
          suggestedActions: [
            'Check network cable connections',
            'Restart network adapter',
            'Contact network administrator'
          ]
        });
        break;

      case '3': // Printer issues
        baseResults.push({
          test: 'Printer Connectivity',
          status: 'fail',
          details: 'Network printer not responding',
          timestamp: new Date(),
          technicalDetails: [
            'Printer IP (192.168.1.200): No response',
            'Print spooler: Running',
            'Driver status: Installed'
          ],
          suggestedActions: [
            'Power cycle the printer',
            'Check printer network settings',
            'Reinstall printer drivers'
          ]
        });
        break;

      case '4': // Phone system
        baseResults.push({
          test: 'VoIP System Status',
          status: 'warning',
          details: 'Voice quality issues detected',
          timestamp: new Date(),
          technicalDetails: [
            'PBX Server (192.168.1.50): Responding',
            'Jitter: 45ms (High)',
            'Packet loss: 8%',
            'Quality score: 2.1/5.0'
          ],
          suggestedActions: [
            'Implement QoS prioritization',
            'Check bandwidth utilization',
            'Update VoIP firmware'
          ]
        });
        break;
    }

    return baseResults;
  }
}
