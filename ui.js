// ui.js
// Módulo encargado de manejar la interfaz visual del juego

// Mostrar un elemento
function mostrarElemento(elemento) {
  elemento.style.display = "block";
}

// Ocultar un elemento
function ocultarElemento(elemento) {
  elemento.style.display = "none";
}

// Actualizar el texto de un elemento
function actualizarTexto(elemento, texto) {
  elemento.textContent = texto;
}

// Crear un botón de opción para una respuesta
function crearBotonOpcion(opcion, callback) {
  const boton = document.createElement("button");
  boton.textContent = opcion;
  boton.classList.add("boton-animado");
  boton.addEventListener("click", () => callback(opcion));
  return boton;
}

// Mostrar la tabla de récords por categoría
function mostrarTablaRecords(records) {
  const tabla = document.getElementById("tabla-records");
  const cuerpo = document.getElementById("tabla-records-body");
  cuerpo.innerHTML = "";

  for (const categoria in records) {
    const fila = document.createElement("tr");
    const celdaCat = document.createElement("td");
    const celdaScore = document.createElement("td");

    celdaCat.textContent = categoria;
    celdaScore.textContent = records[categoria];

    fila.appendChild(celdaCat);
    fila.appendChild(celdaScore);
    cuerpo.appendChild(fila);
  }

  tabla.style.display = "block";
}

// Ocultar la tabla de récords
function ocultarTablaRecords() {
  const tabla = document.getElementById("tabla-records");
  tabla.style.display = "none";
}

export {
  mostrarElemento,
  ocultarElemento,
  actualizarTexto,
  crearBotonOpcion,
  mostrarTablaRecords,
  ocultarTablaRecords
};