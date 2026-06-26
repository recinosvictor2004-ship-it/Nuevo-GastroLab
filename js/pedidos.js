import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc
} from "firebase/firestore";

const grid = document.querySelector(".pedido-grid");
const resumenLista = document.querySelector(".pedido-lista");
const totalTexto = document.querySelector(".pedido-total h3");
const btnConfirmar = document.querySelector(".pedido-confirmar");

let platillos = [];
let pedidoActual = [];

// ===============================
// CARGAR PLATILLOS
// ===============================
async function cargarPlatillos() {
    try {
        grid.innerHTML = ""; // evitar duplicados

        const snap = await getDocs(collection(db, "platillos"));

        platillos = snap.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        // Ordenar por nombre
        platillos.sort((a, b) => a.nombre.localeCompare(b.nombre));

        platillos.forEach(data => {
            grid.innerHTML += `
                <div class="pedido-card">
                    <h3>${data.nombre}</h3>
                    <p>${data.descripcion || "Sin descripción"}</p>

                    <label>Cantidad</label>
                    <input type="number" min="0" id="cant-${data.id}" placeholder="0">

                    <button class="btn-primary" onclick="agregar('${data.id}')">Agregar</button>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al cargar platillos:", error);
        alert("Error al cargar platillos");
    }
}

// ===============================
// AGREGAR AL PEDIDO
// ===============================
window.agregar = (id) => {
    const input = document.getElementById(`cant-${id}`);
    const cantidad = Number(input.value);

    if (cantidad <= 0) return;

    const platillo = platillos.find(p => p.id === id);
    if (!platillo) return;

    // Evitar duplicados
    const existente = pedidoActual.find(p => p.id === id);
    if (existente) {
        existente.cantidad += cantidad;
        existente.subtotal = existente.cantidad * platillo.precio;
    } else {
        pedidoActual.push({
            id,
            nombre: platillo.nombre,
            cantidad,
            subtotal: platillo.precio * cantidad,
            ingredientes: platillo.ingredientes || []
        });
    }

    actualizarResumen();
    input.value = "";
};

// ===============================
// ACTUALIZAR RESUMEN
// ===============================
function actualizarResumen() {
    resumenLista.innerHTML = "";

    let total = 0;

    pedidoActual.forEach(p => {
        total += p.subtotal;

        resumenLista.innerHTML += `
            <div class="pedido-item">
                <span>${p.nombre} (${p.cantidad})</span>
                <span>Q ${p.subtotal.toFixed(2)}</span>
            </div>
        `;
    });

    totalTexto.textContent = `Total: Q ${total.toFixed(2)}`;
}

// ===============================
// DESCONTAR INVENTARIO
// ===============================
async function descontarInventario() {
    for (const item of pedidoActual) {
        for (const ing of item.ingredientes) {
            try {
                const ref = doc(db, "insumos", ing.insumoID);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    console.warn("Insumo no encontrado:", ing.insumoID);
                    continue;
                }

                const data = snap.data();
                const cantidadNecesaria = Number(ing.cantidad) * item.cantidad;

                const nuevaCantidad = Math.max(0, Number(data.cantidad) - cantidadNecesaria);

                await updateDoc(ref, { cantidad: nuevaCantidad });

            } catch (error) {
                console.error("Error descontando inventario:", error);
            }
        }
    }
}

// ===============================
// CONFIRMAR PEDIDO
// ===============================
btnConfirmar.addEventListener("click", async () => {
    if (pedidoActual.length === 0) {
        alert("No hay platillos en el pedido");
        return;
    }

    btnConfirmar.disabled = true;
    btnConfirmar.textContent = "Guardando...";

    try {
        const total = pedidoActual.reduce((acc, p) => acc + p.subtotal, 0);

        await addDoc(collection(db, "pedidos"), {
            fecha: serverTimestamp(),
            platillos: pedidoActual,
            total
        });

        await descontarInventario();

        alert("Pedido registrado y inventario actualizado");

        pedidoActual = [];
        actualizarResumen();

    } catch (error) {
        console.error("Error al confirmar pedido:", error);
        alert("Error al registrar el pedido");
    }

    btnConfirmar.disabled = false;
    btnConfirmar.textContent = "Confirmar Pedido";
});

cargarPlatillos();
