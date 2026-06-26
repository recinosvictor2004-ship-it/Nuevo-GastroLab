import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===============================
// PLATILLOS INICIALES
// ===============================
const platillosIniciales = [
    {
        nombre: "Pizza Margarita",
        descripcion: "Queso mozzarella y tomate",
        precio: 45,
        imagen: "img/pizza.png"
    },
    {
        nombre: "Hamburguesa Clásica",
        descripcion: "Carne, queso y vegetales",
        precio: 35,
        imagen: "img/hamburguesa.jpg"
    },
    {
        nombre: "Tacos al Pastor",
        descripcion: "Carne adobada con piña",
        precio: 30,
        imagen: "img/tacos.jpg"
    }
];

// ===============================
// INVENTARIO INICIAL
// ===============================
const inventarioInicial = [
    { nombre: "Queso", cantidad: 10, unidad: "kg" },
    { nombre: "Carne", cantidad: 15, unidad: "kg" },
    { nombre: "Tomate", cantidad: 20, unidad: "kg" }
];

// ===============================
// FUNCIÓN PRINCIPAL
// ===============================
async function inicializarDatos() {
    // PLATILLOS
    const snapPlatillos = await getDocs(collection(db, "platillos"));
    if (snapPlatillos.empty) {
        for (const p of platillosIniciales) {
            await addDoc(collection(db, "platillos"), p);
        }
        console.log("Platillos iniciales creados");
    }

    // INVENTARIO
    const snapInv = await getDocs(collection(db, "inventario"));
    if (snapInv.empty) {
        for (const i of inventarioInicial) {
            await addDoc(collection(db, "inventario"), i);
        }
        console.log("Inventario inicial creado");
    }
}

inicializarDatos();
