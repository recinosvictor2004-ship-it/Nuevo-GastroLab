import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

// ===============================
// VERIFICAR SI EL USUARIO ESTÁ LOGUEADO
// ===============================
onAuthStateChanged(auth, (user) => {
    const paginaActual = window.location.pathname;

    // Si NO hay usuario y NO estamos en login.html → redirigir
    if (!user && !paginaActual.includes("login.html")) {
        window.location.href = "login.html";
    }

    // Si SÍ hay usuario y estamos en login.html → ir al menú
    if (user && paginaActual.includes("login.html")) {
        window.location.href = "menu.html";
    }
});

// ===============================
// CERRAR SESIÓN
// ===============================
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });
}
