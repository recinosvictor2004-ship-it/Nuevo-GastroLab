import { getCollection, saveCollection } from "./storage.js";

const lista = document.getElementById("historial-lista");

// ===============================
// CARGAR PEDIDOS
// ===============================
function cargarHistorial() {
    lista.innerHTML = "";

    const pedidos = getCollection("pedidos");

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
                        <li>${item.nombre} x ${item.cantidad} — Q ${item.precio * item.cantidad}</li>
                    `).join("")}
                </ul>

                <h3>Total: Q ${p.total}</h3>

                <div class="menu-actions">
                    <button class="btn-primary" onclick="editarPedido(${p.id})">Editar</button>
                    <button class="btn-danger" onclick="eliminarPedido(${p.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// ===============================
// ELIMINAR PEDIDO
// ===============================
window.eliminarPedido = (id) => {
    const pedidos = getCollection("pedidos");
    const nuevos = pedidos.filter(p => p.id !== id);

    saveCollection("pedidos", nuevos);
    cargarHistorial();
};

// ===============================
// EDITAR PEDIDO
// ===============================
window.editarPedido = (id) => {
    const pedidos = getCollection("pedidos");
    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) return;

    // Crear modal dinámico
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

    // Cerrar modal
    document.getElementById("cerrar-edicion").onclick = () => modal.remove();

    // Guardar cambios
    document.getElementById("guardar-edicion").onclick = () => {
        const inventario = getCollection("inventario");

        // Recalcular cantidades
        Object.entries(pedido.items).forEach(([pid, item]) => {
            const nuevaCantidad = Number(document.getElementById(`edit-${pid}`).value);

            // Ajustar inventario
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

        // Recalcular total
        pedido.total = Object.values(pedido.items)
            .reduce((sum, item) => sum + item.precio * item.cantidad, 0);

        // Guardar cambios
        saveCollection("inventario", inventario);
        saveCollection("pedidos", pedidos);

        alert("Pedido actualizado correctamente");

        modal.remove();
        cargarHistorial();
    };
};

// Ejecutar
cargarHistorial();
