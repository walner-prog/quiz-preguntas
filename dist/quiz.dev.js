"use strict";

// Obtener elementos del DOM
var quiz = document.getElementById('quiz');
var questionElement = document.getElementById('question');
var optionsElement = document.getElementById('options');
var nextButton = document.getElementById('next-btn');
var resultElement = document.getElementById('result');
var categorySelection = document.getElementById('category');
var levelSelection = document.getElementById('level');
var startButton = document.getElementById('start-btn');
var nombreApellidoInput = document.getElementById('nombre-apellido');
var starsCounter = document.getElementById('stars-counter');
var repeatAudioButton = document.getElementById('repeat-audio-btn'); // Evento click en el botón de inicio

document.getElementById('start-btn').addEventListener('click', function () {
  // Ocultar etiquetas y campos de entrada
  document.getElementById('nombre-apellido-label').style.display = 'none';
  document.getElementById('nombre-apellido').style.display = 'none';
  document.getElementById('category-label').style.display = 'none';
  document.getElementById('category').style.display = 'none';
  document.getElementById('level-label').style.display = 'none';
  document.getElementById('level').style.display = 'none';
  document.getElementById('quiz-start-image').style.display = 'block'; // Resto de la lógica para empezar el quiz

  updateUserInfo(); // Actualizar información del usuario

  startQuiz(); // Iniciar el quiz
}); // Variables globales

var session = '';
var add_users = '';
var nombreApellido = 'Usuario';
var profilePictureData = '';
var currentQuestionIndex = 0;
var currentCategory = '';
var currentLevel = '';
var score = 0;
var totalQuestions = 0;
var incorrectQuestions = []; // Función para iniciar el quiz

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

  document.getElementById('user-info-container').style.display = 'block'; // Mostrar el contador de puntos

  document.getElementById('points-counter').style.display = 'inline'; // Mostrar el contador de estrellas

  var starsCounter = document.getElementById('stars-counter');

  if (starsCounter) {
    starsCounter.style.display = 'inline';
    starsCounter.textContent = '0'; // Inicializar a 0
  } // Obtener la cantidad total de preguntas para la categoría y nivel seleccionados


  totalQuestions = questions[currentCategory][currentLevel].length; // Cargar la primera pregunta

  loadQuestion(currentCategory, currentLevel);
}

var questionAudioPlayed = false; // Variable para controlar si el audio de la pregunta se ha reproducido

function loadQuestion(category, level) {
  // Obtener la pregunta actual según la categoría, nivel y el índice actual
  var currentQuestion = questions[category][level][currentQuestionIndex]; // Mostrar la pregunta en el elemento HTML y agregar una imagen opcional

  questionElement.innerHTML = "".concat(currentQuestion.question, " <img src=\"img/prueba.png\" alt=\"Happy Face\" width=\"30\" height=\"30\">");
  questionElement.classList.add('fade-in'); // Agregar clase para efecto de animación

  optionsElement.innerHTML = ''; // Limpiar opciones de preguntas anteriores
  // Generar botones para cada opción de respuesta

  currentQuestion.options.forEach(function (option) {
    var button = document.createElement('button');
    button.textContent = option;
    button.classList.add('custom-button'); // Agregar clase para estilo personalizado

    button.addEventListener('click', function () {
      checkAnswer(option, button); // Verificar respuesta al hacer clic en una opción
    });
    optionsElement.appendChild(button); // Agregar botón al contenedor de opciones
  }); // Actualizar el contador de preguntas

  document.getElementById('question-counter').textContent = "Pregunta ".concat(currentQuestionIndex + 1, " de ").concat(totalQuestions);
  resultElement.textContent = ''; // Limpiar mensaje de resultado anterior

  nextButton.style.display = 'none'; // Ocultar botón de siguiente pregunta

  playQuestionAudio(currentQuestion.question); // Reproducir el audio de la pregunta
} // Función para reproducir el audio de la pregunta


function playQuestionAudio(text) {
  // Convertir números en texto
  text = text.replace(/\d+/g, function (match) {
    var numberMap = {
      '0': 'cero',
      '1': 'uno',
      '2': 'dos',
      '3': 'tres',
      '4': 'cuatro',
      '5': 'cinco',
      '6': 'seis',
      '7': 'siete',
      '8': 'ocho',
      '9': 'nueve',
      '10': 'diez',
      '11': 'once',
      '12': 'doce',
      '13': 'trece',
      '14': 'catorce',
      '15': 'quince',
      '16': 'dieciséis',
      '17': 'diecisiete',
      '18': 'dieciocho',
      '19': 'diecinueve',
      '20': 'veinte',
      '30': 'treinta',
      '40': 'cuarenta',
      '50': 'cincuenta',
      '60': 'sesenta',
      '70': 'setenta',
      '80': 'ochenta',
      '90': 'noventa',
      '100': 'cien'
    };
    return numberMap[match] || match; // Si no es un número, devolver el mismo valor
  }); // Reemplazar símbolos de operaciones con su equivalente en texto

  var operationMap = {
    '+': 'más',
    '-': 'menos',
    'x': 'por',
    '/': 'dividido por',
    's': 'ese',
    'c': 'se' // Puedes agregar más símbolos y sus equivalencias en texto según sea necesario

  };
  text = text.replace(/[+\-x\/]/g, function (match) {
    return operationMap[match] || match;
  });
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES'; // Establecer el idioma a español

  speechSynthesis.speak(utterance);
}

function checkAnswer(selectedOption, button) {
  var currentQuestion = questions[currentCategory][currentLevel][currentQuestionIndex];
  var correctIcon = document.createElement('span');
  var incorrectIcon = document.createElement('span');
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

    var _buttons = optionsElement.getElementsByTagName('button');

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _buttons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var btn = _step.value;

        if (btn.textContent === currentQuestion.answer) {
          btn.appendChild(correctIcon.cloneNode(true));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } // Deshabilitar todos los botones de opción después de seleccionar


  var buttons = optionsElement.getElementsByTagName('button');
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = buttons[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _btn = _step2.value;
      _btn.disabled = true;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
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
} // Agregar evento al botón de inicio


startButton.addEventListener('click', startQuiz);

function updateUserInfo() {
  // Obtener el nombre del usuario del campo de entrada o establecerlo como "Usuario" por defecto
  var userName = document.getElementById('nombre-apellido').value.trim() || 'Usuario'; // Obtener la categoría y nivel seleccionados

  var selectedCategory = document.getElementById('category').value;
  var selectedLevel = document.getElementById('level').value; // Actualizar la información del usuario en el HTML

  document.getElementById('user-name').textContent = userName;
  document.getElementById('selected-category').textContent = selectedCategory;
  document.getElementById('selected-level').textContent = selectedLevel;
}

function showSummary() {
  // Ocultar el contenedor de información del usuario
  document.getElementById('user-info-container').style.display = 'none'; // Inicializar el HTML del resumen

  var summaryHtml = "<div class=\"container\"><h2>Resultado del Quiz</h2>"; // Agregar información del usuario al resumen

  summaryHtml += "<div style=\"color: #e65c00;\"><p><strong>Nombre:</strong> ".concat(nombreApellido, "</p>");
  summaryHtml += "<p><strong>Categor\xEDa:</strong> ".concat(currentCategory, "</p></div>");
  summaryHtml += "<div style=\"color: #e65c00; margin-top: 10px;\"><p><strong>Nivel:</strong> ".concat(currentLevel, "</p>");
  summaryHtml += "<p><strong>Puntuaci\xF3n:</strong> ".concat(score, "/").concat(questions[currentCategory][currentLevel].length * 5, "</p></div></div>"); // Verificar si todas las preguntas han sido respondidas

  if (currentQuestionIndex === questions[currentCategory][currentLevel].length) {
    // Agregar mensaje de completado al resumen
    summaryHtml += "<h2 style=\"color: #C4F8FC;\">Has completado el quiz. Puntuaci\xF3n: ".concat(score, "/").concat(questions[currentCategory][currentLevel].length * 5, "</h2>");

    if (score === questions[currentCategory][currentLevel].length * 5) {
      // Si todas las respuestas son correctas, agregar mensajes y medallas de logro
      summaryHtml += '<p style="color: green;">¡Perfecto! Has acertado todas las preguntas.</p>';
      summaryHtml += '<p><i class="fas fa-medal" style="color: gold; font-size: 24px;"></i> ¡Felicidades! Has ganado una medalla por responder todas las preguntas correctamente.</p>';
      summaryHtml += '<p><i class="fas fa-award" style="color: blue; font-size: 24px;"></i> ¡Felicidades! Has obtenido un Certificado de Excelencia.</p>';
      summaryHtml += '<p><i class="fas fa-unlock" style="color: purple; font-size: 24px;"></i> Tienes acceso a <a href="contenido-exclusivo.html" target="_blank">contenido exclusivo</a>.</p>';
    } else {
      // Si hay respuestas incorrectas, agregar mensaje y lista de preguntas incorrectas
      summaryHtml += '<h3 style="color: red;">Preguntas incorrectas:</h3>';
      incorrectQuestions.forEach(function (q, index) {
        summaryHtml += "<p style=\"color: lightcoral;\">".concat(index + 1, ". ").concat(q.question, "</p>");
        summaryHtml += "<p>Respuesta correcta: ".concat(q.answer, "</p>");
      });
    }
  } else {
    // Si no se han respondido todas las preguntas, mostrar resumen parcial
    summaryHtml += "<h2 style=\"color: #C4F8FC;\">Resumen del quiz:</h2>";
    summaryHtml += "<p>Puntuaci\xF3n actual: ".concat(score, "/").concat(questions[currentCategory][currentLevel].length * 5, "</p>");
    var remainingQuestions = questions[currentCategory][currentLevel].length - currentQuestionIndex;
    summaryHtml += "<p>Te faltan responder ".concat(remainingQuestions, " preguntas.</p>");

    var _starsEarned = Math.floor(score / 20);

    if (_starsEarned > 0) {
      summaryHtml += "<p>Estrellas ganadas: ".concat(_starsEarned, "</p>");
    } else {
      summaryHtml += '<p>No se ganaron estrellas hasta el momento.</p>';
    }

    if (incorrectQuestions.length > 0) {
      summaryHtml += '<h3 style="color: red;">Preguntas incorrectas:</h3>';
      incorrectQuestions.forEach(function (q, index) {
        summaryHtml += "<p style=\"color: lightcoral;\">".concat(index + 1, ". ").concat(q.question, "</p>");
        summaryHtml += "<p>Respuesta correcta: ".concat(q.answer, "</p>");
      });
    } else {
      summaryHtml += '<p style="color: green;">No hay preguntas incorrectas hasta el momento.</p>';
    }
  } // Agregar imágenes de estrellas ganadas al resumen


  var starsEarned = Math.floor(score / 20);

  if (starsEarned > 0) {
    summaryHtml += "<p style=\"margin-top: 5px;\">Estrellas ganadas:</p>";

    for (var i = 0; i < starsEarned; i++) {
      summaryHtml += '<img src="img/star.png" alt="star" width="20" height="20">';
    }
  } else {
    summaryHtml += "<p class=\"sumarsinestrellas\">No se ganaron estrellas.</p>";
  } // Agregar botones de descargar resultado y nuevo quiz al resumen


  summaryHtml += '<br><button id="download-btn">Descargar Resultado</button>';
  summaryHtml += '<br><button id="new-quiz-btn">Nuevo Quiz</button>'; // Mostrar el resumen en el contenedor de quiz

  quiz.innerHTML = summaryHtml; // Agregar eventos a los botones de descargar resultado y nuevo quiz

  document.getElementById('download-btn').addEventListener('click', downloadResults);
  document.getElementById('new-quiz-btn').addEventListener('click', function () {
    window.location.reload(); // Recargar la página para iniciar un nuevo quiz
  });
}

function downloadResults() {
  // Importar jsPDF desde el contexto global
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF(); // Establecer estilos generales del documento PDF

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(40); // Título y mensaje de agradecimiento

  doc.setFontSize(18);
  doc.text('Resultado del Quiz', 20, 20);
  doc.setFontSize(12);
  doc.text("Gracias por participar, ".concat(nombreApellido, "."), 20, 30); // Línea divisoria

  doc.setLineWidth(0.5);
  doc.setDrawColor(0);
  doc.line(20, 35, 190, 35); // Categoría y Nivel

  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text("Categor\xEDa: ".concat(currentCategory), 20, 45);
  doc.text("Nivel: ".concat(currentLevel), 20, 55); // Puntuación

  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text("Puntuaci\xF3n: ".concat(score, "/").concat(questions[currentCategory][currentLevel].length * 5), 20, 65); // Determinar si se han respondido todas las preguntas correctamente

  var startY = 85;

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
    doc.textWithLink('Haz clic aquí para acceder.', 90, startY, {
      url: 'contenido-exclusivo.html'
    });
  } else {
    // Mostrar preguntas incorrectas si las hay
    if (incorrectQuestions.length > 0) {
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(14);
      doc.text('Preguntas incorrectas:', 20, startY);
      startY += 10; // Ajuste para separar el título de las preguntas

      doc.setFontSize(12);
      incorrectQuestions.forEach(function (q, index) {
        var questionText = "".concat(index + 1, ". ").concat(q.question);
        var answerText = "Respuesta correcta: ".concat(q.answer);
        var lineHeight = 10;
        var textLines = doc.splitTextToSize("".concat(questionText, "\n").concat(answerText), 170);
        var remainingSpace = doc.internal.pageSize.height - startY;

        if (remainingSpace < textLines.length * lineHeight) {
          doc.addPage();
          startY = 20;
        }

        textLines.forEach(function (line) {
          doc.text(20, startY, line);
          startY += lineHeight;
        });
      });
    } else {
      doc.setTextColor(0, 128, 0);
      doc.setFontSize(14);
      doc.text('¡Perfecto! Has acertado todas las preguntas.', 20, startY);
    }
  } // Estrellas ganadas


  var starsEarned = Math.floor(score / 20);

  if (starsEarned > 0) {
    startY += 10; // Añadir un poco de espacio antes de las estrellas

    doc.setTextColor(40);
    doc.setFontSize(12);
    doc.text('Estrellas ganadas:', 20, startY);

    for (var i = 0; i < starsEarned; i++) {
      doc.addImage('img/star.png', 'PNG', 30 + i * 15, startY + 5, 10, 10);
    }
  } // Firma y derechos de autor


  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text('© 2024 Dev Web. Todos los derechos reservados.', 20, doc.internal.pageSize.height - 10); // Guardar el PDF

  doc.save('resultado_quiz.pdf');
}

function showStars(starCount) {
  // Generar HTML para mostrar las estrellas ganadas
  var starsHtml = '<p>Estrellas ganadas:</p>';

  if (starCount === 0) {
    starsHtml += '<p>No has ganado ninguna estrella.</p>';
  } else {
    for (var i = 0; i < starCount; i++) {
      starsHtml += '<img src="img/star.png" alt="star" width="20" height="20">';
    }
  } // Insertar HTML en el contenedor de quiz


  quiz.insertAdjacentHTML('beforeend', starsHtml);
} // Obtener referencia al botón de finalizar y agregar un evento click para finalizar el quiz


var finishButton = document.getElementById('finish-btn');
finishButton.addEventListener('click', finishQuiz); // Función para finalizar el quiz y mostrar el resumen

function finishQuiz() {
  showSummary(); // Ocultar el contenedor de información del usuario al finalizar el quiz

  document.getElementById('user-info-container').style.display = 'none';
} // Función para actualizar el contador de puntos en el HTML


function updatePoints() {
  document.getElementById('points-counter').textContent = score;
} // Función para actualizar el contador de estrellas en el HTML


function updateStarsCounter() {
  var starsEarned = Math.floor(score / 20); // Calcular estrellas ganadas

  starsCounter.textContent = starsEarned; // Actualizar el contador de estrellas en el HTML
} // Función para actualizar el contador de estrellas


function updateStars(starsEarned) {
  document.getElementById('stars-counter').textContent = starsEarned;
} // Agregar evento click al botón de siguiente pregunta


nextButton.addEventListener('click', nextQuestion);