// main.js
// Este archivo contiene la lógica principal del juego de preguntas y respuestas en JavaScript.
// Maneja la carga de preguntas, la interacción del usuario y el cálculo del puntaje.

import { barajar, seleccionarPreguntasAleatorias } from "./utilidades.js";
import {
  sonidoCorrecto,
  sonidoIncorrecto,
  sonidoFinal,
  musicaFondo,
  iniciarMusica,
  cambiarVolumenMusica,
  cambiarVolumenSonido,
  toggleMuteMusica
} from "./sonido.js";
import {
  getPreguntas,
  setPreguntas,
  getPreguntaActual,
  setPreguntaActual,
  getPuntaje,
  setPuntaje,
  incrementarPuntaje,
  getRecordsPorCategoria,
  setRecordsPorCategoria,
  getCategoriaSeleccionada,
  setCategoriaSeleccionada,
  getRecordActual
} from "./estado.js";
import { manejarRespuestasYContinuar } from "./utilidades.js";
import { guardarResultado } from './estados.js';
import { guardarResultado } from './firebaseServicio.js';




const botonInicio = document.getElementById("boton-inicio");
const preguntaContainer = document.getElementById("pregunta-container");
const preguntaTexto = document.getElementById("pregunta-texto");
const opcionesDiv = document.getElementById("opciones");
const resultadoTexto = document.getElementById("resultado");
const botonReiniciar = document.getElementById("boton-reiniciar"); 
const selectorCategoria = document.getElementById("selector-categoria");
const categoriaActivaTexto = document.getElementById("categoria-activa");
const botonCambiar = document.getElementById("boton-cambiar");
const iconoCambiar = document.getElementById("icono-cambiar");
const menuDesplegable = document.getElementById("menu-desplegable");
const menuSonido = document.getElementById("menu-sonido");
const volumenMusica = document.getElementById("volumen-musica");
const volumenSonido = document.getElementById("volumen-sonido");
const toggleMute = document.getElementById("toggle-mute");
const recordTexto = document.getElementById("record-texto");

let musicaSilenciada = false;

// Mostrar récords al cargar
window.addEventListener("load", () => {
  musicaFondo.play().catch(() => {});
  mostrarTablaRecords();
});

botonInicio.addEventListener("click", () => {
  setCategoriaSeleccionada(selectorCategoria.value);
  const categoria = getCategoriaSeleccionada();
  fetch("preguntas.json")
    .then((r) => r.json())
    .then((datos) => {
      const filtradas = categoria ? datos.filter(p => p.categoria === categoria) : datos;
      setPreguntas(seleccionarPreguntasAleatorias(filtradas, 8));
      setPreguntaActual(0);
      setPuntaje(0);

      if (getPreguntas().length === 0) {
        preguntaTexto.textContent = "No hay preguntas disponibles para esta categoría.";
        return;
      }

      preguntaContainer.style.display = "block";
      selectorCategoria.style.display = "none";
      botonInicio.style.display = "none";
      categoriaActivaTexto.style.display = "block";
      categoriaActivaTexto.textContent = categoria
        ? `Categoría: ${selectorCategoria.options[selectorCategoria.selectedIndex].text}`
        : "Categoría: Todas las Categorías";
      botonCambiar.style.display = "none";
      iconoCambiar.style.display = "inline-block";

      ocultarTablaRecords();
      mostrarPregunta();
    
if (window.esAnfitrion) {
  const pregunta = getPreguntas()[0];
  enviarPregunta(window.codigoSala, pregunta);
}

    });
});
const auth = firebase.auth();
const db = firebase.database();

function mostrarPregunta() {
  resultadoTexto.textContent = "";
  const preguntas = getPreguntas();
  const i = getPreguntaActual();
  if (!preguntas || !preguntas[i]) {
    console.warn("❗ Pregunta no encontrada. Índice:", i, "Preguntas:", preguntas);
    return;
  }
  const pregunta = preguntas[i];

  preguntaTexto.textContent = pregunta.texto;
  document.title = getCategoriaSeleccionada()
    ? `Duolingo Maya – ${getCategoriaSeleccionada()}`
    : "Duolingo Maya – Todas las Categorías";

  opcionesDiv.innerHTML = "";
  const opciones = structuredClone(pregunta.opciones);
  barajar(opciones);
  opciones.forEach(opcion => {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.classList.add("boton-animado");
    boton.onclick = () => verificarRespuesta(opcion);
    opcionesDiv.appendChild(boton);
  });
}

function verificarRespuesta(opcion, correctaForzada = null) {
  const preguntas = getPreguntas();
  const i = getPreguntaActual();
  const correcta = correctaForzada || preguntas[i]?.correcta;

  if (opcion === correcta) {
    resultadoTexto.textContent = "✅ ¡Correcto!";
    resultadoTexto.style.color = "green";
    incrementarPuntaje();
      // Registrar acierto en Firebase
  if (window.codigoSala && window.uidJugador) {
    const ref = firebase.database().ref(`salas/${window.codigoSala}/jugadores/${window.uidJugador}/aciertos`);
    ref.transaction((aciertos) => (aciertos || 0) + 1);
  }
    sonidoCorrecto.play();
    
    } else {
    resultadoTexto.textContent = `❌ Incorrecto. La respuesta correcta era "${correcta}".`;
    resultadoTexto.style.color = "red";
    sonidoIncorrecto.play();
  }
if (window.codigoSala && window.uidJugador) {
  window.marcarRespuestaComoHecha(window.codigoSala, window.uidJugador, getPreguntaActual());
}

  setTimeout(() => {
  const siguiente = getPreguntaActual() + 1;
  const preguntas = getPreguntas();

  if (siguiente < preguntas.length) {
    if (window.codigoSala && window.esAnfitrion) {
      manejarRespuestasYContinuar(window.codigoSala, getPreguntaActual(), () => {
        const siguiente = getPreguntaActual() + 1;
        if (siguiente < preguntas.length) {
          setPreguntaActual(siguiente);
          window.enviarPregunta(window.codigoSala, preguntas[siguiente]);
        } else {
          mostrarResultadoFinal();
        }
      }); 
    } else {
      setPreguntaActual(siguiente);
      mostrarPregunta();
    }
  } else {
    mostrarResultadoFinal();
  }
}, 800);
}


function mostrarResultadoFinal() {
  const total = getPreguntas().length;
  const puntaje = getPuntaje();
  const categoria = getCategoriaSeleccionada() || "Todas";
  let records = getRecordsPorCategoria();

  sonidoFinal.play();
  let mensaje = `Terminaste 🎉 Obtuviste ${puntaje} de ${total} correctas.`;
  if (!records[categoria] || puntaje > records[categoria]) {
    records[categoria] = puntaje;
    setRecordsPorCategoria(records);
    mensaje += " 🏆 ¡Nuevo récord!";
  } else {
    mensaje += ` 🏅 Tu récord actual en esta categoría es ${records[categoria]}.`;
  }
 // Actualizar el texto del récord
  recordTexto.textContent = `Récord actual: ${records[categoria]} puntos.`;
  preguntaTexto.textContent = mensaje;
  opcionesDiv.innerHTML = "";
  resultadoTexto.textContent = "";
  botonReiniciar.style.display = "inline-block";
  botonCambiar.style.display = "inline-block";
  iconoCambiar.style.display = "none";

    // ✅ Guardar el resultado en Firebase
  guardarResultado(puntaje, total);

}


botonReiniciar.onclick = async () => {
  const categoria = getCategoriaSeleccionada();
  const snapshot = await firebase.database().ref("preguntas").once("value");
const datos = Object.values(snapshot.val());
const filtradas = categoria ? datos.filter(p => p.categoria === categoria) : datos;
setPreguntas(seleccionarPreguntasAleatorias(filtradas, 8));
setPreguntaActual(0);
setPuntaje(0);
preguntaTexto.textContent = "";
opcionesDiv.innerHTML = "";
resultadoTexto.textContent = "";
mostrarPregunta();

const preguntas = getPreguntas();
if (window.esAnfitrion && window.codigoSala) {
  window.enviarPregunta(window.codigoSala, preguntas);
}

      botonReiniciar.style.display = "none";
      botonCambiar.style.display = "none";
      iconoCambiar.style.display = "inline-block";
    };
      // Si estamos en una sala, mostrar aciertos por jugador
  if (window.codigoSala) {
    const ref = firebase.database().ref("salas/" + window.codigoSala + "/jugadores");

    ref.once("value").then((snapshot) => {
      const jugadores = snapshot.val();
      if (!jugadores) return;

      // Convertir a array y ordenar por aciertos descendente
      const lista = Object.entries(jugadores).map(([uid, data]) => ({
        nombre: data.nombre || "Jugador",
        aciertos: data.aciertos || 0
      })).sort((a, b) => b.aciertos - a.aciertos);

      // Crear tabla
      const tabla = document.createElement("table");
      tabla.style.marginTop = "1em";
      tabla.style.borderCollapse = "collapse";
      tabla.style.width = "100%";
      tabla.innerHTML = `
        <thead>
          <tr><th style="text-align:left; padding:4px;">Jugador</th><th style="text-align:right; padding:4px;">Aciertos</th></tr>
        </thead>
        <tbody>
          ${lista.map(j => `<tr><td style="padding:4px;">${j.nombre}</td><td style="text-align:right; padding:4px;">${j.aciertos}</td></tr>`).join("")}
        </tbody>
      `;

      // Mostrarla debajo del mensaje
      preguntaTexto.appendChild(tabla);
    });
  }



botonCambiar.onclick = () => {
  selectorCategoria.style.display = "inline-block";
  botonInicio.style.display = "inline-block";
  categoriaActivaTexto.style.display = "none";
  botonCambiar.style.display = "none";
  iconoCambiar.style.display = "none";
  preguntaTexto.textContent = "";
  resultadoTexto.textContent = "";
  opcionesDiv.innerHTML = "";
  botonReiniciar.style.display = "none";
  mostrarTablaRecords();
};

iconoCambiar.onclick = botonCambiar.onclick;

menuSonido.onclick = () => {
  menuDesplegable.style.display = menuDesplegable.style.display === "none" ? "block" : "none";
};

volumenMusica.oninput = () => cambiarVolumenMusica(volumenMusica.value);
volumenSonido.oninput = () => cambiarVolumenSonido(volumenSonido.value);
toggleMute.onclick = () => {
  musicaSilenciada = !musicaSilenciada;
  toggleMuteMusica(musicaSilenciada);
  toggleMute.textContent = musicaSilenciada ? "🔇" : "🔊";
};

function mostrarTablaRecords() {
  const tabla = document.getElementById("tabla-records");
  const cuerpo = document.getElementById("tabla-records-body");
  const records = getRecordsPorCategoria();
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

function ocultarTablaRecords() {
  document.getElementById("tabla-records").style.display = "none";
}

// 🔄 Función para sincronizar preguntas desde Firebase
//Está función esta en desuso, ya que ahora se sincroniza desde firebase.js pero 
// se deja aquí como referencia para futuras implementaciones
//O por si surge un error en firebase.js 

/*function sincronizarPregunta(pregunta) {
  console.log("📡 Pregunta recibida desde Firebase:", pregunta);

  preguntaTexto.textContent = pregunta.texto;
  opcionesDiv.innerHTML = "";

  const opciones = structuredClone(pregunta.opciones);
  barajar(opciones);

  opciones.forEach(opcion => {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.classList.add("boton-animado");
    boton.onclick = () => verificarRespuesta(opcion);
    opcionesDiv.appendChild(boton);
  });
} */

// 🌐 Expón globalmente para que firebase.js pueda usarla
window.sincronizarPregunta = sincronizarPregunta;

// 🔄 Función para sincronizar el estado del juego
const btnCrearSala = document.getElementById("btn-crear-sala");
const btnUnirseSala = document.getElementById("btn-unirse-sala");

btnCrearSala.onclick = () => {
  const nombre = document.getElementById("nombre-jugador").value.trim();
  if (!nombre) return alert("Ingresa tu nombre primero.");

  const codigo = window.crearSala(nombre); // Crea la sala y se une como anfitrión
  alert("Sala creada con código: " + codigo);
};

btnUnirseSala.onclick = () => {
  const nombre = document.getElementById("nombre-jugador").value.trim();
  const codigo = document.getElementById("codigo-sala").value.trim();

  if (!nombre || !codigo) return alert("Ingresa tu nombre y código de sala.");
  window.unirseSala(codigo, nombre); // Se une como jugador normal
};

window.mostrarPregunta = mostrarPregunta;
function sincronizarPregunta(pregunta) {
  if (!pregunta || !pregunta.texto) return;

  resultadoTexto.textContent = "";
  preguntaTexto.textContent = pregunta.texto;
  opcionesDiv.innerHTML = "";

  const opciones = structuredClone(pregunta.opciones);
  barajar(opciones);
  opciones.forEach(opcion => {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.classList.add("boton-animado");
    boton.onclick = () => verificarRespuesta(opcion, pregunta.correcta);
    opcionesDiv.appendChild(boton);
  });
}
