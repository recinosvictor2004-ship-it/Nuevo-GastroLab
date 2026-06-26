import { db } from "./firebase.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const contenedor = document.querySelector(".historial-lista");

async function cargarHistorial() {
    contenedor.innerHTML = "";
    const snap = await getDocs(collection(db, "pedidos"));

    snap.forEach(p => {
        const data = p.data();
        const platillosHTML = data.platillos
            .map(pl => `<li>${pl.nombre} (${pl.cantidad})</li>`)
            .join("");

        contenedor.innerHTML += `
            <div class="historial-card">
                <div class="historial-info">
                    <h3>Pedido</h3>
                    <p>Fecha: (desde Firestore)</p>
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
