import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const lista = document.querySelector(".menu-grid");
const btnAgregar = document.querySelector('.menu-header a[href="#"]');

// Cargar platillos
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

// Agregar platillo (ejemplo simple)
btnAgregar.addEventListener("click", async (e) => {
    e.preventDefault();
    const nombre = prompt("Nombre del platillo:");
    const descripcion = prompt("Descripción:");
    const imagen = prompt("URL de imagen:");

    if (!nombre || !descripcion) return;

    await addDoc(collection(db, "platillos"), {
        nombre,
        descripcion,
        imagen
    });

    cargarPlatillos();
});

// Eliminar
window.eliminarPlatillo = async (id) => {
    await deleteDoc(doc(db, "platillos", id));
    cargarPlatillos();
};

// Editar (simple con prompt)
window.editarPlatillo = async (id) => {
    const ref = doc(db, "platillos", id);
    // Podrías usar getDoc y updateDoc aquí
    alert("Aquí luego hacemos edición con formulario");
};

cargarPlatillos();
