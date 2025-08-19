import React, { useState, useEffect } from 'react';
import { X, Wifi, Server, Router, Printer, Monitor as MonitorIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { NetworkDevice } from '../types';

interface NetworkMonitorProps {
  onClose: () => void;
}

const NetworkMonitor: React.FC<NetworkMonitorProps> = ({ onClose }) => {
  const [devices, setDevices] = useState<NetworkDevice[]>([
    {
      id: '1',
      name: 'Domain Controller',
      type: 'server',
      ip: '192.168.1.10',
      status: 'online',
      uptime: '15d 8h 23m',
      cpu: 45,
      memory: 62,
      ping: 2
    },
    {
      id: '2',
      name: 'File Server',
      type: 'server',
      ip: '192.168.1.11',
      status: 'warning',
      uptime: '7d 2h 15m',
      cpu: 85,
      memory: 78,
      ping: 15
    },
    {
      id: '3',
      name: 'Main Switch',
      type: 'switch',
      ip: '192.168.1.1',
      status: 'online',
      uptime: '45d 12h 5m',
      cpu: 25,
      memory: 35,
      ping: 1
    },
    {
      id: '4',
      name: 'Edge Router',
      type: 'router',
      ip: '192.168.1.2',
      status: 'critical',
      uptime: '0d 0h 12m',
      cpu: 95,
      memory: 89,
      ping: 150
    },
    {
      id: '5',
      name: 'Accounting Printer',
      type: 'printer',
      ip: '192.168.1.50',
      status: 'offline',
      uptime: 'Offline',
      cpu: 0,
      memory: 0,
      ping: 0
    },
    {
      id: '6',
      name: 'User Workstation #1',
      type: 'workstation',
      ip: '192.168.1.100',
      status: 'online',
      uptime: '2d 4h 35m',
      cpu: 35,
      memory: 55,
      ping: 5
    }
  ]);

  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => ({
          ...device,
          cpu: Math.max(0, Math.min(100, device.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, device.memory + (Math.random() - 0.5) * 5)),
          ping: device.status !== 'offline' ? Math.max(1, device.ping + (Math.random() - 0.5) * 20) : 0
        }))
      );
    }, 3000);

    setRefreshInterval(interval as unknown as number);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'critical': return 'text-error bg-error/10';
      case 'offline': return 'text-primary-400 bg-primary-400/10';
      default: return 'text-primary-400 bg-primary-400/10';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'switch': return Wifi;
      case 'router': return Router;
      case 'printer': return Printer;
      case 'workstation': return MonitorIcon;
      default: return MonitorIcon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'offline': return X;
      default: return CheckCircle;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-primary-900 border border-primary-700 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-700">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <MonitorIcon className="h-6 w-6 mr-2 text-info" />
              PRTG Network Monitor
            </h2>
            <p className="text-primary-400 text-sm mt-1">Real-time network monitoring dashboard</p>
          </div>
          <button
            onClick={onClose}
            className="text-primary-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-thin">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success">
                    {devices.filter(d => d.status === 'online').length}
                  </div>
                  <div className="text-primary-300 text-sm">Online</div>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>

            <div className="bg-primary-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {devices.filter(d => d.status === 'warning').length}
                  </div>
                  <div className="text-primary-300 text-sm">Warning</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </div>

            <div className="bg-primary-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-error">
                    {devices.filter(d => d.status === 'critical').length}
                  </div>
                  <div className="text-primary-300 text-sm">Critical</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-error" />
              </div>
            </div>

            <div className="bg-primary-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary-300">
                    {devices.filter(d => d.status === 'offline').length}
                  </div>
                  <div className="text-primary-300 text-sm">Offline</div>
                </div>
                <X className="h-8 w-8 text-primary-300" />
              </div>
            </div>
          </div>

          {/* Device List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Network Devices</h3>
            
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              const StatusIcon = getStatusIcon(device.status);
              
              return (
                <div key={device.id} className="bg-primary-800/30 border border-primary-700 rounded-lg p-4 hover:bg-primary-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <DeviceIcon className="h-6 w-6 text-info" />
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-primary-400">{device.ip}</div>
                        </div>
                      </div>
                      
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(device.status)}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium capitalize">{device.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="text-primary-400">Uptime</div>
                        <div className="font-medium">{device.uptime}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-primary-400">CPU</div>
                        <div className="font-medium">{device.cpu.toFixed(0)}%</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-primary-400">Memory</div>
                        <div className="font-medium">{device.memory.toFixed(0)}%</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-primary-400">Ping</div>
                        <div className="font-medium">{device.ping.toFixed(0)}ms</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>CPU Usage</span>
                        <span>{device.cpu.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-primary-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            device.cpu > 80 ? 'bg-error' : 
                            device.cpu > 60 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${device.cpu}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Memory Usage</span>
                        <span>{device.memory.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-primary-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            device.memory > 80 ? 'bg-error' : 
                            device.memory > 60 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${device.memory}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-primary-700 p-4">
          <div className="flex items-center justify-between text-sm text-primary-400">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            <div>Auto-refresh: 3s</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitor;
