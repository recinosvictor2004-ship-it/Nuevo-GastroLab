import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const grid = document.querySelector(".menu-grid");

// Cargar insumos
async function cargarInsumos() {
    grid.innerHTML = "";
    const snap = await getDocs(collection(db, "insumos"));

    snap.forEach(i => {
        const data = i.data();
        grid.innerHTML += `
            <div class="menu-card">
                <h3>${data.nombre}</h3>
                <p>Cantidad: ${data.cantidad}</p>
                <p>Unidad: ${data.unidad}</p>
                <p>Costo: Q ${data.costo}</p>
                <div class="menu-actions">
                    <button class="btn-primary" onclick="editarInsumo('${i.id}')">Editar</button>
                    <button class="btn-danger" onclick="eliminarInsumo('${i.id}')">Eliminar</button>
                </div>
            </div>
        `;
    });
}

window.eliminarInsumo = async (id) => {
    await deleteDoc(doc(db, "insumos", id));
    cargarInsumos();
};

window.editarInsumo = (id) => {
    alert("Luego hacemos edición con formulario específico");
};

cargarInsumos();
