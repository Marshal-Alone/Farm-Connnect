// Keep-Alive Service for maintaining server activity
class KeepAliveService {
    constructor(config = {}) {
        // More aggressive ping intervals to prevent Render shutdown
        this.shortInterval = config.shortInterval || 2 * 60 * 1000; // 2 minutes for frequent pings
        this.longInterval = config.longInterval || 4 * 60 * 1000;  // 4 minutes for maintenance pings
        this.currentInterval = this.shortInterval; // Start with frequent pings
        
        // Determine API URL dynamically
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        // Backend is always on Render, even when frontend is on Vercel
        this.apiUrl = isLocalhost 
            ? 'http://localhost:4173' 
            : 'https://farm-connnect.onrender.com'; // Render backend URL
        
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
