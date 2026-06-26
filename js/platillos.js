import { 
    getCollection, 
    saveCollection, 
    addDocLS, 
    updateDocLS 
} from "./storage.js";

// ===============================
// CREAR PLATILLOS POR DEFECTO
// ===============================
function inicializarPlatillos() {
    const existentes = getCollection("platillos");

    if (existentes.length === 0) {
        const iniciales = [
            {
                nombre: "Pizza Margarita",
                precio: 45,
                imagen: "img/pizza.jpg"
            },
            {
                nombre: "Hamburguesa Clásica",
                precio: 35,
                imagen: "img/hamburguesa.jpg"
            },
            {
                nombre: "Papas Fritas",
                precio: 15,
                imagen: "img/papas.jpg"
            }
        ];

        iniciales.forEach(p => addDocLS("platillos", p));
    }
}

// Ejecutar al cargar
inicializarPlatillos();

// ===============================
// OBTENER TODOS LOS PLATILLOS
// ===============================
export function obtenerPlatillos() {
    return getCollection("platillos");
}

// ===============================
// CREAR PLATILLO
// ===============================
export function crearPlatillo(data) {
    if (!data.nombre || !data.precio) {
        throw new Error("Faltan datos obligatorios");
    }

    return addDocLS("platillos", {
        ...data,
        precio: Number(data.precio)
    });
}

// ===============================
// ACTUALIZAR PLATILLO
// ===============================
export function actualizarPlatillo(id, data) {
    updateDocLS("platillos", id, {
        ...data,
        precio: Number(data.precio)
    });
}

// ===============================
// ELIMINAR PLATILLO
// ===============================
export function eliminarPlatillo(id) {
    const platillos = getCollection("platillos");
    const nuevos = platillos.filter(p => p.id !== id);
    saveCollection("platillos", nuevos);
}
