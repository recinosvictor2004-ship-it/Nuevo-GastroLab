import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const insumosRef = collection(db, "insumos");

export async function obtenerInsumos() {
  const snapshot = await getDocs(insumosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function descontarInsumo(id, cantidad) {
  const ref = doc(db, "insumos", id);
  return await updateDoc(ref, { cantidad });
}
