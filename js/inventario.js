import { 
    getCollection, 
    saveCollection, 
    addDocLS, 
    updateDocLS 
} from "./storage.js";

const grid = document.querySelector(".menu-grid");

// ===============================
// CREAR INSUMOS POR DEFECTO (si no existen)
// ===============================
function inicializarInsumos() {
    const existentes = getCollection("inventario");

    if (existentes.length === 0) {
        const iniciales = [
            { id: crypto.randomUUID(), nombre: "masa", cantidad: 10, unidad: "piezas", costo: 5 },
            { id: crypto.randomUUID(), nombre: "queso", cantidad: 5, unidad: "kg", costo: 30 },
            { id: crypto.randomUUID(), nombre: "tomate", cantidad: 8, unidad: "kg", costo: 12 },
            { id: crypto.randomUUID(), nombre: "pan", cantidad: 20, unidad: "piezas", costo: 3 },
            { id: crypto.randomUUID(), nombre: "carne", cantidad: 10, unidad: "kg", costo: 40 },
            { id: crypto.randomUUID(), nombre: "lechuga", cantidad: 5, unidad: "kg", costo: 10 },
            { id: crypto.randomUUID(), nombre: "papas", cantidad: 15, unidad: "kg", costo: 8 },
            { id: crypto.randomUUID(), nombre: "aceite", cantidad: 10, unidad: "litros", costo: 20 }
        ];

        iniciales.forEach(i => addDocLS("inventario", i));
    }
}

inicializarInsumos();

// ===============================
// CARGAR INSUMOS
// ===============================
function cargarInsumos() {
    grid.innerHTML = "";

    const insumos = getCollection("inventario");

    insumos.forEach(i => {
        grid.innerHTML += `
            <div class="menu-card">
                <h3>${i.nombre}</h3>
                <p>Cantidad: ${i.cantidad}</p>
                <p>Unidad: ${i.unidad}</p>
                <p>Costo: Q ${i.costo}</p>

                <div class="menu-actions">
                    <button class="btn-primary" onclick="editarInsumo('${i.id}')">Editar</button>
                    <button class="btn-danger" onclick="eliminarInsumo('${i.id}')">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// ===============================
// AGREGAR INSUMO
// ===============================
document.getElementById("btn-agregar-insumo")?.addEventListener("click", () => {
    const nombre = prompt("Nombre del insumo:");
    const cantidad = Number(prompt("Cantidad disponible:"));
    const unidad = prompt("Unidad (g, ml, piezas, etc):");
    const costo = Number(prompt("Costo por unidad:"));

    if (!nombre || !unidad) return;

    addDocLS("inventario", {
        id: crypto.randomUUID(),
        nombre,
        cantidad,
        unidad,
        costo
    });

    cargarInsumos();
});

// ===============================
// ELIMINAR INSUMO
// ===============================
window.eliminarInsumo = (id) => {
    const insumos = getCollection("inventario");
    const nuevos = insumos.filter(i => i.id !== id);

    saveCollection("inventario", nuevos);
    cargarInsumos();
};

// ===============================
// EDITAR INSUMO
// ===============================
window.editarInsumo = (id) => {
    const insumos = getCollection("inventario");
    const insumo = insumos.find(i => i.id === id);

    const nuevoNombre = prompt("Nuevo nombre:", insumo.nombre);
    const nuevaCantidad = Number(prompt("Nueva cantidad:", insumo.cantidad));
    const nuevaUnidad = prompt("Nueva unidad:", insumo.unidad);
    const nuevoCosto = Number(prompt("Nuevo costo:", insumo.costo));

    updateDocLS("inventario", id, {
        nombre: nuevoNombre,
        cantidad: nuevaCantidad,
        unidad: nuevaUnidad,
        costo: nuevoCosto
    });

    alert("Insumo actualizado");
    cargarInsumos();
};

// Ejecutar al cargar
cargarInsumos();
