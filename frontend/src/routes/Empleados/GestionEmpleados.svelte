<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    // VARIABLES PARA ALMACENAR LA LISTA DE CLIENTES Y VENTAS
    let empleados = writable([]);
    let ventas = writable([]);

    // VARIABLES PARA EL FORMULARIO DE CLIENTE
    let nombre = '';
    let apellidos = '';
    let email = '';
    let telefono = '';
    let ciudad = '';
    let sueldo = '';

    // VARIABLES PARA EL FORMULARIO DE VENTA
    let productosVenta = [];
    let productosSeleccionado = '';
    let cantidadProducto = 1;
    let idEmpleado = '';
    const productosDisponibles = {
        "Camiseta": 39,
        "Camisa": 59,
        "Pantalon": 99,
        "Chaqueta": 159,
        "Abrigo": 299
    };

    // AGREGAR CLIENTE
    function agregarEmpleado() {
        const nuevoEmpleado = {
            id: $empleados.length + 1,
            nombre,
            apellidos,
            email, 
            telefono, 
            ciudad,
            sueldo
        };
        empleados.update(empleados => [...empleados, nuevoEmpleado]);

        // REINICIAR EL FORMULARIO CLIENTE
        nombre = '';
        apellidos = '';
        email = '';
        telefono = '';
        ciudad = '';
        sueldo = ''
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
    /*
    // GUARDAR VENTA
    function agregarVenta(idEmpleado) {
        const precioTotal = productosVenta.reduce((sum, item) => sum + item.subtotal, 0);
        const cantidadTotal = productosVenta.reduce((sum, item) => sum + item.cantidad, 0);
        const nuevaVenta = {
            idVenta: $ventas.length + 1,
            idEmpleado, 
            productos: productosVenta,
            cantidad_total: cantidadTotal,
            precio_total: precioTotal,
            precio_medio: (precioTotal / cantidadTotal).toFixed(2)
        };
        ventas.update(ventas => [...ventas, nuevaVenta]);

        productosVenta = [];
    }
    */
</script>

<h2>Agregar Empleado y Venta</h2>

<!-- Formulario para agregar empleado -->
<div class="formulario">
    <h3>Nuevo Empleado</h3>
    <input type="text" placeholder="Nombre" bind:value={nombre} />
    <input type="text" placeholder="Apellidos" bind:value={apellidos} />
    <input type="text" placeholder="Ciudad" bind:value={ciudad} />
    <button on:click={agregarEmpleado}>Agregar Empleado</button>
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

<!-- Seleccionar empleado para asociar la venta -->
<div class="formulario">
    <h3>Finalizar Venta</h3>
    <select bind:value={idEmpleado}>
        <option value="" disabled selected>Selecciona un empleado</option>
        {#each $empleados as empleado}
            <option value={empleado.id}>{empleado.nombre} {empleado.apellidos}</option>
        {/each}
    </select>
    <button on:click={agregarVenta}>Guardar Venta</button>
</div>