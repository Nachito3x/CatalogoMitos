// Importamos las funciones necesarias del SDK de Firebase
// initializeApp: inicializa la aplicación con la configuración del proyecto
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

// addDoc: agrega un nuevo documento a una colección
// collection: referencia a una colección de la base de datos
// getFirestore: obtiene la instancia de la base de datos Firestore
// onSnapshot: escucha cambios en tiempo real en una colección
// deleteDoc: elimina un documento
// updateDoc: actualiza un documento existente
// doc: crea una referencia a un documento específico por ID
// getDoc: obtiene un documento una sola vez (sin escucha en tiempo real)
import { addDoc, collection, getFirestore, onSnapshot, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Configuración del proyecto Firebase
// Estos valores son únicos del proyecto y vienen de la consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBUhZ2xZep0sBA3-q7dHHUOxsdi2cNz7k0",
  authDomain: "catalogo-de-cartas-mitos.firebaseapp.com",
  projectId: "catalogo-de-cartas-mitos",
  storageBucket: "catalogo-de-cartas-mitos.firebasestorage.app",
  messagingSenderId: "420518453867",
  appId: "1:420518453847:web:1f98bf23469150c7d3872e"
};

// Inicializamos la aplicación Firebase con la configuración anterior
const app = initializeApp(firebaseConfig);

// Obtenemos la instancia de Firestore (la base de datos)
const db = getFirestore(app);

// Guarda un nuevo mazo en la colección "mazos"
// Recibe un objeto "datos" con: nombre, expansion, estrategia, raza, lista
// Retorna una promesa con la referencia al documento creado
export const save = async (datos) => {
  return await addDoc(collection(db, "mazos"), datos)
}

// Escucha cambios en tiempo real en la colección "mazos"
// Recibe una función "data" (callback) que se ejecuta automáticamente
// cada vez que se agrega, modifica o elimina un mazo en Firebase
export const getData = (data) => {
  onSnapshot(collection(db, 'mazos'), data)
}

// Elimina un mazo de la colección por su ID de documento
// El ID lo provee Firebase al crear el documento (no es el id de la carta)
export const deleteData = (id) => {
  console.log(id)
  deleteDoc(doc(db, "mazos", id))
}

// Obtiene un único mazo por su ID de documento
// Retorna los datos del documento como un objeto plano
export const getById = async (id) => {
  const docSnap = await getDoc(doc(db, "mazos", id))
  return docSnap.data()
}

// Actualiza un mazo existente con nuevos datos
// Recibe el ID del documento y el objeto con los campos a actualizar
export const editData = async (id, datos) => {
  return await updateDoc(doc(db, "mazos", id), datos)
}
