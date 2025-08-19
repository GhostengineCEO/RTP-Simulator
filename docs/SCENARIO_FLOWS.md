# Scenario Flow Diagrams

Visual guide to optimal troubleshooting paths for each scenario in the RTP IT Support Training Simulator.

## 🎯 How to Read These Diagrams

- **🟢 GREEN**: Optimal action/decision
- **🟡 YELLOW**: Acceptable alternative
- **🔴 RED**: Suboptimal choice (mood/score impact)
- **⚡ CRITICAL**: Key diagnostic step
- **🏆 SUCCESS**: Achievement/badge trigger
- **📞 ESCALATE**: Proper escalation point

---

## 🌐 Scenario 1: Network Outage - Cisco Core Switch

### Optimal Flow Path
```mermaid
graph TD
    A[📞 Client Call: Network Down] --> B[🟢 Calm client, gather scope]
    B --> C{Affected users?}
    C --> D[🟢 50 users, full floor]
    D --> E[⚡ Check PRTG immediately]
    E --> F{PRTG shows issues?}
    F --> G[🟢 Core switch alerts visible]
    G --> H[⚡ Access PuTTY for diagnostics]
    H --> I[🟢 Run: show system]
    I --> J[🟢 Run: show interfaces]
    J --> K[⚡ CRITICAL: show power]
    K --> L[🔍 Power Supply 2 FAILED]
    L --> M[🟢 Explain findings to client]
    M --> N[📞 ESCALATE: Level 2 hardware team]
    N --> O[🏆 Badge: Network Expert]
    
    style K fill:#ff6b6b
    style L fill:#feca57
    style N fill:#48cae4
    style O fill:#06ffa5
```

### Common Mistakes to Avoid
```mermaid
graph TD
    A[📞 Client Call] --> B[🔴 Panic response]
    B --> C[🔴 Immediate escalation]
    C --> D[😤 Client frustrated]
    D --> E[❌ Low score: -15 points]
    
    A --> F[🔴 Skip PRTG check]
    F --> G[🔴 Random commands in PuTTY]
    G --> H[😤 Client loses confidence]
    H --> I[❌ Missed optimal path]
    
    style B fill:#ff6b6b
    style C fill:#ff6b6b
    style F fill:#ff6b6b
    style G fill:#ff6b6b
```

### Score Breakdown
- **Initial Response**: 15 points
- **PRTG Check**: 20 points
- **Systematic Diagnostics**: 25 points  
- **Root Cause ID**: 30 points
- **Professional Escalation**: 25 points
- **Total Possible**: 115 points

---

## 🔐 Scenario 2: Barracuda VPN Connection Failure

### Optimal Flow Path
```mermaid
graph TD
    A[📞 Client: Can't connect VPN] --> B[🟢 Gather auth failure details]
    B --> C{Multiple users affected?}
    C --> D[🟢 Yes, colleague has same issue]
    D --> E[⚡ Check PRTG RADIUS status]
    E --> F{Primary RADIUS server?}
    F --> G[🔴 Server DOWN/TIMEOUT]
    G --> H[⚡ Test backup server]
    H --> I[🟢 Secondary server operational]
    I --> J[🟢 Activate failover immediately]
    J --> K[📞 Inform client: testing connection]
    K --> L[🟢 VPN working via backup]
    L --> M[📞 ESCALATE: Primary server repair]
    M --> N[🏆 Badge: Security Specialist]
    
    style G fill:#ff6b6b
    style J fill:#feca57
    style L fill:#06ffa5
    style N fill:#06ffa5
```

### Alternative Paths
```mermaid
graph TD
    A[Start] --> B{Check PRTG first?}
    B -->|Yes| C[🟢 Systematic approach +20]
    B -->|No| D[🟡 Client interview first +10]
    
    C --> E[⚡ RADIUS failure found]
    D --> F[🟡 Eventually check PRTG]
    F --> E
    
    E --> G{Backup implementation?}
    G -->|Immediate| H[🟢 Swift resolution +25]
    G -->|Delayed| I[🟡 Resolution but slower +15]
    G -->|Skip| J[🔴 Incomplete fix -10]
    
    style C fill:#06ffa5
    style H fill:#06ffa5
    style J fill:#ff6b6b
```

### Critical Decision Points
1. **PRTG vs Client Interview**: Both valid, PRTG slightly better
2. **Backup Activation Speed**: Immediate = better score
3. **Escalation Timing**: After fixing, not before
4. **Client Communication**: Keep informed throughout

---

## 📞 Scenario 3: Mitel Phone System Outage

### Optimal Flow Path
```mermaid
graph TD
    A[📞 Accounting: All phones down] --> B[🟢 Professional concern]
    B --> C{Scope assessment?}
    C --> D[🟢 8 phones, no power/display]
    D --> E[⚡ Check PRTG PoE status]
    E --> F{PoE switch issues?}
    F --> G[🔴 PoE power consumption LOW]
    G --> H[⚡ Access PuTTY diagnostics]
    H --> I[🟢 Run: show interfaces]
    I --> J[⚡ CRITICAL: show poe]
    J --> K[🔍 PoE Module FAILED]
    K --> L[🟢 Run: show poe interface X]
    L --> M[🔍 Detailed fault analysis]
    M --> N[🟢 Explain hardware failure]
    N --> O[📞 ESCALATE: Facilities/Hardware]
    O --> P[🏆 Badge: Telephony Expert]
    
    style K fill:#ff6b6b
    style M fill:#feca57
    style O fill:#48cae4
    style P fill:#06ffa5
```

### Time Pressure Handling
```mermaid
graph TD
    A[😤 Client: Missing important calls!] --> B{Response approach?}
    B -->|🟢 Acknowledge urgency| C[+5 mood points]
    B -->|🔴 Dismiss concern| D[-10 mood points]
    B -->|🟡 Technical focus only| E[No mood change]
    
    C --> F[🟢 Systematic diagnosis]
    D --> G[😡 Client becomes angry]
    E --> F
    
    F --> H[⚡ Quick PoE identification]
    G --> I[🔴 Pressure affects performance]
    
    H --> J[🏆 Swift Resolution badge possible]
    I --> K[❌ Missed achievement]
    
    style C fill:#06ffa5
    style D fill:#ff6b6b
    style G fill:#ff6b6b
    style J fill:#06ffa5
```

### PoE Diagnostic Sequence
1. **`show interfaces`** - Physical layer check
2. **`show poe`** - Overall PoE status ⚡
3. **`show poe interface X`** - Specific port analysis
4. **`show system`** - Overall health confirmation

---

## 🚨 Scenario 4: L3 Multi-System Cascading Failure

### Emergency Response Flow
```mermaid
graph TD
    A[🚨 EMERGENCY: Everything down!] --> B[⚡ IMMEDIATE: Acknowledge crisis]
    B --> C[🟢 Professional emergency tone]
    C --> D{Scope confirmation?}
    D --> E[🚨 200+ users, complete outage]
    E --> F[⚡ URGENT: Check PRTG status]
    F --> G[🔴 Multiple critical systems DOWN]
    G --> H[⚡ Emergency PuTTY diagnostics]
    H --> I[🟢 Run: show system (rapid)]
    I --> J[🟢 Run: show interfaces (critical)]
    J --> K[🟢 Run: netstat (connections)]
    K --> L[🔍 Cascading infrastructure failure]
    L --> M[📞 CRITICAL ESCALATION: Crisis team]
    M --> N[🟢 Emergency business continuity]
    N --> O[🏆 Badge: Crisis Manager]
    
    style A fill:#ff0000
    style B fill:#feca57
    style M fill:#48cae4
    style O fill:#06ffa5
```

### Crisis Management Decision Tree
```mermaid
graph TD
    A[🚨 Crisis Identified] --> B{Initial Response?}
    B -->|🟢 Professional crisis mode| C[Client confidence +10]
    B -->|🔴 Panic/Overwhelm| D[Client panic increases]
    B -->|🟡 Standard response| E[Missed crisis recognition]
    
    C --> F{Diagnostic approach?}
    D --> G[😰 Situation deteriorates]
    E --> H[🟡 Eventually recognize severity]
    
    F -->|🟢 Rapid systematic| I[Crisis contained]
    F -->|🔴 Slow/methodical| J[Crisis escalates]
    
    I --> K[📞 Emergency escalation]
    G --> L[🔴 Poor crisis management]
    J --> M[🟡 Delayed but eventual escalation]
    
    K --> N[🏆 Multiple badges possible]
    L --> O[❌ Failed scenario]
    M --> P[🟡 Partial success]
    
    style C fill:#06ffa5
    style D fill:#ff6b6b
    style I fill:#06ffa5
    style K fill:#48cae4
    style N fill:#06ffa5
```

### Emergency Command Sequence
1. **`show system`** - Immediate health overview ⚡
2. **`show interfaces`** - Critical connectivity check ⚡  
3. **`netstat`** - Active connections analysis
4. **`ping [critical-servers]`** - Infrastructure testing
5. **Emergency escalation** - Crisis team activation 📞

### Achievement Thresholds
- **🚨 Crisis Manager**: Complete within 60min, score >85
- **🆘 Emergency Responder**: Proper escalation, score >80
- **🛡️ System Savior**: Perfect path, score >90

---

## 📊 Universal Best Practices

### Optimal Decision Framework
```mermaid
graph TD
    A[Problem Identified] --> B[🟢 Professional Response]
    B --> C[🟢 Scope Assessment]
    C --> D[🟢 PRTG Check First]
    D --> E[🟢 Systematic Diagnostics]
    E --> F[🟢 Root Cause Analysis]
    F --> G[🟢 Client Communication]
    G --> H[🟢 Proper Escalation]
    H --> I[🏆 Optimal Completion]
    
    style A fill:#f8f9fa
    style I fill:#06ffa5
```

### Score Optimization Tips
- **Response Speed**: Quick acknowledgment (+mood)
- **Tool Usage**: PRTG before PuTTY (usually optimal)
- **Command Sequence**: Logical diagnostic flow
- **Client Updates**: Keep informed throughout
- **Professional Tone**: Maintain throughout scenario
- **Escalation Timing**: After diagnosis, with findings

### Common Failure Patterns
1. **Immediate Escalation**: Skipping diagnostics (-20 points)
2. **Poor Communication**: Ignoring client mood (-15 points)
3. **Random Commands**: No systematic approach (-10 points)
4. **Missing Key Steps**: Not using critical tools (-25 points)
5. **Delayed Response**: Taking too long (-mood degradation)

---

## 🎮 Interactive Elements

### Mood Management
- **Client Stress**: Increases over time if not addressed
- **Professional Response**: Improves mood (+5 to +15 points)
- **Clear Communication**: Maintains or improves mood
- **Technical Jargon**: May confuse or frustrate client
- **Confidence**: Systematic approach builds trust

### Time Pressure
- **Network Outage**: Presentation deadline pressure
- **VPN Failure**: Remote work urgency
- **Phone System**: Missing important calls
- **L3 Emergency**: Business continuity crisis

### Tool Integration
- **PRTG → PuTTY**: Standard diagnostic flow
- **PuTTY Confirmation**: Verify PRTG findings
- **Cross-Reference**: Use both tools effectively
- **Documentation**: Note findings for escalation

---

**Remember**: Each scenario has multiple valid paths, but following the optimal flow maximizes learning value and achievement potential. Practice different approaches to understand the impact of various decision points.
