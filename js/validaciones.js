//importamos la función save desde firebase.js para guardar los datos en la base de datos
import { save, getData, deleteData, getById, editData } from "./firebase.js"
let id = ''
document.getElementById('btnGuardar').addEventListener('click', () => {

    let msj = ''
    document.querySelectorAll('form input,textarea').forEach(item => {
        if (item.value.trim() == '') {
            msj += `Debe ingresar el campo ${item.name} \n`
        }
    })
    if (msj != '') {
        alert(msj)
        return false
    }
    else {
        if (id == '') {
            //datos es un objeto que captura todos los valores ingresados en el formulario
            const datos = {
                nombre: document.getElementById('name').value,
                email: document.getElementById('email').value,
                fecha: document.getElementById('birthdate').value,
                mensaje: document.getElementById('message').value
            }
            console.log(datos)
            save(datos)
        } else {
            const datos = {
                nombre: document.getElementById('name').value,
                email: document.getElementById('email').value,
                fecha: document.getElementById('birthdate').value,
                mensaje: document.getElementById('message').value
            }
            editData(id, datos)
            id = ''
        }
        alert('Datos guardados correctamente')
    }
})

//DOMContentLoaded es un evento que se ejecuta cuando el documento HTML ha sido completamente cargado y parseado, sin esperar a que las hojas de estilo, imágenes y subframes terminen de cargar
window.addEventListener('DOMContentLoaded', () => {
    //getData es una función que se encarga de escuchar los cambios en la colección de contactos, cada vez que hay un cambio en la colección, se ejecuta la función que recibe como parámetro, en este caso, una función que recibe un snapshot de la colección, el snapshot es un objeto que contiene toda la información de la colección, incluyendo los documentos y sus datos
    getData((coleccion) => {
        let tabla = ''
        coleccion.forEach(doc => {
            //doc.data() es una función que se encarga de obtener los datos de cada documento, devuelve un objeto con los datos del documento
            const datos = doc.data()
            tabla += `
                <tr>
                    <td>${datos.nombre}</td>
                    <td>${datos.email}</td>
                    <td>${datos.fecha}</td>
                    <td>${datos.mensaje}</td>
                    <td>
                        <button class="btnEliminar" id="${doc.id}">Eliminar</button>
                        <button class="btnEditar" id="${doc.id}">Editar</button>
                    </td>
                </tr>
            `
        })
        document.getElementById('tablaContactos').innerHTML = tabla
        // permite eliminar el registro
        const btnEliminar = document.querySelectorAll('.btnEliminar')
        btnEliminar.forEach(btn => {
            btn.addEventListener('click', () => {
                deleteData(btn.id)
            })
        })
        // permite editar el registro
        const btnEditar = document.querySelectorAll('.btnEditar')
        btnEditar.forEach(btn => {
            btn.addEventListener('click', async () => {
                const datos = await getById(btn.id)
                document.getElementById('name').value = datos.nombre
                document.getElementById('email').value = datos.email
                document.getElementById('birthdate').value = datos.fecha
                document.getElementById('message').value = datos.mensaje
                id = btn.id
            })
        })
    });
});