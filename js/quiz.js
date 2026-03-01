/**
 * Quiz Application Logic
 * Manages the entire quiz flow and user interactions
 */

// Quiz State
let quizState = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswers: [],
    timePerQuestion: 30,
    timerId: null,
    timeRemaining: 30,
    quizPaused: false,
    isPaused: false
};

// Available topics with emojis
const TOPICS = [
    { name: 'Photosynthesis', emoji: '🌱' },
    { name: 'Python Programming', emoji: '🐍' },
    { name: 'World History', emoji: '🌍' },
    { name: 'Biology', emoji: '🧬' },
    { name: 'Physics', emoji: '⚛️' },
    { name: 'Mathematics', emoji: '📐' },
    { name: 'Chemistry', emoji: '🧪' },
    { name: 'Geography', emoji: '🗺️' },
    { name: 'Literature', emoji: '📚' },
    { name: 'Science', emoji: '🔬' },
    { name: 'Art History', emoji: '🎨' },
    { name: 'Computer Science', emoji: '💻' },
    { name: 'World Geography', emoji: '🌐' },
    { name: 'Music Theory', emoji: '🎵' },
    { name: 'Economics', emoji: '💰' }
];

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Quiz Application');
    loadTopics();
    setupEventListeners();
});

/**
 * Load and display available topics
 */
function loadTopics() {
    const topicGrid = document.getElementById('topicGrid');
    topicGrid.innerHTML = '';

    TOPICS.forEach(topic => {
        const topicBtn = document.createElement('button');
        topicBtn.className = 'topic-btn emoji';
        topicBtn.innerHTML = `<div>${topic.emoji}</div><div>${topic.name}</div>`;
        topicBtn.onclick = () => startQuiz(topic.name);
        topicGrid.appendChild(topicBtn);
    });
}

/**
 * Start a new quiz for the selected topic
 * @param {string} topic - The selected topic
 */
async function startQuiz(topic) {
    console.log(`📚 Starting quiz for: ${topic}`);
    
    try {
        // Show loading state
        showLoadingState();

        // Generate or fetch quiz questions
        const quizData = await generateQuizFromAPI(topic);

        // Validate the quiz structure
        if (!validateQuizStructure(quizData)) {
            throw new Error('Invalid quiz structure received');
        }

        // Initialize quiz state
        quizState.currentQuiz = formatQuizData(quizData);
        quizState.currentQuestionIndex = 0;
        quizState.score = 0;
        quizState.selectedAnswers = new Array(10).fill(null);
        quizState.timeRemaining = quizState.timePerQuestion;
        quizState.quizPaused = false;

        // Display quiz page
        showPage('quizPage');
        displayQuestion();
        startTimer();

        console.log(`✅ Quiz started with ${quizState.currentQuiz.totalQuestions} questions`);
    } catch (error) {
        console.error('❌ Error starting quiz:', error);
        alert(`Error starting quiz: ${error.message}`);
        showPage('homePage');
    }
}

/**
 * Start custom quiz with user-entered topic
 */
async function startCustomQuiz() {
    const customTopic = document.getElementById('customTopic').value.trim();

    if (!customTopic) {
        alert('Please enter a topic!');
        return;
    }

    startQuiz(customTopic);
    document.getElementById('customTopic').value = '';
}

/**
 * Display the current question
 */
function displayQuestion() {
    const question = quizState.currentQuiz.questions[quizState.currentQuestionIndex];

    // Update progress
    const progressPercent = ((quizState.currentQuestionIndex + 1) / quizState.currentQuiz.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    document.getElementById('questionNumber').textContent = quizState.currentQuestionIndex + 1;
    document.getElementById('scoreDisplay').textContent = quizState.score;

    // Update question
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('topicName').textContent = `Topic: ${quizState.currentQuiz.topic}`;

    // Update options
    question.options.forEach((option, index) => {
        const btnId = `option${index + 1}`;
        const optionBtn = document.getElementById(btnId);
        optionBtn.textContent = option;
        optionBtn.className = 'option-btn';

        // Highlight previously selected answer
        if (quizState.selectedAnswers[quizState.currentQuestionIndex] === index) {
            optionBtn.classList.add('selected');
        }
    });

    // Reset timer
    quizState.timeRemaining = quizState.timePerQuestion;
    updateTimer();
    
    // Disable next button until an answer is selected
    document.getElementById('nextBtn').disabled = true;
}

/**
 * Handle answer selection
 * @param {number} optionIndex - The selected option index (0-3)
 */
function selectAnswer(optionIndex) {
    if (quizState.quizPaused) {
        alert('Quiz is paused. Resume to continue.');
        return;
    }

    // Update selected answer
    quizState.selectedAnswers[quizState.currentQuestionIndex] = optionIndex;

    // Update UI
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
        btn.classList.remove('selected');
        if (index === optionIndex) {
            btn.classList.add('selected');
        }
    });

    // Enable next button
    document.getElementById('nextBtn').disabled = false;
    
    console.log(`✓ Answer selected: ${optionIndex}`);
}

/**
 * Move to the next question
 */
function nextQuestion() {
    const question = quizState.currentQuiz.questions[quizState.currentQuestionIndex];
    const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex];

    if (selectedAnswer === null) {
        alert('Please select an answer before proceeding!');
        return;
    }

    // Check if answer is correct
    if (selectedAnswer === question.correctAnswer) {
        quizState.score++;
        console.log(`✅ Correct! Score: ${quizState.score}`);
    } else {
        console.log(`❌ Incorrect. Correct answer was: ${question.correctAnswer}`);
    }

    quizState.currentQuestionIndex++;

    // Check if quiz is complete
    if (quizState.currentQuestionIndex >= quizState.currentQuiz.totalQuestions) {
        completeQuiz();
    } else {
        displayQuestion();
    }
}

/**
 * Complete the quiz and show results
 */
function completeQuiz() {
    clearInterval(quizState.timerId);
    
    console.log(`🎉 Quiz Complete! Final Score: ${quizState.score}/10`);

    // Display results
    displayResults();
    showPage('resultsPage');
}

/**
 * Display quiz results
 */
function displayResults() {
    const finalScore = quizState.score;
    const totalQuestions = quizState.currentQuiz.totalQuestions;
    const percentage = (finalScore / totalQuestions) * 100;

    // Update score display
    document.getElementById('finalScore').textContent = finalScore;

    // Generate result message
    let message = '';
    if (percentage === 100) {
        message = '🏆 Perfect Score! You are a quiz master!';
    } else if (percentage >= 80) {
        message = '🥇 Excellent! Great job!';
    } else if (percentage >= 60) {
        message = '🥈 Good! You did well!';
    } else if (percentage >= 40) {
        message = '🥉 Not bad! Keep learning!';
    } else {
        message = '📚 Keep practicing! You\'ll improve!';
    }

    document.getElementById('resultMessage').textContent = `${message} (${percentage.toFixed(1)}%)`;

    // Display individual answers review
    displayAnswersReview();
}

/**
 * Display review of all answers
 */
function displayAnswersReview() {
    const answersReview = document.getElementById('answersReview');
    answersReview.innerHTML = '';

    quizState.currentQuiz.questions.forEach((question, index) => {
        const selectedIndex = quizState.selectedAnswers[index];
        const isCorrect = selectedIndex === question.correctAnswer;

        const answerItem = document.createElement('div');
        answerItem.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;

        const selectedText = selectedIndex !== null ? question.options[selectedIndex] : 'Not answered';
        const correctText = question.options[question.correctAnswer];

        answerItem.innerHTML = `
            <div class="answer-item-number">Question ${index + 1}: ${isCorrect ? '✅ Correct' : '❌ Incorrect'}</div>
            <div class="answer-item-text"><strong>Question:</strong> ${question.question}</div>
            <div class="answer-item-text"><strong>Your answer:</strong> ${selectedText}</div>
            <div class="answer-item-text"><strong>Correct answer:</strong> ${correctText}</div>
            <div class="answer-item-text"><strong>Explanation:</strong> ${question.explanation}</div>
        `;

        answersReview.appendChild(answerItem);
    });
}

/**
 * Pause the quiz
 */
function pauseQuiz() {
    quizState.quizPaused = !quizState.quizPaused;
    const pauseBtn = document.querySelector('.quiz-actions .btn-secondary');

    if (quizState.quizPaused) {
        clearInterval(quizState.timerId);
        pauseBtn.textContent = 'Resume';
        pauseBtn.style.background = '#f59e0b';
    } else {
        pauseBtn.textContent = 'Pause';
        pauseBtn.style.background = '';
        startTimer();
    }

    console.log(quizState.quizPaused ? '⏸️ Quiz paused' : '▶️ Quiz resumed');
}

/**
 * Start the countdown timer
 */
function startTimer() {
    quizState.timerId = setInterval(() => {
        if (!quizState.quizPaused) {
            quizState.timeRemaining--;
            updateTimer();

            // Auto-select random answer if time runs out
            if (quizState.timeRemaining <= 0) {
                handleTimeOut();
            }
        }
    }, 1000);
}

/**
 * Update timer display
 */
function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = quizState.timeRemaining;

    // Change color based on time remaining
    timerElement.classList.remove('warning', 'danger');
    if (quizState.timeRemaining <= 10) {
        timerElement.classList.add('danger');
    } else if (quizState.timeRemaining <= 15) {
        timerElement.classList.add('warning');
    }
}

/**
 * Handle timeout - auto-move to next question
 */
function handleTimeOut() {
    clearInterval(quizState.timerId);
    console.log('⏰ Time\'s up!');

    // Auto-select an answer if not selected
    if (quizState.selectedAnswers[quizState.currentQuestionIndex] === null) {
        const randomAnswer = Math.floor(Math.random() * 4);
        selectAnswer(randomAnswer);
    }

    // Auto-move to next question after 2 seconds
    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

/**
 * Retake the current quiz
 */
function retakeQuiz() {
    const topicName = quizState.currentQuiz.topic;
    startQuiz(topicName);
}

/**
 * Go back to home page
 */
function goHome() {
    clearInterval(quizState.timerId);
    showPage('homePage');
}

/**
 * Download quiz results
 */
function downloadResults() {
    const results = {
        topic: quizState.currentQuiz.topic,
        score: quizState.score,
        totalQuestions: quizState.currentQuiz.totalQuestions,
        percentage: ((quizState.score / quizState.currentQuiz.totalQuestions) * 100).toFixed(2),
        date: new Date().toLocaleString(),
        answers: quizState.selectedAnswers.map((answer, index) => {
            const question = quizState.currentQuiz.questions[index];
            return {
                question: question.question,
                selected: answer,
                selectedText: answer !== null ? question.options[answer] : 'Not answered',
                correct: question.correctAnswer,
                correctText: question.options[question.correctAnswer],
                isCorrect: answer === question.correctAnswer
            };
        })
    };

    // Generate CSV
    const csv = exportResultsAsCSV(results);
    downloadFile(csv, `quiz_results_${Date.now()}.csv`, 'text/csv');

    // Also offer JSON download
    const json = exportResultsAsJSON(results);
    console.log('📊 Quiz Results (JSON):', json);
}

/**
 * Download file utility
 * @param {string} content - The file content
 * @param {string} filename - The filename
 * @param {string} mimeType - The MIME type
 */
function downloadFile(content, filename, mimeType) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Show a loading state
 */
function showLoadingState() {
    const quizPage = document.getElementById('quizPage');
    quizPage.innerHTML = `
        <div class="quiz-container" style="text-align: center;">
            <h2>Loading Your Quiz...</h2>
            <div class="loader" style="margin: 2rem 0;">
                <div style="font-size: 3rem; animation: spin 1s linear infinite;">⏳</div>
            </div>
            <p>Generating questions from AI...</p>
        </div>
    `;
    showPage('quizPage');
}

/**
 * Display a specific page
 * @param {string} pageName - The page to display
 */
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (pageName === 'homePage') {
        navLinks[0].classList.add('active');
    }
}

/**
 * Handle sign in
 */
function handleSignIn() {
    alert('Sign In functionality coming soon!');
}

/**
 * Handle sign up
 */
function handleSignUp() {
    alert('Sign Up functionality coming soon!');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Handle Enter key for custom topic input
    document.getElementById('customTopic').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            startCustomQuiz();
        }
    });
}

/**
 * Add CSS animation for loader
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('✅ Quiz application loaded and ready!');
