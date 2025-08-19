# Troubleshooting Guide

This guide covers common issues and solutions for the RTP IT Support Training Simulator.

## 🚨 Common Issues

### Installation & Setup

#### Issue: `npm install` fails with dependency conflicts
```bash
# Solution: Clear cache and use legacy peer deps
npm cache clean --force
npm install --legacy-peer-deps
```

#### Issue: TypeScript compilation errors
```bash
# Solution: Check TypeScript version compatibility
npm install typescript@^5.2.2
npm run type-check
```

#### Issue: Vite dev server won't start
```bash
# Solution: Check port availability and clear cache
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
npm run dev -- --port 3001    # Use different port
```

### Build & Deployment

#### Issue: Build fails with "out of memory" error
```bash
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Issue: PWA service worker not registering
**Symptoms:** App doesn't work offline, no install prompt

**Solutions:**
1. Ensure HTTPS in production
2. Check service worker path in browser DevTools > Application > Service Workers
3. Verify manifest.json is accessible at `/manifest.json`
4. Clear browser cache and hard reload (Ctrl+Shift+R)

```javascript
// Debug service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => console.log('SW registered:', registration))
    .catch(error => console.log('SW registration failed:', error));
}
```

#### Issue: Static assets not loading after deployment
**Symptoms:** 404 errors for JS/CSS files, blank page

**Solutions:**
1. Check base URL in `vite.config.ts`
2. Ensure proper build output structure
3. Verify server configuration for SPA routing

```typescript
// vite.config.ts
export default defineConfig({
  base: './',  // For relative paths
  // OR
  base: '/your-subdirectory/',  // For subdirectory deployment
})
```

### Runtime Issues

#### Issue: Scenarios not loading or stuck
**Symptoms:** Blank scenario screen, infinite loading

**Solutions:**
1. Check browser console for JavaScript errors
2. Clear localStorage: `localStorage.clear()`
3. Verify scenario data integrity
4. Check network requests in DevTools

```javascript
// Debug scenario loading
console.log('Scenarios loaded:', JSON.stringify(scenarios));
localStorage.removeItem('rtp-simulator-state');
location.reload();
```

#### Issue: Progress not saving
**Symptoms:** Scenarios reset on page refresh

**Solutions:**
1. Check localStorage quota: `navigator.storage.estimate()`
2. Verify localStorage is enabled in browser
3. Test in incognito mode to rule out extensions

```javascript
// Test localStorage
try {
  localStorage.setItem('test', 'value');
  localStorage.removeItem('test');
  console.log('localStorage working');
} catch (e) {
  console.error('localStorage blocked:', e);
}
```

#### Issue: Tools (PRTG/PuTTY) not responding
**Symptoms:** Modal doesn't open, no tool interface

**Solutions:**
1. Check for modal backdrop click handlers
2. Verify state management flow
3. Test in different browsers

```javascript
// Debug tool access
console.log('Tool access state:', {
  prtgChecked: state.toolsAccessed.prtgChecked,
  puttyChecked: state.toolsAccessed.puttyChecked
});
```

### Performance Issues

#### Issue: Slow loading times
**Symptoms:** Long initial load, laggy interactions

**Solutions:**
1. Enable production build: `npm run build`
2. Check bundle size: `npm run analyze`
3. Optimize images and assets
4. Enable compression on server

```nginx
# Nginx compression config
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

#### Issue: High memory usage
**Symptoms:** Browser becomes sluggish, tab crashes

**Solutions:**
1. Monitor memory usage in DevTools > Performance
2. Check for memory leaks in event listeners
3. Optimize component re-renders

```javascript
// Monitor memory usage
setInterval(() => {
  if (performance.memory) {
    console.log('Memory:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
    });
  }
}, 5000);
```

## 🔧 Browser-Specific Issues

### Chrome
- **Issue:** Service worker not updating
- **Solution:** DevTools > Application > Service Workers > Update on reload

### Firefox
- **Issue:** PWA install prompt not showing
- **Solution:** Firefox has different PWA criteria, ensure all manifest requirements met

### Safari
- **Issue:** localStorage quota exceeded
- **Solution:** Safari has stricter storage limits, implement storage cleanup

### Edge
- **Issue:** CSS not loading correctly
- **Solution:** Check CSS compatibility, add vendor prefixes if needed

## 🐛 Debugging Tools

### Browser DevTools Checklist
1. **Console**: Check for JavaScript errors
2. **Network**: Verify all resources load (status 200)
3. **Application**: Check localStorage, service worker status
4. **Performance**: Monitor memory and CPU usage
5. **Lighthouse**: Run PWA audit for issues

### Debug Mode
Enable debug mode in development:

```javascript
// Add to localStorage for debug mode
localStorage.setItem('rtp-simulator-debug', 'true');

// Check debug output in console
if (localStorage.getItem('rtp-simulator-debug')) {
  console.log('Debug mode enabled');
}
```

### Test Commands
```bash
# Run comprehensive testing
npm run test:scenarios
npm run test:edge-cases

# Type checking
npm run type-check

# Linting
npm run lint

# Bundle analysis
npm run analyze
```

## 📋 Environment Verification

### Development Environment
```bash
# Check versions
node --version    # Should be 18+
npm --version     # Should be 8+
git --version

# Check project health
npm audit
npm outdated
```

### Production Environment
```bash
# Verify build output
ls -la dist/
du -sh dist/      # Check bundle size

# Test production build locally
npm run preview
```

### Server Requirements
- **HTTP/2**: Recommended for better performance
- **HTTPS**: Required for PWA features
- **Compression**: Gzip/Brotli for static assets
- **Caching**: Proper cache headers for assets

## 🔍 Common Error Messages

### `Module not found: Can't resolve 'xyz'`
```bash
# Solution: Install missing dependency
npm install xyz
# OR update import paths
```

### `Cannot read property of undefined`
```javascript
// Solution: Add null checks
const value = data?.property?.subProperty || defaultValue;
```

### `localStorage is not defined`
```javascript
// Solution: Check if localStorage is available
if (typeof Storage !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### `Failed to register service worker`
```javascript
// Solution: Check service worker scope and HTTPS
if (location.protocol === 'https:' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' });
}
```

## 🆘 Getting Help

If you can't resolve an issue:

1. **Search existing issues** on GitHub
2. **Create detailed bug report** with:
   - Browser and version
   - Node.js version
   - Steps to reproduce
   - Console error messages
   - Screenshots if applicable
3. **Include environment details**:
   ```bash
   # Generate environment report
   npx envinfo --system --browsers --npmPackages
   ```

## 📞 Support Escalation

For critical production issues:
1. **Check status page** for known issues
2. **Contact support** with incident details
3. **Provide logs** and error traces
4. **Document workarounds** for team

---

**Remember**: Most issues are environmental. Test in a clean environment (incognito mode, different browser) to isolate the problem.
