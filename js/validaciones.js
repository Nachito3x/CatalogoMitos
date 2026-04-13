//importamos la función save desde firebase.js para guardar los datos en la base de datos
import { save, getData, deleteData, getById, editData } from "./firebase.js"

let id = ''

//DOMContentLoaded es un evento que se ejecuta cuando cargan elementos resolviendo conflictos
window.addEventListener('DOMContentLoaded', () => {

    // Reseteo customizado
    const deckForm = document.getElementById('deckForm');
    if (deckForm) {
        deckForm.addEventListener('reset', () => {
            setTimeout(() => {
                if (window.updateStrategy) window.updateStrategy('Agro'); // valor por defecto al resetear
                id = '';
            }, 10);
        });
    }

    document.getElementById('btnGuardar').addEventListener('click', async (e) => {
        e.preventDefault();

        let msj = ''
        document.querySelectorAll('#deckForm input:not([type="hidden"]), #deckForm textarea, #deckForm select').forEach(item => {
            if (item.value.trim() == '') {
                msj += `Debe ingresar el campo ${item.name} \n`
            }
        })

        if (msj != '') {
            window.showToast("<b>Faltan Datos:</b><br/>" + msj, 'error')
            return false
        }
        else {
            const btnGuardar = document.getElementById('btnGuardar');
            const deckForm = document.getElementById('deckForm');

            if (!btnGuardar || !deckForm) {
                console.error("No se encontró el botón de guardado o el formulario en el DOM.");
                window.showToast("Error crítico de la interfaz.", "error");
                return false;
            }

            const originalBtnText = btnGuardar.innerHTML;
            btnGuardar.innerHTML = "Consagrando...";
            btnGuardar.disabled = true;

            try {
                const deckNameEl = document.getElementById('deckName');
                const deckExpansionEl = document.getElementById('deckExpansion');
                const deckStrategyEl = document.getElementById('deckStrategy');
                const deckDescEl = document.getElementById('deckDesc');
                const deckListEl = document.getElementById('deckList');

                if (!deckNameEl || !deckExpansionEl || !deckStrategyEl || !deckDescEl || !deckListEl) {
                    throw new Error("No se encontraron todos los inputs del formulario en el DOM.");
                }

                if (id == '') {
                    const datos = {
                        nombre: deckNameEl.value,
                        expansion: deckExpansionEl.value,
                        estrategia: deckStrategyEl.value,
                        descripcion: deckDescEl.value,
                        lista: deckListEl.value
                    }
                    console.log(datos)
                    await save(datos)
                } else {
                    const datos = {
                        nombre: deckNameEl.value,
                        expansion: deckExpansionEl.value,
                        estrategia: deckStrategyEl.value,
                        descripcion: deckDescEl.value,
                        lista: deckListEl.value
                    }
                    await editData(id, datos)
                    id = ''
                }
                window.showToast('Mazo consagrado exitosamente en la bóveda.', 'success')
                deckForm.reset();
            } catch (error) {
                console.error("Error saving document: ", error);
                window.showToast('Hubo un error al consagrar el mazo u ocurrio un error de lectura. Por favor, asegúrese de recargar la página.', 'error');
            } finally {
                btnGuardar.innerHTML = originalBtnText;
                btnGuardar.disabled = false;
            }
        }
    })

    getData((coleccion) => {
        let tabla = ''
        coleccion.forEach(doc => {
            const datos = doc.data()
            tabla += `
            <!-- Deck Item -->
            <div class="bg-surface-container-low p-4 hover:bg-surface-container-highest transition-colors flex items-center gap-4 group relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                <div class="w-16 h-16 bg-surface-container-lowest flex-shrink-0 border border-outline-variant/20 overflow-hidden">
                    <div class="w-full h-full bg-[#f2ca50]/20 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[#f2ca50]/50" data-icon="book">book</span>
                    </div>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-serif text-on-surface leading-tight">${datos.nombre}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] bg-primary/20 text-primary px-2 py-0.5 font-bold uppercase tracking-tighter">${datos.estrategia}</span>
                        <span class="text-[10px] text-outline uppercase tracking-widest font-medium">${datos.expansion}</span>
                    </div>
                </div>
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
        const deckContainer = document.getElementById('deckContainer');
        if (deckContainer) {
            deckContainer.innerHTML = tabla;
        } else {
            console.warn("Contenedor de mazos (deckContainer) no encontrado.");
        }

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
                document.getElementById('deckName').value = datos.nombre
                document.getElementById('deckExpansion').value = datos.expansion
                document.getElementById('deckDesc').value = datos.descripcion
                document.getElementById('deckList').value = datos.lista
                if (window.updateStrategy) window.updateStrategy(datos.estrategia)
                id = btn.id
            })
        })
    });
});