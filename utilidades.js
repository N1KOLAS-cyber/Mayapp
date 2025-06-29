//crear una función para barajar las preguntas
// Usamos el algoritmo de Fisher-Yates para barajar el array
function barajar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Función para seleccionar preguntas aleatorias sin repetir
function seleccionarPreguntasAleatorias(arrayOriginal, cantidad) {
  const copia = [...arrayOriginal]; // Hacemos una copia del arreglo
  barajar(copia); // Barajamos esa copia
  return copia.slice(0, Math.min(cantidad, copia.length)); // Tomamos la cantidad deseada sin repetir
}

function manejarRespuestasYContinuar(codigoSala, numeroPregunta) {
  window.escucharRespuestas(codigoSala, numeroPregunta, (respuestas) => {
    const jugadoresRef = firebase.database().ref(`salas/${codigoSala}/jugadores`);
    jugadoresRef.once("value").then(snapshot => {
      const totalJugadores = Object.keys(snapshot.val() || {}).length;
      const respondieron = Object.keys(respuestas).length;
console.log("📡 Esperando respuestas para la pregunta", numeroPregunta);

      if (respondieron === totalJugadores) {
        firebase.database().ref(`salas/${codigoSala}/respuestas/${numeroPregunta}`).remove();
        const siguiente = numeroPregunta + 1;
        const preguntas = getPreguntas();
        console.log("✅ Todos respondieron, enviando siguiente");
        if (siguiente < preguntas.length) {
          setPreguntaActual(siguiente);
          const siguientePregunta = preguntas[siguiente];
          window.enviarPregunta(codigoSala, siguientePregunta);
          manejarRespuestasYContinuar(codigoSala, siguiente); // Recursivo
        } else {
          mostrarResultadoFinal();
        }
      }
    });
  });
}


export { barajar, seleccionarPreguntasAleatorias };
export {manejarRespuestasYContinuar}
