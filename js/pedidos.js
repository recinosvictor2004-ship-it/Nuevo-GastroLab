async function cargarPlatillos() {
    const platillos = getCollection("platillos");

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


import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
async function cargarPlatillos() {
    const snap = await getDocs(collection(db, "platillos"));

    snap.forEach(p => {
        const data = p.data();

        lista.innerHTML += `
            <div class="pedido-card">
                <img src="${data.imagen}" class="pedido-img">
                <h3>${data.nombre}</h3>
                <p>Q ${data.precio}</p>

                <input type="number" min="0" value="0"
                    onchange="actualizarCantidad('${p.id}', '${data.nombre}', ${data.precio}, this.value)">
            </div>
        `;
    });
}

function actualizarCantidad(id, nombre, precio, cantidad) {
    cantidad = Number(cantidad);

    if (cantidad <= 0) {
        delete carrito[id];
    } else {
        carrito[id] = { nombre, precio, cantidad };
    }

    calcularTotal();
};

// ===============================
// CALCULAR TOTAL
// ===============================
function calcularTotal() {
    let total = 0;

    Object.values(carrito).forEach(item => {
        total += item.precio * item.cantidad;
    });

    totalSpan.textContent = total;
}

// ===============================
// CONFIRMAR PEDIDO
// ===============================
btnConfirmar.addEventListener("click", async () => {
    if (Object.keys(carrito).length === 0) {
        alert("No hay platillos seleccionados");
        return;
    }

    // VALIDAR INVENTARIO
    const inventarioSnap = await getDocs(collection(db, "inventario"));
    let inventario = {};

    inventarioSnap.forEach(i => {
        inventario[i.data().nombre.toLowerCase()] = {
            id: i.id,
            cantidad: i.data().cantidad,
            unidad: i.data().unidad
        };
    });

    // Verificar si alcanza el inventario
    for (const item of Object.values(carrito)) {
        const receta = recetas[item.nombre];

        for (const ing in receta) {
            const requerido = receta[ing] * item.cantidad;

            if (!inventario[ing] || inventario[ing].cantidad < requerido) {
                alert(`No hay suficiente ${ing} para ${item.nombre}`);
                return;
            }
        }
    }

    // DESCONTAR INVENTARIO
    for (const item of Object.values(carrito)) {
        const receta = recetas[item.nombre];

        for (const ing in receta) {
            const requerido = receta[ing] * item.cantidad;
            const inv = inventario[ing];

            await updateDoc(doc(db, "inventario", inv.id), {
                cantidad: inv.cantidad - requerido
            });
        }
    }

    // GUARDAR PEDIDO
    const pedido = {
        fecha: new Date(),
        items: carrito,
        total: Number(totalSpan.textContent)
    };

    await addDoc(collection(db, "pedidos"), pedido);
    await addDoc(collection(db, "historial"), pedido);

    alert("Pedido realizado con éxito");
    carrito = {};
    totalSpan.textContent = 0;
    lista.innerHTML = "";
    cargarPlatillos();
});

cargarPlatillos();
btnConfirmar.addEventListener("click", () => {
    const pedidos = getCollection("pedidos");

    pedidos.push({
        id: crypto.randomUUID(),
        fecha: new Date().toLocaleString(),
        items: carrito,
        total: calcularTotal(true)
    });

    saveCollection("pedidos", pedidos);

    alert("Pedido guardado correctamente");
    carrito = {};
    lista.innerHTML = "";
    cargarPlatillos();
});
