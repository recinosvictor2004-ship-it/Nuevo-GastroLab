import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "menu.html";
    } catch (err) {
        console.error("Error al iniciar sesión:", err);

        if (err.code === "auth/invalid-credential") {
            alert("Correo o contraseña incorrectos");
        } else {
            alert("No se pudo iniciar sesión");
        }
    }
});
