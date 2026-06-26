import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const contenedor = document.querySelector(".historial-lista");

// ===============================
// FORMATEAR FECHA
// ===============================
function formatearFecha(timestamp) {
    if (!timestamp) return "Fecha no disponible";

    const fecha = timestamp.toDate();
    return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ===============================
// CARGAR HISTORIAL
// ===============================
async function cargarHistorial() {
    contenedor.innerHTML = "";

    // Pedidos ordenados por fecha descendente
    const q = query(collection(db, "pedidos"), orderBy("fecha", "desc"));
    const snap = await getDocs(q);

    snap.forEach(p => {
        const data = p.data();

        // Lista de platillos
        const platillosHTML = data.platillos
            .map(pl => `<li>${pl.nombre} (${pl.cantidad}) — Q ${pl.subtotal}</li>`)
            .join("");

        // Renderizar tarjeta
        contenedor.innerHTML += `
            <div class="historial-card">
                <div class="historial-info">
                    <h3>Pedido</h3>
                    <p>Fecha: ${formatearFecha(data.fecha)}</p>
                    <p>Platillos:</p>
                    <ul>${platillosHTML}</ul>
                </div>

                <div class="historial-total">
                    <h3>Total: Q ${data.total}</h3>
                </div>
            </div>
        `;
    });
}

cargarHistorial();
