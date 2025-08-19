import React, { useState, useEffect } from 'react';
import { X, Wifi, Server, Zap, HardDrive, Phone, Shield, Globe, AlertTriangle, CheckCircle, Clock, XCircle, WifiOff } from 'lucide-react';
import { PRTGSensor, PRTGAlert, PRTGScenarioData } from '../types';

interface PRTGDashboardProps {
  onClose: () => void;
  scenarioId: string;
  onSensorClick?: (sensor: PRTGSensor) => void;
}

const PRTGDashboard: React.FC<PRTGDashboardProps> = ({ onClose, scenarioId, onSensorClick }) => {
  const [scenarioData, setScenarioData] = useState<PRTGScenarioData | null>(null);
  const [selectedTab, setSelectedTab] = useState<'sensors' | 'alerts'>('sensors');

  useEffect(() => {
    // Load scenario-specific PRTG data
    setScenarioData(getPRTGDataForScenario(scenarioId));
  }, [scenarioId]);

  const getPRTGDataForScenario = (scenarioId: string): PRTGScenarioData => {
    const now = new Date();
    const recentTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago

    switch (scenarioId) {
      case '1': // Network Outage
        return {
          scenarioId,
          title: 'Network Infrastructure Monitoring',
          sensors: [
            {
              id: 'core-switch',
              name: 'Core Switch (Cisco 9300)',
              type: 'network',
              status: 'DOWN',
              value: 'OFFLINE',
              message: 'Device not responding to SNMP queries',
              icon: 'switch',
              lastCheck: recentTime,
              downtime: '00:12:34'
            },
            {
              id: 'network-traffic',
              name: 'Network Traffic (Port 1-24)',
              type: 'network',
              status: 'DOWN',
              value: '0 Mbps',
              message: 'No traffic detected on monitored ports',
              icon: 'network',
              lastCheck: recentTime,
              downtime: '00:12:34'
            },
            {
              id: 'connected-devices',
              name: 'Connected Devices',
              type: 'network',
              status: 'CRITICAL',
              value: '0/75',
              message: 'No devices connected to network',
              icon: 'network',
              lastCheck: recentTime
            },
            {
              id: 'uplink',
              name: 'Uplink to ISP',
              type: 'internet',
              status: 'UP',
              value: '95.2 Mbps',
              message: 'Internet connection stable',
              icon: 'internet',
              lastCheck: now
            }
          ],
          alerts: [
            {
              id: 'alert-1',
              level: 'critical',
              sensor: 'Core Switch (Cisco 9300)',
              message: 'Device down - SNMP timeout after 3 retry attempts',
              timestamp: recentTime,
              acknowledged: false
            },
            {
              id: 'alert-2',
              level: 'critical',
              sensor: 'Network Traffic (Port 1-24)',
              message: 'Traffic dropped to 0 Mbps - possible hardware failure',
              timestamp: recentTime,
              acknowledged: false
            },
            {
              id: 'alert-3',
              level: 'warning',
              sensor: 'Connected Devices',
              message: 'Device count dropped from 75 to 0 in 2 minutes',
              timestamp: recentTime,
              acknowledged: false
            }
          ]
        };

      case '2': // VPN Failure
        return {
          scenarioId,
          title: 'Security Infrastructure Monitoring',
          sensors: [
            {
              id: 'vpn-server',
              name: 'VPN Server (Barracuda)',
              type: 'security',
              status: 'WARNING',
              value: 'AUTH FAIL',
              message: 'Authentication requests failing',
              icon: 'security',
              lastCheck: recentTime
            },
            {
              id: 'radius-primary',
              name: 'Primary RADIUS Server',
              type: 'server',
              status: 'DOWN',
              value: 'OFFLINE',
              message: 'Service not responding on port 1812',
              icon: 'server',
              lastCheck: recentTime,
              downtime: '00:08:15'
            },
            {
              id: 'radius-backup',
              name: 'Backup RADIUS Server',
              type: 'server',
              status: 'UP',
              value: 'ONLINE',
              message: 'Standby server operational',
              icon: 'server',
              lastCheck: now
            },
            {
              id: 'internet-connection',
              name: 'Internet Connection',
              type: 'internet',
              status: 'UP',
              value: '98.5 Mbps',
              message: 'WAN connection stable',
              icon: 'internet',
              lastCheck: now
            }
          ],
          alerts: [
            {
              id: 'alert-1',
              level: 'critical',
              sensor: 'Primary RADIUS Server',
              message: 'Service down - Authentication service unavailable',
              timestamp: recentTime,
              acknowledged: false
            },
            {
              id: 'alert-2',
              level: 'warning',
              sensor: 'VPN Server (Barracuda)',
              message: 'High authentication failure rate detected',
              timestamp: recentTime,
              acknowledged: false
            },
            {
              id: 'alert-3',
              level: 'info',
              sensor: 'Backup RADIUS Server',
              message: 'Backup server ready for failover activation',
              timestamp: now,
              acknowledged: false
            }
          ]
        };

      case '3': // Mitel Phone System
        return {
          scenarioId,
          title: 'Telephony System Monitoring',
          sensors: [
            {
              id: 'phone-controller',
              name: 'Mitel Phone Controller',
              type: 'phone',
              status: 'UP',
              value: 'ONLINE',
              message: 'Main controller operational',
              icon: 'phone',
              lastCheck: now
            },
            {
              id: 'poe-module-1',
              name: 'PoE Module 1 (Ports 1-12)',
              type: 'power',
              status: 'UP',
              value: '145W/180W',
              message: 'Power delivery normal',
              icon: 'power',
              lastCheck: now
            },
            {
              id: 'poe-module-2',
              name: 'PoE Module 2 (Ports 13-24)',
              type: 'power',
              status: 'DOWN',
              value: '0W/180W',
              message: 'Module failure - no power output',
              icon: 'power',
              lastCheck: recentTime,
              downtime: '00:15:42'
            },
            {
              id: 'network-uplink',
              name: 'Network Uplink',
              type: 'network',
              status: 'UP',
              value: '1 Gbps',
              message: 'Network connectivity stable',
              icon: 'network',
              lastCheck: now
            }
          ],
          alerts: [
            {
              id: 'alert-1',
              level: 'critical',
              sensor: 'PoE Module 2 (Ports 13-24)',
              message: 'PoE module failure - 8 phones offline in accounting dept',
              timestamp: recentTime,
              acknowledged: false
            },
            {
              id: 'alert-2',
              level: 'warning',
              sensor: 'PoE Module 1 (Ports 1-12)',
              message: 'Power consumption at 80% capacity',
              timestamp: new Date(now.getTime() - 10 * 60 * 1000),
              acknowledged: true
            }
          ]
        };

      case '4': // L3 Crisis
        return {
          scenarioId,
          title: 'Critical Infrastructure Status',
          sensors: [
            {
              id: 'domain-controller-1',
              name: 'Primary Domain Controller',
              type: 'server',
              status: 'CRITICAL',
              value: 'CRITICAL',
              message: 'System failure - blue screen detected',
              icon: 'server',
              lastCheck: recentTime,
              downtime: '00:23:17'
            },
            {
              id: 'domain-controller-2',
              name: 'Secondary Domain Controller',
              type: 'server',
              status: 'DOWN',
              value: 'OFFLINE',
              message: 'Service stopped - manual intervention required',
              icon: 'server',
              lastCheck: recentTime,
              downtime: '00:21:43'
            },
            {
              id: 'storage-array',
              name: 'Primary Storage Array',
              type: 'storage',
              status: 'CRITICAL',
              value: 'DEGRADED',
              message: 'Multiple disk failures - RAID degraded',
              icon: 'storage',
              lastCheck: recentTime
            },
            {
              id: 'backup-storage',
              name: 'Backup Storage System',
              type: 'storage',
              status: 'WARNING',
              value: 'SLOW',
              message: 'Performance degraded - high I/O wait',
              icon: 'storage',
              lastCheck: now
            },
            {
              id: 'network-core',
              name: 'Core Network',
              type: 'network',
              status: 'WARNING',
              value: 'INTERMITTENT',
              message: 'Packet loss detected - 15% drop rate',
              icon: 'network',
              lastCheck: now
            }
          ],
          alerts: [
            {
              id: 'alert-1',
              level: 'critical',
              sensor: 'Primary Domain Controller',
              message: 'EMERGENCY: Domain Controller system failure - organization-wide impact',
              timestamp: recentTime,
              acknowledged: false
            },
            {
              id: 'alert-2',
              level: 'critical',
              sensor: 'Secondary Domain Controller',
              message: 'EMERGENCY: Backup DC offline - no failover available',
              timestamp: new Date(recentTime.getTime() + 2 * 60 * 1000),
              acknowledged: false
            },
            {
              id: 'alert-3',
              level: 'critical',
              sensor: 'Primary Storage Array',
              message: 'EMERGENCY: Storage array degraded - data at risk',
              timestamp: new Date(recentTime.getTime() + 1 * 60 * 1000),
              acknowledged: false
            },
            {
              id: 'alert-4',
              level: 'warning',
              sensor: 'Core Network',
              message: 'Network instability detected - investigate immediately',
              timestamp: now,
              acknowledged: false
            }
          ]
        };

      default:
        return {
          scenarioId,
          title: 'Network Monitoring Dashboard',
          sensors: [],
          alerts: []
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP': return CheckCircle;
      case 'DOWN': return XCircle;
      case 'WARNING': return AlertTriangle;
      case 'CRITICAL': return AlertTriangle;
      case 'TIMEOUT': return Clock;
      case 'OFFLINE': return WifiOff;
      default: return CheckCircle;
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'network': return Wifi;
      case 'server': return Server;
      case 'power': return Zap;
      case 'storage': return HardDrive;
      case 'phone': return Phone;
      case 'security': return Shield;
      case 'internet': return Globe;
      default: return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP': return 'text-success bg-success/10 border-success/20';
      case 'DOWN': return 'text-error bg-error/10 border-error/20';
      case 'WARNING': return 'text-warning bg-warning/10 border-warning/20';
      case 'CRITICAL': return 'text-error bg-error/10 border-error/20';
      case 'TIMEOUT': return 'text-warning bg-warning/10 border-warning/20';
      case 'OFFLINE': return 'text-primary-400 bg-primary-400/10 border-primary-400/20';
      default: return 'text-primary-400 bg-primary-400/10 border-primary-400/20';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-error bg-error/10 border-error/30';
      case 'warning': return 'text-warning bg-warning/10 border-warning/30';
      case 'info': return 'text-info bg-info/10 border-info/30';
      default: return 'text-primary-400 bg-primary-400/10 border-primary-400/30';
    }
  };

  const handleSensorClick = (sensor: PRTGSensor) => {
    if (onSensorClick) {
      onSensorClick(sensor);
    }
  };

  if (!scenarioData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-primary-900 border border-primary-700 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-700">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Server className="h-6 w-6 mr-2 text-info" />
              PRTG Network Monitor
            </h2>
            <p className="text-primary-400 text-sm mt-1">{scenarioData.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-primary-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-primary-700">
          <button
            onClick={() => setSelectedTab('sensors')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'sensors' 
                ? 'bg-primary-800 text-white border-b-2 border-info' 
                : 'text-primary-300 hover:text-white hover:bg-primary-800'
            }`}
          >
            Sensors ({scenarioData.sensors.length})
          </button>
          <button
            onClick={() => setSelectedTab('alerts')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              selectedTab === 'alerts' 
                ? 'bg-primary-800 text-white border-b-2 border-info' 
                : 'text-primary-300 hover:text-white hover:bg-primary-800'
            }`}
          >
            Alerts ({scenarioData.alerts.filter(a => !a.acknowledged).length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] scrollbar-thin">
          {selectedTab === 'sensors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarioData.sensors.map((sensor) => {
                const StatusIcon = getStatusIcon(sensor.status);
                const SensorIcon = getSensorIcon(sensor.type);
                
                return (
                  <div
                    key={sensor.id}
                    onClick={() => handleSensorClick(sensor)}
                    className={`bg-primary-800/30 border rounded-lg p-4 cursor-pointer hover:bg-primary-800/50 transition-all ${getStatusColor(sensor.status)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <SensorIcon className="h-5 w-5 text-info" />
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(sensor.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{sensor.status}</span>
                        </div>
                      </div>
                      {sensor.downtime && (
                        <div className="text-xs text-error font-mono">
                          {sensor.downtime}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{sensor.name}</h3>
                    
                    <div className="space-y-2">
                      <div className="text-lg font-bold">{sensor.value}</div>
                      <p className="text-sm text-primary-300 line-clamp-2">{sensor.message}</p>
                      <div className="text-xs text-primary-400 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Last check: {sensor.lastCheck.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedTab === 'alerts' && (
            <div className="space-y-4">
              {scenarioData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${getAlertColor(alert.level)} ${
                    alert.acknowledged ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${getAlertColor(alert.level)}`}>
                          {alert.level}
                        </div>
                        <span className="text-sm font-medium">{alert.sensor}</span>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <div className="text-xs text-primary-400 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp.toLocaleString()}</span>
                        {alert.acknowledged && (
                          <span className="ml-4 text-success">• Acknowledged</span>
                        )}
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <button className="text-xs px-3 py-1 bg-primary-700 hover:bg-primary-600 rounded transition-colors">
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-primary-700 p-4">
          <div className="flex items-center justify-between text-sm text-primary-400">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="text-xs">
              Click sensors for detailed diagnostics • Auto-refresh: 30s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRTGDashboard;
