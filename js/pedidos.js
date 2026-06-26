import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const btnConfirmar = document.querySelector(".pedido-confirmar");

btnConfirmar.addEventListener("click", async () => {
    // Aquí deberías leer las cantidades de los inputs
    // Por ahora, ejemplo estático:
    const pedido = {
        fecha: serverTimestamp(),
        platillos: [
            { nombre: "Esferas de Caprese", cantidad: 2 },
            { nombre: "Risotto de Trufa Negra", cantidad: 1 }
        ],
        total: 150
    };

    await addDoc(collection(db, "pedidos"), pedido);
    alert("Pedido guardado en la base de datos");
});
