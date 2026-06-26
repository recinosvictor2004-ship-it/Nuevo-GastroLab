import { 
    getCollection, 
    saveCollection 
} from "./storage.js";

const lista = document.getElementById("lista-platillos");
const totalSpan = document.getElementById("total");
const btnConfirmar = document.getElementById("btn-confirmar");

let carrito = {}; // idPlatillo → cantidad

// ===============================
// RECETAS FIJAS
// ===============================
const recetas = {
    "Pizza Margarita": {
        queso: 0.2,
        tomate: 0.1,
        harina: 0.15
    },
    "Hamburguesa Clásica": {
        carne: 0.2,
        pan: 1,
        queso: 0.05
    },
    "Tacos al Pastor": {
        tortillas: 3,
        carne: 0.15,
        piña: 0.05
    }
};

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
                <h3>${p.nombre}</h3>
                <p>Q ${p.precio}</p>

                <input type="number" min="0" value="0"
                    onchange="actualizarCantidad('${p.id}', '${p.nombre}', ${p.precio}, this.value)">
            </div>
        `;
    });
}

// ===============================
// ACTUALIZAR CANTIDAD
// ===============================
function actualizarCantidad(id, nombre, precio, cantidad) {
    cantidad = Number(cantidad);

    if (cantidad <= 0) {
        delete carrito[id];
    } else {
        carrito[id] = { nombre, precio, cantidad };
    }

    calcularTotal();
}

// ===============================
// CALCULAR TOTAL
// ===============================
function calcularTotal() {
    let total = 0;

    Object.values(carrito).forEach(item => {
        total += item.precio * item.cantidad;
    });

    totalSpan.textContent = total;
    return total;
}

// ===============================
// CONFIRMAR PEDIDO
// ===============================
btnConfirmar.addEventListener("click", () => {
    if (Object.keys(carrito).length === 0) {
        alert("No hay platillos seleccionados");
        return;
    }

    // VALIDAR INVENTARIO
    const inventario = getCollection("inventario");

    for (const item of Object.values(carrito)) {
        const receta = recetas[item.nombre];

        for (const ing in receta) {
            const requerido = receta[ing] * item.cantidad;

            const ingrediente = inventario.find(i => i.nombre.toLowerCase() === ing);

            if (!ingrediente || ingrediente.cantidad < requerido) {
                alert(`No hay suficiente ${ing} para ${item.nombre}`);
                return;
            }
        }
    }

    // DESCONTAR INVENTARIO
    inventario.forEach(i => {
        for (const item of Object.values(carrito)) {
            const receta = recetas[item.nombre];
            if (receta[i.nombre.toLowerCase()]) {
                i.cantidad -= receta[i.nombre.toLowerCase()] * item.cantidad;
            }
        }
    });

    saveCollection("inventario", inventario);

    // GUARDAR PEDIDO
    const pedidos = getCollection("pedidos");

    pedidos.push({
        id: crypto.randomUUID(),
        fecha: new Date().toLocaleString(),
        items: carrito,
        total: calcularTotal()
    });

    saveCollection("pedidos", pedidos);

    alert("Pedido realizado con éxito");

    carrito = {};
    totalSpan.textContent = 0;
    lista.innerHTML = "";
    cargarPlatillos();
});

// Ejecutar al cargar
cargarPlatillos();
