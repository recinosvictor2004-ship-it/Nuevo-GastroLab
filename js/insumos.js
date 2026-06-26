import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  addDoc,
  deleteDoc
} from "firebase/firestore";

const insumosRef = collection(db, "insumos");

// ===============================
// OBTENER INSUMOS
// ===============================
export async function obtenerInsumos() {
  try {
    const snapshot = await getDocs(insumosRef);

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  } catch (error) {
    console.error("Error al obtener insumos:", error);
    return [];
  }
}

// ===============================
// DESCONTAR INSUMO
// ===============================
export async function descontarInsumo(id, cantidad) {
  try {
    const ref = doc(db, "insumos", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("Insumo no encontrado:", id);
      return;
    }

    const data = snap.data();
    const nuevaCantidad = Math.max(0, Number(data.cantidad) - Number(cantidad));

    await updateDoc(ref, { cantidad: nuevaCantidad });

  } catch (error) {
    console.error("Error al descontar insumo:", error);
  }
}

// ===============================
// ACTUALIZAR INSUMO COMPLETO
// ===============================
export async function actualizarInsumo(id, data) {
  try {
    const ref = doc(db, "insumos", id);
    await updateDoc(ref, data);
  } catch (error) {
    console.error("Error al actualizar insumo:", error);
  }
}

// ===============================
// CREAR INSUMO
// ===============================
export async function crearInsumo(data) {
  try {
    return await addDoc(insumosRef, {
      ...data,
      cantidad: Number(data.cantidad),
      costo: Number(data.costo)
    });
  } catch (error) {
    console.error("Error al crear insumo:", error);
  }
}

// ===============================
// ELIMINAR INSUMO
// ===============================
export async function eliminarInsumo(id) {
  try {
    const ref = doc(db, "insumos", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Error al eliminar insumo:", error);
  }
}
