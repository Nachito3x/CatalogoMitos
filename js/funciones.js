// tres formas de hacer funciones
function saludar() {
    alert("Hola, bienvenido a la clase de HTML")
}
//llamar a la función
saludar()
// función anónima
const despedir = function () {
    alert("Adiós, gracias por asistir a la clase de HTML")
}
//llamar a la función anónima
despedir()
// función flecha
const preguntar = () => {
    const respuesta = prompt("¿Te gustó la clase de HTML? (sí/no)")
    if (respuesta.toLowerCase() === "sí") {
        alert("¡Me alegra que te haya gustado!")
    } else {
        alert("¡Gracias por tu feedback, seguiré mejorando!")
    }
}
//llamar a la función flecha
preguntar()
//Tarea utilizando funciones validar el formulario de contacto
