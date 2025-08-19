# RTP IT Support Training Simulator

A comprehensive, interactive training simulator for IT support professionals, featuring realistic troubleshooting scenarios with decision-based learning paths.

![RTP Simulator](https://img.shields.io/badge/Version-1.0.0-blue)
![Build Status](https://img.shields.io/badge/Build-Passing-green)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple)

## 🚀 Features

- **4 Realistic Scenarios**: Network outage, VPN failures, phone system issues, and emergency L3 incidents
- **Interactive Decision Trees**: Make real-time decisions that affect client mood and scenario outcomes
- **Dual Tool Interface**: Access both PRTG monitoring and PuTTY terminal for authentic troubleshooting
- **Progressive Scoring**: Performance tracking with detailed feedback and improvement suggestions
- **Achievement System**: Earn badges for exceptional performance and methodology
- **PWA Support**: Offline capabilities and mobile-friendly interface
- **State Persistence**: Resume scenarios from where you left off

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

## 🔧 Installation & Setup

### Local Development

```bash
# Clone the repository
git clone https://github.com/GhostengineCEO/RTP-Simulator.git
cd RTP-Simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment Options

### GitHub Pages

1. **Fork the repository**
2. **Enable GitHub Pages** in repository settings
3. **Set source to GitHub Actions**
4. **Push changes** - automatic deployment via GitHub Actions

```bash
# Add GitHub Pages deployment script
npm run build
npm run deploy:gh-pages
```

### Netlify

1. **Connect your repository** to Netlify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy** - automatic deployment on push

The `netlify.toml` configuration file is included for optimal performance.

### Vercel

1. **Connect repository** to Vercel
2. **Configure project**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy** - automatic deployment on push

The `vercel.json` configuration file handles SPA routing and caching.

### Docker Deployment

#### Single Container
```bash
# Build Docker image
docker build -t rtp-simulator .

# Run container
docker run -p 8080:80 rtp-simulator
```

#### Docker Compose
```bash
# Start application
docker-compose up -d

# With reverse proxy
docker-compose --profile proxy up -d

# Stop application
docker-compose down
```

### Static File Hosting

The built application is fully static and can be hosted on:
- **Apache HTTP Server**
- **Nginx**
- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**

Simply upload the contents of the `dist` folder to your hosting provider.

## 🎮 Usage Guide

### Getting Started

1. **Select a Scenario**: Choose from 4 different IT support scenarios
2. **Read the Brief**: Understand the client's problem and severity
3. **Make Decisions**: Choose responses that affect client mood and outcomes
4. **Use Tools**: Access PRTG monitoring and PuTTY terminal when needed
5. **Follow Best Practices**: Systematic troubleshooting leads to better scores
6. **Complete & Review**: Get detailed feedback and suggestions for improvement

### Scenarios Overview

#### 1. Network Outage - Cisco Core Switch
- **Difficulty**: Intermediate
- **Duration**: 30-45 minutes
- **Focus**: Hardware diagnostics, power system troubleshooting
- **Tools**: PRTG + PuTTY

#### 2. Barracuda VPN Connection Failure
- **Difficulty**: Intermediate  
- **Duration**: 20-30 minutes
- **Focus**: Authentication services, failover procedures
- **Tools**: PRTG

#### 3. Mitel Phone System Outage
- **Difficulty**: Intermediate
- **Duration**: 25-35 minutes
- **Focus**: PoE diagnostics, telephony systems
- **Tools**: PRTG + PuTTY

#### 4. L3 Multi-System Cascading Failure
- **Difficulty**: Advanced
- **Duration**: 60+ minutes
- **Focus**: Crisis management, emergency procedures
- **Tools**: PRTG + PuTTY

### Scoring System

- **Efficiency**: Speed of problem identification and resolution
- **Accuracy**: Correct diagnostic steps and tool usage
- **Client Satisfaction**: Managing client mood and communication
- **Tool Utilization**: Proper use of PRTG and PuTTY
- **Escalation Timing**: Knowing when and how to escalate
- **Best Practices**: Following established IT support methodologies

### Achievement Badges

- 🌐 **Network Expert**: Master network troubleshooting
- 🔐 **Security Specialist**: Excel at VPN and authentication issues
- 📞 **Telephony Expert**: Resolve phone system problems efficiently
- 🚨 **Crisis Manager**: Handle organization-wide emergencies
- ⚡ **Swift Resolution**: Complete scenarios under time pressure
- 🛡️ **System Savior**: Prevent complete organizational shutdown

## 🧪 Testing

### Running Tests

```bash
# Run all test scenarios
npm run test:scenarios

# Run specific test types
npm run test:optimal        # Optimal path testing
npm run test:suboptimal    # Suboptimal path testing
npm run test:edge-cases    # Edge case testing

# Generate test report
npm run test:report
```

### Test Coverage

- **Optimal Path Testing**: Verifies perfect troubleshooting methodology
- **Suboptimal Path Testing**: Tests consequences of poor decisions
- **Edge Case Testing**: Validates handling of invalid inputs and rapid interactions
- **Browser Compatibility**: Cross-browser testing for modern browsers
- **Performance Testing**: Load time and responsiveness validation

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Development settings
VITE_APP_TITLE=RTP Simulator
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true

# Analytics (optional)
VITE_ANALYTICS_ID=your-analytics-id
```

### PWA Configuration

The application includes PWA support with:
- **Offline Functionality**: Core features work without internet
- **Install Prompt**: Add to home screen on mobile devices
- **Background Sync**: Save progress even when offline
- **Push Notifications**: Optional scenario reminders

### Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Safari  | 14+            |
| Edge    | 90+            |

## 📁 Project Structure

```
RTP-Simulator/
├── src/
│   ├── components/           # React components
│   │   ├── ChatInterface.tsx      # Client communication
│   │   ├── PRTGDashboard.tsx     # Network monitoring
│   │   ├── TerminalEmulator.tsx  # PuTTY interface
│   │   ├── ScenarioSelection.tsx # Scenario picker
│   │   └── ...
│   ├── data/
│   │   └── scenarios.ts          # Scenario definitions
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── utils/
│   │   ├── stateManager.ts       # Game state logic
│   │   ├── progressSave.ts       # Progress persistence
│   │   └── testingScenarios.ts   # Test automation
│   ├── App.tsx                   # Main application
│   └── main.tsx                  # Application entry
├── public/                       # Static assets
├── docs/                         # Documentation
├── Dockerfile                    # Docker configuration
├── docker-compose.yml           # Multi-container setup
├── netlify.toml                 # Netlify configuration
├── vercel.json                  # Vercel configuration
└── vite.config.ts              # Build configuration
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

#### PWA Not Working
- Ensure HTTPS is enabled in production
- Check service worker registration
- Verify manifest.json accessibility

#### State Not Persisting
- Check browser localStorage limits
- Verify PWA service worker installation
- Clear browser cache and reload

#### Performance Issues
- Enable production build optimizations
- Check network throttling in DevTools
- Verify code splitting is working

### Getting Help

1. **Check Documentation**: Review this README and inline code comments
2. **Search Issues**: Look through existing GitHub issues
3. **Create Issue**: Report bugs with detailed reproduction steps
4. **Contact Support**: Reach out for technical assistance

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with proper TypeScript types
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open Pull Request** with detailed description

### Development Guidelines

- **TypeScript**: Maintain strict type checking
- **ESLint**: Follow established code style
- **Testing**: Add tests for new features
- **Documentation**: Update README for significant changes
- **Performance**: Consider bundle size impact

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IT Support Teams** who inspired realistic scenarios
- **Training Organizations** who provided methodology feedback
- **Open Source Community** for excellent tooling and libraries

## 📞 Support

For technical support or questions:
- **GitHub Issues**: Bug reports and feature requests
- **Email**: support@rtpsimulator.com
- **Documentation**: Comprehensive guides and API docs

---

**Built with ❤️ for IT Support Professionals**

[Website](https://rtpsimulator.com) | [Demo](https://demo.rtpsimulator.com) | [Documentation](https://docs.rtpsimulator.com)
