<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    let ventas = writable([]);
    let clientes = writable({})

    // Cargar datos desde ventas.json y clientes.json
    onMount(async () => {
    try {
        const respuestaClientes = await fetch('http://localhost:3000/api/clientes');
        const dataClientes = await respuestaClientes.json();

        // Transformar la lista de clientes en un objeto con idCliente como clave
        const clientesMap = {};
        dataClientes.forEach(cliente => {
            clientesMap[cliente.idCliente] = cliente;
        });
        clientes.set(clientesMap);

        const respuestaVentas = await fetch('http://localhost:3000/api/ventas');
        const dataVentas = await respuestaVentas.json();
        ventas.set(dataVentas);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});
</script>

<h2>Lista de Ventas</h2>

<div class="ventas-container">
    {#each $ventas as venta}
        <div class="venta-card">
            <h3>Cliente: {$clientes[venta.idCliente]?.nombre} {$clientes[venta.idCliente]?.apellidos}</h3>
            <p><strong>Id Venta:</strong> {venta.idVenta}</p>
            <p><strong>Productos:</strong></p>
            <ul class="productos-list">
                {#each venta.productos as producto}
                    <li>
                        <strong>{producto.nombre}:</strong> {producto.cantidad} unidades - Subtotal: {producto.subtotal}€
                    </li>
                {/each}
            </ul>
            <p><strong>Cantidad Total de Productos:</strong> {venta.cantidad_total}</p>
            <p><strong>Precio Total:</strong> {venta.precio_total}€</p>
            <p><strong>Precio Medio por Producto:</strong> {venta.precio_medio}€</p>
        </div>
    {/each}
</div>

<style>
    h2 {
        text-align: center;
        color: #1A73E8;
        margin-bottom: 1.5rem;
    }
    .ventas-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .venta-card {
        background-color: #f0f7ff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 1.5rem;
        width: 300px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .venta-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .venta-card h3 {
        font-size: 1.2rem;
        color: #1A73E8;
        margin-bottom: 0.5rem;
    }

    .venta-card p, .productos-list {
        margin: 0.3rem 0;
        font-size: 0.9rem;
        color: #555;
    }

    .venta-card p strong {
        color: #333;
    }

    .productos-list {
        padding: 0;
        list-style: none;
    }

    .productos-list li {
        margin: 0.2rem 0;
    }
</style>