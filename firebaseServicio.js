export function guardarResultado(puntaje, total) {
  const user = firebase.auth().currentUser;
  if (user) {
    const resultadosRef = firebase.database().ref("usuarios/" + user.uid + "/resultados");
    resultadosRef.push({
      puntaje,
      total,
      fecha: new Date().toISOString()
    });
  }
}
