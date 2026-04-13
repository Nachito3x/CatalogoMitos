import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { addDoc, collection, getFirestore, onSnapshot, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5EG433ZzTdqkfazkMMouqqLkZlkRsnTM",
  authDomain: "formularioapp-8c919.firebaseapp.com",
  projectId: "formularioapp-8c919",
  storageBucket: "formularioapp-8c919.firebasestorage.app",
  messagingSenderId: "776992313312",
  appId: "1:776992313312:web:e180503eb7b2cd7c376585"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export const save = (datos) => {
  //addDoc es la función que se encarga de guardar los datos en la colección, recibe dos parámetros, la referencia a la colección y los datos a guardar
  //collection es la función que se encarga de crear una referencia a la colección, recibe dos parámetros, la referencia a la base de datos y el nombre de la colección
  addDoc(collection(db, "contactos"), datos)
}

export const getData = (data) => {
  //onSnapshot es la función que se encarga de escuchar los cambios en la colección, recibe dos parámetros, la referencia a la colección y una función que se ejecuta cada vez que hay un cambio en la colección
  onSnapshot(collection(db, 'contactos'), data)
}

export const deleteData = (id) => {
  console.log(id)
  //deleteDoc es la función que se encarga de eliminar los datos de la colección, recibe dos parámetros, la referencia a la colección y el id del documento a eliminar
  deleteDoc(doc(db, "contactos", id))
}

export const getById = async (id) => {
  //getDoc es la función que se encarga de obtener los datos de un documento, recibe dos parámetros, la referencia a la colección y el id del documento a obtener
  const docSnap = await getDoc(doc(db, "contactos", id))
  return docSnap.data()
}

export const editData = (id, datos) => {
  //updateDoc es la función que se encarga de actualizar los datos de un documento, recibe dos parámetros, la referencia a la colección y el id del documento a actualizar
  updateDoc(doc(db, "contactos", id), datos)
}