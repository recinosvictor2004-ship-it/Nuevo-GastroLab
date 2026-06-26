// Proteger páginas
if (!localStorage.getItem("sesion")) {
    if (!window.location.pathname.includes("index.html")) {
        window.location.href = "login.html";
    }
}

// Cerrar sesión
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("sesion");
        window.location.href = "login.html";
    });
}
