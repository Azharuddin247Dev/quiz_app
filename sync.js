// Real-time sync functionality using localStorage with cross-tab communication
class QuizSync {
    constructor() {
        this.sessionId = null;
        this.isHost = false;
        this.participants = new Map();
        this.results = [];
        this.useLocalStorage = true;
        this.isListening = false;
        console.log('QuizSync initialized with localStorage');
        this.setupStorageListener();
    }

    setupStorageListener() {
        // Listen for storage changes across tabs/devices
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('quiz_session_') && e.newValue) {
                const sessionId = e.key.replace('quiz_session_', '');
                if (sessionId === this.sessionId) {
                    console.log('Session data updated:', e.newValue);
                    this.handleStorageUpdate(JSON.parse(e.newValue));
                }
            }
        });
    }

    // Create a new quiz session
    async createSession() {
        this.sessionId = this.generateSessionId();
        this.isHost = true;
        
        const user = this.getCurrentUser();
        const sessionData = {
            host: user,
            created: Date.now(),
            participants: { [user.id]: user },
            results: {},
            status: 'active',
            lastUpdate: Date.now()
        };

        localStorage.setItem(`quiz_session_${this.sessionId}`, JSON.stringify(sessionData));
        console.log('Session created:', this.sessionId, sessionData);
        
        this.startListening();
        return this.sessionId;
    }

    // Join an existing session
    async joinSession(sessionId) {
        const sessionData = JSON.parse(localStorage.getItem(`quiz_session_${sessionId}`) || 'null');
        
        if (!sessionData) {
            throw new Error('Session not found');
        }
        
        this.sessionId = sessionId;
        this.isHost = false;
        
        const user = this.getCurrentUser();
        sessionData.participants[user.id] = user;
        sessionData.lastUpdate = Date.now();
        
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

        const sessionData = JSON.parse(localStorage.getItem(`quiz_session_${this.sessionId}`) || '{}');
        if (!sessionData.results) sessionData.results = {};
        sessionData.results[user.id] = resultData;
        sessionData.lastUpdate = Date.now();
        
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
    checkForUpdates() {
        if (!this.sessionId) return;
        
        const sessionData = JSON.parse(localStorage.getItem(`quiz_session_${this.sessionId}`) || '{}');
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
