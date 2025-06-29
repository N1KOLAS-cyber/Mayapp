// Cargar configuración y conectar Firebase

const firebaseConfig = {
  apiKey: "AIzaSyA_EJg0HGIAec-ljYBkZdx2xI6JjnRIdOQ",
  authDomain: "mayapp-24fb1.firebaseapp.com",
  databaseURL: "https://mayapp-24fb1-default-rtdb.firebaseio.com",
  projectId: "mayapp-24fb1",
  storageBucket: "mayapp-24fb1.appspot.com",
  messagingSenderId: "80018177609",
  appId: "1:80018177609:web:5219c721c45c26af8a4998",
  measurementId: "G-J44N0JC2M4"
};

// Inicializa Firebase en modo compat
firebase.initializeApp(firebaseConfig);

// Conexiones útiles
const db = firebase.database();

// Autenticación anónima
firebase.auth().signInAnonymously()
  .then((userCredential) => {
    const uid = userCredential.user.uid;
    console.log("Jugador conectado con UID:", uid);
    window.uidJugador = uid;
  })
  .catch((error) => {
    console.error("Error al iniciar sesión anónima:", error);
  });

// Crear una nueva sala
function crearSala(nombreJugador) {
  const uid = window.uidJugador;
  const codigoSala = Math.random().toString(36).substring(2, 8); // ej: 'a2f9dk'

  const salaRef = firebase.database().ref("salas/" + codigoSala);


  // Dummys de preguntas Temporales y a remplasar por las del .json
  const preguntasDummy = [
    { texto: "¿Cómo se dice uno en maya?", opciones: ["Jun", "Ka’a", "Óox"], correcta: "Jun" },
    { texto: "¿Qué significa 'Ka’a'?", opciones: ["Dos", "Tres", "Cinco"], correcta: "Dos" }
  ];

  salaRef.set({
    jugadores: {
      [uid]: {
        nombre: nombreJugador || "Jugador 1",
        aciertos: 0
      }
    },
    preguntas: preguntasDummy,
    actual: 0,
    iniciada: true
  }).then(() => {
  console.log("✅ Sala guardada en Firebase");
}).catch((error) => {
  console.error("🔥 Error al guardar la sala:", error);
});

  console.log("✅ Sala creada con código:", codigoSala);
  escucharJugadores(codigoSala);
  window.codigoSala = codigoSala;
  window.esAnfitrion = true;
escucharPregunta(codigoSala, sincronizarPregunta);

  return codigoSala;  
}

// Unirse a una sala existente
function unirseSala(codigoSala, nombreJugador) {
  const uid = window.uidJugador;
  const salaRef = firebase.database().ref("salas/" + codigoSala);

  salaRef.once("value").then((snapshot) => {
    if (!snapshot.exists()) {
      console.error("❌ Sala no encontrada");
      return;
    }

    salaRef.child("jugadores/" + uid).set({
      nombre: nombreJugador || "Jugador X",
      aciertos: 0
    }).then(() => {
  console.log("✅ Sala guardada en Firebase");
}).catch((error) => {
  console.error("🔥 Error al guardar la sala:", error);
});

    console.log("✅ Unido a la sala:", codigoSala);
    escucharJugadores(codigoSala);
    window.codigoSala = codigoSala;
    window.esAnfitrion = false;
    escucharPregunta(codigoSala, sincronizarPregunta);

  });
}



// Escucha en tiempo real a los jugadores conectados en la sala
function escucharJugadores(codigoSala) {
  const listaUl = document.getElementById("lista-jugadores");
  const contenedor = document.getElementById("jugadores-conectados");
  contenedor.style.display = "block";

  const jugadoresRef = firebase.database().ref("salas/" + codigoSala + "/jugadores");

  jugadoresRef.on("value", (snapshot) => {
    const jugadores = snapshot.val();
    listaUl.innerHTML = ""; // Limpiar la lista

    for (const uid in jugadores) {
      const li = document.createElement("li");
      li.textContent = jugadores[uid].nombre || "Jugador sin nombre";
      listaUl.appendChild(li);
    }
  });
}

function enviarPregunta(codigoSala, pregunta) {
  return firebase.database().ref("salas/" + codigoSala + "/preguntaActual").set(pregunta);
}

function escucharPregunta(codigoSala, callback) {
  const ref = firebase.database().ref("salas/" + codigoSala + "/preguntaActual");
  ref.on("value", (snapshot) => {
    const pregunta = snapshot.val();
    if (pregunta) callback(pregunta);
  });
}
window.crearSala = crearSala;
window.unirseSala = unirseSala;
window.enviarPregunta = enviarPregunta;
window.escucharPregunta = escucharPregunta;

console.log("📩 Marcando respuesta de:", window.uidJugador, "en pregunta", getPreguntaActual());
function marcarRespuestaComoHecha(codigoSala, uid, numeroPregunta) {
  firebase.database().ref(`salas/${codigoSala}/respuestas/${numeroPregunta}/${uid}`).set(true);
}
window.marcarRespuestaComoHecha = marcarRespuestaComoHecha;

console.log("✅ Guardada respuesta en Firebase");

function escucharRespuestas(codigoSala, numeroPregunta, callback) {
  const ref = firebase.database().ref(`salas/${codigoSala}/respuestas/${numeroPregunta}`);
  ref.on("value", (snapshot) => {
    const respuestas = snapshot.val() || {};
    callback(respuestas);
  });
}

window.marcarRespuestaComoHecha = marcarRespuestaComoHecha;
window.escucharRespuestas = escucharRespuestas;