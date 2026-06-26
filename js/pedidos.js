import { getCollection, saveCollection } from "./storage.js";

const lista = document.getElementById("lista-platillos");
const totalSpan = document.getElementById("total");
const btnConfirmar = document.getElementById("btn-confirmar");

const inputNombre = document.getElementById("cliente-nombre");
const inputTelefono = document.getElementById("cliente-telefono");

let carrito = {}; 

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
// SUMAR / RESTAR
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
// VALIDAR INVENTARIO
// ===============================
function validarInventario() {
    const inventario = getCollection("inventario");

    for (const item of Object.values(carrito)) {
        for (const ing of item.ingredientes) {
            const insumo = inventario.find(i => i.id === ing.insumoID);

            if (!insumo) {
                alert(`El insumo ${ing.insumoID} no existe en inventario`);
                return false;
            }

            const requerido = ing.cantidad * item.cantidad;

            if (insumo.cantidad < requerido) {
                alert(`No hay suficiente ${insumo.nombre} para ${item.nombre}`);
                return false;
            }
        }
    }

    return true;
}

// ===============================
// DESCONTAR INVENTARIO + REPORTE
// ===============================
function descontarInventario() {
    const inventario = getCollection("inventario");
    let reporte = "Insumos descontados:\n\n";

    Object.values(carrito).forEach(item => {
        item.ingredientes.forEach(ing => {
            const insumo = inventario.find(i => i.id === ing.insumoID);
            const requerido = ing.cantidad * item.cantidad;

            insumo.cantidad -= requerido;

            reporte += `- ${insumo.nombre}: -${requerido} ${insumo.unidad}\n`;
        });
    });

    saveCollection("inventario", inventario);

    return reporte;
}

// ===============================
// REPORTE DE INSUMOS POR AGOTARSE
// ===============================
function reporteAgotados() {
    const inventario = getCollection("inventario");

    const bajos = inventario.filter(i => i.cantidad <= 2);

    if (bajos.length === 0) return "Todos los insumos están en buen nivel.";

    let texto = "\n⚠ Insumos por agotarse:\n\n";

    bajos.forEach(i => {
        texto += `- ${i.nombre}: ${i.cantidad} ${i.unidad}\n`;
    });

    return texto;
}

// ===============================
// 🔥 REGISTRAR VENTA (NUEVO)
// ===============================
function registrarVenta(pedido) {
    const ventas = getCollection("ventas");

    ventas.push({
        id: Date.now(),
        fecha: new Date().toISOString().split("T")[0],
        items: pedido.items,
        total: pedido.total
    });

    saveCollection("ventas", ventas);
}

// ===============================
// CONFIRMAR PEDIDO
// ===============================
btnConfirmar.addEventListener("click", () => {

    if (!inputNombre.value.trim() || !inputTelefono.value.trim()) {
        alert("Debes ingresar nombre y teléfono del cliente");
        return;
    }

    if (Object.keys(carrito).length === 0) {
        alert("No hay platillos en el pedido");
        return;
    }

    if (!validarInventario()) return;

    const reporteDescuento = descontarInventario();
    const reporteBajos = reporteAgotados();

    const pedidos = getCollection("pedidos");

    const nuevoPedido = {
        id: Date.now(),
        fecha: new Date().toLocaleString(),
        cliente: {
            nombre: inputNombre.value.trim(),
            telefono: inputTelefono.value.trim()
        },
        items: carrito,
        total: Number(totalSpan.textContent)
    };

    pedidos.push(nuevoPedido);
    saveCollection("pedidos", pedidos);

    // 🔥 REGISTRAR VENTA REAL
    registrarVenta(nuevoPedido);

    alert(
        "Pedido creado y registrado como venta\n\n" +
        reporteDescuento +
        "\n" +
        reporteBajos
    );

    carrito = {};
    inputNombre.value = "";
    inputTelefono.value = "";
    cargarPlatillos();
    actualizarTotal();

    // 🔥 ACTUALIZAR INVENTARIO AUTOMÁTICAMENTE SI ESTÁ ABIERTO
    if (window.opener && window.opener.location.pathname.includes("inventario.html")) {
        window.opener.location.reload();
    }
});

// Ejecutar
cargarPlatillos();
