import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});
