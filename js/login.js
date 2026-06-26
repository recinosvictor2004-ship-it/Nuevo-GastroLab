const usuarioFijo = "admin";
const passwordFijo = "1234";

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    if (email === usuarioFijo && pass === passwordFijo) {
        localStorage.setItem("sesion", "activa");
        window.location.href = "menu.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});
