# Command Reference Guide

Complete reference for all commands available in the RTP IT Support Training Simulator.

## 🖥️ Terminal Commands (PuTTY Interface)

### Network Diagnostics

#### `show power`
**Description**: Display power supply status and diagnostics
**Scenarios**: Network Outage (Critical for identifying power failures)
**Sample Output**:
```
POWER SUPPLY STATUS
===================
PS1: 12V   OK    
PS2: 12V   FAILED  ← Critical finding!
PS3: 5V    OK    
Temperature: 45°C

ERROR: Redundant power supply failure detected
RECOMMENDATION: Replace power supply module immediately
```

#### `show interfaces`
**Description**: Show network interface status and statistics
**Scenarios**: Network Outage, L3 Emergency
**Sample Output**:
```
Interface Status:
GigabitEthernet1/1    UP      UP
GigabitEthernet1/2    DOWN    DOWN  ← Port failure
FastEthernet0/1       UP      UP
Vlan1                 UP      UP

Errors: 247 input errors, 0 CRC, 0 frame
```

#### `show system`
**Description**: Display system health and hardware status
**Scenarios**: All scenarios
**Sample Output**:
```
System Information:
Uptime: 45 days, 12:34:56
CPU Usage: 23%
Memory Usage: 67%
Temperature: Normal (42°C)
```

#### `show version`
**Description**: Show device firmware and hardware information
**Scenarios**: All scenarios for baseline information
**Sample Output**:
```
Cisco IOS Software, Version 15.2(4)S7
Hardware: WS-C3750-48TS
System uptime is 45 days, 12 hours, 34 minutes
```

### PoE Diagnostics

#### `show poe`
**Description**: Display Power over Ethernet status for all ports
**Scenarios**: Mitel Phone System (Critical for PoE failures)
**Sample Output**:
```
POE STATUS
==========
Port    Status    Power    Class    Device
Fa0/1   ON        15.4W    3        IP Phone
Fa0/2   ON        12.8W    2        IP Phone  
Fa0/3   FAULT     0.0W     -        NONE      ← PoE failure!
Fa0/4   FAULT     0.0W     -        NONE      ← PoE failure!

Total Power: 234.2W / 370W available
PoE Module: FAILED - Replacement required
```

#### `show poe interface fastethernet 0/3`
**Description**: Detailed PoE status for specific port
**Scenarios**: Mitel Phone System (Detailed diagnostics)
**Sample Output**:
```
FastEthernet0/3 PoE Status:
Administrative State: Enabled
Operational State: FAULT
Power Allocated: 0W
Power Consumed: 0W
Detection Status: Short Circuit Detected
Classification: Failed
```

### Authentication & Security

#### `test radius`
**Description**: Test RADIUS server connectivity and authentication
**Scenarios**: VPN Connection Failure (Critical for auth issues)
**Sample Output**:
```
RADIUS Server Test Results:
Primary Server (10.0.1.50): TIMEOUT
Secondary Server (10.0.1.51): SUCCESS

Authentication Test:
Username: testuser
Result: FAILED - Primary server unreachable

RECOMMENDATION: Switch to backup RADIUS server
```

#### `show authentication`
**Description**: Display authentication server status
**Scenarios**: VPN Connection Failure
**Sample Output**:
```
Authentication Servers:
RADIUS Primary: 10.0.1.50 - UNREACHABLE
RADIUS Secondary: 10.0.1.51 - ACTIVE
LDAP: 10.0.1.100 - ACTIVE

Current Active Server: 10.0.1.51 (Backup)
```

### Advanced Diagnostics

#### `ping [destination]`
**Description**: Test network connectivity to specified destination
**Usage**: `ping 8.8.8.8` or `ping google.com`
**Scenarios**: All scenarios
**Sample Output**:
```
PING google.com (142.250.191.14): 56 data bytes
64 bytes from 142.250.191.14: icmp_seq=0 ttl=118 time=12.345 ms
64 bytes from 142.250.191.14: icmp_seq=1 ttl=118 time=11.234 ms

--- google.com ping statistics ---
2 packets transmitted, 2 received, 0% packet loss
```

#### `traceroute [destination]`
**Description**: Trace network path to destination
**Usage**: `traceroute 8.8.8.8`
**Scenarios**: Network diagnostics
**Sample Output**:
```
traceroute to 8.8.8.8, 30 hops max:
 1  192.168.1.1      1.234 ms
 2  10.0.0.1         5.678 ms
 3  * * * Request timed out
 4  8.8.8.8         12.345 ms
```

#### `netstat`
**Description**: Display network connections and listening ports
**Scenarios**: L3 Emergency (Network analysis)
**Sample Output**:
```
Active Connections:
TCP    192.168.1.100:22    ESTABLISHED
TCP    192.168.1.100:443   LISTENING
TCP    192.168.1.100:80    LISTENING
UDP    192.168.1.100:161   LISTENING (SNMP)
```

## 🚫 Invalid Commands

The simulator will reject dangerous or invalid commands:

### Blocked Commands
- `rm -rf /` - System destruction
- `format c:` - Drive formatting
- `shutdown` - System shutdown
- `reboot` - System restart
- `delete database` - Data destruction
- SQL injection attempts
- XSS attempts
- Path traversal attempts

### Error Response
```
ERROR: Invalid or dangerous command detected
This command is not allowed in the training environment
Please use appropriate diagnostic commands only
```

## 📊 PRTG Monitoring Interface

### Device Categories

#### Network Infrastructure
- **Core Switches**: Main network distribution
- **Access Switches**: End-user connectivity  
- **Routers**: Internet and WAN connectivity
- **Firewalls**: Security appliances

#### Server Infrastructure  
- **Domain Controllers**: Authentication services
- **File Servers**: Data storage
- **Mail Servers**: Email services
- **Database Servers**: Application data

#### Specialized Systems
- **RADIUS Servers**: Authentication for VPN/WiFi
- **PoE Switches**: Power over Ethernet for phones
- **VPN Concentrators**: Remote access
- **Backup Systems**: Data protection

### Status Indicators

| Status | Color | Description |
|--------|-------|-------------|
| UP | 🟢 Green | Device operational |
| DOWN | 🔴 Red | Device offline/failed |
| WARNING | 🟡 Yellow | Performance issues |
| PAUSED | ⚪ Gray | Monitoring paused |
| UNKNOWN | 🟣 Purple | Status unclear |

### Performance Metrics

#### Network Devices
- **Bandwidth Utilization**: % of capacity used
- **Packet Loss**: Dropped packet percentage  
- **Latency**: Response time in milliseconds
- **Interface Errors**: Hardware-level errors

#### Servers
- **CPU Usage**: Processor utilization %
- **Memory Usage**: RAM utilization %
- **Disk Usage**: Storage capacity %
- **Service Status**: Application health

#### Power Systems
- **PoE Usage**: Power consumption per port
- **Total Power**: System-wide power draw
- **Temperature**: Hardware temperature
- **Fan Status**: Cooling system health

## 🎯 Scenario-Specific Commands

### Network Outage Scenario
**Primary Commands**:
1. `show interfaces` - Check port status
2. `show power` - **Critical**: Identify power failure
3. `show system` - Overall health check

**Optimal Sequence**:
```bash
show system
show interfaces  
show power        # Key diagnostic finding
show version      # For escalation details
```

### VPN Connection Failure
**Primary Commands**:
1. `test radius` - **Critical**: Test auth servers
2. `show authentication` - Server status
3. `ping [radius-server]` - Connectivity test

**Optimal Sequence**:
```bash
test radius       # Primary diagnostic
show authentication
ping 10.0.1.50    # Test primary server
ping 10.0.1.51    # Test backup server
```

### Mitel Phone System Outage
**Primary Commands**:
1. `show poe` - **Critical**: PoE system status
2. `show poe interface [port]` - Detailed port analysis
3. `show interfaces` - Physical layer check

**Optimal Sequence**:
```bash
show interfaces
show poe          # Key diagnostic finding
show poe interface fastethernet 0/3
show system       # Overall health
```

### L3 Multi-System Failure
**Emergency Commands**:
1. `show system` - Quick health check
2. `show interfaces` - Connectivity status
3. `netstat` - Active connections
4. `ping [critical-servers]` - Rapid testing

**Crisis Sequence**:
```bash
show system       # Immediate overview
show interfaces   # Network status
netstat           # Connection analysis  
ping [domain-controller]
ping [file-server]
```

## 💡 Command Tips & Best Practices

### Efficient Troubleshooting
1. **Start broad**: Use `show system` for overview
2. **Focus narrow**: Target specific subsystems
3. **Verify findings**: Use multiple commands to confirm
4. **Document results**: Note outputs for escalation

### Common Mistakes
❌ **Running destructive commands**: Always use read-only diagnostics
❌ **Skipping basic checks**: Always verify system health first  
❌ **Ignoring error messages**: Pay attention to command output
❌ **Random command execution**: Follow logical diagnostic flow

### Pro Tips
✅ **Use tab completion**: Start typing and press Tab
✅ **Check command history**: Use up arrow for previous commands
✅ **Read all output**: Important details may be at the end
✅ **Cross-reference PRTG**: Verify terminal findings with monitoring

## 🔍 Output Interpretation

### Critical Indicators
- **"FAILED"**: Immediate attention required
- **"UNREACHABLE"**: Connectivity issues
- **"TIMEOUT"**: Network or service delays
- **"ERROR"**: System-level problems
- **"WARNING"**: Performance degradation

### Performance Baselines
- **CPU Usage**: >80% = concern
- **Memory Usage**: >90% = critical
- **Temperature**: >60°C = warning
- **Packet Loss**: >1% = investigation needed

### Escalation Triggers
- Hardware failures (power, interfaces)
- Security issues (authentication failures)
- Performance degradation (>80% utilization)
- Service outages (critical applications down)

---

**Remember**: The terminal interface simulates real equipment. Use these commands as you would in production environments, following your organization's diagnostic procedures.
