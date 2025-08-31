// Real-time sync functionality using Firebase
class QuizSync {
    constructor() {
        this.sessionId = null;
        this.isHost = false;
        this.participants = new Map();
        this.results = [];
        this.firebaseConfig = {
            // Using a demo Firebase config - replace with your own
            apiKey: "demo-api-key",
            authDomain: "quiz-sync-demo.firebaseapp.com",
            databaseURL: "https://quiz-sync-demo-default-rtdb.firebaseio.com",
            projectId: "quiz-sync-demo"
        };
        this.initFirebase();
    }

    async initFirebase() {
        // Initialize Firebase (in real implementation, load from CDN)
        if (typeof firebase === 'undefined') {
            // Fallback to localStorage for demo
            this.useLocalStorage = true;
            console.log('Using localStorage fallback for sync');
            return;
        }
        
        firebase.initializeApp(this.firebaseConfig);
        this.database = firebase.database();
    }

    // Create a new quiz session
    async createSession() {
        this.sessionId = this.generateSessionId();
        this.isHost = true;
        
        const sessionData = {
            host: this.getCurrentUser(),
            created: Date.now(),
            participants: {},
            results: {},
            status: 'waiting'
        };

        if (this.useLocalStorage) {
            localStorage.setItem(`quiz_session_${this.sessionId}`, JSON.stringify(sessionData));
        } else {
            await this.database.ref(`sessions/${this.sessionId}`).set(sessionData);
        }

        return this.sessionId;
    }

    // Join an existing session
    async joinSession(sessionId) {
        this.sessionId = sessionId;
        this.isHost = false;

        const user = this.getCurrentUser();
        
        if (this.useLocalStorage) {
            const sessionData = JSON.parse(localStorage.getItem(`quiz_session_${sessionId}`) || '{}');
            if (!sessionData.participants) sessionData.participants = {};
            sessionData.participants[user.id] = user;
            localStorage.setItem(`quiz_session_${sessionId}`, JSON.stringify(sessionData));
        } else {
            await this.database.ref(`sessions/${sessionId}/participants/${user.id}`).set(user);
        }

        this.startListening();
        return true;
    }

    // Submit quiz results
    async submitResults(results) {
        if (!this.sessionId) return;

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

        if (this.useLocalStorage) {
            const sessionData = JSON.parse(localStorage.getItem(`quiz_session_${this.sessionId}`) || '{}');
            if (!sessionData.results) sessionData.results = {};
            sessionData.results[user.id] = resultData;
            localStorage.setItem(`quiz_session_${this.sessionId}`, JSON.stringify(sessionData));
            
            // Trigger custom event for real-time updates
            window.dispatchEvent(new CustomEvent('quizResultUpdate', { detail: resultData }));
        } else {
            await this.database.ref(`sessions/${this.sessionId}/results/${user.id}`).set(resultData);
        }
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
        if (this.useLocalStorage) {
            // Poll for changes every 2 seconds
            this.pollInterval = setInterval(() => {
                this.checkForUpdates();
            }, 2000);
            
            // Listen for custom events
            window.addEventListener('quizResultUpdate', (event) => {
                this.onResultUpdate(event.detail);
            });
        } else {
            this.database.ref(`sessions/${this.sessionId}/results`).on('child_added', (snapshot) => {
                this.onResultUpdate(snapshot.val());
            });
        }
    }

    // Check for updates (localStorage fallback)
    checkForUpdates() {
        if (!this.sessionId) return;
        
        const sessionData = JSON.parse(localStorage.getItem(`quiz_session_${this.sessionId}`) || '{}');
        const currentResults = Object.values(sessionData.results || {});
        
        if (currentResults.length !== this.results.length) {
            this.results = currentResults;
            this.updateResultsDisplay();
        }
    }

    // Handle new result updates
    onResultUpdate(resultData) {
        console.log('New result received:', resultData);
        
        // Update local results
        const existingIndex = this.results.findIndex(r => r.userId === resultData.userId);
        if (existingIndex >= 0) {
            this.results[existingIndex] = resultData;
        } else {
            this.results.push(resultData);
        }
        
        this.updateResultsDisplay();
        this.showNotification(`${resultData.userName} completed the quiz! Score: ${resultData.percentage}%`);
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
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
        
        if (!this.useLocalStorage && this.database) {
            this.database.ref(`sessions/${this.sessionId}/results`).off();
        }
    }
}

// Initialize sync
const quizSync = new QuizSync();