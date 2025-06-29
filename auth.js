// Configura aquí tu Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
  databaseURL: "https://TU_PROJECT_ID.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Función de login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Sesión iniciada");
      window.location.href = "Index.html";
    })
    .catch(error => alert("Error: " + error.message));
}

// Función de registro
function registrar() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Usuario registrado");
      const uid = userCredential.user.uid;
      db.ref("usuarios/" + uid).set({ email });
      window.location.href = "Index.html";
    })
    .catch(error => alert("Error: " + error.message));
}
