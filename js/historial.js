import { getCollection } from "./storage.js";

const contenedor = document.querySelector(".historial-lista");

// ===============================
// FORMATEAR FECHA
// ===============================
function formatearFecha(fechaString) {
    if (!fechaString) return "Fecha no disponible";
    return fechaString;
}

// ===============================
// CARGAR HISTORIAL
// ===============================
function cargarHistorial() {
    contenedor.innerHTML = "";

    const pedidos = getCollection("pedidos");

    if (pedidos.length === 0) {
        contenedor.innerHTML = `
            <p style="text-align:center; color:#ccc; margin-top:20px;">
                No hay pedidos registrados
            </p>
        `;
        return;
    }

    // Ordenar por fecha (más reciente primero)
    pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    pedidos.forEach(p => {
        const items = Object.values(p.items || {});

        const platillosHTML = items
            .map(i => `<li>${i.nombre} (${i.cantidad}) — Q ${(i.precio * i.cantidad).toFixed(2)}</li>`)
            .join("");

        contenedor.innerHTML += `
            <div class="historial-card">
                <div class="historial-info">
                    <h3>Pedido</h3>
                    <p>Fecha: ${formatearFecha(p.fecha)}</p>
                    <p>Platillos:</p>
                    <ul>${platillosHTML}</ul>
                </div>

                <div class="historial-total">
                    <h3>Total: Q ${Number(p.total).toFixed(2)}</h3>
                </div>
            </div>
        `;
    });
}

cargarHistorial();
