import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    getDoc
} from "firebase/firestore";

const grid = document.querySelector(".menu-grid");

// ===============================
// CARGAR INSUMOS
// ===============================
async function cargarInsumos() {
    try {
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

    } catch (error) {
        console.error("Error al cargar insumos:", error);
        alert("No se pudieron cargar los insumos");
    }
}

// ===============================
// AGREGAR INSUMO
// ===============================
document.getElementById("btn-agregar-insumo")?.addEventListener("click", async () => {
    try {
        const nombre = prompt("Nombre del insumo:");
        const cantidad = Number(prompt("Cantidad disponible:"));
        const unidad = prompt("Unidad (g, ml, piezas, etc):");
        const costo = Number(prompt("Costo por unidad:"));

        if (!nombre || !unidad) return;

        await addDoc(collection(db, "insumos"), {
            nombre,
            cantidad,
            unidad,
            costo
        });

        cargarInsumos();

    } catch (error) {
        console.error("Error al agregar insumo:", error);
        alert("No se pudo agregar el insumo");
    }
});

// ===============================
// ELIMINAR INSUMO
// ===============================
window.eliminarInsumo = async (id) => {
    try {
        await deleteDoc(doc(db, "insumos", id));
        cargarInsumos();
    } catch (error) {
        console.error("Error al eliminar insumo:", error);
        alert("No se pudo eliminar el insumo");
    }
};

// ===============================
// EDITAR INSUMO
// ===============================
window.editarInsumo = async (id) => {
    try {
        const ref = doc(db, "insumos", id);
        const snap = await getDoc(ref);
        const data = snap.data();

        const nuevoNombre = prompt("Nuevo nombre:", data.nombre);
        const nuevaCantidad = Number(prompt("Nueva cantidad:", data.cantidad));
        const nuevaUnidad = prompt("Nueva unidad:", data.unidad);
        const nuevoCosto = Number(prompt("Nuevo costo:", data.costo));

        await updateDoc(ref, {
            nombre: nuevoNombre,
            cantidad: nuevaCantidad,
            unidad: nuevaUnidad,
            costo: nuevoCosto
        });

        alert("Insumo actualizado");
        cargarInsumos();

    } catch (error) {
        console.error("Error al editar insumo:", error);
        alert("No se pudo editar el insumo");
    }
};

cargarInsumos();
