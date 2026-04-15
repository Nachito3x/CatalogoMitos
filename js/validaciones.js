// Importamos las funciones de firebase.js para operar con la base de datos
import { save, getData, deleteData, getById, editData } from "./firebase.js"

// Variable global que almacena el ID del mazo que se está editando.
// Cuando está vacía (''), significa que se va a crear un mazo nuevo.
// Cuando tiene valor, significa que se está editando un mazo existente.
let id = ''

// DOMContentLoaded garantiza que todo el HTML ya está cargado antes de
// ejecutar el código, evitando errores al buscar elementos del DOM.
window.addEventListener('DOMContentLoaded', () => {

    // ─── LISTENER DE RESET DEL FORMULARIO ───────────────────────────────────
    // Cuando el formulario se resetea (por limpiarFormulario o form.reset()),
    // se restaura la estrategia al valor por defecto "Agro" y se limpia el ID
    // de edición. El setTimeout(10ms) asegura que corre después del reset nativo.
    const deckForm = document.getElementById('deckForm');
    if (deckForm) {
        deckForm.addEventListener('reset', () => {
            setTimeout(() => {
                if (window.updateStrategy) window.updateStrategy('Agro');
                id = '';
            }, 10);
        });
    }

    // ─── BOTÓN CONSAGRAR MAZO (GUARDAR) ─────────────────────────────────────
    document.getElementById('btnGuardar').addEventListener('click', async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página

        // Validación: recorre todos los inputs visibles y selects del formulario.
        // Los inputs hidden y textareas readonly se excluyen porque no los rellena
        // el usuario directamente.
        let msj = ''
        document.querySelectorAll('#deckForm input:not([type="hidden"]), #deckForm textarea:not([readonly]), #deckForm select').forEach(item => {
            if (item.value.trim() == '') {
                msj += `Debe ingresar el campo ${item.name} \n`
            }
        })

        // Si hay campos vacíos, muestra un toast de error y detiene la ejecución
        if (msj != '') {
            window.showToast("<b>Faltan Datos:</b><br/>" + msj, 'error')
            return false
        }
        else {
            const btnGuardar = document.getElementById('btnGuardar');
            const deckForm = document.getElementById('deckForm');

            // Verificación defensiva: si por algún motivo los elementos no existen
            if (!btnGuardar || !deckForm) {
                console.error("No se encontró el botón de guardado o el formulario en el DOM.");
                window.showToast("Error crítico de la interfaz.", "error");
                return false;
            }

            // Deshabilita el botón y cambia su texto mientras se procesa,
            // para evitar envíos dobles accidentales
            const originalBtnText = btnGuardar.innerHTML;
            btnGuardar.innerHTML = "Consagrando...";
            btnGuardar.disabled = true;

            try {
                // Obtenemos referencias a todos los campos del formulario
                const deckNameEl = document.getElementById('deckName');
                const deckExpansionEl = document.getElementById('deckExpansion');
                const deckStrategyEl = document.getElementById('deckStrategy');   // input hidden
                const deckRazaEl = document.getElementById('deckRaza');
                const deckListEl = document.getElementById('deckList');           // input hidden con IDs de cartas

                if (!deckNameEl || !deckExpansionEl || !deckStrategyEl || !deckRazaEl || !deckListEl) {
                    throw new Error("No se encontraron todos los inputs del formulario en el DOM.");
                }

                // Si id está vacío, es un mazo nuevo → usamos save()
                // Si id tiene valor, es una edición → usamos editData()
                if (id == '') {
                    const datos = {
                        nombre: deckNameEl.value,
                        expansion: deckExpansionEl.value,
                        estrategia: deckStrategyEl.value,
                        raza: deckRazaEl.value,
                        // lista: string de IDs separados por coma, ej: "5,5,30,102"
                        // Cada número corresponde al campo "id" de una carta en el JSON
                        lista: deckListEl.value
                    }
                    console.log(datos)
                    await save(datos)
                } else {
                    const datos = {
                        nombre: deckNameEl.value,
                        expansion: deckExpansionEl.value,
                        estrategia: deckStrategyEl.value,
                        raza: deckRazaEl.value,
                        lista: deckListEl.value
                    }
                    await editData(id, datos)
                    id = '' // Limpiamos el ID de edición tras guardar
                }

                window.showToast('Mazo consagrado exitosamente en la bóveda.', 'success')

                // Limpia el formulario completo incluyendo la selección de cartas.
                // Si la función no está disponible (carga tardía), usa el reset nativo.
                if (window.limpiarFormulario) window.limpiarFormulario(); else deckForm.reset();

            } catch (error) {
                console.error("Error saving document: ", error);
                window.showToast('Hubo un error al consagrar el mazo u ocurrio un error de lectura. Por favor, asegúrese de recargar la página.', 'error');
            } finally {
                // Siempre restaura el botón, tanto si hubo éxito como si hubo error
                btnGuardar.innerHTML = originalBtnText;
                btnGuardar.disabled = false;
            }
        }
    })

    // ─── LISTENER EN TIEMPO REAL DE FIREBASE ────────────────────────────────
    // getData escucha la colección "mazos" en tiempo real.
    // Cada vez que se crea, edita o elimina un mazo, esta función se ejecuta
    // automáticamente y re-renderiza toda la lista de mazos en pantalla.
    getData((coleccion) => {
        let tabla = ''
        let deckCount = 0;

        // Iteramos sobre cada documento de la colección
        coleccion.forEach(doc => {
            deckCount++;
            const datos = doc.data() // Obtenemos los campos del documento

            // Construimos el HTML de cada tarjeta de mazo como template string.
            // doc.id es el ID único que Firebase asigna al documento.
            tabla += `
            <!-- Deck Item -->
            <div class="bg-surface-container-low p-4 hover:bg-surface-container-highest transition-colors flex items-center gap-4 group relative overflow-hidden">
                <!-- Barra dorada animada en el borde izquierdo al hacer hover -->
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                <!-- Ícono decorativo del mazo -->
                <div class="w-16 h-16 bg-surface-container-lowest flex-shrink-0 border border-outline-variant/20 overflow-hidden">
                    <div class="w-full h-full bg-[#f2ca50]/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[#f2ca50]/50" data-icon="book">book</span>
                    </div>
                </div>
                <!-- Información del mazo -->
                <div class="flex-1">
                    <h3 class="text-lg font-serif text-on-surface leading-tight">${datos.nombre}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        <!-- Badge de estrategia (Agro / Control / Mixto) -->
                        <span class="text-[10px] bg-primary/20 text-primary px-2 py-0.5 font-bold uppercase tracking-tighter">${datos.estrategia}</span>
                        <span class="text-[10px] text-outline uppercase tracking-widest font-medium">${datos.expansion}</span>
                        <!-- La raza solo se muestra si existe (los no-Aliados no tienen raza) -->
                        ${datos.raza ? `<span class="text-[10px] text-outline uppercase tracking-widest font-medium border-l border-outline-variant/30 pl-2 ml-1">${datos.raza}</span>` : ''}
                    </div>
                    <!-- Badge "Incompleto" en rojo si el mazo tiene menos de 49 cartas.
                         Se calcula contando los IDs en la lista separada por comas.
                         Si lista está vacía o no existe, también se muestra como incompleto. -->
                    ${(!datos.lista || datos.lista.split(',').filter(s => s.trim() !== '').length < 49) ? '<span class="text-[10px] text-error font-bold uppercase tracking-widest mt-1 inline-block">Incompleto</span>' : ''}
                </div>
                <!-- Botones de acción: el id del botón es el ID del documento en Firebase -->
                <div class="flex gap-2">
                    <button class="btnEditar p-2 text-primary/60 hover:text-primary transition-colors" id="${doc.id}">
                        <span class="material-symbols-outlined text-lg" data-icon="edit">edit</span>
                    </button>
                    <button class="btnEliminar p-2 text-error/60 hover:text-error transition-colors" id="${doc.id}">
                        <span class="material-symbols-outlined text-lg" data-icon="delete">delete</span>
                    </button>
                </div>
            </div>
            `
        })

        // Si no hay mazos, mostramos un mensaje vacío en lugar de la tabla
        const deckContainer = document.getElementById('deckContainer');
        if (deckCount === 0) {
            tabla = '<p class="text-outline/60 text-center text-sm font-serif italic py-6">Aún no has creado ningún mazo.</p>';
        }
        if (deckContainer) {
            deckContainer.innerHTML = tabla;
        } else {
            console.warn("Contenedor de mazos (deckContainer) no encontrado.");
        }

        // Actualizamos el contador "X/10 Mazos" y la barra de capacidad de almacenamiento
        const deckCounter = document.getElementById('deckCounter');
        if (deckCounter) deckCounter.innerText = `${deckCount}/10 Mazos`;

        // Calculamos el porcentaje de uso (máx. 10 mazos = 100%)
        let percentage = Math.floor((deckCount / 10) * 100);
        if (percentage > 100) percentage = 100;

        const storagePercentage = document.getElementById('storagePercentage');
        if (storagePercentage) storagePercentage.innerText = `${percentage}%`;

        // Actualizamos el ancho de la barra de progreso visual
        const storageBar = document.getElementById('storageBar');
        if (storageBar) {
            storageBar.style.width = `${percentage}%`;
        }

        // ─── BOTONES ELIMINAR ────────────────────────────────────────────────
        // Seleccionamos todos los botones con clase btnEliminar que se acaban
        // de renderizar y les asignamos el evento click.
        // El id del botón coincide con el ID del documento en Firebase.
        const btnEliminar = document.querySelectorAll('.btnEliminar')
        btnEliminar.forEach(btn => {
            btn.addEventListener('click', () => {
                deleteData(btn.id)
                // Firebase actualiza la lista en tiempo real automáticamente
            })
        })

        // ─── BOTONES EDITAR ──────────────────────────────────────────────────
        // Al hacer click, obtiene los datos del mazo desde Firebase por su ID
        // y rellena todos los campos del formulario con esos datos para editarlos.
        const btnEditar = document.querySelectorAll('.btnEditar')
        btnEditar.forEach(btn => {
            btn.addEventListener('click', async () => {
                const datos = await getById(btn.id) // Obtiene el mazo de Firebase

                // Rellenamos los campos básicos del formulario
                document.getElementById('deckName').value = datos.nombre
                document.getElementById('deckExpansion').value = datos.expansion

                // Actualizamos el select de razas según la expansión cargada
                if (window.updateRaces) window.updateRaces(datos.expansion)
                const razaSelect = document.getElementById('deckRaza');
                if (razaSelect && datos.raza) razaSelect.value = datos.raza

                // Reconstruye cartasSeleccionadas desde la string de IDs guardada
                // y actualiza el display visual de la lista de cartas
                if (window.cargarListaCartas) window.cargarListaCartas(datos.lista || '');

                // Marca el botón activo de estrategia visualmente
                if (window.updateStrategy) window.updateStrategy(datos.estrategia)

                // Guardamos el ID del documento para saber que estamos editando
                id = btn.id
            })
        })
    });
});
