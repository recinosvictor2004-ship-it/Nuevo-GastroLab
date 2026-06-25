// ===============================
//  NAVEGACIÓN ENTRE VISTAS
// ===============================

// Todas las vistas internas
const views = document.querySelectorAll("main section");

// Botones del menú principal
const navButtons = document.querySelectorAll("nav button");

// Botón de cerrar sesión
const logoutBtn = document.getElementById("btn-logout");

// Función para mostrar una vista
function showView(viewId) {
    views.forEach(view => {
        view.style.display = (view.id === viewId) ? "block" : "none";
    });
}

// Eventos del menú
navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");

        // FIX: actualizar selects al entrar a cada vista
        if (view === "platillos-view") {
            cargarInsumosEnSelect();
        }
        if (view === "pedidos-view") {
            cargarPlatillosEnSelect();
        }

        showView(view);
    });
});

// Botones "Volver al menú"
const volverButtons = document.querySelectorAll(".btn-volver");
volverButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        showView("inventario-view");
    });
});


// ===============================
//  LOGIN
// ===============================

const loginView = document.getElementById("login-view");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

// Verificar sesión
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


// ===============================
//  LOCALSTORAGE - INVENTARIO
// ===============================

function getInsumos() {
    return JSON.parse(localStorage.getItem("insumos")) || [];
}

function saveInsumos(lista) {
    localStorage.setItem("insumos", JSON.stringify(lista));
}


// ===============================
//  RENDER INVENTARIO EN <inventory-table>
// ===============================

function actualizarTablaInsumos() {
    const tabla = document.querySelector("inventory-table");
    if (!tabla) return;
    tabla.data = getInsumos();
}


// ===============================
//  CRUD INVENTARIO
// ===============================

let insumoEditando = null;

const formInsumo = document.getElementById("form-insumo");

if (formInsumo) {
    formInsumo.addEventListener("submit", (e) => {
        e.preventDefault();

        const codigo = document.getElementById("insumo-codigo").value.trim();
        const nombre = document.getElementById("insumo-nombre").value.trim();
        const descripcion = document.getElementById("insumo-descripcion").value.trim();
        const cantidadValor = document.getElementById("insumo-cantidad").value;
        const cantidad = parseFloat(cantidadValor);
        const unidad = document.getElementById("insumo-unidad").value;

        if (!codigo || !nombre || !cantidadValor) {
            alert("Todos los campos obligatorios deben estar completos");
            return;
        }

        if (isNaN(cantidad) || cantidad < 0) {
            alert("La cantidad debe ser un número válido");
            return;
        }

        let insumos = getInsumos();

        // EDITAR
        if (insumoEditando) {
            const index = insumos.findIndex(i => i.codigo === insumoEditando);
            if (index !== -1) {
                insumos[index] = { codigo, nombre, descripcion, cantidad, unidad };
            }
            insumoEditando = null;
        } 
        // CREAR
        else {
            if (insumos.some(i => i.codigo === codigo)) {
                alert("Ya existe un insumo con ese código");
                return;
            }

            insumos.push({ codigo, nombre, descripcion, cantidad, unidad });
        }

        saveInsumos(insumos);
        actualizarTablaInsumos();
        cargarInsumosEnSelect(); // FIX: actualizar select de ingredientes
        formInsumo.reset();
    });
}


// ===============================
//  EVENTOS EDITAR / ELIMINAR INSUMOS
// ===============================

document.addEventListener("click", (e) => {
    // ELIMINAR INSUMO
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.getAttribute("data-id");
        let insumos = getInsumos().filter(i => i.codigo !== id);
        saveInsumos(insumos);
        actualizarTablaInsumos();
        cargarInsumosEnSelect();
    }

    // EDITAR INSUMO
    if (e.target.classList.contains("edit-btn")) {
        const id = e.target.getAttribute("data-id");
        const insumo = getInsumos().find(i => i.codigo === id);
        if (!insumo) return;

        document.getElementById("insumo-codigo").value = insumo.codigo;
        document.getElementById("insumo-nombre").value = insumo.nombre;
        document.getElementById("insumo-descripcion").value = insumo.descripcion;
        document.getElementById("insumo-cantidad").value = insumo.cantidad;
        document.getElementById("insumo-unidad").value = insumo.unidad;

        insumoEditando = id;
    }
});

actualizarTablaInsumos();


// ===============================
//  LOCALSTORAGE - PLATILLOS
// ===============================

function getPlatillos() {
    return JSON.parse(localStorage.getItem("platillos")) || [];
}

function savePlatillos(lista) {
    localStorage.setItem("platillos", JSON.stringify(lista));
}

function actualizarListaPlatillos() {
    const contenedor = document.getElementById("lista-platillos");
    const platillos = getPlatillos();

    contenedor.innerHTML = "";

    platillos.forEach(p => {
        const card = document.createElement("dish-card");
        card.data = p;
        contenedor.appendChild(card);
    });
}


// ===============================
//  CARGAR INSUMOS EN SELECT (CORREGIDO)
// ===============================

function cargarInsumosEnSelect() {
    const select = document.getElementById("ingrediente-insumo");
    if (!select) return;

    const insumos = getInsumos();
    select.innerHTML = "";

    insumos.forEach(i => {
        const option = document.createElement("option");
        option.value = i.codigo;
        option.textContent = `${i.nombre} (${i.unidad})`;
        select.appendChild(option);
    });
}


// ===============================
//  AGREGAR INGREDIENTES A PLATILLO
// ===============================

let ingredientesTemp = [];

document.getElementById("btn-agregar-ingrediente").addEventListener("click", () => {
    const insumo = document.getElementById("ingrediente-insumo").value;
    const cantidad = parseFloat(document.getElementById("ingrediente-cantidad").value);

    if (!insumo || isNaN(cantidad) || cantidad <= 0) {
        alert("Debe seleccionar un insumo y una cantidad válida");
        return;
    }

    ingredientesTemp.push({ insumo, cantidad });

    alert("Ingrediente agregado");
    document.getElementById("ingrediente-cantidad").value = "";
});


// ===============================
//  CRUD PLATILLOS
// ===============================

let platilloEditando = null;

const formPlatillo = document.getElementById("form-platillo");

formPlatillo.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigo = document.getElementById("platillo-codigo").value.trim();
    const nombre = document.getElementById("platillo-nombre").value.trim();
    const descripcion = document.getElementById("platillo-descripcion").value.trim();
    const imagen = document.getElementById("platillo-imagen").value.trim();
    const valor = parseFloat(document.getElementById("platillo-valor").value);

    if (!codigo || !nombre || !valor) {
        alert("Código, nombre y valor son obligatorios");
        return;
    }

    let platillos = getPlatillos();

    // EDITAR
    if (platilloEditando) {
        const index = platillos.findIndex(p => p.codigo === platilloEditando);
        platillos[index] = { codigo, nombre, descripcion, imagen, valor, ingredientes: ingredientesTemp };
        platilloEditando = null;
    }
    // CREAR
    else {
        if (platillos.some(p => p.codigo === codigo)) {
            alert("Ya existe un platillo con ese código");
            return;
        }

        platillos.push({
            codigo,
            nombre,
            descripcion,
            imagen,
            valor,
            ingredientes: ingredientesTemp
        });
    }

    savePlatillos(platillos);
    actualizarListaPlatillos();
    formPlatillo.reset();
    ingredientesTemp = [];
});


// ===============================
//  EDITAR / ELIMINAR PLATILLOS
// ===============================

document.addEventListener("click", (e) => {

    // ELIMINAR
    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.getAttribute("data-id");
        let platillos = getPlatillos().filter(p => p.codigo !== id);
        savePlatillos(platillos);
        actualizarListaPlatillos();
    }

    // EDITAR
    if (e.target.classList.contains("edit-btn")) {
        const id = e.target.getAttribute("data-id");
        const p = getPlatillos().find(p => p.codigo === id);

        document.getElementById("platillo-codigo").value = p.codigo;
        document.getElementById("platillo-nombre").value = p.nombre;
        document.getElementById("platillo-descripcion").value = p.descripcion;
        document.getElementById("platillo-imagen").value = p.imagen;
        document.getElementById("platillo-valor").value = p.valor;

        ingredientesTemp = [...p.ingredientes];

        platilloEditando = id;

        showView("platillos-view");
        cargarInsumosEnSelect();
    }
});

cargarInsumosEnSelect();
actualizarListaPlatillos();


// ===============================
//  LOCALSTORAGE - PEDIDOS
// ===============================

function getPedidos() {
    return JSON.parse(localStorage.getItem("pedidos")) || [];
}

function savePedidos(lista) {
    localStorage.setItem("pedidos", JSON.stringify(lista));
}


// ===============================
//  VARIABLES TEMPORALES DEL PEDIDO
// ===============================

let pedidoEditando = null;
let listaPedidoTemp = [];


// ===============================
//  CARGAR PLATILLOS EN SELECT
// ===============================

function cargarPlatillosEnSelect() {
    const select = document.getElementById("pedido-platillo-select");
    if (!select) return;

    const platillos = getPlatillos();
    select.innerHTML = "";

    platillos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.codigo;
        option.textContent = `${p.nombre} (Q${p.valor})`;
        select.appendChild(option);
    });
}


// ===============================
//  AGREGAR PLATILLO AL PEDIDO
// ===============================

document.getElementById("btn-agregar-platillo-pedido").addEventListener("click", () => {
    const codigo = document.getElementById("pedido-platillo-select").value;
    const cantidad = parseInt(document.getElementById("pedido-platillo-cantidad").value);

    if (!codigo || isNaN(cantidad) || cantidad <= 0) {
        alert("Debe seleccionar un platillo y una cantidad válida");
        return;
    }

    const platillo = getPlatillos().find(p => p.codigo === codigo);

    listaPedidoTemp.push({
        codigo: platillo.codigo,
        nombre: platillo.nombre,
        precio: platillo.valor,
        cantidad
    });

    document.querySelector("order-summary").data = listaPedidoTemp;

    document.getElementById("pedido-platillo-cantidad").value = "";
});


// ===============================
//  VALIDAR INVENTARIO ANTES DE GUARDAR
// ===============================

function validarInventarioParaPedido() {
    const insumos = getInsumos();
    const platillos = getPlatillos();

    for (let item of listaPedidoTemp) {
        const platillo = platillos.find(p => p.codigo === item.codigo);

        for (let ing of platillo.ingredientes) {
            const insumo = insumos.find(i => i.codigo === ing.insumo);
            const requerido = ing.cantidad * item.cantidad;

            if (insumo.cantidad < requerido) {
                return `No hay suficiente ${insumo.nombre}. Se requiere ${requerido} ${insumo.unidad}`;
            }
        }
    }

    return null;
}


// ===============================
//  DESCONTAR INVENTARIO AL GUARDAR PEDIDO
// ===============================

function descontarInventario() {
    let insumos = getInsumos();
    const platillos = getPlatillos();

    listaPedidoTemp.forEach(item => {
        const platillo = platillos.find(p => p.codigo === item.codigo);

        platillo.ingredientes.forEach(ing => {
            const insumo = insumos.find(i => i.codigo === ing.insumo);
            insumo.cantidad -= ing.cantidad * item.cantidad;
        });
    });

    saveInsumos(insumos);
    actualizarTablaInsumos();
}


// ===============================
//  GUARDAR PEDIDO (CREAR / EDITAR)
// ===============================

const formPedido = document.getElementById("form-pedido");

formPedido.addEventListener("submit", (e) => {
    e.preventDefault();

    const numero = document.getElementById("pedido-numero").value.trim();
    const cliente = document.getElementById("pedido-cliente").value.trim();
    const telefono = document.getElementById("pedido-telefono").value.trim();
    const estado = document.getElementById("pedido-estado").value;

    if (!numero || !cliente) {
        alert("Número de pedido y cliente son obligatorios");
        return;
    }

    let pedidos = getPedidos();

    // Validar inventario
    const errorInv = validarInventarioParaPedido();
    if (errorInv) {
        alert(errorInv);
        return;
    }

    // EDITAR
    if (pedidoEditando) {
        const index = pedidos.findIndex(p => p.numero === pedidoEditando);
        pedidos[index] = { numero, cliente, telefono, estado, items: listaPedidoTemp };
        pedidoEditando = null;
    }
    // CREAR
    else {
        if (pedidos.some(p => p.numero === numero)) {
            alert("Ya existe un pedido con ese número");
            return;
        }

        pedidos.push({
            numero,
            cliente,
            telefono,
            estado,
            items: listaPedidoTemp
        });
    }

    savePedidos(pedidos);
    descontarInventario();
    actualizarTablaPedidos();

    formPedido.reset();
    listaPedidoTemp = [];
    document.querySelector("order-summary").data = [];
});


// ===============================
//  RENDER TABLA DE PEDIDOS
// ===============================

function actualizarTablaPedidos() {
    const tbody = document.querySelector("#tabla-pedidos tbody");
    const pedidos = getPedidos();

    tbody.innerHTML = "";

    pedidos.forEach(p => {
        const total = p.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        tbody.innerHTML += `
            <tr>
                <td>${p.numero}</td>
                <td>${p.cliente}</td>
                <td>${p.estado}</td>
                <td>Q${total}</td>
                <td>
                    <button class="edit-pedido" data-id="${p.numero}">Editar</button>
                    <button class="delete-pedido" data-id="${p.numero}">Eliminar</button>
                </td>
            </tr>
        `;
    });
}


// ===============================
//  EDITAR / ELIMINAR PLATILLOS (CORREGIDO)
// ===============================

document.addEventListener("click", (e) => {

    // ELIMINAR PLATILLO
    if (e.target.classList.contains("delete-platillo")) {
        const id = e.target.getAttribute("data-id");
        let platillos = getPlatillos().filter(p => p.codigo !== id);
        savePlatillos(platillos);
        actualizarListaPlatillos();
    }

    // EDITAR PLATILLO
    if (e.target.classList.contains("edit-platillo")) {
        const id = e.target.getAttribute("data-id");
        const p = getPlatillos().find(p => p.codigo === id);

        document.getElementById("platillo-codigo").value = p.codigo;
        document.getElementById("platillo-nombre").value = p.nombre;
        document.getElementById("platillo-descripcion").value = p.descripcion;
        document.getElementById("platillo-imagen").value = p.imagen;
        document.getElementById("platillo-valor").value = p.valor;

        ingredientesTemp = [...p.ingredientes];

        platilloEditando = id;

        showView("platillos-view");
        cargarInsumosEnSelect();
    }
});



// ===============================
//  INICIALIZAR
// ===============================

cargarInsumosEnSelect();
cargarPlatillos