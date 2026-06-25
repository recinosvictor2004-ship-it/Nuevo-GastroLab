// components/inventory-table.js

class InventoryTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    set data(insumos) {
        this.render(insumos);
    }

    render(insumos = []) {
        this.shadowRoot.innerHTML = `
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    color: #e6e6e6;
                }
                th, td {
                    padding: 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                button {
                    padding: 6px 10px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                }
                .edit-btn { background: #3399ff; color: white; }
                .delete-btn { background: #ff4d4d; color: white; }
            </style>

            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${insumos.map(i => `
                        <tr>
                            <td>${i.codigo}</td>
                            <td>${i.nombre}</td>
                            <td>${i.cantidad}</td>
                            <td>${i.unidad}</td>
                            <td>
                                <button class="edit-btn" data-id="${i.codigo}">Editar</button>
                                <button class="delete-btn" data-id="${i.codigo}">Eliminar</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    }
}

customElements.define("inventory-table", InventoryTable);
