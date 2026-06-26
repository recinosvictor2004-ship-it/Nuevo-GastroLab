import { 
    getCollection, 
    saveCollection, 
    updateDocLS, 
    addDocLS 
} from "./storage.js";

const lista = document.querySelector(".menu-grid");

// ELEMENTOS DEL MODAL
const modal = document.getElementById("modal-editar");
const tituloModal = document.getElementById("modal-titulo");
const editNombre = document.getElementById("edit-nombre");
const editDescripcion = document.getElementById("edit-descripcion");
const editPrecio = document.getElementById("edit-precio");
const editImagen = document.getElementById("edit-imagen");
const btnGuardar = document.getElementById("btn-guardar-cambios");
const btnCerrar = document.getElementById("btn-cerrar-modal");
const btnAgregar = document.getElementById("btn-agregar");

let idEditando = null;
let ingredientesTemp = [];

// ===============================
// CARGAR PLATILLOS
// ===============================
function cargarPlatillos() {
    lista.innerHTML = "";

    const platillos = getCollection("platillos");

    platillos.forEach(p => {
        lista.innerHTML += `
            <div class="menu-card">
                <img src="${p.imagen}" class="menu-img">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>

                <div class="menu-actions">
                    <button class="btn-primary" onclick="editarPlatillo('${p.id}')">Editar</button>
                    <button class="btn-danger" onclick="eliminarPlatillo('${p.id}')">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// ===============================
// CARGAR INSUMOS EN SELECT
// ===============================
function cargarInsumosSelect() {
    const insumos = getCollection("inventario");
    const select = document.getElementById("ingrediente-insumo");

    select.innerHTML = "";
    insumos.forEach(i => {
        select.innerHTML += `<option value="${i.id}">${i.nombre}</option>`;
    });
}

// ===============================
// MOSTRAR INGREDIENTES EN LISTA
// ===============================
function mostrarIngredientes() {
    const cont = document.getElementById("ingredientes-lista");
    cont.innerHTML = "";

    ingredientesTemp.forEach((ing, index) => {
        const insumo = getCollection("inventario").find(i => i.id === ing.insumoID);

        cont.innerHTML += `
            <div class="ingrediente-item">
                <span>${insumo?.nombre || "Insumo eliminado"} — ${ing.cantidad}</span>
                <button class="btn-danger" onclick="eliminarIngrediente(${index})">X</button>
            </div>
        `;
    });
}

window.eliminarIngrediente = (index) => {
    ingredientesTemp.splice(index, 1);
    mostrarIngredientes();
};

// ===============================
// AGREGAR INGREDIENTE
// ===============================
document.getElementById("btn-agregar-ingrediente").addEventListener("click", () => {
    const insumoID = document.getElementById("ingrediente-insumo").value;
    const cantidad = Number(document.getElementById("ingrediente-cantidad").value);

    if (!cantidad || cantidad <= 0) {
        alert("Cantidad inválida");
        return;
    }

    ingredientesTemp.push({ insumoID, cantidad });
    mostrarIngredientes();
});

// ===============================
// ABRIR MODAL PARA EDITAR
// ===============================
window.editarPlatillo = (id) => {
    idEditando = id;

    const platillo = getCollection("platillos").find(p => p.id === id);

    tituloModal.textContent = "Editar Platillo";

    editNombre.value = platillo.nombre;
    editDescripcion.value = platillo.descripcion;
    editPrecio.value = platillo.precio;
    editImagen.value = platillo.imagen;

    // Cargar ingredientes del platillo
    ingredientesTemp = [...platillo.ingredientes];

    cargarInsumosSelect();
    mostrarIngredientes();

    modal.style.display = "flex";
};

// ===============================
// ABRIR MODAL PARA CREAR
// ===============================
btnAgregar.addEventListener("click", () => {
    idEditando = null;

    tituloModal.textContent = "Agregar Platillo";

    editNombre.value = "";
    editDescripcion.value = "";
    editPrecio.value = "";
    editImagen.value = "";

    ingredientesTemp = [];

    cargarInsumosSelect();
    mostrarIngredientes();

    modal.style.display = "flex";
});

// ===============================
// GUARDAR CAMBIOS
// ===============================
btnGuardar.addEventListener("click", () => {

    if (idEditando) {
        updateDocLS("platillos", idEditando, {
            nombre: editNombre.value,
            descripcion: editDescripcion.value,
            precio: Number(editPrecio.value),
            imagen: editImagen.value,
            ingredientes: ingredientesTemp
        });

    } else {
        addDocLS("platillos", {
            id: crypto.randomUUID(),
            nombre: editNombre.value,
            descripcion: editDescripcion.value,
            precio: Number(editPrecio.value),
            imagen: editImagen.value,
            ingredientes: ingredientesTemp
        });
    }

    modal.style.display = "none";
    cargarPlatillos();
});

// ===============================
// CERRAR MODAL
// ===============================
btnCerrar.addEventListener("click", () => {
    modal.style.display = "none";
});

// ===============================
// ELIMINAR PLATILLO
// ===============================
window.eliminarPlatillo = (id) => {
    const platillos = getCollection("platillos");
    const nuevos = platillos.filter(p => p.id !== id);

    saveCollection("platillos", nuevos);
    cargarPlatillos();
};

// Ejecutar al cargar
cargarPlatillos();
