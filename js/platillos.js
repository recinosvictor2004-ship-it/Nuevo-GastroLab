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
                id: crypto.randomUUID(),
                nombre: "Pizza Margarita",
                precio: 45,
                imagen: "img/pizza.jpg",
                ingredientes: [
                    { insumoID: "masa", cantidad: 1 },
                    { insumoID: "queso", cantidad: 0.25 },
                    { insumoID: "tomate", cantidad: 0.20 }
                ]
            },
            {
                id: crypto.randomUUID(),
                nombre: "Hamburguesa Clásica",
                precio: 35,
                imagen: "img/hamburguesa.jpg",
                ingredientes: [
                    { insumoID: "pan", cantidad: 1 },
                    { insumoID: "carne", cantidad: 0.30 },
                    { insumoID: "lechuga", cantidad: 0.10 }
                ]
            },
            {
                id: crypto.randomUUID(),
                nombre: "Papas Fritas",
                precio: 15,
                imagen: "img/papas.jpg",
                ingredientes: [
                    { insumoID: "papas", cantidad: 0.25 },
                    { insumoID: "aceite", cantidad: 0.05 }
                ]
            }
        ];

        iniciales.forEach(p => addDocLS("platillos", p));
    }
}

inicializarPlatillos();

// ===============================
// EXPORTS
// ===============================
export function obtenerPlatillos() {
    return getCollection("platillos");
}

export function crearPlatillo(data) {
    return addDocLS("platillos", {
        id: crypto.randomUUID(),
        ...data,
        precio: Number(data.precio)
    });
}

export function actualizarPlatillo(id, data) {
    updateDocLS("platillos", id, {
        ...data,
        precio: Number(data.precio)
    });
}

export function eliminarPlatillo(id) {
    const platillos = getCollection("platillos");
    const nuevos = platillos.filter(p => p.id !== id);
    saveCollection("platillos", nuevos);
}
