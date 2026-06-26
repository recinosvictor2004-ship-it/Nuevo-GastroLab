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
// AGREGAR PLATILLO
// ===============================
btnAgregar.addEventListener("click", async (e) => {
    e.preventDefault();

    const nombre = prompt("Nombre del platillo:");
    const descripcion = prompt("Descripción:");
    const precio = Number(prompt("Precio:"));
    const imagen = prompt("URL de imagen:");

    const ingredientes = [];

    let agregarMas = true;

    while (agregarMas) {
        const insumoID = prompt("ID del insumo (ej: arroz):");
        const cantidad = Number(prompt("Cantidad necesaria:"));

        ingredientes.push({ insumoID, cantidad });

        agregarMas = confirm("¿Agregar otro ingrediente?");
    }

    await addDoc(collection(db, "platillos"), {
        nombre,
        descripcion,
        precio,
        imagen,
        ingredientes
    });

    cargarPlatillos();
});

// ===============================
// ELIMINAR PLATILLO
// ===============================
window.eliminarPlatillo = async (id) => {
    await deleteDoc(doc(db, "platillos", id));
    cargarPlatillos();
};

// ===============================
// EDITAR PLATILLO
// ===============================
window.editarPlatillo = async (id) => {
    const ref = doc(db, "platillos", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    const nuevoNombre = prompt("Nuevo nombre:", data.nombre);
    const nuevaDescripcion = prompt("Nueva descripción:", data.descripcion);
    const nuevoPrecio = Number(prompt("Nuevo precio:", data.precio));
    const nuevaImagen = prompt("Nueva URL de imagen:", data.imagen);

    await updateDoc(ref, {
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
        precio: nuevoPrecio,
        imagen: nuevaImagen
    });

    alert("Platillo actualizado");
    cargarPlatillos();
};

cargarPlatillos();
