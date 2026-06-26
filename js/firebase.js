// IMPORTS DESDE CDN (FUNCIONA EN PROYECTOS HTML + JS)
import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getFirestore } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getAuth } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getStorage } 
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// CONFIGURACIÓN DE TU PROYECTO
const firebaseConfig = {
  apiKey: "AIzaSyD0FegoC91QAVHXlqaDQP0BPxwcV1rZQMY",
  authDomain: "gatrolab-babf2.firebaseapp.com",
  projectId: "gatrolab-babf2",
  storageBucket: "gatrolab-babf2.firebasestorage.app",
  messagingSenderId: "1048808489091",
  appId: "1:1048808489091:web:7adbe4f65527921b335bb6",
  measurementId: "G-LFJNSXVP90"
};

// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);

// EXPORTAR SERVICIOS
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
