import { Scenario, ConversationStep, DecisionStep, CompletionBadge } from '../types';

export const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Network Outage - Cisco Core Switch',
    description: 'Critical network outage affecting 50 employees. Multiple departments reporting complete loss of network connectivity.',
    difficulty: 'intermediate',
    severity: 'critical',
    category: 'network',
    estimatedTime: '30-45 minutes',
    usersAffected: '50 employees',
    rootCause: 'Power supply failure in Cisco core switch',
    solutionPath: [
      'Initial assessment and user impact verification',
      'Check PRTG network monitoring for device status',
      'Access PuTTY to investigate switch diagnostics',
      'Identify power supply failure',
      'Escalate to Level 2 for hardware replacement'
    ],
    requiredTools: ['both'],
    objectives: [
      'Assess the scope of the network outage',
      'Use PRTG to identify affected network devices',
      'Access switch via PuTTY for diagnostics',
      'Identify root cause of the failure',
      'Escalate appropriately with detailed findings'
    ],
    completed: false,
    optimalPath: [
      {
        id: 'assess_scope',
        type: 'response',
        action: 'Gather initial information about scope and impact',
        moodImpact: { change: 'improve', severity: 'minor', reason: 'Professional response' },
        scoreImpact: 10,
        required: true,
        order: 1
      },
      {
        id: 'check_prtg',
        type: 'tool_access',
        action: 'Check PRTG monitoring before investigating further',
        moodImpact: { change: 'improve', severity: 'moderate', reason: 'Systematic approach appreciated' },
        scoreImpact: 15,
        required: true,
        order: 2
      },
      {
        id: 'putty_diagnostics',
        type: 'tool_access',
        action: 'Access switch via PuTTY for detailed diagnostics',
        expectedBefore: ['check_prtg'],
        moodImpact: { change: 'maintain', severity: 'minor', reason: 'Proper diagnostic sequence' },
        scoreImpact: 20,
        required: true,
        order: 3
      },
      {
        id: 'escalate',
        type: 'escalation',
        action: 'Escalate to Level 2 with detailed findings',
        expectedBefore: ['putty_diagnostics'],
        moodImpact: { change: 'improve', severity: 'major', reason: 'Clear escalation with findings' },
        scoreImpact: 25,
        required: true,
        order: 4
      }
    ],
    completionBadges: [
      {
        id: 'network_expert',
        name: 'Network Troubleshooting Expert',
        description: 'Successfully diagnosed network outage with perfect methodology',
        icon: '🌐',
        criteria: { minScore: 80, perfectPath: true, clientSatisfaction: 4 },
        rarity: 'rare'
      },
      {
        id: 'swift_resolution',
        name: 'Swift Resolution',
        description: 'Completed network diagnosis under time pressure',
        icon: '⚡',
        criteria: { maxTime: 25, minScore: 70 },
        rarity: 'uncommon'
      }
    ]
  },
  {
    id: '2',
    title: 'Barracuda VPN Connection Failure',
    description: 'Remote users unable to connect via VPN. Authentication failures reported by multiple users trying to access company resources.',
    difficulty: 'intermediate',
    severity: 'high',
    category: 'security',
    estimatedTime: '20-30 minutes',
    usersAffected: 'Multiple remote users',
    rootCause: 'Primary RADIUS server down',
    solutionPath: [
      'Verify VPN connection issues with affected users',
      'Check PRTG for RADIUS server status',
      'Test RADIUS authentication services',
      'Switch to backup RADIUS server',
      'Escalate primary server issue to infrastructure team'
    ],
    requiredTools: ['prtg'],
    objectives: [
      'Confirm VPN authentication issues',
      'Monitor RADIUS server status via PRTG',
      'Test authentication services',
      'Implement failover to backup systems',
      'Document incident and escalate server repair'
    ],
    completed: false,
    optimalPath: [
      {
        id: 'verify_scope',
        type: 'response',
        action: 'Verify scope of VPN authentication issues',
        moodImpact: { change: 'improve', severity: 'minor', reason: 'Taking issue seriously' },
        scoreImpact: 10,
        required: true,
        order: 1
      },
      {
        id: 'check_prtg_radius',
        type: 'tool_access',
        action: 'Check PRTG for RADIUS server status immediately',
        moodImpact: { change: 'improve', severity: 'moderate', reason: 'Quick systematic check' },
        scoreImpact: 20,
        required: true,
        order: 2
      },
      {
        id: 'implement_backup',
        type: 'diagnosis',
        action: 'Activate backup RADIUS server',
        expectedBefore: ['check_prtg_radius'],
        moodImpact: { change: 'improve', severity: 'major', reason: 'Quick resolution' },
        scoreImpact: 25,
        required: true,
        order: 3
      },
      {
        id: 'escalate_repair',
        type: 'escalation',
        action: 'Escalate primary server repair to infrastructure team',
        expectedBefore: ['implement_backup'],
        moodImpact: { change: 'maintain', severity: 'minor', reason: 'Proper follow-up' },
        scoreImpact: 15,
        required: true,
        order: 4
      }
    ],
    completionBadges: [
      {
        id: 'security_specialist',
        name: 'Security Specialist',
        description: 'Successfully resolved VPN authentication crisis',
        icon: '🔐',
        criteria: { minScore: 75, clientSatisfaction: 4 },
        rarity: 'uncommon'
      },
      {
        id: 'failover_master',
        name: 'Failover Master',
        description: 'Expertly implemented backup systems',
        icon: '🔄',
        criteria: { specificActions: ['implement_backup'], minScore: 70 },
        rarity: 'rare'
      }
    ]
  },
  {
    id: '3',
    title: 'Mitel Phone System Outage',
    description: 'Department-wide phone system failure. 8 IP phones in the accounting department are completely offline.',
    difficulty: 'intermediate',
    severity: 'high',
    category: 'telephony',
    estimatedTime: '25-35 minutes',
    usersAffected: 'Accounting department (8 phones)',
    rootCause: 'PoE (Power over Ethernet) module failure',
    solutionPath: [
      'Confirm phone system outage scope',
      'Check PRTG for PoE switch status and power consumption',
      'Diagnose PoE module via switch interface',
      'Identify hardware failure requiring replacement',
      'Escalate to facilities team for PoE module replacement'
    ],
    requiredTools: ['both'],
    objectives: [
      'Verify extent of phone system outage',
      'Monitor PoE switch status in PRTG',
      'Access switch diagnostics via PuTTY',
      'Identify PoE module hardware failure',
      'Coordinate hardware replacement escalation'
    ],
    completed: false,
    optimalPath: [
      {
        id: 'assess_phone_outage',
        type: 'response',
        action: 'Assess scope of phone system outage professionally',
        moodImpact: { change: 'improve', severity: 'minor', reason: 'Taking critical communication issue seriously' },
        scoreImpact: 10,
        required: true,
        order: 1
      },
      {
        id: 'check_prtg_poe',
        type: 'tool_access',
        action: 'Check PRTG for PoE switch power status',
        moodImpact: { change: 'improve', severity: 'moderate', reason: 'Systematic power diagnostics' },
        scoreImpact: 15,
        required: true,
        order: 2
      },
      {
        id: 'putty_poe_diagnostics',
        type: 'tool_access',
        action: 'Access switch via PuTTY for PoE module diagnostics',
        expectedBefore: ['check_prtg_poe'],
        moodImpact: { change: 'maintain', severity: 'minor', reason: 'Thorough hardware investigation' },
        scoreImpact: 20,
        required: true,
        order: 3
      },
      {
        id: 'escalate_facilities',
        type: 'escalation',
        action: 'Escalate to facilities team for PoE module replacement',
        expectedBefore: ['putty_poe_diagnostics'],
        moodImpact: { change: 'improve', severity: 'moderate', reason: 'Clear path to resolution' },
        scoreImpact: 20,
        required: true,
        order: 4
      }
    ],
    completionBadges: [
      {
        id: 'telephony_expert',
        name: 'Telephony Systems Expert',
        description: 'Successfully diagnosed and resolved phone system outage',
        icon: '📞',
        criteria: { minScore: 75, perfectPath: true },
        rarity: 'uncommon'
      },
      {
        id: 'power_diagnostician',
        name: 'Power Systems Diagnostician',
        description: 'Expertly identified PoE hardware failure',
        icon: '⚡',
        criteria: { specificActions: ['putty_poe_diagnostics'], minScore: 65 },
        rarity: 'rare'
      }
    ]
  },
  {
    id: '4',
    title: 'L3 Multi-System Cascading Failure',
    description: 'EMERGENCY: Organization-wide system failure. Domain Controller and Storage Array simultaneous failure affecting 200+ users.',
    difficulty: 'advanced',
    severity: 'emergency',
    category: 'infrastructure',
    estimatedTime: '60+ minutes',
    usersAffected: 'Entire organization (200+ users)',
    rootCause: 'Domain Controller and Storage Array cascading failures',
    solutionPath: [
      'Immediate impact assessment and crisis declaration',
      'Emergency PRTG monitoring of all critical systems',
      'Rapid diagnostics via PuTTY on available systems',
      'Coordinate with crisis management team',
      'Implement emergency business continuity procedures'
    ],
    requiredTools: ['both'],
    objectives: [
      'Assess organization-wide impact immediately',
      'Monitor all critical infrastructure via PRTG',
      'Perform emergency diagnostics on available systems',
      'Escalate to crisis management team immediately',
      'Implement business continuity measures'
    ],
    completed: false,
    optimalPath: [
      {
        id: 'crisis_assessment',
        type: 'response',
        action: 'Immediately acknowledge crisis and begin systematic assessment',
        moodImpact: { change: 'improve', severity: 'minor', reason: 'Professional crisis response' },
        scoreImpact: 15,
        required: true,
        order: 1
      },
      {
        id: 'emergency_prtg',
        type: 'tool_access',
        action: 'Check PRTG for all critical system status immediately',
        moodImpact: { change: 'maintain', severity: 'minor', reason: 'Quick situational awareness' },
        scoreImpact: 20,
        required: true,
        order: 2
      },
      {
        id: 'rapid_diagnostics',
        type: 'tool_access',
        action: 'Perform emergency system diagnostics via available terminals',
        expectedBefore: ['emergency_prtg'],
        moodImpact: { change: 'maintain', severity: 'minor', reason: 'Rapid technical assessment' },
        scoreImpact: 25,
        required: true,
        order: 3
      },
      {
        id: 'crisis_escalation',
        type: 'escalation',
        action: 'Escalate immediately to crisis management team',
        expectedBefore: ['rapid_diagnostics'],
        moodImpact: { change: 'improve', severity: 'major', reason: 'Appropriate emergency escalation' },
        scoreImpact: 30,
        required: true,
        order: 4
      }
    ],
    completionBadges: [
      {
        id: 'crisis_manager',
        name: 'Crisis Management Expert',
        description: 'Successfully managed organization-wide emergency',
        icon: '🚨',
        criteria: { minScore: 85, clientSatisfaction: 4, maxTime: 60 },
        rarity: 'legendary'
      },
      {
        id: 'emergency_responder',
        name: 'Emergency Response Specialist',
        description: 'Rapid response to critical infrastructure failure',
        icon: '🆘',
        criteria: { specificActions: ['crisis_escalation'], minScore: 80 },
        rarity: 'epic'
      },
      {
        id: 'system_savior',
        name: 'System Savior',
        description: 'Prevented complete organizational shutdown',
        icon: '🛡️',
        criteria: { perfectPath: true, minScore: 90 },
        rarity: 'legendary'
      }
    ]
  }
];

export const conversationSteps: Record<string, ConversationStep[]> = {
  '1': [ // Network Outage - Cisco Core Switch
    {
      id: 1,
      description: 'Initial panic call from user',
      expectedUserAction: 'Calm the user and gather initial information',
      clientResponse: 'Our entire network is down! Nobody can access anything - email, files, internet, nothing works!',
      toolSuggestion: 'none',
      moodChange: 'neutral',
      scoreWeight: 15
    },
    {
      id: 2,
      description: 'Scope assessment',
      expectedUserAction: 'Ask about affected users and departments',
      clientResponse: 'It\'s affecting our whole floor - about 50 people. Sales, marketing, and admin are all down.',
      toolSuggestion: 'prtg',
      moodChange: 'neutral',
      scoreWeight: 20
    },
    {
      id: 3,
      description: 'PRTG investigation prompt',
      expectedUserAction: 'Check PRTG for network device status',
      clientResponse: 'Can you see what\'s wrong? We have an important client presentation in an hour!',
      toolSuggestion: 'prtg',
      moodChange: 'worsen',
      scoreWeight: 25
    },
    {
      id: 4,
      description: 'Switch diagnostics needed',
      expectedUserAction: 'Access core switch via PuTTY for detailed diagnostics',
      clientResponse: 'The PRTG shows issues, but we need to know exactly what\'s wrong and how long this will take.',
      toolSuggestion: 'putty',
      moodChange: 'neutral',
      scoreWeight: 30
    },
    {
      id: 5,
      description: 'Root cause identified',
      expectedUserAction: 'Explain power supply failure and escalation need',
      clientResponse: 'Hardware failure?! How long will this take to fix? Our presentation is critical!',
      toolSuggestion: 'none',
      moodChange: 'worsen',
      scoreWeight: 25
    }
  ],
  '2': [ // Barracuda VPN Connection Failure
    {
      id: 1,
      description: 'VPN connection complaint',
      expectedUserAction: 'Gather details about VPN connection issues',
      clientResponse: 'I can\'t connect to the VPN from home. It keeps saying authentication failed.',
      toolSuggestion: 'none',
      moodChange: 'neutral',
      scoreWeight: 15
    },
    {
      id: 2,
      description: 'Multiple user verification',
      expectedUserAction: 'Ask if other remote users are affected',
      clientResponse: 'Yes, my colleague Jane is having the same problem. We both need to access the file server urgently.',
      toolSuggestion: 'prtg',
      moodChange: 'worsen',
      scoreWeight: 20
    },
    {
      id: 3,
      description: 'PRTG RADIUS check',
      expectedUserAction: 'Check PRTG for RADIUS server status',
      clientResponse: 'I see you\'re checking the systems. Is this going to take long? I have a deadline today.',
      toolSuggestion: 'prtg',
      moodChange: 'frustrated',
      scoreWeight: 30
    },
    {
      id: 4,
      description: 'Backup system activation',
      expectedUserAction: 'Explain RADIUS server issue and backup activation',
      clientResponse: 'Oh good, can I try connecting now? Will this happen again?',
      toolSuggestion: 'none',
      moodChange: 'improve',
      scoreWeight: 25
    }
  ],
  '3': [ // Mitel Phone System Outage
    {
      id: 1,
      description: 'Phone system failure report',
      expectedUserAction: 'Assess phone system outage scope',
      clientResponse: 'All our phones in accounting are dead! We can\'t make or receive calls.',
      toolSuggestion: 'none',
      moodChange: 'frustrated',
      scoreWeight: 15
    },
    {
      id: 2,
      description: 'Department impact assessment',
      expectedUserAction: 'Confirm which phones and users are affected',
      clientResponse: 'It\'s all 8 phones in our department. The phones have no power - the screens are completely black.',
      toolSuggestion: 'prtg',
      moodChange: 'neutral',
      scoreWeight: 20
    },
    {
      id: 3,
      description: 'PoE investigation',
      expectedUserAction: 'Check PRTG for PoE switch power status',
      clientResponse: 'Can you see what\'s wrong with the power? We need our phones working for client calls.',
      toolSuggestion: 'putty',
      moodChange: 'neutral',
      scoreWeight: 25
    },
    {
      id: 4,
      description: 'Hardware diagnosis',
      expectedUserAction: 'Use PuTTY to diagnose PoE module failure',
      clientResponse: 'Hardware failure? How long until it\'s fixed? We\'re missing important calls!',
      toolSuggestion: 'none',
      moodChange: 'worsen',
      scoreWeight: 25
    }
  ],
  '4': [ // L3 Multi-System Cascading Failure
    {
      id: 1,
      description: 'Emergency crisis call',
      expectedUserAction: 'Immediately assess crisis scope and declare emergency',
      clientResponse: 'EMERGENCY! Everything is down - servers, domain controller, file storage, everything! Nobody can log in!',
      toolSuggestion: 'prtg',
      moodChange: 'panicked',
      scoreWeight: 20
    },
    {
      id: 2,
      description: 'Organization-wide impact',
      expectedUserAction: 'Confirm organization-wide failure scope',
      clientResponse: 'All 200+ users are affected! This is a complete disaster - we\'ve lost everything!',
      toolSuggestion: 'prtg',
      moodChange: 'panicked',
      scoreWeight: 25
    },
    {
      id: 3,
      description: 'Emergency diagnostics',
      expectedUserAction: 'Perform emergency system diagnostics',
      clientResponse: 'What can you see? Is this a cyber attack? How long until we\'re back online?',
      toolSuggestion: 'both',
      moodChange: 'panicked',
      scoreWeight: 30
    },
    {
      id: 4,
      description: 'Crisis escalation',
      expectedUserAction: 'Escalate immediately to crisis management team',
      clientResponse: 'Yes, please get everyone involved! This is costing us thousands every minute!',
      toolSuggestion: 'none',
      moodChange: 'panicked',
      scoreWeight: 35
    }
  ]
};
