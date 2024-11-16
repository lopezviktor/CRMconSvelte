<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    // VARIABLES PARA ALMACENAR LA LISTA DE CLIENTES Y VENTAS
    let clientes = writable([]);
    let ventas = writable([]);

    // VARIABLES PARA EL FORMULARIO DE CLIENTE
    let nombre = '';
    let apellidos = '';
    let email = '';
    let telefono = '';
    let ciudad = '';

    // VARIABLES PARA EL FORMULARIO DE VENTA
    let productosVenta = [];
    let productosSeleccionado = '';
    let cantidadProducto = 1;
    let idCliente = '';
    const productosDisponibles = {
        "Camiseta": 39,
        "Camisa": 59,
        "Pantalon": 99,
        "Chaqueta": 159,
        "Abrigo": 299
    };

    // AGREGAR CLIENTE
    function agregarCliente() {
        const nuevoCliente = {
            id: $clientes.length + 1,
            nombre,
            apellidos,
            email, 
            telefono, 
            ciudad
        };
        clientes.update(clientes => [...clientes, nuevoCliente]);

        // REINICIAR EL FORMULARIO CLIENTE
        nombre = '';
        apellidos = '';
        email = '';
        telefono = '';
        ciudad = ''
    }

    // AGREGAR EL PRODUCTO A LA VENTA ACTUAL
    function agregarProductoAVenta(){
        const precioUnitario = productosDisponibles[productosSeleccionado];
        const subtotal = precioUnitario * cantidadProducto;

        productosVenta = [...productosVenta, {
            producto: productosSeleccionado,
            cantidad: cantidadProducto,
            subtotal
        }];

        // REINICIAR SELECCION DE PRODUCTO
        productosSeleccionado = '';
        cantidadProducto = 1;
    }
    // GUARDAR VENTA
    function agregarVenta(idCliente) {
        const precioTotal = productosVenta.reduce((sum, item) => sum + item.subtotal, 0);
        const cantidadTotal = productosVenta.reduce((sum, item) => sum + item.cantidad, 0);
        const nuevaVenta = {
            idVenta: $ventas.length + 1,
            idCliente, 
            productos: productosVenta,
            cantidad_total: cantidadTotal,
            precio_total: precioTotal,
            precio_medio: (precioTotal / cantidadTotal).toFixed(2)
        };
        ventas.update(ventas => [...ventas, nuevaVenta]);

        productosVenta = [];
    }
</script>

<h2>Agregar Cliente y Venta</h2>

<!-- Formulario para agregar cliente -->
<div class="formulario">
    <h3>Nuevo Cliente</h3>
    <input type="text" placeholder="Nombre" bind:value={nombre} />
    <input type="text" placeholder="Apellidos" bind:value={apellidos} />
    <input type="text" placeholder="Ciudad" bind:value={ciudad} />
    <button on:click={agregarCliente}>Agregar Cliente</button>
</div>

<!-- Formulario para agregar productos a la venta -->
<div class="formulario">
    <h3>Agregar Productos a la Venta</h3>
    <select bind:value={productosSeleccionado}>
        <option value="" disabled selected>Selecciona un producto</option>
        {#each Object.keys(productosDisponibles) as producto}
            <option value={producto}>{producto} - {productosDisponibles[producto]}€</option>
        {/each}
    </select>
    <input type="number" min="1" bind:value={cantidadProducto} />
    <button on:click={agregarProductoAVenta}>Agregar Producto</button>

    <ul>
        {#each productosVenta as item}
            <li>{item.cantidad} x {item.producto} - Subtotal: {item.subtotal}€</li>
        {/each}
    </ul>
</div>

<!-- Seleccionar cliente para asociar la venta -->
<div class="formulario">
    <h3>Finalizar Venta</h3>
    <select bind:value={idCliente}>
        <option value="" disabled selected>Selecciona un cliente</option>
        {#each $clientes as cliente}
            <option value={cliente.id}>{cliente.nombre} {cliente.apellidos}</option>
        {/each}
    </select>
    <button on:click={agregarVenta}>Guardar Venta</button>
</div>

<style>
    /* Estilos generales de la página */
    h2 {
        text-align: center;
        color: #1A73E8;
        margin-bottom: 1.5rem;
    }

    .formulario {
        background-color: #f5faff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 1.5rem;
        width: 100%;
        max-width: 500px;
        margin: 1rem auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .formulario h3 {
        color: #1A73E8;
        margin-bottom: 1rem;
        font-size: 1.3rem;
        text-align: center;
    }

    input, select, button {
        display: block;
        width: 100%;
        padding: 0.7rem;
        margin: 0.5rem 0;
        font-size: 1rem;
        border-radius: 8px;
        border: 1px solid #ddd;
        font-family: inherit;
    }

    input:focus, select:focus, button:focus {
        outline: none;
        border-color: #1A73E8;
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
    }

    button {
        background-color: #1A73E8;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #155ab2;
    }

    ul {
        padding: 0;
        list-style: none;
        margin: 1rem 0;
    }

    ul li {
        background-color: #e9f2ff;
        border-radius: 8px;
        padding: 0.5rem;
        margin: 0.3rem 0;
        color: #333;
        font-size: 0.95rem;
    }
</style>
