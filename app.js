// ===============================
//  NAVEGACIÓN ENTRE VISTAS
// ===============================

// Todas las vistas
const views = document.querySelectorAll("main section");

// Botones del menú
const navButtons = document.querySelectorAll("nav button");

// Botón de cerrar sesión
const logoutBtn = document.getElementById("btn-logout");


// Función para mostrar una vista
function showView(viewId) {
    views.forEach(view => {
        view.style.display = (view.id === viewId) ? "block" : "none";
    });
}


// Eventos de navegación
navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        showView(view);
    });
});


// ===============================
//  LOGIN
// ===============================

const loginView = document.getElementById("login-view");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

// Ocultar todo excepto login si no hay sesión
function verificarSesion() {
    const sesion = localStorage.getItem("usuarioActivo");

    if (sesion === "admin") {
        loginView.style.display = "none";
        document.querySelector("header").style.display = "flex";
        showView("inventario-view");
    } else {
        loginView.style.display = "block";
        document.querySelector("header").style.display = "none";
        views.forEach(v => v.style.display = "none");
    }
}

verificarSesion();


// Evento de login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value.trim();

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("usuarioActivo", "admin");
        loginError.style.display = "none";
        verificarSesion();
    } else {
        loginError.style.display = "block";
    }
});


// ===============================
//  CERRAR SESIÓN
// ===============================

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    verificarSesion();
});
