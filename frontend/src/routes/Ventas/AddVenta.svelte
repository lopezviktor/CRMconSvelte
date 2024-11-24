<script>
    import { onMount } from "svelte";
    let clientes = [];
    let productos = [];
    let carrito = [];
    let idCliente = "";
    let precioTotal = 0;

    let selectedProduct = ""; 
    let selectedCantidad = 1;

    // Cargamos clientes desde el backend
    async function cargarClientes() {
        const res = await fetch("http://localhost:3000/api/clientes/listar");
        clientes = await res.json();
    }

    // Cargamos productos desde el backend
    async function cargarProductos() {
        const res = await fetch("http://localhost:3000/api/productos");
        productos = await res.json(); 
    }

    // Función para actualizar la cantidad con el teclado numérico
    function actualizarCantidad(valor) {
        selectedCantidad += valor; // Añadir el número pulsado a la cantidad
    }

    // Función para borrar el último dígito
    function borrarUltimoDigito() {
        selectedCantidad = selectedCantidad.slice(0, -1);
    }

    // Función para limpiar la cantidad
    function limpiarCantidad() {
        selectedCantidad = "";
    }

    // Añadimos producto al carrito
    function agregarProducto(idProducto, cantidad) {
        const producto = productos.find((p) => p.idProducto === idProducto);
        if (!producto) return;

        const subtotal = producto.precio * cantidad;
        carrito = [...carrito, { ...producto, cantidad, subtotal }];
        actualizarPrecioTotal();
        limpiarCantidad();
    }

    // Actualizar el precio total
    function actualizarPrecioTotal() {
        precioTotal = carrito.reduce((total, item) => total + item.subtotal, 0);
    } 

    // Enviamos la venta al back
    async function guardarVenta() {
        if (!idCliente || carrito.length === 0) {
            alert("Selecciona un cliente y al menos un producto.");
            return;
        }
        const venta = { idCliente, productos: carrito.map (({ idProducto, cantidad, subtotal }) => ({ idProducto, cantidad, subtotal }))};

        try {
            const res = await fetch("http://localhost:3000/api/ventas/anadir" , {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(venta),
            });
            if (!res.ok) throw new Error("Error al guardar la venta.");
            alert("Venta guardada correctamente.");
            carrito = [];
            idCliente = "";
            precioTotal = 0;
        }catch (error) {
            console.log(error);
            alert("Hubo un error al guardar la venta.")
        }
    }
    onMount(() => {
        cargarClientes();
        cargarProductos();
    });
</script>

<h1>Añadir venta</h1>

<form on:submit|preventDefault={guardarVenta}>
<label>
    Cliente:
    <select bind:value={idCliente} required>
      <option value="" disabled selected>Selecciona un cliente</option>
      {#each clientes as cliente}
        <option value={cliente.idCliente}>{cliente.nombre} {cliente.apellidos}</option>
      {/each}
    </select>
  </label>

  <label>
    Producto:
    <select bind:value="{selectedProduct}">
      <option value="" disabled selected>Selecciona un producto</option>
      {#each productos as producto}
        <option value={producto.idProducto}>{producto.nombre} - {producto.precio}€</option>
      {/each}
    </select>
  </label>

  <div class="teclado">
    <p>Cantidad: {selectedCantidad || 0}</p>
    <div class="teclado-numerico">
      {#each Array(10) as _, i}
        <button type="button" on:click={() => actualizarCantidad(i)}>{i}</button>
      {/each}
    </div>
    <div class="teclado-controles">
      <button type="button" on:click={borrarUltimoDigito}>Borrar</button>
      <button type="button" on:click={limpiarCantidad}>Limpiar</button>
    </div>
  </div>

  <button type="button" on:click={() => agregarProducto(selectedProduct, selectedCantidad)}>Añadir Producto</button>
  <h2>Carrito</h2>
  <ul>
    {#each carrito as item}
      <li>{item.cantidad} x {item.nombre} - {item.subtotal.toFixed(2)}€</li>
    {/each}
  </ul>

  <h3>Total: {precioTotal.toFixed(2)}€</h3>
  <button type="submit">Guardar Venta</button>

</form>
