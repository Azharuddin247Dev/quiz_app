// Real-time sync functionality using JSONBin.io for cross-device sync
class QuizSync {
    constructor() {
        this.sessionId = null;
        this.isHost = false;
        this.participants = new Map();
        this.results = [];
        this.isListening = false;
        this.apiUrl = 'https://api.jsonbin.io/v3/b';
        this.apiKey = '$2a$10$8K9wX2vN5qL3mR7pT1uY8eH6jF4sA9dC2bE5gI8kM0nP3rV6wZ1yX'; // Demo key
        console.log('QuizSync initialized with JSONBin.io');
    }

    async apiRequest(method, url, data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': this.apiKey
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            // Fallback to localStorage
            return this.localStorageFallback(method, url, data);
        }
    }
    
    localStorageFallback(method, url, data) {
        const key = `quiz_session_${this.sessionId}`;
        
        if (method === 'POST' || method === 'PUT') {
            localStorage.setItem(key, JSON.stringify(data));
            return { record: data };
        } else if (method === 'GET') {
            const stored = localStorage.getItem(key);
            return stored ? { record: JSON.parse(stored) } : null;
        }
        return null;
    }

    // Create a new quiz session
    async createSession() {
        this.sessionId = this.generateSessionId();
        this.isHost = true;
        
        const user = this.getCurrentUser();
        const sessionData = {
            sessionId: this.sessionId,
            host: user,
            created: Date.now(),
            participants: { [user.id]: user },
            results: {},
            status: 'active',
            lastUpdate: Date.now()
        };

        try {
            const response = await this.apiRequest('POST', this.apiUrl, sessionData);
            this.binId = response.metadata?.id;
            console.log('Session created:', this.sessionId, 'Bin ID:', this.binId);
        } catch (error) {
            console.log('Using localStorage fallback for session creation');
        }
        
        this.startListening();
        return this.sessionId;
    }

    // Join an existing session
    async joinSession(sessionId) {
        this.sessionId = sessionId;
        this.isHost = false;
        
        // Try to find session in online storage first
        let sessionData = null;
        
        try {
            // Search for session (simplified - in real app would use proper session lookup)
            const response = await this.apiRequest('GET', `${this.apiUrl}/${sessionId}`);
            sessionData = response?.record;
        } catch (error) {
            console.log('Trying localStorage fallback');
        }
        
        // Fallback to localStorage
        if (!sessionData) {
            sessionData = JSON.parse(localStorage.getItem(`quiz_session_${sessionId}`) || 'null');
        }
        
        if (!sessionData) {
            throw new Error('Session not found. Make sure the Session ID is correct and the session exists.');
        }
        
        const user = this.getCurrentUser();
        sessionData.participants[user.id] = user;
        sessionData.lastUpdate = Date.now();
        
        // Update both online and local storage
        try {
            if (this.binId) {
                await this.apiRequest('PUT', `${this.apiUrl}/${this.binId}`, sessionData);
            }
        } catch (error) {
            console.log('Online update failed, using localStorage');
        }
        
        localStorage.setItem(`quiz_session_${sessionId}`, JSON.stringify(sessionData));
        console.log('Joined session:', sessionId, user);
        
        this.startListening();
        return true;
    }

    // Submit quiz results
    async submitResults(results) {
        if (!this.sessionId) {
            console.log('No session ID, cannot submit results');
            return;
        }

        const user = this.getCurrentUser();
        const resultData = {
            userId: user.id,
            userName: user.name,
            score: results.score,
            totalQuestions: results.total,
            percentage: results.percentage,
            completedAt: Date.now(),
            answers: results.answers || []
        };

        // Get current session data
        let sessionData = JSON.parse(localStorage.getItem(`quiz_session_${this.sessionId}`) || '{}');
        
        if (!sessionData.results) sessionData.results = {};
        sessionData.results[user.id] = resultData;
        sessionData.lastUpdate = Date.now();
        
        // Update both online and local storage
        try {
            if (this.binId) {
                await this.apiRequest('PUT', `${this.apiUrl}/${this.binId}`, sessionData);
            }
        } catch (error) {
            console.log('Online update failed, using localStorage only');
        }
        
        localStorage.setItem(`quiz_session_${this.sessionId}`, JSON.stringify(sessionData));
        console.log('Results submitted:', resultData);
        
        // Update local display immediately
        this.handleStorageUpdate(sessionData);
    }

    // Get all results from session
    async getSessionResults() {
        if (!this.sessionId) return [];

        if (this.useLocalStorage) {
            const sessionData = JSON.parse(localStorage.getItem(`quiz_session_${this.sessionId}`) || '{}');
            return Object.values(sessionData.results || {});
        } else {
            const snapshot = await this.database.ref(`sessions/${this.sessionId}/results`).once('value');
            return Object.values(snapshot.val() || {});
        }
    }

    // Start listening for real-time updates
    startListening() {
        if (this.isListening) return;
        
        this.isListening = true;
        console.log('Started listening for session:', this.sessionId);
        
        // Poll for changes every 1 second
        this.pollInterval = setInterval(() => {
            this.checkForUpdates();
        }, 1000);
        
        // Initial load
        this.checkForUpdates();
    }

    // Check for updates
    async checkForUpdates() {
        if (!this.sessionId) return;
        
        let sessionData = null;
        
        // Try to get latest data from online storage first
        try {
            if (this.binId) {
                const response = await this.apiRequest('GET', `${this.apiUrl}/${this.binId}`);
                sessionData = response?.record;
            }
        } catch (error) {
            // Fallback to localStorage
        }
        
        // Fallback to localStorage if online fails
        if (!sessionData) {
            sessionData = JSON.parse(localStorage.getItem(`quiz_session_${this.sessionId}`) || '{}');
        }
        
        const currentResults = Object.values(sessionData.results || {});
        
        // Check if results changed
        const currentCount = currentResults.length;
        const previousCount = this.results.length;
        
        if (currentCount !== previousCount || this.hasResultsChanged(currentResults)) {
            console.log('Results updated:', currentResults);
            this.results = currentResults;
            this.updateResultsDisplay();
            
            // Show notification for new results
            if (currentCount > previousCount) {
                const newResult = currentResults[currentResults.length - 1];
                if (newResult && newResult.userName !== this.getCurrentUser().name) {
                    this.showNotification(`${newResult.userName} completed the quiz! Score: ${newResult.percentage}%`);
                }
            }
        }
    }
    
    // Check if results have changed
    hasResultsChanged(newResults) {
        if (newResults.length !== this.results.length) return true;
        
        for (let i = 0; i < newResults.length; i++) {
            const newResult = newResults[i];
            const oldResult = this.results.find(r => r.userId === newResult.userId);
            if (!oldResult || oldResult.completedAt !== newResult.completedAt) {
                return true;
            }
        }
        return false;
    }
    
    // Handle storage updates from other tabs
    handleStorageUpdate(sessionData) {
        const currentResults = Object.values(sessionData.results || {});
        if (this.hasResultsChanged(currentResults)) {
            this.results = currentResults;
            this.updateResultsDisplay();
        }
    }
    
    // Store bin ID for session
    setBinId(binId) {
        this.binId = binId;
        localStorage.setItem(`quiz_bin_${this.sessionId}`, binId);
    }
    
    // Get bin ID for session
    getBinId() {
        return this.binId || localStorage.getItem(`quiz_bin_${this.sessionId}`);
    }



    // Update the results display
    updateResultsDisplay() {
        const container = document.getElementById('live-results');
        if (!container) return;

        const sortedResults = this.results.sort((a, b) => b.percentage - a.percentage);
        
        let html = '<h3>🔴 Live Results</h3>';
        if (sortedResults.length === 0) {
            html += '<p>Waiting for participants to complete the quiz...</p>';
        } else {
            html += '<div class="live-results-list">';
            sortedResults.forEach((result, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
                html += `
                    <div class="live-result-item ${index === 0 ? 'winner' : ''}">
                        <span class="rank">${medal}</span>
                        <span class="name">${result.userName}</span>
                        <span class="score">${result.score}/${result.totalQuestions}</span>
                        <span class="percentage">${result.percentage}%</span>
                        <span class="time">${new Date(result.completedAt).toLocaleTimeString()}</span>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        container.innerHTML = html;
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'sync-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Generate session ID
    generateSessionId() {
        return Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // Get current user info
    getCurrentUser() {
        const userId = localStorage.getItem('quiz_user_id') || this.generateUserId();
        localStorage.setItem('quiz_user_id', userId);
        
        return {
            id: userId,
            name: playerName || 'Anonymous',
            joinedAt: Date.now()
        };
    }

    // Generate user ID
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    // Get shareable link
    getShareableLink() {
        if (!this.sessionId) return null;
        return `${window.location.origin}${window.location.pathname}?session=${this.sessionId}`;
    }

    // Stop listening
    stopListening() {
        this.isListening = false;
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        console.log('Stopped listening');
    }
}

// Initialize sync
const quizSync = new QuizSync();
