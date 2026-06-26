import { getCollection, saveCollection } from "./storage.js";

const lista = document.getElementById("lista-platillos");
const totalSpan = document.getElementById("total");
const btnConfirmar = document.getElementById("btn-confirmar");

let carrito = {}; // { idPlatillo: { nombre, precio, cantidad, ingredientes } }

// ===============================
// CARGAR PLATILLOS
// ===============================
function cargarPlatillos() {
    const platillos = getCollection("platillos");
    lista.innerHTML = "";

    platillos.forEach(p => {
        lista.innerHTML += `
            <div class="pedido-card">
                <img src="${p.imagen}" class="pedido-img">

                <div class="pedido-info">
                    <h3>${p.nombre}</h3>
                    <p>Q ${p.precio}</p>

                    <div class="pedido-cantidad">
                        <button class="btn-danger" onclick="restar('${p.id}')">-</button>
                        <span id="cant-${p.id}">0</span>
                        <button class="btn-primary" onclick="sumar('${p.id}')">+</button>
                    </div>

                    <button class="btn-primary" onclick="agregar('${p.id}')">
                        Agregar al pedido
                    </button>
                </div>
            </div>
        `;
    });
}

// ===============================
// SUMAR / RESTAR CANTIDAD
// ===============================
window.sumar = (id) => {
    const span = document.getElementById(`cant-${id}`);
    span.textContent = Number(span.textContent) + 1;
};

window.restar = (id) => {
    const span = document.getElementById(`cant-${id}`);
    const val = Number(span.textContent);
    if (val > 0) span.textContent = val - 1;
};

// ===============================
// AGREGAR AL CARRITO
// ===============================
window.agregar = (id) => {
    const platillos = getCollection("platillos");
    const p = platillos.find(x => x.id === id);

    const cantidad = Number(document.getElementById(`cant-${id}`).textContent);
    if (cantidad === 0) return;

    carrito[id] = {
        nombre: p.nombre,
        precio: p.precio,
        cantidad,
        ingredientes: p.ingredientes
    };

    actualizarTotal();
};

// ===============================
// ACTUALIZAR TOTAL
// ===============================
function actualizarTotal() {
    let total = 0;

    Object.values(carrito).forEach(item => {
        total += item.precio * item.cantidad;
    });

    totalSpan.textContent = total.toFixed(2);
}

// ===============================
// DESCONTAR INVENTARIO
// ===============================
function descontarInventario() {
    const inventario = getCollection("inventario");

    Object.values(carrito).forEach(item => {
        item.ingredientes.forEach(ing => {
            const insumo = inventario.find(i => i.id === ing.insumoID);
            if (!insumo) return;

            const cantidadNecesaria = ing.cantidad * item.cantidad;
            insumo.cantidad -= cantidadNecesaria;
        });
    });

    saveCollection("inventario", inventario);
}

// ===============================
// CONFIRMAR PEDIDO
// ===============================
btnConfirmar.addEventListener("click", () => {
    if (Object.keys(carrito).length === 0) {
        alert("No hay platillos en el pedido");
        return;
    }

    descontarInventario();

    const pedidos = getCollection("pedidos");

    pedidos.push({
        id: Date.now(),
        fecha: new Date().toLocaleString(),
        items: carrito,
        total: Number(totalSpan.textContent)
    });

    saveCollection("pedidos", pedidos);

    alert("Pedido creado correctamente");

    carrito = {};
    cargarPlatillos();
    actualizarTotal();
});

// Ejecutar
cargarPlatillos();
