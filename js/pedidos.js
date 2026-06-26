import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
    const snap = await getDocs(collection(db, "platillos"));

    snap.forEach(p => {
        const data = p.data();
        data.id = p.id;
        platillos.push(data);

        grid.innerHTML += `
            <div class="pedido-card">
                <h3>${data.nombre}</h3>
                <p>${data.descripcion}</p>

                <label>Cantidad</label>
                <input type="number" min="0" id="cant-${data.id}" placeholder="0">

                <button class="btn-primary" onclick="agregar('${data.id}')">Agregar</button>
            </div>
        `;
    });
}

// ===============================
// AGREGAR AL PEDIDO
// ===============================
window.agregar = (id) => {
    const input = document.getElementById(`cant-${id}`);
    const cantidad = Number(input.value);

    if (cantidad <= 0) return;

    const platillo = platillos.find(p => p.id === id);

    const subtotal = platillo.precio * cantidad;

    pedidoActual.push({
        id,
        nombre: platillo.nombre,
        cantidad,
        subtotal,
        ingredientes: platillo.ingredientes
    });

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
                <span>Q ${p.subtotal}</span>
            </div>
        `;
    });

    totalTexto.textContent = `Total: Q ${total}`;
}

// ===============================
// DESCONTAR INVENTARIO
// ===============================
async function descontarInventario() {
    for (const item of pedidoActual) {
        for (const ing of item.ingredientes) {
            const ref = doc(db, "insumos", ing.insumoID);
            const snap = await getDoc(ref);

            if (!snap.exists()) continue;

            const data = snap.data();

            const cantidadNecesaria = ing.cantidad * item.cantidad;

            const nuevaCantidad = data.cantidad - cantidadNecesaria;

            await updateDoc(ref, { cantidad: nuevaCantidad });
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

    let total = pedidoActual.reduce((acc, p) => acc + p.subtotal, 0);

    await addDoc(collection(db, "pedidos"), {
        fecha: serverTimestamp(),
        platillos: pedidoActual,
        total
    });

    await descontarInventario();

    alert("Pedido registrado y inventario actualizado");

    pedidoActual = [];
    actualizarResumen();
});

cargarPlatillos();
