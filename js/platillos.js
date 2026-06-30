function inicializarPlatillos() {
    const existentes = getCollection("platillos");

    if (!existentes || existentes.length === 0) {

        const inventario = getCollection("inventario");

        const masa = inventario.find(i => i.nombre.toLowerCase() === "masa");
        const queso = inventario.find(i => i.nombre.toLowerCase() === "queso");
        const tomate = inventario.find(i => i.nombre.toLowerCase() === "tomate");
        const pan = inventario.find(i => i.nombre.toLowerCase() === "pan");
        const carne = inventario.find(i => i.nombre.toLowerCase() === "carne");
        const lechuga = inventario.find(i => i.nombre.toLowerCase() === "lechuga");
        const papas = inventario.find(i => i.nombre.toLowerCase() === "papas");
        const aceite = inventario.find(i => i.nombre.toLowerCase() === "aceite");

        const iniciales = [
            {
                id: crypto.randomUUID(),
                nombre: "Pizza Margarita",
                descripcion: "Pizza clásica con queso y tomate",
                precio: 45,
                imagen: "img/pizza.jpg",
                ingredientes: [
                    { insumoID: masa.id, cantidad: 1 },
                    { insumoID: queso.id, cantidad: 0.25 },
                    { insumoID: tomate.id, cantidad: 0.20 }
                ]
            },
            {
                id: crypto.randomUUID(),
                nombre: "Hamburguesa Clásica",
                descripcion: "Carne, pan y vegetales frescos",
                precio: 35,
                imagen: "img/hamburguesa.jpg",
                ingredientes: [
                    { insumoID: pan.id, cantidad: 1 },
                    { insumoID: carne.id, cantidad: 0.30 },
                    { insumoID: lechuga.id, cantidad: 0.10 }
                ]
            },
            {
                id: crypto.randomUUID(),
                nombre: "Papas Fritas",
                descripcion: "Papas crujientes con sal",
                precio: 15,
                imagen: "img/papas.jpeg",
                ingredientes: [
                    { insumoID: papas.id, cantidad: 0.25 },
                    { insumoID: aceite.id, cantidad: 0.05 }
                ]
            }
        ];

        iniciales.forEach(p => addDocLS("platillos", p));
    } // ← esta cierra el IF

} 

inicializarPlatillos();
