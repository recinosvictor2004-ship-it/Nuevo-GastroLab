// Importar SDKs principales
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0FegoC91QAVHXlqaDQP0BPxwcV1rZQMY",
  authDomain: "gatrolab-babf2.firebaseapp.com",
  projectId: "gatrolab-babf2",
  storageBucket: "gatrolab-babf2.firebasestorage.app",
  messagingSenderId: "1048808489091",
  appId: "1:1048808489091:web:7adbe4f65527921b335bb6",
  measurementId: "G-LFJNSXVP90"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
