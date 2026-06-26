// ===============================
// MINI BASE DE DATOS LOCAL
// ===============================

// Leer una colección
export function getCollection(nombre) {
    return JSON.parse(localStorage.getItem(nombre)) || [];
}

// Guardar una colección
export function saveCollection(nombre, data) {
    localStorage.setItem(nombre, JSON.stringify(data));
}

// Agregar un documento
export function addDocLS(nombre, doc) {
    const coleccion = getCollection(nombre);
    doc.id = crypto.randomUUID(); // ID único
    coleccion.push(doc);
    saveCollection(nombre, coleccion);
    return doc;
}

// Actualizar un documento
export function updateDocLS(nombre, id, cambios) {
    const coleccion = getCollection(nombre);
    const index = coleccion.findIndex(d => d.id === id);
    if (index !== -1) {
        coleccion[index] = { ...coleccion[index], ...cambios };
        saveCollection(nombre, coleccion);
    }
}

// Obtener un documento por ID
export function getDocLS(nombre, id) {
    return getCollection(nombre).find(d => d.id === id);
}
