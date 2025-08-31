const questions = [
    {
        question: "What is the capital of India?",
        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
        correct: 1
    },
    {
        question: "Which river is known as the 'Ganga of the South'?",
        options: ["Krishna", "Godavari", "Kaveri", "Narmada"],
        correct: 2
    },
    {
        question: "Who is known as the 'Father of the Nation' in India?",
        options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Dr. APJ Abdul Kalam"],
        correct: 1
    },
    {
        question: "In which year did India gain independence?",
        options: ["1945", "1946", "1947", "1948"],
        correct: 2
    },
    {
        question: "Which is the largest state in India by area?",
        options: ["Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Maharashtra"],
        correct: 2
    },
    {
        question: "What is the national bird of India?",
        options: ["Eagle", "Peacock", "Parrot", "Sparrow"],
        correct: 1
    },
    {
        question: "Which Indian city is known as the 'Silicon Valley of India'?",
        options: ["Hyderabad", "Pune", "Bangalore", "Chennai"],
        correct: 2
    },
    {
        question: "Who wrote the Indian National Anthem?",
        options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Sarojini Naidu", "Subhas Chandra Bose"],
        correct: 0
    },
    {
        question: "Which is the highest mountain peak in India?",
        options: ["Kanchenjunga", "Nanda Devi", "Kamet", "Saltoro Kangri"],
        correct: 0
    },
    {
        question: "What is the currency of India?",
        options: ["Dollar", "Pound", "Rupee", "Euro"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correct: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Japan", "South Korea", "Thailand"],
        correct: 1
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
        correct: 2
    },
    {
        question: "Who invented the telephone?",
        options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Benjamin Franklin"],
        correct: 1
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2
    },
    {
        question: "Which gas makes up most of Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"],
        correct: 3
    },
    {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: 1
    },
    {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Osmium", "Oxygen", "Oganesson", "Olivine"],
        correct: 1
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
    },
    {
        question: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correct: 1
    },
    {
        question: "Which continent is the largest by area?",
        options: ["Africa", "North America", "Asia", "Europe"],
        correct: 2
    },
    {
        question: "What is the speed of light in vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
        correct: 0
    },
    {
        question: "Who developed the theory of relativity?",
        options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
        correct: 1
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct: 1
    },
    {
        question: "Which programming language is known for web development?",
        options: ["Python", "C++", "JavaScript", "Assembly"],
        correct: 2
    },
    {
        question: "What does 'WWW' stand for?",
        options: ["World Wide Web", "World Wide Window", "World Web Works", "Wide World Web"],
        correct: 0
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
    
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('mode-container').style.display = 'block';
    document.getElementById('player-name').value = '';
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
}

function selectMode(mode) {
    gameMode = mode;
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