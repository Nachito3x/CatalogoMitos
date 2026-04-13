import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { addDoc, collection, getFirestore, onSnapshot, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUhZ2xZep0sBA3-q7dHHUOxsdi2cNz7k0",
  authDomain: "catalogo-de-cartas-mitos.firebaseapp.com",
  projectId: "catalogo-de-cartas-mitos",
  storageBucket: "catalogo-de-cartas-mitos.firebasestorage.app",
  messagingSenderId: "420518453867",
  appId: "1:420518453867:web:1f98bf23469150c7d3872e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export const save = async (datos) => {
  //addDoc es la función que se encarga de guardar los datos en la colección, recibe dos parámetros, la referencia a la colección y los datos a guardar
  //collection es la función que se encarga de crear una referencia a la colección, recibe dos parámetros, la referencia a la base de datos y el nombre de la colección
  return await addDoc(collection(db, "contactos"), datos)
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

export const editData = async (id, datos) => {
  //updateDoc es la función que se encarga de actualizar los datos de un documento, recibe dos parámetros, la referencia a la colección y el id del documento a actualizar
  return await updateDoc(doc(db, "contactos", id), datos)
}