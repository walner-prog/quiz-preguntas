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
    finishButton.style.display = 'block'; // Show the "Terminar Quiz" button
}

function loadQuestion(category, level) {
    const currentQuestion = questions[category][level][currentQuestionIndex];
    questionElement.innerHTML = `${currentQuestion.question} <img src="img/cara-alegre.png" alt="Happy Face" width="20" height="20">`;

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
    correctIcon.style.color = 'green'; // Estilo para respuestas correctas
    incorrectIcon.innerHTML = ' ❌';
    incorrectIcon.style.color = 'red'; // Estilo para respuestas incorrectas

    if (selectedOption === currentQuestion.answer) {
        score += 5; // Cada respuesta correcta vale 5 puntos
        resultElement.textContent = '¡Respuesta correcta!';
        resultElement.style.backgroundColor = 'darkslategray'; // Fondo para respuesta correcta
        button.appendChild(correctIcon);
    } else {
        resultElement.textContent = 'Respuesta incorrecta';
        resultElement.style.backgroundColor = 'lightcoral'; // Fondo para respuesta incorrecta
        button.appendChild(incorrectIcon);
        incorrectQuestions.push(currentQuestion); // Guardar pregunta incorrecta
        // Resaltar la respuesta correcta
        const buttons = optionsElement.getElementsByTagName('button');
        for (let btn of buttons) {
            if (btn.textContent === currentQuestion.answer) {
                btn.appendChild(correctIcon.cloneNode(true));
            }
        }
    }

    // Deshabilitar todos los botones después de seleccionar
    const buttons = optionsElement.getElementsByTagName('button');
    for (let btn of buttons) {
        btn.disabled = true;
    }

    nextButton.style.display = 'block';

    // Verificar si la puntuación califica para ganar una estrella
    if (score % 20 === 0) {
        showStars(score / 20); // Llamar a una función para mostrar las estrellas ganadas
    }
}



function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[currentCategory][currentLevel].length) {
        loadQuestion(currentCategory, currentLevel);
    } else {
        showSummary();
    }
}

/**function showSummary() {
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
} */

function showSummary() {
    let summaryHtml = `<h2>Has completado el quiz. Puntuación: ${score}/${questions[currentCategory][currentLevel].length * 5}</h2>`;
    if (incorrectQuestions.length >= 0) {
        summaryHtml += '<h3 style="color: red;">Preguntas incorrectas:</h3>';
        incorrectQuestions.forEach((q, index) => {
            summaryHtml += `<p style="color: red;">${index + 1}. ${q.question}</p>`;
            summaryHtml += `<p>Respuesta correcta: ${q.answer}</p>`;
        });
    } else {
        summaryHtml += '<p style="color: green;">¡Perfecto! Has acertado todas las preguntas.</p>';
    }

    // Calculate stars earned
    const starsEarned = Math.floor(score / 20);

    // Add stars earned to the summary
    summaryHtml += `<p style="margin-top: 5px;">Estrellas ganadas:</p>`;
    for (let i = 0; i < starsEarned; i++) {
        summaryHtml += '<img src="img/star.png" alt="star" width="20" height="20">';
    }

    summaryHtml += '<br><button id="download-btn">Descargar Resultado</button>';
    summaryHtml += '<br><button id="new-quiz-btn">Nuevo Quiz</button>';
    quiz.innerHTML = summaryHtml;

    document.getElementById('download-btn').addEventListener('click', downloadResults);
    document.getElementById('new-quiz-btn').addEventListener('click', () => {
        window.location.reload();
    });
}

function downloadResults() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Estilos generales
    doc.setFontSize(16);
    doc.setTextColor(40);

    // Título y mensaje de agradecimiento
    doc.text('Resultado del Quiz', 20, 20);
    doc.setFontSize(12);
    doc.text('Gracias por aprender con nosotros.', 20, 30);

    // Puntuación
    doc.setFontSize(14);
    doc.text(`Puntuación: ${score}/${questions[currentCategory][currentLevel].length * 5}`, 20, 40);

    // Preguntas incorrectas
    if (incorrectQuestions.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(255, 0, 0);
        doc.text('Preguntas incorrectas:', 20, 50);

        incorrectQuestions.forEach((q, index) => {
            const questionText = `${index + 1}. ${q.question}`;
            const answerText = `Respuesta correcta: ${q.answer}`;
            const questionStartY = 60 + (index * 20);

            doc.text(questionText, 20, questionStartY);
            doc.text(answerText, 20, questionStartY + 10);
        });
    } else {
        doc.setTextColor(0, 128, 0);
        doc.text('¡Perfecto! Has acertado todas las preguntas.', 20, 50);
    }

    // Estrellas ganadas
    const starsEarned = Math.floor(score / 20);
    if (starsEarned > 0) {
        doc.setTextColor(40);
        doc.text('Estrellas ganadas:', 20, 70 + (incorrectQuestions.length * 20));

        for (let i = 0; i < starsEarned; i++) {
            doc.addImage('img/star.png', 'PNG', 20 + (i * 15), 80 + (incorrectQuestions.length * 20), 10, 10);
        }
    }

    // Guardar el PDF
    doc.save('resultado_quiz.pdf');
}



function showStars(starCount) {
    let starsHtml = '<p>Estrellas ganadas:</p>';
    for (let i = 0; i < starCount; i++) {
        starsHtml += '<img src="img/star.png" alt="star" width="20" height="20">';
    }
    quiz.insertAdjacentHTML('beforeend', starsHtml);
}

const finishButton = document.getElementById('finish-btn');
finishButton.addEventListener('click', finishQuiz);

function finishQuiz() {
    showSummary();
}


nextButton.addEventListener('click', nextQuestion);



