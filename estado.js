// estado.js
// Este archivo contiene las variables del estado global del juego y funciones para acceder o modificarlas

// Variables del juego (estado)
let preguntas = [];
let preguntaActual = 0;
let puntaje = 0;
let recordsPorCategoria = JSON.parse(localStorage.getItem("recordsMaya")) || {};
let categoriaSeleccionada = "";

// Funciones para acceder y modificar el estado
export function setPreguntas(nuevasPreguntas) {
  preguntas = nuevasPreguntas;
  preguntaActual = 0;
}

export function getPreguntas() {
  return preguntas;
}

export function getPreguntaActual() {
  return preguntaActual;
}


export function avanzarPregunta() {
  preguntaActual++;
}

export function reiniciarEstado() {
  preguntas = [];
  preguntaActual = 0;
  puntaje = 0;
}

export function getPreguntaActualIndex() {
  return preguntaActual;
}

export function getPuntaje() {
  return puntaje;
}

export function incrementarPuntaje() {
  puntaje++;
}

export function getRecordActual(recordsPorCategoria, categoriaSeleccionada) {
  const categoriaKey = categoriaSeleccionada || "Todas";
  return recordsPorCategoria[categoriaKey] || 0;
}

export function actualizarRecord(categoria, nuevoPuntaje) {
  if (!recordsPorCategoria[categoria] || nuevoPuntaje > recordsPorCategoria[categoria]) {
    recordsPorCategoria[categoria] = nuevoPuntaje;
    localStorage.setItem("recordsMaya", JSON.stringify(recordsPorCategoria));
    return true; // indica que es nuevo récord
  }
  return false;
}

// Inicializa los records desde localStorage
export function getRecordsPorCategoria() {
  return JSON.parse(localStorage.getItem("recordsMaya")) || {};
}


export function setCategoriaSeleccionada(categoria) {
  categoriaSeleccionada = categoria;
}

export function getCategoriaSeleccionada() {
  return categoriaSeleccionada;
}
export function setPreguntaActual(index) {
  preguntaActual = index;
}
export function setPuntaje(nuevoPuntaje) {
  puntaje = nuevoPuntaje;
}
export function setRecordsPorCategoria(nuevosRecords) {
  recordsPorCategoria = nuevosRecords;
  localStorage.setItem("recordsMaya", JSON.stringify(recordsPorCategoria));
}
