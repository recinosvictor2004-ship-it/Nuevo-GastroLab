import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const lista = document.querySelector(".menu-grid");
const btnAgregar = document.querySelector('.menu-header a[href="#"]');

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
async function cargarPlatillos() {
    lista.innerHTML = "";

    const snap = await getDocs(collection(db, "platillos"));

    snap.forEach(p => {
        const data = p.data();

        lista.innerHTML += `
            <div class="menu-card">
                <img src="${data.imagen}" class="menu-img">
                <h3>${data.nombre}</h3>
                <p>${data.descripcion}</p>

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
window.editarPlatillo = async (id) => {
    idEditando = id;

    const ref = doc(db, "platillos", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    // Cargar datos en inputs
    editNombre.value = data.nombre;
    editDescripcion.value = data.descripcion;
    editPrecio.value = data.precio;
    editImagen.value = data.imagen;

    modal.style.display = "flex";
};

// ===============================
// GUARDAR CAMBIOS
// ===============================
btnGuardar.addEventListener("click", async () => {
    const ref = doc(db, "platillos", idEditando);

    await updateDoc(ref, {
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
window.eliminarPlatillo = async (id) => {
    await deleteDoc(doc(db, "platillos", id));
    cargarPlatillos();
};

cargarPlatillos();
