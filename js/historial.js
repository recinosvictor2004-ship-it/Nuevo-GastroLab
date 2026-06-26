import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

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
    try {
        contenedor.innerHTML = "";

        const q = query(collection(db, "pedidos"), orderBy("fecha", "desc"));
        const snap = await getDocs(q);

        if (snap.empty) {
            contenedor.innerHTML = `
                <p style="text-align:center; color:#ccc; margin-top:20px;">
                    No hay pedidos registrados
                </p>
            `;
            return;
        }

        snap.forEach(p => {
            const data = p.data();

            const platillos = Array.isArray(data.platillos) ? data.platillos : [];

            const platillosHTML = platillos
                .map(pl => `<li>${pl.nombre} (${pl.cantidad}) — Q ${pl.subtotal.toFixed(2)}</li>`)
                .join("");

            contenedor.innerHTML += `
                <div class="historial-card">
                    <div class="historial-info">
                        <h3>Pedido</h3>
                        <p>Fecha: ${formatearFecha(data.fecha)}</p>
                        <p>Platillos:</p>
                        <ul>${platillosHTML}</ul>
                    </div>

                    <div class="historial-total">
                        <h3>Total: Q ${Number(data.total).toFixed(2)}</h3>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al cargar historial:", error);
        contenedor.innerHTML = `
            <p style="text-align:center; color:red; margin-top:20px;">
                Error al cargar el historial
            </p>
        `;
    }
}

cargarHistorial();
