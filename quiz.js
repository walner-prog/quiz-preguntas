// Obtener elementos del DOM
const quiz = document.getElementById('quiz');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultElement = document.getElementById('result');
const categorySelection = document.getElementById('category');
const levelSelection = document.getElementById('level');
const startButton = document.getElementById('start-btn');
const nombreApellidoInput = document.getElementById('nombre-apellido');
const starsCounter = document.getElementById('stars-counter');

// Evento click en el botón de inicio
document.getElementById('start-btn').addEventListener('click', function() {
    // Ocultar etiquetas y campos de entrada
    document.getElementById('nombre-apellido-label').style.display = 'none';
    document.getElementById('nombre-apellido').style.display = 'none';
    document.getElementById('category-label').style.display = 'none';
    document.getElementById('category').style.display = 'none';
    document.getElementById('level-label').style.display = 'none';
    document.getElementById('level').style.display = 'none';
    document.getElementById('quiz-start-image').style.display = 'block';

    // Resto de la lógica para empezar el quiz
    updateUserInfo(); // Actualizar información del usuario
    startQuiz(); // Iniciar el quiz
});

// Variables globales
let nombreApellido = 'Usuario';
let profilePictureData = '';
let currentQuestionIndex = 0;
let currentCategory = '';
let currentLevel = '';
let score = 0;
let totalQuestions = 0;
let incorrectQuestions = [];

// Función para iniciar el quiz
function startQuiz() {
    nombreApellido = nombreApellidoInput.value;
    currentCategory = categorySelection.value;
    currentLevel = levelSelection.value;
    currentQuestionIndex = 0; // Reiniciar índice para un nuevo juego
    score = 0; // Reiniciar puntaje para un nuevo juego
    incorrectQuestions = []; // Reiniciar preguntas incorrectas para un nuevo juego
    resultElement.textContent = ''; // Limpiar mensaje de resultado al inicio
    loadQuestion(currentCategory, currentLevel);
    startButton.style.display = 'none';
    categorySelection.disabled = true;
    levelSelection.disabled = true;
    nombreApellidoInput.style.display = 'none';
    finishButton.style.display = 'block'; // Mostrar el botón "Terminar Quiz"
    // Actualizar información del usuario

    // Mostrar el contenedor de información del usuario
    document.getElementById('user-info-container').style.display = 'block';
    // Mostrar el contador de puntos
    document.getElementById('points-counter').style.display = 'inline';

    // Mostrar el contador de estrellas
    const starsCounter = document.getElementById('stars-counter');
    if (starsCounter) {
        starsCounter.style.display = 'inline';
        starsCounter.textContent = '0'; // Inicializar a 0
    }

    // Obtener la cantidad total de preguntas para la categoría y nivel seleccionados
    totalQuestions = questions[currentCategory][currentLevel].length;
    // Cargar la primera pregunta
    loadQuestion(currentCategory, currentLevel);
}

function loadQuestion(category, level) {
    // Obtener la pregunta actual según la categoría, nivel y el índice actual
    const currentQuestion = questions[category][level][currentQuestionIndex];
    // Mostrar la pregunta en el elemento HTML y agregar una imagen opcional
    questionElement.innerHTML = `${currentQuestion.question} <img src="img/prueba.png" alt="Happy Face" width="30" height="30">`;
    questionElement.classList.add('fade-in'); // Agregar clase para efecto de animación
    optionsElement.innerHTML = ''; // Limpiar opciones de preguntas anteriores
    // Generar botones para cada opción de respuesta
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('custom-button'); // Agregar clase para estilo personalizado
        button.addEventListener('click', () => {
            checkAnswer(option, button); // Verificar respuesta al hacer clic en una opción
        });
        optionsElement.appendChild(button); // Agregar botón al contenedor de opciones
    });

    // Actualizar el contador de preguntas
    document.getElementById('question-counter').textContent = `Pregunta ${currentQuestionIndex + 1} de ${totalQuestions}`;

    resultElement.textContent = ''; // Limpiar mensaje de resultado anterior
    nextButton.style.display = 'none'; // Ocultar botón de siguiente pregunta
}

function checkAnswer(selectedOption, button) {
    const currentQuestion = questions[currentCategory][currentLevel][currentQuestionIndex];
    const correctIcon = document.createElement('span');
    const incorrectIcon = document.createElement('span');

    correctIcon.innerHTML = ' ✔️'; // Icono de respuesta correcta
    correctIcon.style.color = 'green'; // Estilo para respuestas correctas
    incorrectIcon.innerHTML = ' ❌'; // Icono de respuesta incorrecta
    incorrectIcon.style.color = 'red'; // Estilo para respuestas incorrectas

    // Verificar si la opción seleccionada es correcta
    if (selectedOption === currentQuestion.answer) {
        score += 5; // Sumar 5 puntos por respuesta correcta
        resultElement.textContent = '¡Respuesta correcta!';
        resultElement.style.backgroundColor = 'darkslategray'; // Fondo para respuesta correcta
        button.appendChild(correctIcon);
        updatePoints(); // Actualizar contador de puntos
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

    // Deshabilitar todos los botones de opción después de seleccionar
    const buttons = optionsElement.getElementsByTagName('button');
    for (let btn of buttons) {
        btn.disabled = true;
    }

    nextButton.style.display = 'block'; // Mostrar botón de siguiente pregunta

    // Verificar si la puntuación califica para ganar una estrella
    if (score % 20 === 0) {
        showStars(score / 20); // Mostrar estrellas ganadas
    }

    updateStarsCounter(); // Actualizar contador de estrellas
}

function nextQuestion() {
    currentQuestionIndex++; // Ir a la siguiente pregunta
    // Verificar si hay más preguntas en la lista
    if (currentQuestionIndex < questions[currentCategory][currentLevel].length) {
        loadQuestion(currentCategory, currentLevel); // Cargar la siguiente pregunta
    } else {
        showSummary(); // Mostrar resumen si no hay más preguntas
    }
}

// Agregar evento al botón de inicio
startButton.addEventListener('click', startQuiz);


function updateUserInfo() {
    // Obtener el nombre del usuario del campo de entrada o establecerlo como "Usuario" por defecto
    const userName = document.getElementById('nombre-apellido').value.trim() || 'Usuario';
    // Obtener la categoría y nivel seleccionados
    const selectedCategory = document.getElementById('category').value;
    const selectedLevel = document.getElementById('level').value;

    // Actualizar la información del usuario en el HTML
    document.getElementById('user-name').textContent = userName;
    document.getElementById('selected-category').textContent = selectedCategory;
    document.getElementById('selected-level').textContent = selectedLevel;
}

function showSummary() {
    // Ocultar el contenedor de información del usuario
    document.getElementById('user-info-container').style.display = 'none';
    // Inicializar el HTML del resumen
    let summaryHtml = `<div class="container"><h2>Resultado del Quiz</h2>`;
    // Agregar información del usuario al resumen
    summaryHtml += `<div style="color: #e65c00;"><p><strong>Nombre:</strong> ${nombreApellido}</p>`;
    summaryHtml += `<p><strong>Categoría:</strong> ${currentCategory}</p></div>`;
    summaryHtml += `<div style="color: #e65c00; margin-top: 10px;"><p><strong>Nivel:</strong> ${currentLevel}</p>`;
    summaryHtml += `<p><strong>Puntuación:</strong> ${score}/${questions[currentCategory][currentLevel].length * 5}</p></div></div>`;

    // Verificar si todas las preguntas han sido respondidas
    if (currentQuestionIndex === questions[currentCategory][currentLevel].length) {
        // Agregar mensaje de completado al resumen
        summaryHtml += `<h2 style="color: #C4F8FC;">Has completado el quiz. Puntuación: ${score}/${questions[currentCategory][currentLevel].length * 5}</h2>`;
        if (score === questions[currentCategory][currentLevel].length * 5) {
            // Si todas las respuestas son correctas, agregar mensajes y medallas de logro
            summaryHtml += '<p style="color: green;">¡Perfecto! Has acertado todas las preguntas.</p>';
            summaryHtml += '<p><i class="fas fa-medal" style="color: gold; font-size: 24px;"></i> ¡Felicidades! Has ganado una medalla por responder todas las preguntas correctamente.</p>';
            summaryHtml += '<p><i class="fas fa-award" style="color: blue; font-size: 24px;"></i> ¡Felicidades! Has obtenido un Certificado de Excelencia.</p>';
            summaryHtml += '<p><i class="fas fa-unlock" style="color: purple; font-size: 24px;"></i> Tienes acceso a <a href="contenido-exclusivo.html" target="_blank">contenido exclusivo</a>.</p>';
        } else {
            // Si hay respuestas incorrectas, agregar mensaje y lista de preguntas incorrectas
            summaryHtml += '<h3 style="color: red;">Preguntas incorrectas:</h3>';
            incorrectQuestions.forEach((q, index) => {
                summaryHtml += `<p style="color: lightcoral;">${index + 1}. ${q.question}</p>`;
                summaryHtml += `<p>Respuesta correcta: ${q.answer}</p>`;
            });
        }
    } else {
        // Si no se han respondido todas las preguntas, mostrar resumen parcial
        summaryHtml += `<h2 style="color: #C4F8FC;">Resumen del quiz:</h2>`;
        summaryHtml += `<p>Puntuación actual: ${score}/${questions[currentCategory][currentLevel].length * 5}</p>`;
        const remainingQuestions = questions[currentCategory][currentLevel].length - currentQuestionIndex;
        summaryHtml += `<p>Te faltan responder ${remainingQuestions} preguntas.</p>`;
        const starsEarned = Math.floor(score / 20);
        if (starsEarned > 0) {
            summaryHtml += `<p>Estrellas ganadas: ${starsEarned}</p>`;
        } else {
            summaryHtml += '<p>No se ganaron estrellas hasta el momento.</p>';
        }
        if (incorrectQuestions.length > 0) {
            summaryHtml += '<h3 style="color: red;">Preguntas incorrectas:</h3>';
            incorrectQuestions.forEach((q, index) => {
                summaryHtml += `<p style="color: lightcoral;">${index + 1}. ${q.question}</p>`;
                summaryHtml += `<p>Respuesta correcta: ${q.answer}</p>`;
            });
        } else {
            summaryHtml += '<p style="color: green;">No hay preguntas incorrectas hasta el momento.</p>';
        }
    }

    // Agregar imágenes de estrellas ganadas al resumen
    const starsEarned = Math.floor(score / 20);
    if (starsEarned > 0) {
        summaryHtml += `<p style="margin-top: 5px;">Estrellas ganadas:</p>`;
        for (let i = 0; i < starsEarned; i++) {
            summaryHtml += '<img src="img/star.png" alt="star" width="20" height="20">';
        }
    } else {
        summaryHtml += `<p class="sumarsinestrellas">No se ganaron estrellas.</p>`;
    }

    // Agregar botones de descargar resultado y nuevo quiz al resumen
    summaryHtml += '<br><button id="download-btn">Descargar Resultado</button>';
    summaryHtml += '<br><button id="new-quiz-btn">Nuevo Quiz</button>';
    // Mostrar el resumen en el contenedor de quiz
    quiz.innerHTML = summaryHtml;

    // Agregar eventos a los botones de descargar resultado y nuevo quiz
    document.getElementById('download-btn').addEventListener('click', downloadResults);
    document.getElementById('new-quiz-btn').addEventListener('click', () => {
        window.location.reload(); // Recargar la página para iniciar un nuevo quiz
    });
}

function downloadResults() {
    // Importar jsPDF desde el contexto global
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Establecer estilos generales del documento PDF
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(40);

    // Título y mensaje de agradecimiento
    doc.setFontSize(18);
    doc.text('Resultado del Quiz', 20, 20);
    doc.setFontSize(12);
    doc.text(`Gracias por participar, ${nombreApellido}.`, 20, 30);

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.line(20, 35, 190, 35);

    // Categoría y Nivel
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Categoría: ${currentCategory}`, 20, 45);
    doc.text(`Nivel: ${currentLevel}`, 20, 55);

    // Puntuación
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(`Puntuación: ${score}/${questions[currentCategory][currentLevel].length * 5}`, 20, 65);

    // Determinar si se han respondido todas las preguntas correctamente
    let startY = 85;
    if (score === questions[currentCategory][currentLevel].length * 5) {
        // Si todas las respuestas son correctas, mostrar mensajes y medallas de logro
        doc.setTextColor(0, 128, 0);
        doc.setFontSize(14);
        doc.text('¡Perfecto! Has acertado todas las preguntas.', 20, startY);
        startY += 10;
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text('Medalla de Oro: ', 20, startY);
        doc.addImage('img/oro.jpg', 'JPG', 80, startY - 5, 15, 15);
        startY += 20;
        doc.text('Certificado de Excelencia: ', 20, startY);
        doc.addImage('img/star.png', 'PNG', 110, startY - 5, 15, 15);
        startY += 20;
        doc.text('Acceso a contenido exclusivo: ', 20, startY);
        doc.setTextColor(0, 0, 255);
        doc.textWithLink('Haz clic aquí para acceder.', 90, startY, { url: 'contenido-exclusivo.html' });
    } else {
        // Mostrar preguntas incorrectas si las hay
        if (incorrectQuestions.length > 0) {
            doc.setTextColor(255, 0, 0);
            doc.setFontSize(14);
            doc.text('Preguntas incorrectas:', 20, startY);

            startY += 10; // Ajuste para separar el título de las preguntas

            doc.setFontSize(12);
            incorrectQuestions.forEach((q, index) => {
                const questionText = `${index + 1}. ${q.question}`;
                const answerText = `Respuesta correcta: ${q.answer}`;
                const lineHeight = 10;

                const textLines = doc.splitTextToSize(`${questionText}\n${answerText}`, 170);
                const remainingSpace = doc.internal.pageSize.height - startY;
                if (remainingSpace < textLines.length * lineHeight) {
                    doc.addPage();
                    startY = 20;
                }

                textLines.forEach(line => {
                    doc.text(20, startY, line);
                    startY += lineHeight;
                });
            });
        } else {
            doc.setTextColor(0, 128, 0);
            doc.setFontSize(14);
            doc.text('¡Perfecto! Has acertado todas las preguntas.', 20, startY);
        }
    }

    // Estrellas ganadas
    const starsEarned = Math.floor(score / 20);
    if (starsEarned > 0) {
        startY += 10; // Añadir un poco de espacio antes de las estrellas
        doc.setTextColor(40);
        doc.setFontSize(12);
        doc.text('Estrellas ganadas:', 20, startY);

        for (let i = 0; i < starsEarned; i++) {
            doc.addImage('img/star.png', 'PNG', 30 + (i * 15), startY + 5, 10, 10);
        }
    }

    // Firma y derechos de autor
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text('© 2024 Dev Web. Todos los derechos reservados.', 20, doc.internal.pageSize.height - 10);

    // Guardar el PDF
    doc.save('resultado_quiz.pdf');
}

function showStars(starCount) {
    // Generar HTML para mostrar las estrellas ganadas
    let starsHtml = '<p>Estrellas ganadas:</p>';
    if (starCount === 0) {
        starsHtml += '<p>No has ganado ninguna estrella.</p>';
    } else {
        for (let i = 0; i < starCount; i++) {
            starsHtml += '<img src="img/star.png" alt="star" width="20" height="20">';
        }
    }
    // Insertar HTML en el contenedor de quiz
    quiz.insertAdjacentHTML('beforeend', starsHtml);
}

// Obtener referencia al botón de finalizar y agregar un evento click para finalizar el quiz
const finishButton = document.getElementById('finish-btn');
finishButton.addEventListener('click', finishQuiz);

// Función para finalizar el quiz y mostrar el resumen
function finishQuiz() {
    showSummary();
    // Ocultar el contenedor de información del usuario al finalizar el quiz
    document.getElementById('user-info-container').style.display = 'none';
}

// Función para actualizar el contador de puntos en el HTML
function updatePoints() {
    document.getElementById('points-counter').textContent = score;
}

// Función para actualizar el contador de estrellas en el HTML
function updateStarsCounter() {
    const starsEarned = Math.floor(score / 20); // Calcular estrellas ganadas
    starsCounter.textContent = starsEarned; // Actualizar el contador de estrellas en el HTML
}

// Función para actualizar el contador de estrellas
function updateStars(starsEarned) {
    document.getElementById('stars-counter').textContent = starsEarned;
}

// Agregar evento click al botón de siguiente pregunta
nextButton.addEventListener('click', nextQuestion);
