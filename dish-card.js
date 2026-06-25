// components/dish-card.js

class DishCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    set data(platillo) {
        this.render(platillo);
    }

    render(p) {
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: rgba(255,255,255,0.05);
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #e6e6e6;
                }
                img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 10px;
                }
                h3 {
                    color: #4db8ff;
                    margin-bottom: 6px;
                }
                button {
                    margin-top: 10px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    background: #0077ff;
                    color: white;
                }
            </style>

            <div class="card">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <p><strong>Precio:</strong> Q${p.valor}</p>

                <button data-id="${p.codigo}" class="edit-btn">Editar</button>
                <button data-id="${p.codigo}" class="delete-btn" style="background:#ff4d4d;">Eliminar</button>
            </div>
        `;
    }
}

customElements.define("dish-card", DishCard);
