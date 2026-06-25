// components/order-summary.js

class OrderSummary extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    set data(lista) {
        this.render(lista);
    }

    render(lista = []) {
        let total = lista.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        this.shadowRoot.innerHTML = `
            <style>
                .box {
                    background: rgba(0, 119, 255, 0.08);
                    padding: 16px;
                    border-radius: 10px;
                    border: 1px solid rgba(0, 119, 255, 0.4);
                    color: #e6e6e6;
                }
                table {
                    width: 100%;
                    margin-bottom: 10px;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .total {
                    font-size: 18px;
                    color: #4db8ff;
                    text-align: right;
                }
            </style>

            <div class="box">
                <table>
                    <thead>
                        <tr>
                            <th>Platillo</th>
                            <th>Cant.</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lista.map(p => `
                            <tr>
                                <td>${p.nombre}</td>
                                <td>${p.cantidad}</td>
                                <td>Q${p.precio}</td>
                                <td>Q${p.precio * p.cantidad}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <p class="total"><strong>Total: Q${total}</strong></p>
            </div>
        `;
    }
}

customElements.define("order-summary", OrderSummary);
