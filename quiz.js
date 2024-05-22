const quiz = document.getElementById('quiz');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultElement = document.getElementById('result');
const categorySelection = document.getElementById('category');
const levelSelection = document.getElementById('level');
const startButton = document.getElementById('start-btn');

let currentQuestionIndex = 0;
let currentCategory = '';
let currentLevel = '';
let score = 0;
let incorrectQuestions = [];

startButton.addEventListener('click', startQuiz);

function startQuiz() {
    currentCategory = categorySelection.value;
    currentLevel = levelSelection.value;
    currentQuestionIndex = 0; // Reset index for new game
    score = 0; // Reset score for new game
    incorrectQuestions = []; // Reset incorrect questions for new game
    resultElement.textContent = ''; // Clear result message at start
    loadQuestion(currentCategory, currentLevel);
    startButton.style.display = 'none';
    categorySelection.disabled = true;
    levelSelection.disabled = true;
}

function loadQuestion(category, level) {
    const currentQuestion = questions[category][level][currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    optionsElement.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => {
            checkAnswer(option, button);
        });
        optionsElement.appendChild(button);
    });

    resultElement.textContent = ''; // Clear previous result message
    nextButton.style.display = 'none';
}

function checkAnswer(selectedOption, button) {
    const currentQuestion = questions[currentCategory][currentLevel][currentQuestionIndex];
    const correctIcon = document.createElement('span');
    const incorrectIcon = document.createElement('span');

    correctIcon.innerHTML = ' ✔️';
    incorrectIcon.innerHTML = ' ❌';

    if (selectedOption === currentQuestion.answer) {
        score += 5; // Each correct answer is worth 5 points
        resultElement.textContent = '¡Respuesta correcta!';
        button.appendChild(correctIcon);
    } else {
        resultElement.textContent = 'Respuesta incorrecta';
        button.appendChild(incorrectIcon);
        incorrectQuestions.push(currentQuestion); // Save incorrect question
        // Highlight the correct answer
        const buttons = optionsElement.getElementsByTagName('button');
        for (let btn of buttons) {
            if (btn.textContent === currentQuestion.answer) {
                btn.appendChild(correctIcon.cloneNode(true));
            }
        }
    }

    // Disable all buttons after selection
    const buttons = optionsElement.getElementsByTagName('button');
    for (let btn of buttons) {
        btn.disabled = true;
    }

    nextButton.style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[currentCategory][currentLevel].length) {
        loadQuestion(currentCategory, currentLevel);
    } else {
        showSummary();
    }
}

function showSummary() {
    let summaryHtml = `<h2>Has completado el quiz. Puntuación: ${score}/${questions[currentCategory][currentLevel].length * 5}</h2>`;
    if (incorrectQuestions.length > 0) {
        summaryHtml += '<h3>Preguntas incorrectas:</h3>';
        incorrectQuestions.forEach((q, index) => {
            summaryHtml += `<p>${index + 1}. ${q.question}</p>`;
            summaryHtml += `<p>Respuesta correcta: ${q.answer}</p>`;
        });
    } else {
        summaryHtml += '<p>¡Perfecto! Has acertado todas las preguntas.</p>';
    }
    summaryHtml += '<button id="new-quiz-btn">Nuevo Quiz</button>';
    quiz.innerHTML = summaryHtml;

    document.getElementById('new-quiz-btn').addEventListener('click', () => {
        window.location.reload();
    });
}

nextButton.addEventListener('click', nextQuestion);
