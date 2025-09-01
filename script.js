const questions = [
    {
        question: "What is the national animal of India?",
        options: ["Elephant", "Lion", "Tiger", "Leopard"],
        correct: 2
    },
    {
        question: "Which Indian state is known as the 'Land of Rising Sun'?",
        options: ["Sikkim", "Arunachal Pradesh", "Assam", "Nagaland"],
        correct: 1
    },
    {
        question: "Who was the first President of India?",
        options: ["Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Zakir Hussain", "V. V. Giri"],
        correct: 0
    },
    {
        question: "Which is the longest river in India?",
        options: ["Yamuna", "Godavari", "Ganga", "Brahmaputra"],
        correct: 2
    },
    {
        question: "What is the national flower of India?",
        options: ["Rose", "Lotus", "Sunflower", "Marigold"],
        correct: 1
    },
    {
        question: "Which Indian state has the highest population?",
        options: ["Maharashtra", "Uttar Pradesh", "Bihar", "West Bengal"],
        correct: 1
    },
    {
        question: "Who was the first Prime Minister of India?",
        options: ["Mahatma Gandhi", "Sardar Patel", "Jawaharlal Nehru", "Rajendra Prasad"],
        correct: 2
    },
    {
        question: "Which Indian state is famous for the dance form Kathakali?",
        options: ["Tamil Nadu", "Kerala", "Odisha", "Karnataka"],
        correct: 1
    },
    {
        question: "In which city is the Gateway of India located?",
        options: ["Mumbai", "Kolkata", "Chennai", "Delhi"],
        correct: 0
    },
    {
        question: "Which is the smallest state in India by area?",
        options: ["Goa", "Sikkim", "Tripura", "Nagaland"],
        correct: 0
    },
    {
        question: "Who was the first woman Prime Minister of India?",
        options: ["Sarojini Naidu", "Indira Gandhi", "Pratibha Patil", "Sonia Gandhi"],
        correct: 1
    },
    {
        question: "Which state is known as the 'Spice Garden of India'?",
        options: ["Kerala", "Assam", "Tamil Nadu", "Karnataka"],
        correct: 0
    },
    {
        question: "Which Indian monument is also called the 'Symbol of Love'?",
        options: ["Qutub Minar", "Charminar", "Taj Mahal", "Red Fort"],
        correct: 2
    },
    {
        question: "Who was the first Indian to win a Nobel Prize?",
        options: ["C. V. Raman", "Rabindranath Tagore", "Mother Teresa", "Amartya Sen"],
        correct: 1
    },
    {
        question: "What is the national sport of India?",
        options: ["Hockey", "Cricket", "Kabaddi", "Football"],
        correct: 0
    },
    {
        question: "Which is the largest union territory of India?",
        options: ["Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"],
        correct: 3
    },
    {
        question: "Who is known as the Iron Man of India?",
        options: ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "B. R. Ambedkar"],
        correct: 1
    },
    {
        question: "Which is the national aquatic animal of India?",
        options: ["Dolphin", "Shark", "Crocodile", "Turtle"],
        correct: 0
    },
    {
        question: "Where is the Sun Temple located?",
        options: ["Konark", "Puri", "Madurai", "Hampi"],
        correct: 0
    },
    {
        question: "Who was the first Indian astronaut to go into space?",
        options: ["Rakesh Sharma", "Kalpana Chawla", "Sunita Williams", "Vikram Sarabhai"],
        correct: 0
    },
    {
        question: "Which Indian state is famous for tea plantations?",
        options: ["Kerala", "Assam", "Punjab", "Gujarat"],
        correct: 1
    },
    {
        question: "Who is known as the Missile Man of India?",
        options: ["Dr. Vikram Sarabhai", "Dr. A. P. J. Abdul Kalam", "Dr. Homi Bhabha", "Dr. C. V. Raman"],
        correct: 1
    },
    {
        question: "Which is the highest civilian award in India?",
        options: ["Padma Shri", "Padma Bhushan", "Padma Vibhushan", "Bharat Ratna"],
        correct: 3
    },
    {
        question: "Which Indian state is called the 'Land of Five Rivers'?",
        options: ["Haryana", "Punjab", "Rajasthan", "Gujarat"],
        correct: 1
    },
    {
        question: "Which Mughal emperor built the Red Fort in Delhi?",
        options: ["Akbar", "Aurangzeb", "Shah Jahan", "Babur"],
        correct: 2
    },
    {
        question: "Which Indian festival is known as the 'Festival of Lights'?",
        options: ["Holi", "Diwali", "Eid", "Navratri"],
        correct: 1
    },
    {
        question: "Where is the Indian Space Research Organisation (ISRO) headquartered?",
        options: ["Chennai", "Bengaluru", "Hyderabad", "New Delhi"],
        correct: 1
    },
    {
        question: "Which Indian freedom fighter gave the slogan 'Give me blood, and I shall give you freedom'?",
        options: ["Bhagat Singh", "Subhas Chandra Bose", "Mahatma Gandhi", "Lala Lajpat Rai"],
        correct: 1
    },
    {
        question: "Which Indian city is known as the 'Pink City'?",
        options: ["Udaipur", "Jaipur", "Jodhpur", "Bikaner"],
        correct: 1
    },
    {
        question: "Who wrote the book 'Discovery of India'?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Rabindranath Tagore", "Sardar Patel"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let playerName = '';
let timer = 30;
let timerInterval = null;
let totalQuestions = 10;
let quizQuestions = [];
let gameMode = 'single';
let players = [];
let currentPlayerIndex = 0;
let playerScores = [];
let usedQuestions = new Set();
let isPaused = false;
let currentQuestionData = null;
let syncSession = null;
let isSyncMode = false;

function loadQuestion() {
    let question;
    
    if (gameMode === 'multi') {
        let questionIndex = 0;
        do {
            questionIndex = Math.floor(Math.random() * quizQuestions.length);
            question = quizQuestions[questionIndex];
        } while (usedQuestions.has(questionIndex) && usedQuestions.size < quizQuestions.length);
        
        usedQuestions.add(questionIndex);
    } else {
        question = quizQuestions[currentQuestion];
    }
    
    currentQuestionData = question;
    
    document.getElementById('question').textContent = question.question;
    
    updateProgress();
    
    if (gameMode === 'multi') {
        document.getElementById('current-player').textContent = `${players[currentPlayerIndex]}'s Turn`;
    }
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index, question);
        optionsContainer.appendChild(optionDiv);
    });
    
    selectedAnswer = null;
    startTimer();
}

function selectOption(index, questionData) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    selectedAnswer = index;
    
    setTimeout(() => {
        if (selectedAnswer !== null) {
            nextQuestion(questionData);
        }
    }, 1000);
}

function nextQuestion(currentQuestionData = null) {
    clearInterval(timerInterval);
    
    const question = currentQuestionData || quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    options[question.correct].classList.add('correct');
    if (selectedAnswer !== null && selectedAnswer !== question.correct) {
        options[selectedAnswer].classList.add('incorrect');
    }
    
    if (selectedAnswer === question.correct) {
        if (gameMode === 'single') {
            score++;
        } else {
            playerScores[currentPlayerIndex]++;
        }
    }
    
    setTimeout(() => {
        if (gameMode === 'multi') {
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            if (currentPlayerIndex === 0) {
                currentQuestion++;
            }
        } else {
            currentQuestion++;
        }
        
        if ((gameMode === 'single' && currentQuestion < totalQuestions) || 
            (gameMode === 'multi' && currentQuestion < totalQuestions)) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    
    if (gameMode === 'single') {
        document.getElementById('single-result').style.display = 'block';
        document.getElementById('multi-result').style.display = 'none';
        
        const percentage = Math.round((score / totalQuestions) * 100);
        
        const scoreCircle = document.getElementById('score-circle');
        scoreCircle.style.setProperty('--score', percentage + '%');
        
        document.getElementById('score-percentage').textContent = percentage + '%';
        document.getElementById('player-info').textContent = `Well done, ${playerName}!`;
        document.getElementById('score').textContent = `You scored ${score} out of ${totalQuestions}`;
        
        const badge = document.getElementById('performance-badge');
        if (percentage >= 90) {
            badge.textContent = '🏆 Excellent!';
            badge.className = 'performance-badge badge-excellent';
        } else if (percentage >= 70) {
            badge.textContent = '👍 Good Job!';
            badge.className = 'performance-badge badge-good';
        } else if (percentage >= 50) {
            badge.textContent = '👌 Not Bad!';
            badge.className = 'performance-badge badge-average';
        } else {
            badge.textContent = '💪 Keep Trying!';
            badge.className = 'performance-badge badge-poor';
        }
        
        saveScore();
    } else {
        document.getElementById('single-result').style.display = 'none';
        document.getElementById('multi-result').style.display = 'block';
        
        const winner = playerScores[0] > playerScores[1] ? players[0] : 
                      playerScores[1] > playerScores[0] ? players[1] : 'Tie';
        
        document.getElementById('winner-info').textContent = 
            winner === 'Tie' ? "🤝 It's a tie!" : `🏆 ${winner} Wins!`;
        
        const scoresHtml = `
            <div class="player-score ${playerScores[0] > playerScores[1] ? 'winner' : ''}">
                <h4>${players[0]}</h4>
                <p>${playerScores[0]}/${totalQuestions} (${Math.round((playerScores[0]/totalQuestions)*100)}%)</p>
            </div>
            <div class="player-score ${playerScores[1] > playerScores[0] ? 'winner' : ''}">
                <h4>${players[1]}</h4>
                <p>${playerScores[1]}/${totalQuestions} (${Math.round((playerScores[1]/totalQuestions)*100)}%)</p>
            </div>
        `;
        document.getElementById('player-scores').innerHTML = scoresHtml;
        
        players.forEach((player, index) => {
            playerName = player;
            score = playerScores[index];
            saveScore();
        });
    }
    
    displayLeaderboard();
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    currentPlayerIndex = 0;
    playerScores = [];
    usedQuestions.clear();
    isPaused = false;
    currentQuestionData = null;
    clearInterval(timerInterval);
    
    // Stop sync listening
    if (quizSync) {
        quizSync.stopListening();
    }
    syncSession = null;
    isSyncMode = false;
    
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('mode-container').style.display = 'block';
    document.getElementById('sync-options').style.display = 'none';
    document.getElementById('player-name').value = '';
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
    document.getElementById('session-id').value = '';
}

function selectMode(mode) {
    gameMode = mode;
    
    if (mode === 'sync') {
        document.getElementById('sync-options').style.display = 'block';
        isSyncMode = true;
        return;
    }
    
    document.getElementById('mode-container').style.display = 'none';
    document.getElementById('name-container').style.display = 'block';
    
    if (mode === 'single') {
        document.getElementById('mode-title').textContent = 'Enter Your Name';
        document.getElementById('single-player').style.display = 'block';
        document.getElementById('multi-player').style.display = 'none';
    } else {
        document.getElementById('mode-title').textContent = 'Enter Player Names';
        document.getElementById('single-player').style.display = 'none';
        document.getElementById('multi-player').style.display = 'block';
    }
}

function goBack() {
    document.getElementById('name-container').style.display = 'none';
    document.getElementById('mode-container').style.display = 'block';
}

function startQuiz() {
    if (gameMode === 'single') {
        playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }
        players = [playerName];
        playerScores = [0];
    } else {
        const player1 = document.getElementById('player1-name').value.trim();
        const player2 = document.getElementById('player2-name').value.trim();
        if (!player1 || !player2) {
            alert('Please enter both player names!');
            return;
        }
        players = [player1, player2];
        playerScores = [0, 0];
    }
    
    totalQuestions = parseInt(document.getElementById('question-count').value);
    
    if (gameMode === 'multi') {
        quizQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(totalQuestions * 2, questions.length));
    } else {
        quizQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    }
    
    currentPlayerIndex = 0;
    usedQuestions.clear();
    
    document.getElementById('name-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    if (gameMode === 'multi') {
        document.getElementById('current-player').style.display = 'block';
    }
    
    loadQuestion();
}

function startTimer() {
    timer = 30;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            if (selectedAnswer === null) {
                nextQuestion();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timer-text').textContent = timer;
    const percentage = (timer / 30) * 100;
    document.getElementById('timer-bar').style.setProperty('--width', percentage + '%');
    
    const timerBar = document.getElementById('timer-bar');
    if (timer <= 10) {
        timerBar.style.background = 'conic-gradient(#ff6b6b var(--width, 100%), #e1e5e9 0)';
    } else if (timer <= 20) {
        timerBar.style.background = 'conic-gradient(#ffc107 var(--width, 100%), #e1e5e9 0)';
    } else {
        timerBar.style.background = 'conic-gradient(#667eea var(--width, 100%), #e1e5e9 0)';
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    const questionNumber = gameMode === 'multi' ? 
        Math.floor(currentQuestion / players.length) + 1 : 
        currentQuestion + 1;
    
    document.getElementById('question-counter').textContent = `${questionNumber} / ${totalQuestions}`;
}

function pauseQuiz() {
    if (!isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        document.getElementById('pause-modal').style.display = 'flex';
    }
}

function resumeQuiz() {
    isPaused = false;
    document.getElementById('pause-modal').style.display = 'none';
    startTimer();
}

function quitQuiz() {
    if (confirm('Are you sure you want to quit the quiz?')) {
        clearInterval(timerInterval);
        document.getElementById('pause-modal').style.display = 'none';
        restartQuiz();
    }
}

function shareResults() {
    const percentage = Math.round((score / totalQuestions) * 100);
    const text = `I just scored ${score}/${totalQuestions} (${percentage}%) on QuizMaster Pro! 🧠✨`;
    
    if (navigator.share) {
        navigator.share({
            title: 'QuizMaster Pro Results',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        });
    }
}

function saveScore() {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const newScore = {
        name: playerName,
        score: score,
        total: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        date: new Date().toLocaleDateString()
    };
    
    scores.push(newScore);
    scores.sort((a, b) => b.percentage - a.percentage);
    scores.splice(10);
    
    localStorage.setItem('quizScores', JSON.stringify(scores));
    
    // Submit to sync session if active
    if (syncSession && isSyncMode) {
        quizSync.submitResults({
            score: score,
            total: totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            answers: [] // Could track individual answers if needed
        });
    }
}

function displayLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const leaderboard = document.getElementById('leaderboard');
    
    if (scores.length === 0) {
        leaderboard.innerHTML = '';
        return;
    }
    
    let html = '<h3>Top Scores</h3>';
    scores.slice(0, 5).forEach((entry, index) => {
        html += `<div class="leaderboard-entry">${index + 1}. ${entry.name} - ${entry.score}/${entry.total} (${entry.percentage}%) - ${entry.date}</div>`;
    });
    
    leaderboard.innerHTML = html;
}

// Sync-related functions
async function createSyncSession() {
    try {
        syncSession = await quizSync.createSession();
        const shareLink = quizSync.getShareableLink();
        
        const message = `Quiz Sync Session Created!\n\nSession ID: ${syncSession}\n\nShare this link: ${shareLink}\n\nOthers can join using the Session ID or by clicking the link.`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Join My Quiz Session',
                text: `Join my quiz session with ID: ${syncSession}`,
                url: shareLink
            });
        } else {
            navigator.clipboard.writeText(shareLink).then(() => {
                alert(message + '\n\nLink copied to clipboard!');
            }).catch(() => {
                alert(message);
            });
        }
        
        // Start listening for results
        quizSync.startListening();
        
    } catch (error) {
        alert('Failed to create sync session. Please try again.');
        console.error('Sync session creation failed:', error);
    }
}

async function joinSyncSession() {
    const sessionId = document.getElementById('session-id').value.trim().toUpperCase();
    if (!sessionId) {
        alert('Please enter a Session ID');
        return;
    }
    
    try {
        await quizSync.joinSession(sessionId);
        syncSession = sessionId;
        isSyncMode = true;
        
        alert(`Successfully joined session: ${sessionId}`);
        
        // Switch to single player mode for the quiz
        gameMode = 'single';
        document.getElementById('mode-container').style.display = 'none';
        document.getElementById('name-container').style.display = 'block';
        document.getElementById('mode-title').textContent = 'Enter Your Name (Sync Mode)';
        document.getElementById('single-player').style.display = 'block';
        document.getElementById('multi-player').style.display = 'none';
        
    } catch (error) {
        alert('Failed to join session. Please check the Session ID.');
        console.error('Failed to join sync session:', error);
    }
}

// Check for session ID in URL on page load
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId) {
        document.getElementById('session-id').value = sessionId;
        selectMode('sync');
        
        // Auto-show join dialog
        setTimeout(() => {
            if (confirm(`Join quiz session: ${sessionId}?`)) {
                joinSyncSession();
            }
        }, 500);
    }
});
