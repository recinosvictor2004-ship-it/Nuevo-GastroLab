const lista = document.getElementById("historial-lista");

// ===============================
// CARGAR PEDIDOS
// ===============================
function cargarHistorial() {
    lista.innerHTML = "";

    const pedidos = getCollection("pedidos") || [];

    if (pedidos.length === 0) {
        lista.innerHTML = "<p>No hay pedidos registrados.</p>";
        return;
    }

    pedidos.forEach(p => {
        lista.innerHTML += `
            <div class="historial-card">
                <h3>Pedido #${p.id}</h3>
                <p><strong>Fecha:</strong> ${p.fecha}</p>
                <p><strong>Cliente:</strong> ${p.cliente?.nombre || "Sin nombre"}</p>
                <p><strong>Teléfono:</strong> ${p.cliente?.telefono || "Sin teléfono"}</p>

                <h4>Platillos:</h4>
                <ul>
                    ${Object.values(p.items).map(item => `
                        <li>${item.nombre} x ${item.cantidad} — Q ${(item.precio * item.cantidad).toFixed(2)}</li>
                    `).join("")}
                </ul>

                <h3>Total: Q ${p.total}</h3>

                <p><strong>Pagado:</strong> ${p.pagado ? "Sí" : "No"}</p>
                <p><strong>Método de Pago:</strong> ${p.metodoPago || "No registrado"}</p>

                <div class="menu-actions">
                    <button class="btn-primary" onclick="editarPedido(${p.id})">Editar</button>
                    <button class="btn-danger" onclick="eliminarPedido(${p.id})">Eliminar</button>
                    ${!p.pagado ? `<button class="btn-success" onclick="abrirPago(${p.id})">Pagar</button>` : ""}
                </div>
            </div>
        `;
    });
}

// ===============================
// ELIMINAR PEDIDO
// ===============================
window.eliminarPedido = (id) => {
    const pedidos = getCollection("pedidos") || [];
    const nuevos = pedidos.filter(p => p.id !== id);

    saveCollection("pedidos", nuevos);
    cargarHistorial();
};

// ===============================
// EDITAR PEDIDO
// ===============================
window.editarPedido = (id) => {
    const pedidos = getCollection("pedidos") || [];
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) return;

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "flex";

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Editar Pedido #${id}</h2>

            <div id="items-edit">
                ${Object.entries(pedido.items).map(([pid, item]) => `
                    <div class="edit-item">
                        <p>${item.nombre}</p>
                        <input type="number" id="edit-${pid}" value="${item.cantidad}" min="1">
                    </div>
                `).join("")}
            </div>

            <div class="modal-actions">
                <button class="btn-primary" id="guardar-edicion">Guardar Cambios</button>
                <button class="btn-danger" id="cerrar-edicion">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("cerrar-edicion").onclick = () => modal.remove();

    document.getElementById("guardar-edicion").onclick = () => {
        const inventario = getCollection("inventario") || [];

        Object.entries(pedido.items).forEach(([pid, item]) => {
            const nuevaCantidad = Number(document.getElementById(`edit-${pid}`).value);

            const diferencia = nuevaCantidad - item.cantidad;

            if (diferencia !== 0) {
                item.ingredientes.forEach(ing => {
                    const insumo = inventario.find(i => i.id === ing.insumoID);
                    if (insumo) {
                        insumo.cantidad -= ing.cantidad * diferencia;
                    }
                });
            }

            item.cantidad = nuevaCantidad;
        });

        pedido.total = Object.values(pedido.items)
            .reduce((sum, item) => sum + item.precio * item.cantidad, 0);

        saveCollection("inventario", inventario);
        saveCollection("pedidos", pedidos);

        alert("Pedido actualizado correctamente");

        modal.remove();
        cargarHistorial();
    };
};

// ===============================
// MODAL DE PAGO
// ===============================
let pedidoPagando = null;

window.abrirPago = (id) => {
    pedidoPagando = id;
    document.getElementById("modal-pago").style.display = "flex";
};

document.getElementById("btnCancelarPago").onclick = () => {
    pedidoPagando = null;
    document.getElementById("modal-pago").style.display = "none";
};

document.getElementById("btnConfirmarPago").onclick = () => {
    if (!pedidoPagando) return;

    const pedidos = getCollection("pedidos") || [];
    const ventas = getCollection("ventas") || [];

    const pedido = pedidos.find(p => p.id === pedidoPagando);
    if (!pedido) return;

    const metodo = document.getElementById("metodoPago").value;

    pedido.pagado = true;
    pedido.metodoPago = metodo;

    ventas.push({
        id: Date.now(),
        fecha: new Date().toISOString().split("T")[0],
        total: pedido.total,
        metodoPago: metodo,
        items: pedido.items
    });

    saveCollection("ventas", ventas);
    saveCollection("pedidos", pedidos);

    alert("Pago registrado correctamente");

    document.getElementById("modal-pago").style.display = "none";
    pedidoPagando = null;

    cargarHistorial();
};

// Ejecutar
cargarHistorial();
