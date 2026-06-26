import { db } from "./firebase.js";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const platillosRef = collection(db, "platillos");

export async function obtenerPlatillos() {
  const snapshot = await getDocs(platillosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function crearPlatillo(data) {
  return await addDoc(platillosRef, data);
}

export async function actualizarPlatillo(id, data) {
  const ref = doc(db, "platillos", id);
  return await updateDoc(ref, data);
}
