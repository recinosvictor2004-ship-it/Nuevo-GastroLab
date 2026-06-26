import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

// ===============================
// PROTECCIÓN DE RUTAS
// ===============================
onAuthStateChanged(auth, (user) => {
    const pagina = window.location.pathname;

    const esLogin = pagina.includes("login.html") || pagina.endsWith("/") || pagina.endsWith("index.html");

    // Si NO hay usuario y NO estamos en login → redirigir
    if (!user && !esLogin) {
        window.location.href = "login.html";
        return;
    }

    // Si SÍ hay usuario y estamos en login → ir al menú
    if (user && esLogin) {
        window.location.href = "menu.html";
        return;
    }
});

// ===============================
// CERRAR SESIÓN
// ===============================
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión");
        }
    });
}
