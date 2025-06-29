// sonido.js
//Cargar audios
const sonidoCorrecto = new Audio("sonidos/correcto.wav");
const sonidoIncorrecto = new Audio("sonidos/incorrecto.wav");
const sonidoFinal = new Audio("sonidos/final.wav");
const musicaFondo = new Audio("sonidos/Peregrina.wav");
musicaFondo.loop = true;
musicaFondo.volume = 0.4;

//Control de volumen inicial
musicaFondo.volume = localStorage.getItem("volumenMusica") || 0.1;
sonidoCorrecto.volume =
sonidoIncorrecto.volume =
sonidoFinal.volume = localStorage.getItem("volumenSonido") || 1;

//Reproducir música cuando cargue la página
function iniciarMusica() {
  musicaFondo.play().catch(() => {
    console.log("🔇 Autoplay bloqueado, se iniciará tras interacción");
  });
}

//Ajustar volumen desde sliders
function cambiarVolumenMusica(valor) {
  musicaFondo.volume = valor;
  localStorage.setItem("volumenMusica", valor);
}

function cambiarVolumenSonido(valor) {
  sonidoCorrecto.volume = valor;
  sonidoIncorrecto.volume = valor;
  sonidoFinal.volume = valor;
  localStorage.setItem("volumenSonido", valor);
}

//Silenciar / Activar
function toggleMuteMusica(silenciado) {
  musicaFondo.volume = silenciado ? 0 : localStorage.getItem("volumenMusica") || 0.1;
}

//Exportar
export {
  sonidoCorrecto,
  sonidoIncorrecto,
  sonidoFinal,
  musicaFondo,
  iniciarMusica,
  cambiarVolumenMusica,
  cambiarVolumenSonido,
  toggleMuteMusica
};
