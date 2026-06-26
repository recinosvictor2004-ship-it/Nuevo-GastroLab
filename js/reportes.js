// ===============================
// GENERAR REPORTE POR PLATILLO
// ===============================
function generarReporteVentas(fechaInicio, fechaFin) {
    const ventas = getCollection("ventas") || [];

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Filtrar ventas por rango
    const ventasFiltradas = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha);
        return fechaVenta >= inicio && fechaVenta <= fin;
    });

    // Agrupar por platillo
    const resumen = {};

    ventasFiltradas.forEach(v => {
        Object.values(v.items).forEach(item => {

            if (!resumen[item.id]) {
                resumen[item.id] = {
                    codigo: item.id,
                    nombre: item.nombre,
                    cantidad: 0,
                    total: 0
                };
            }

            resumen[item.id].cantidad += item.cantidad;
            resumen[item.id].total += item.cantidad * item.precio;
        });
    });

    const lista = Object.values(resumen);

    // Total general
    const totalGeneral = lista.reduce((acc, p) => acc + p.total, 0);

    // Platillo más vendido (por cantidad)
    const masVendido = lista.length > 0
        ? lista.reduce((a, b) => a.cantidad > b.cantidad ? a : b)
        : null;

    // Platillo con mayor ingreso
    const mayorIngreso = lista.length > 0
        ? lista.reduce((a, b) => a.total > b.total ? a : b)
        : null;

    return { totalGeneral, lista, masVendido, mayorIngreso };
}

// ===============================
// BOTÓN GENERAR
// ===============================
document.getElementById("btnGenerar").addEventListener("click", () => {
    const inicio = document.getElementById("fechaInicio").value;
    const fin = document.getElementById("fechaFin").value;

    if (!inicio || !fin) {
        alert("Debe seleccionar ambas fechas para generar el reporte.");
        return;
    }

    const { totalGeneral, lista, masVendido, mayorIngreso } =
        generarReporteVentas(inicio, fin);

    let html = `
        <h2 style="color:black;">Total General de Ventas: Q${totalGeneral.toFixed(2)}</h2>
    `;

    if (masVendido) {
        html += `
            <div class="resumen-destacado">
                <p><strong>Platillo más vendido:</strong> ${masVendido.nombre} (${masVendido.cantidad} unidades)</p>
                <p><strong>Platillo con mayor ingreso:</strong> ${mayorIngreso.nombre} (Q${mayorIngreso.total.toFixed(2)})</p>
            </div>
        `;
    }

    html += `
        <table class="tabla-reporte">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Platillo</th>
                    <th>Cantidad Vendida</th>
                    <th>Total Generado</th>
                </tr>
            </thead>
            <tbody>
    `;

    lista.forEach(r => {
        html += `
            <tr>
                <td>${r.codigo}</td>
                <td>${r.nombre}</td>
                <td>${r.cantidad}</td>
                <td>Q${r.total.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    document.getElementById("resultado").innerHTML = html;
});
