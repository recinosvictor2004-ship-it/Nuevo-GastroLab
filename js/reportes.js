import { getCollection } from "./storage.js";

function generarReporteVentas(fechaInicio, fechaFin) {
    const ventas = getCollection("ventas") || [];
    const platillos = getCollection("platillos") || [];

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Filtrar ventas por rango
    const ventasFiltradas = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha);
        return fechaVenta >= inicio && fechaVenta <= fin;
    });

    // Agrupar ventas por platillo
    const resumen = {};

    ventasFiltradas.forEach(v => {
        v.items.forEach(item => {
            if (!resumen[item.platilloID]) {
                const p = platillos.find(pl => pl.id === item.platilloID);

                resumen[item.platilloID] = {
                    codigo: p.id,
                    nombre: p.nombre,
                    cantidad: 0,
                    total: 0
                };
            }

            resumen[item.platilloID].cantidad += item.cantidad;
            resumen[item.platilloID].total += item.cantidad * item.precio;
        });
    });

    const totalGeneral = ventasFiltradas.reduce((acc, v) => acc + v.total, 0);

    return { totalGeneral, resumen: Object.values(resumen) };
}

document.getElementById("btnGenerar").addEventListener("click", () => {
    const inicio = document.getElementById("fechaInicio").value;
    const fin = document.getElementById("fechaFin").value;

    const { totalGeneral, resumen } = generarReporteVentas(inicio, fin);

    let html = `
        <h3>Total General de Ventas: Q${totalGeneral.toFixed(2)}</h3>

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

    resumen.forEach(r => {
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
