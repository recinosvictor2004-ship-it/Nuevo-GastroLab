import { 
    getCollection, 
    saveCollection, 
    updateDocLS, 
    addDocLS 
} from "./storage.js";

const lista = document.querySelector(".menu-grid");

// ELEMENTOS DEL MODAL
const modal = document.getElementById("modal-editar");
const editNombre = document.getElementById("edit-nombre");
const editDescripcion = document.getElementById("edit-descripcion");
const editPrecio = document.getElementById("edit-precio");
const editImagen = document.getElementById("edit-imagen");
const btnGuardar = document.getElementById("btn-guardar-cambios");
const btnCerrar = document.getElementById("btn-cerrar-modal");

let idEditando = null;

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
// ABRIR MODAL PARA EDITAR
// ===============================
window.editarPlatillo = (id) => {
    idEditando = id;

    const platillo = getCollection("platillos").find(p => p.id === id);

    editNombre.value = platillo.nombre;
    editDescripcion.value = platillo.descripcion;
    editPrecio.value = platillo.precio;
    editImagen.value = platillo.imagen;

    modal.style.display = "flex";
};

// ===============================
// GUARDAR CAMBIOS
// ===============================
btnGuardar.addEventListener("click", () => {
    updateDocLS("platillos", idEditando, {
        nombre: editNombre.value,
        descripcion: editDescripcion.value,
        precio: Number(editPrecio.value),
        imagen: editImagen.value
    });

    modal.style.display = "none";
    cargarPlatillos();
    alert("Platillo actualizado correctamente");
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
