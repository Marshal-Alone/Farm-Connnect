# Complete Keep-Alive Implementation Guide for Vercel + Render Deployment

## 📋 Table of Contents
1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Complete Implementation](#complete-implementation)
4. [Files Modified/Created](#files-modifiedcreated)
5. [Troubleshooting](#troubleshooting)
6. [Testing Guide](#testing-guide)

---

## 🎯 Problem Statement

### The Issue
When deploying a full-stack application with:
- **Frontend**: Hosted on Vercel (always active)
- **Backend**: Hosted on Render Free Tier (shuts down after 15 minutes of inactivity)

**Problem**: When a user visits the frontend after the backend has been inactive for 15+ minutes, the backend takes **10-15 minutes** to wake up (cold start), resulting in poor user experience.

### Root Cause
Render's free tier automatically spins down services after **15 minutes of inactivity** to save resources. The wake-up process (cold start) is slow because:
1. Server needs to restart
2. Dependencies need to reload
3. Database connections need to re-establish

### The Goal
Implement a keep-alive mechanism that:
1. Starts pinging the backend **immediately** when any user visits the frontend
2. Keeps the backend warm with regular pings
3. Works automatically without user interaction
4. Is smart about resource usage

---

## 💡 Solution Overview

### Strategy: Two-Tier Aggressive Keep-Alive System

```
┌─────────────────────────────────────────────────────────────┐
│                    User Visits Frontend                      │
│                    (Hosted on Vercel)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           keepalive.js loads automatically                   │
│           (included in ALL HTML pages)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│        IMMEDIATE ping sent to backend                        │
│        (Starts waking up Render server)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Aggressive Mode: 2-minute pings                 │
│              (First 3 successful pings)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            Maintenance Mode: 4-minute pings                  │
│            (Keeps server warm after it's active)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Complete Implementation

### Step 1: Create/Update `keepalive.js`

**Location**: `frontend/keepalive.js`

**Full Code**:

```javascript
// Keep-Alive Service for maintaining server activity
class KeepAliveService {
    constructor(config = {}) {
        // More aggressive ping intervals to prevent Render shutdown
        this.shortInterval = config.shortInterval || 2 * 60 * 1000; // 2 minutes for frequent pings
        this.longInterval = config.longInterval || 4 * 60 * 1000;  // 4 minutes for maintenance pings
        this.currentInterval = this.shortInterval; // Start with frequent pings
        
        // Determine API URL dynamically
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.apiUrl = isLocalhost 
            ? 'http://localhost:5050' 
            : 'https://collaborative-whiteboard-i6ri.onrender.com'; // REPLACE WITH YOUR RENDER URL
        
        this.pingEndpoint = `${this.apiUrl}/api/ping`;
        this.healthEndpoint = `${this.apiUrl}/api/health`;
        this.timerId = null;
        this.isActive = false;
        this.lastPingTime = null;
        this.nextPingTime = null;
        this.consecutiveSuccesses = 0;
        this.callbacks = {
            onPing: [],
            onError: [],
            onHealthUpdate: []
        };
        
        console.log('[KeepAlive] Service initialized');
        console.log('[KeepAlive] API URL:', this.apiUrl);
        console.log('[KeepAlive] Short interval:', this.shortInterval / 1000, 'seconds');
        console.log('[KeepAlive] Long interval:', this.longInterval / 1000, 'seconds');
    }

    // Start the keep-alive pings
    start() {
        if (this.isActive) {
            console.log('[KeepAlive] Service already running');
            return;
        }

        this.isActive = true;
        console.log('[KeepAlive] Service started with aggressive wake-up strategy');

        // Send initial ping immediately to wake up the server
        this.ping();

        // Set up recurring pings with current interval
        this.scheduleNextPing();
    }

    // Stop the keep-alive pings
    stop() {
        if (!this.isActive) {
            console.log('[KeepAlive] Service already stopped');
            return;
        }

        this.isActive = false;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        console.log('[KeepAlive] Service stopped');
    }

    // Schedule the next ping based on current interval
    scheduleNextPing() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        
        this.timerId = setTimeout(() => {
            if (this.isActive) {
                this.ping();
            }
        }, this.currentInterval);
    }

    // Send a ping to the server
    async ping() {
        const startTime = Date.now();
        
        try {
            const response = await fetch(this.pingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Add timeout to detect slow cold starts
                signal: AbortSignal.timeout(30000) // 30 second timeout for cold starts
            });

            if (!response.ok) {
                throw new Error(`Ping failed with status: ${response.status}`);
            }

            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            this.lastPingTime = Date.now();
            this.nextPingTime = Date.now() + this.currentInterval;
            this.consecutiveSuccesses++;

            // Log response time to detect cold starts
            if (responseTime > 5000) {
                console.log(`[KeepAlive] Ping successful (server was cold, took ${(responseTime/1000).toFixed(1)}s)`);
            } else {
                console.log(`[KeepAlive] Ping successful (${responseTime}ms)`);
            }

            // After 3 successful pings, switch to longer interval
            if (this.consecutiveSuccesses >= 3 && this.currentInterval === this.shortInterval) {
                this.currentInterval = this.longInterval;
                console.log('[KeepAlive] Server warmed up, switching to maintenance interval:', this.longInterval / 1000, 'seconds');
            }

            // Trigger callbacks
            this.callbacks.onPing.forEach(callback => callback(data));

            // Schedule next ping
            if (this.isActive) {
                this.scheduleNextPing();
            }

        } catch (error) {
            const responseTime = Date.now() - startTime;
            console.error(`[KeepAlive] Ping failed after ${(responseTime/1000).toFixed(1)}s:`, error.message);
            
            // Reset to short interval on error (server might be sleeping)
            this.consecutiveSuccesses = 0;
            this.currentInterval = this.shortInterval;
            
            // Trigger error callbacks
            this.callbacks.onError.forEach(callback => callback(error));
            
            // Retry after short interval
            if (this.isActive) {
                this.scheduleNextPing();
            }
        }
    }

    // Get current health status from server
    async getHealth() {
        try {
            const response = await fetch(this.healthEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Health check failed with status: ${response.status}`);
            }

            const healthData = await response.json();
            
            // Trigger health update callbacks
            this.callbacks.onHealthUpdate.forEach(callback => callback(healthData));

            return healthData;

        } catch (error) {
            console.error('[KeepAlive] Health check failed:', error);
            this.callbacks.onError.forEach(callback => callback(error));
            return null;
        }
    }

    // Register callback for ping events
    onPing(callback) {
        this.callbacks.onPing.push(callback);
    }

    // Register callback for error events
    onError(callback) {
        this.callbacks.onError.push(callback);
    }

    // Register callback for health updates
    onHealthUpdate(callback) {
        this.callbacks.onHealthUpdate.push(callback);
    }

    // Get service status
    getStatus() {
        return {
            isActive: this.isActive,
            currentInterval: this.currentInterval,
            shortInterval: this.shortInterval,
            longInterval: this.longInterval,
            lastPingTime: this.lastPingTime,
            nextPingTime: this.nextPingTime,
            consecutiveSuccesses: this.consecutiveSuccesses
        };
    }
}

// Create a global instance with configuration
window.keepAliveService = new KeepAliveService({
    shortInterval: 2 * 60 * 1000,  // 2 minutes - aggressive wake-up
    longInterval: 4 * 60 * 1000    // 4 minutes - keep server warm
});

// Function to start the service
function startKeepAlive() {
    if (!window.keepAliveService.isActive) {
        window.keepAliveService.start();
        console.log('[KeepAlive] Service started automatically');
    }
}

// Auto-start when page loads
document.addEventListener('DOMContentLoaded', startKeepAlive);

// Also start immediately if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startKeepAlive();
}

// Restart on page visibility change (when user comes back to the tab)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.keepAliveService) {
        if (!window.keepAliveService.isActive) {
            window.keepAliveService.start();
            console.log('[KeepAlive] Restarted on visibility change');
        } else {
            // Send an immediate ping when user returns
            window.keepAliveService.ping();
            console.log('[KeepAlive] Immediate ping on visibility change');
        }
    }
});
```

**⚠️ IMPORTANT**: Replace `https://collaborative-whiteboard-i6ri.onrender.com` with your actual Render backend URL.

---

### Step 2: Add Script to ALL HTML Pages

You need to include `<script src="keepalive.js"></script>` in the `<head>` section of every HTML page.

**Example for `index.html`**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Your App</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles.css" />
    <script src="keepalive.js"></script> <!-- ADD THIS LINE -->
    <script type="module" src="script.js"></script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

**Pages to Update**:
- ✅ `index.html`
- ✅ `auth.html`
- ✅ `login.html` (if standalone)
- ✅ `register.html` (if standalone)
- ✅ `board.html`
- ✅ `health.html`
- ✅ Any other HTML pages

---

### Step 3: Add Backend Endpoints

**Location**: `backend/server.js`

Add these endpoints BEFORE `server.listen()`:

```javascript
// Keep-alive tracking
const serverHealth = {
    startTime: Date.now(),
    lastPing: Date.now(),
    nextPing: Date.now() + (10 * 60 * 1000), // 10 minutes
    pingCount: 0,
    pingInterval: 10 * 60 * 1000, // 10 minutes in milliseconds
    status: 'active'
};

// Keep-alive ping endpoint
app.post("/api/ping", (req, res) => {
    serverHealth.lastPing = Date.now();
    serverHealth.nextPing = Date.now() + serverHealth.pingInterval;
    serverHealth.pingCount++;
    serverHealth.status = 'active';
    
    console.log(`Keep-alive ping received (#${serverHealth.pingCount})`);
    
    res.status(200).json({
        message: "Pong",
        timestamp: serverHealth.lastPing,
        nextPing: serverHealth.nextPing
    });
});

// Health dashboard endpoint
app.get("/api/health", (req, res) => {
    const now = Date.now();
    const uptime = now - serverHealth.startTime;
    const timeSinceLastPing = now - serverHealth.lastPing;
    const timeUntilNextPing = serverHealth.nextPing - now;
    
    // Calculate uptime in a human-readable format
    const uptimeSeconds = Math.floor(uptime / 1000);
    const uptimeDays = Math.floor(uptimeSeconds / 86400);
    const uptimeHours = Math.floor((uptimeSeconds % 86400) / 3600);
    const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeSecsRemaining = uptimeSeconds % 60;
    
    res.status(200).json({
        status: serverHealth.status,
        uptime: {
            milliseconds: uptime,
            formatted: `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSecsRemaining}s`
        },
        lastPing: {
            timestamp: serverHealth.lastPing,
            ago: timeSinceLastPing,
            formatted: formatDuration(timeSinceLastPing)
        },
        nextPing: {
            timestamp: serverHealth.nextPing,
            in: Math.max(0, timeUntilNextPing),
            formatted: formatDuration(Math.max(0, timeUntilNextPing))
        },
        pingCount: serverHealth.pingCount,
        pingInterval: {
            milliseconds: serverHealth.pingInterval,
            formatted: formatDuration(serverHealth.pingInterval)
        },
        startTime: serverHealth.startTime
    });
});

// Helper function to format duration
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}
```

---

## 📁 Files Modified/Created

### Created Files
1. ✅ `frontend/keepalive.js` - Main keep-alive service
2. ✅ `KEEPALIVE_STRATEGY.md` - Strategy documentation
3. ✅ `KEEPALIVE_IMPLEMENTATION_GUIDE.md` - This file

### Modified Files
1. ✅ `frontend/index.html` - Added keepalive.js script
2. ✅ `frontend/auth.html` - Added keepalive.js script
3. ✅ `frontend/board.html` - Already had it
4. ✅ `frontend/health.html` - Added keepalive.js script
5. ✅ `frontend/page2.html` - Added keepalive.js script
6. ✅ `backend/server.js` - Added /api/ping and /api/health endpoints

---

## 🐛 Troubleshooting

### Issue 1: "keepalive.js not found" Error
**Cause**: Script path is incorrect  
**Solution**: 
- Ensure `keepalive.js` is in the `frontend/` directory
- Use relative path: `<script src="keepalive.js"></script>`
- For subdirectories, use: `<script src="../keepalive.js"></script>`

### Issue 2: Pings Not Sending
**Cause**: Script not loading or API URL incorrect  
**Solution**:
1. Open browser console (F12)
2. Check for errors
3. Verify console shows: `[KeepAlive] Service initialized`
4. Verify API URL matches your Render backend URL

### Issue 3: CORS Errors
**Cause**: Backend not configured for CORS  
**Solution**: Add to `backend/server.js` BEFORE routes:
```javascript
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});
```

### Issue 4: Server Still Sleeping
**Cause**: Intervals too long  
**Solution**:
- Reduce shortInterval to 90 seconds (90 * 1000)
- Reduce longInterval to 3 minutes (3 * 60 * 1000)

### Issue 5: Duplicate Script Errors
**Cause**: Script included multiple times  
**Solution**: Search all HTML files for `keepalive.js` and ensure it's only included once per file

---

## 🧪 Testing Guide

### Local Testing

1. **Start Backend**:
```bash
cd backend
npm start
```

2. **Open Frontend**:
```bash
# In browser, open: http://localhost:5050
```

3. **Check Console**:
```
[KeepAlive] Service initialized
[KeepAlive] API URL: http://localhost:5050
[KeepAlive] Short interval: 120 seconds
[KeepAlive] Long interval: 240 seconds
[KeepAlive] Service started with aggressive wake-up strategy
[KeepAlive] Ping successful (45ms)
```

### Production Testing

1. **Deploy to Render + Vercel**

2. **Wait 15+ Minutes** (let Render server go cold)

3. **Visit Vercel URL** in browser

4. **Open Console** (F12):
```
[KeepAlive] Service initialized
[KeepAlive] API URL: https://your-app.onrender.com
[KeepAlive] Service started with aggressive wake-up strategy
[KeepAlive] Ping successful (server was cold, took 14.2s)
[KeepAlive] Ping successful (523ms)
[KeepAlive] Ping successful (401ms)
[KeepAlive] Server warmed up, switching to maintenance interval: 240 seconds
```

### Testing Interval Switching

1. Open browser console
2. Run: `window.keepAliveService.getStatus()`
3. Expected output:
```javascript
{
    isActive: true,
    currentInterval: 240000,  // 4 minutes after 3 successful pings
    shortInterval: 120000,
    longInterval: 240000,
    lastPingTime: 1697889123456,
    nextPingTime: 1697889363456,
    consecutiveSuccesses: 3
}
```

---

## ⚙️ Configuration Options

### Adjusting Ping Intervals

In `keepalive.js`, modify the constructor call:

```javascript
window.keepAliveService = new KeepAliveService({
    shortInterval: 90 * 1000,   // 90 seconds (more aggressive)
    longInterval: 3 * 60 * 1000 // 3 minutes (more frequent maintenance)
});
```

**Recommendations**:
- **Very Aggressive**: shortInterval: 60s, longInterval: 2min
- **Balanced** (default): shortInterval: 2min, longInterval: 4min
- **Conservative**: shortInterval: 3min, longInterval: 5min

**⚠️ Warning**: Too aggressive pinging may hit Render rate limits.

---

## 📊 How It Works - Detailed Flow

### 1. Page Load
```
User opens page
    ↓
HTML loads keepalive.js
    ↓
DOMContentLoaded event fires
    ↓
startKeepAlive() function called
    ↓
KeepAliveService.start() executed
    ↓
Immediate ping sent to backend
```

### 2. First Ping (Cold Start)
```
fetch('https://your-render-app.com/api/ping')
    ↓
Render detects incoming request
    ↓
Server starts waking up (10-15 seconds)
    ↓
Response received
    ↓
Console: "Ping successful (server was cold, took 14.2s)"
    ↓
Schedule next ping in 2 minutes (shortInterval)
```

### 3. Subsequent Pings
```
2 minutes pass
    ↓
scheduleNextPing() timer fires
    ↓
ping() method called
    ↓
Server responds quickly (<500ms)
    ↓
consecutiveSuccesses++
    ↓
If consecutiveSuccesses >= 3:
    Switch to longInterval (4 minutes)
    ↓
Schedule next ping in 4 minutes
```

### 4. Error Recovery
```
Ping fails (server sleeping or network error)
    ↓
consecutiveSuccesses = 0
    ↓
currentInterval = shortInterval (2 minutes)
    ↓
Retry ping in 2 minutes
    ↓
Continue aggressive pinging until stable
```

---

## 🔍 Common Mistakes & Solutions

### Mistake 1: Hardcoded URLs
❌ **Wrong**:
```javascript
this.apiUrl = 'https://my-app.onrender.com';
```

✅ **Correct**:
```javascript
const isLocalhost = window.location.hostname === 'localhost';
this.apiUrl = isLocalhost 
    ? 'http://localhost:5050' 
    : 'https://my-app.onrender.com';
```

### Mistake 2: Not Including in All Pages
❌ **Wrong**: Only including in `index.html`

✅ **Correct**: Include in EVERY HTML page that users might visit

### Mistake 3: Wrong Script Order
❌ **Wrong**:
```html
<script type="module" src="script.js"></script>
<script src="keepalive.js"></script>
```

✅ **Correct**:
```html
<script src="keepalive.js"></script>
<script type="module" src="script.js"></script>
```

### Mistake 4: Missing Backend Endpoints
❌ **Wrong**: Frontend has keepalive.js but backend has no `/api/ping` endpoint

✅ **Correct**: Backend MUST have both `/api/ping` (POST) and `/api/health` (GET) endpoints

---

## 📈 Performance Impact

### Network Usage
- **2-minute pings**: ~30 pings/hour = ~720 pings/day
- **4-minute pings**: ~15 pings/hour = ~360 pings/day
- **Payload size**: ~100 bytes per ping (minimal)

### Server Load
- Each ping = 1 simple HTTP request
- Processing time: <10ms
- Memory impact: Negligible
- CPU impact: Minimal

### User Impact
- **Zero user interaction required**
- **Transparent operation**
- **No performance degradation**
- **No visible UI changes**

---

## 🎯 Success Criteria

✅ Server wakes up within **15-20 seconds** when user visits frontend  
✅ Server stays active during user session  
✅ Console shows successful pings every 2-4 minutes  
✅ No CORS errors  
✅ No 404 errors on /api/ping  
✅ Health dashboard shows accurate statistics  

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] `keepalive.js` created in frontend directory
- [ ] Script included in ALL HTML pages
- [ ] Render backend URL updated in keepalive.js
- [ ] `/api/ping` endpoint added to backend
- [ ] `/api/health` endpoint added to backend
- [ ] CORS configured in backend
- [ ] Tested locally
- [ ] Deployed to Vercel (frontend)
- [ ] Deployed to Render (backend)
- [ ] Verified pings in browser console
- [ ] Tested cold start scenario
- [ ] Health dashboard accessible

---

## 🚀 Quick Start for New Project

1. **Copy Files**:
   - Copy `keepalive.js` to new project's `frontend/` directory

2. **Update Configuration**:
   - Open `keepalive.js`
   - Replace Render URL with new backend URL:
     ```javascript
     this.apiUrl = isLocalhost 
         ? 'http://localhost:YOUR_PORT' 
         : 'https://your-new-app.onrender.com';
     ```

3. **Add Script to HTML**:
   ```html
   <script src="keepalive.js"></script>
   ```

4. **Add Backend Endpoints**:
   - Copy `/api/ping` and `/api/health` endpoints to `server.js`
   - Copy `formatDuration()` helper function
   - Copy `serverHealth` object

5. **Deploy & Test**:
   - Deploy frontend to Vercel
   - Deploy backend to Render
   - Visit frontend URL
   - Check console for ping logs

---

## 📞 Support & Maintenance

### Monitoring
- Check `/health` endpoint regularly
- Monitor console logs in production
- Watch for failed pings

### Adjustments
If server still goes cold:
1. Reduce `shortInterval` to 90 seconds
2. Reduce `longInterval` to 3 minutes
3. Keep `consecutiveSuccesses` threshold at 3

### Updates
When backend URL changes:
1. Update `keepalive.js` line ~13
2. Redeploy frontend
3. Clear browser cache

---

## ✨ Advanced Features (Optional)

### Feature 1: Retry with Exponential Backoff
```javascript
async ping() {
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
        try {
            // ... ping logic ...
            break;
        } catch (error) {
            retries++;
            await new Promise(resolve => 
                setTimeout(resolve, 1000 * Math.pow(2, retries))
            );
        }
    }
}
```

### Feature 2: Ping Only During Business Hours
```javascript
function shouldPing() {
    const hour = new Date().getHours();
    return hour >= 8 && hour <= 22; // 8 AM to 10 PM
}
```

### Feature 3: Regional Detection
```javascript
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// Adjust intervals based on timezone
```

---

## 📖 References

- [Render Free Tier Limitations](https://render.com/docs/free)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Fetch API Timeout](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout)
- [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-18  
**Author**: AI Assistant  
**Project**: Collaboard Keep-Alive Implementation
