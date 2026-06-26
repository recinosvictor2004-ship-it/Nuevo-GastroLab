import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// Referencia a la colección
const platillosRef = collection(db, "platillos");

// ===============================
// OBTENER TODOS LOS PLATILLOS
// ===============================
export async function obtenerPlatillos() {
  try {
    const snapshot = await getDocs(platillosRef);

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  } catch (error) {
    console.error("Error al obtener platillos:", error);
    return [];
  }
}

// ===============================
// CREAR PLATILLO
// ===============================
export async function crearPlatillo(data) {
  try {
    // Validación mínima
    if (!data.nombre || !data.precio) {
      throw new Error("Faltan datos obligatorios");
    }

    return await addDoc(platillosRef, {
      ...data,
      precio: Number(data.precio)
    });
  } catch (error) {
    console.error("Error al crear platillo:", error);
    throw error;
  }
}

// ===============================
// ACTUALIZAR PLATILLO
// ===============================
export async function actualizarPlatillo(id, data) {
  try {
    const ref = doc(db, "platillos", id);

    return await updateDoc(ref, {
      ...data,
      precio: Number(data.precio)
    });
  } catch (error) {
    console.error("Error al actualizar platillo:", error);
    throw error;
  }
}

// ===============================
// ELIMINAR PLATILLO
// ===============================
export async function eliminarPlatillo(id) {
  try {
    const ref = doc(db, "platillos", id);
    return await deleteDoc(ref);
  } catch (error) {
    console.error("Error al eliminar platillo:", error);
    throw error;
  }
}
