# 🍽️ GastroLab - Sistema de Gestión para Cocina Molecular

GastroLab es una aplicación web diseñada para administrar de forma eficiente un laboratorio de cocina molecular.  
El sistema permite gestionar **insumos**, **platillos** y **pedidos**, integrando control de inventario, recetas con ingredientes y actualización automática de existencias.

---

## 🚀 Características principales

### ✔ Gestión de Inventario
- Crear, editar y eliminar insumos.
- Control de cantidades y unidades (gramos, mililitros, unidades, etc.).
- Tabla dinámica con Web Components.

### ✔ Gestión de Platillos
- Crear platillos con:
  - Código
  - Nombre
  - Descripción molecular
  - Imagen
  - Precio
  - Ingredientes (insumos + cantidades)
- Editar y eliminar platillos.
- Los ingredientes se cargan automáticamente desde el inventario.

### ✔ Gestión de Pedidos
- Crear pedidos con:
  - Cliente
  - Teléfono
  - Estado
  - Lista de platillos + cantidades
- Cálculo automático de totales.
- **Descuento automático de inventario** según los ingredientes del platillo.
- Validación de inventario antes de confirmar el pedido.

### ✔ Autenticación
- Login básico con usuario y contraseña.
- Control de sesión con LocalStorage.

### ✔ SPA (Single Page Application)
- Navegación sin recargar la página.
- Vistas dinámicas controladas desde `app.js`.

### ✔ Web Components
- `<inventory-table>`
- `<dish-card>`
- `<order-summary>`

---

## 🧩 Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **Web Components**
- **LocalStorage**
- **Shadow DOM**

---

## 📁 Estructura del proyecto

/GastroLab
│── index.html
│── app.js
│── /components
│     ├── inventory-table.js
│     ├── dish-card.js
│     └── order-summary.js
│── /css
│     └── styles.css
│── README.md

---

## 🖼️ como se ve la pagina 

![Texto alternativo]("C:\Users\recin\OneDrive\Imágenes\Screenshots\Captura de pantalla 2026-06-25 141900.png")


