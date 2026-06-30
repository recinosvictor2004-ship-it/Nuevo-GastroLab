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
                descripcion: "Pizza clásica con queso y tomate",
                precio: 45,
                imagen: "img/pizza.jpg",   // ← RUTA CORRECTA
                ingredientes: [
                    { insumoID: "masa", cantidad: 1 },
                    { insumoID: "queso", cantidad: 0.25 },
                    { insumoID: "tomate", cantidad: 0.20 }
                ]
            },
            {
                id: crypto.randomUUID(),
                nombre: "Hamburguesa Clásica",
                descripcion: "Carne, pan y vegetales frescos",
                precio: 35,
                imagen: "img/hamburguesa.jpg",  // ← RUTA CORRECTA
                ingredientes: [
                    { insumoID: "pan", cantidad: 1 },
                    { insumoID: "carne", cantidad: 0.30 },
                    { insumoID: "lechuga", cantidad: 0.10 }
                ]
            },
            {
                id: crypto.randomUUID(),
                nombre: "Papas Fritas",
                descripcion: "Papas crujientes con sal",
                precio: 15,
                imagen: "img/papas.jpeg",   // ← CORREGIDO: antes decía papas.jpg
                ingredientes: [
                    { insumoID: "papas", cantidad: 0.25 },
                    { insumoID: "aceite", cantidad: 0.05 }
                ]
            }
        ];

    // Guardar platillos en LocalStorage
    iniciales.forEach(p => addDocLS("platillos", p));

    console.log("Platillos iniciales creados correctamente.");
}

inicializarPlatillos();
