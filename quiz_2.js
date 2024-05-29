// Obtener la categoría y el nivel seleccionados por el usuario
const categoriaSeleccionada = document.getElementById("category").value;
const nivelSeleccionado = document.getElementById("level").value;

// Obtener preguntas correspondientes a la categoría y nivel seleccionados
const preguntasSeleccionadas = preguntas[categoriaSeleccionada][nivelSeleccionado];
const containerPreguntas = document.getElementById("question");
containerPreguntas.innerHTML = "";

preguntasSeleccionadas.forEach((pregunta, index) => {
    const preguntaHTML = `<p>Pregunta ${index + 1}: ${pregunta.pregunta}</p>`;
    containerPreguntas.insertAdjacentHTML("beforeend", preguntaHTML);
});
