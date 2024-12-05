<script>
    import { onMount } from "svelte";
    let clientes = [];
    let productos = [];
    let empleados = [];
    let carrito = [];
    let idCliente = "";
    let idEmpleado = "";
    let precioTotal = 0;
    let selectedProduct = ""; 
    let selectedCantidad = 1;

    // Cargamos empleados desde el backend
    async function cargarEmpleados() {
      const res = await fetch("http://localhost:3000/api/empleados/listar");
      empleados = await res.json();
    }

    // Cargamos clientes desde el backend
    async function cargarClientes() {
        const res = await fetch("http://localhost:3000/api/clientes/listar");
        clientes = await res.json();
    }

    // Cargamos productos desde el backend
    async function cargarProductos() {
        const res = await fetch("http://localhost:3000/api/productos/listar");
        productos = await res.json(); 
    }

    // Añadimos producto al carrito
    function agregarProducto(idProducto, cantidad) {
      const producto = productos.find((p) => p.idProducto === idProducto);
      if (!producto) return;

      if (cantidad > producto.stock) {
          alert(`El stock disponible de "${producto.nombre}" es ${producto.stock}.`);
          return;
      }

      // Verificar si el producto ya está en el carrito
      const carritoItem = carrito.find((item) => item.idProducto === idProducto);
      if (carritoItem) {
          if (carritoItem.cantidad + cantidad > producto.stock) {
              alert(`No puedes agregar más de ${producto.stock} unidades de "${producto.nombre}".`);
              return;
          }
          // Actualizar la cantidad y el subtotal
          carritoItem.cantidad += cantidad;
          carritoItem.subtotal = carritoItem.cantidad * producto.precio;
      } else {
          // Agregar nuevo producto al carrito
          const subtotal = producto.precio * cantidad;
          carrito = [...carrito, { ...producto, cantidad, subtotal }];
      }

      // Restar el stock del producto
      producto.stock -= cantidad;

      actualizarPrecioTotal();
      selectedCantidad = 1; // Reinicia la cantidad después de agregar
    }

    // Actualizar el precio total
    function actualizarPrecioTotal() {
        precioTotal = carrito.reduce((total, item) => total + item.subtotal, 0);
    } 

    // Eliminar producto del carrito
    function eliminarProducto(index) {
        const item = carrito[index];
        const producto = productos.find((p) => p.idProducto === item.idProducto);
        if (producto) {
            producto.stock += item.cantidad; // Restaurar el stock
        }
        carrito = carrito.filter((_, i) => i !== index);
        actualizarPrecioTotal();
    }

    function modificarStock(idProducto, nuevoStock) {
    // Buscar el producto en el array de productos
    const producto = productos.find((p) => p.idProducto === idProducto);
        if (!producto) {
            alert("Producto no encontrado.");
            return;
        }

        if (nuevoStock < 0) {
            alert("El stock no puede ser negativo.");
            return;
        }

        producto.stock = nuevoStock; // Actualiza el stock del producto
        alert(`El stock del producto "${producto.nombre}" se actualizó a ${nuevoStock}.`);
    }

    // Enviamos la venta al back
    async function guardarVenta() {
        if (!idCliente || !idEmpleado ||carrito.length === 0) {
            alert("Selecciona un cliente, un empleado y al menos un producto.");
            return;
        }
        const venta = { 
          idCliente,
          idEmpleado, 
          productos: carrito.map (({ idProducto, cantidad, subtotal }) => ({ 
            idProducto, 
            cantidad, 
            subtotal 
          }))
      };

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
            idEmpleado = "";
            selectedProduct = "";
            precioTotal = 0;
            
            await cargarProductos();
        }catch (error) {
            console.log(error);
            alert("Hubo un error al guardar la venta.")
        }
    }
    onMount(() => {
        cargarClientes();
        cargarProductos();
        cargarEmpleados();
    });
</script>

<h1>Añadir venta</h1>

<form on:submit|preventDefault={guardarVenta}>
  
  <!-- Selección de empleado -->
  <label>
    Empleado:
    <select bind:value={idEmpleado} required>
      <option value="" disabled selected>Selecciona un empleado</option>
      {#each empleados as empleado}
        <option value={empleado.idEmpleado}>{empleado.nombre} {empleado.apellidos}</option>
      {/each}
    </select>
  </label>
  
  <!-- Selección de cliente -->
  <label>
    Cliente:
    <select bind:value={idCliente} required>
      <option value="" disabled selected>Selecciona un cliente</option>
      {#each clientes as cliente}
        <option value={cliente.idCliente}>{cliente.nombre} {cliente.apellidos}</option>
      {/each}
    </select>
  </label>

  <!-- Selección de producto -->
  <div>
    <label for="producto">Producto:</label>
      <select id="producto" bind:value={selectedProduct}>
        <option value="" disabled>Selecciona un producto</option>
        {#each productos as producto}
            <option value={producto.idProducto} disabled={producto.stock === 0}>
                {producto.nombre} - Precio: {producto.precio}€ - Stock: {producto.stock}
            </option>
        {/each}
    </select>
  </div>

  <!-- Slider para cantidad -->
  <div>
    <label for="cantidad">Cantidad:</label>
    <input
      type="range"
      id="cantidad"
      min="1"
      max="{selectedProduct ? productos.find(p => p.idProducto === selectedProduct)?.stock : 1}"
      bind:value={selectedCantidad}
    />
    <p>Cantidad seleccionada: {selectedCantidad}</p>
  </div>

  <!-- Botón para agregar al carrito -->
  <button type="button" on:click={() => agregarProducto(selectedProduct, selectedCantidad)}>Añadir Producto</button>

  <!-- Visualización del carrito -->
  <h2>Carrito</h2>
  {#if carrito.length === 0}
    <p>El carrito está vacío. Añade productos para empezar.</p>
  {:else}
    <ul>
      {#each carrito as item, index}
        <li>
          {item.cantidad} x {item.nombre} - {item.subtotal.toFixed(2)}€
          <button type="button" on:click={() => eliminarProducto(index)}>Eliminar</button>
        </li>
      {/each}
    </ul>
    <h3>Total: {precioTotal.toFixed(2)}€</h3>
  {/if}

  <!-- Botón para guardar la venta -->
  <button type="submit">Guardar Venta</button>
</form>
<style>
.venta-form {
    max-width: 600px; /* Ancho máximo del formulario */
    margin: auto; /* Centra el formulario */
    padding: 20px; /* Relleno interno */
    border: 1px solid #ddd; /* Borde gris claro */
    border-radius: 8px; /* Bordes redondeados */
    background-color: #fff; /* Fondo blanco */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra suave */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
}

label {
    display: block; /* Cada etiqueta ocupa toda la línea */
    margin-bottom: 10px; /* Espacio entre etiquetas */
    font-weight: bold; /* Negrita para las etiquetas */
    color: #555; /* Color del texto de las etiquetas */
}

select,
input[type="range"],
button {
    width: calc(100% - 20px); /* Campos ocupan todo el ancho disponible menos el padding */
    padding: 10px; /* Relleno interno */
    border-radius: 4px; /* Bordes redondeados */
    margin-top: 5px; /* Espacio entre etiqueta y campo de entrada */
    font-size: 1rem; /* Tamaño de fuente en los campos de entrada */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
 }

 select,
 input[type="text"],
 input[type="email"] {
     border: 1px solid #ccc; /* Borde gris claro */
 }

 input[type="range"] {
     -webkit-appearance: none;
     background-color: #ddd;
     height: 8px;
     border-radius: 5px;
 }

 input[type="range"]::-webkit-slider-thumb {
     -webkit-appearance: none;
     appearance: none;
     width: 20px;
     height: 20px;
     background-color: #1a73e8;
     border-radius:50%;
     cursor:pointer;
 }

 button {
     background-color: #1a73e8; /* Color de fondo del botón */
     color: white; /* Color del texto del botón */
     border: none; /* Sin borde */
     cursor:pointer; /* Cambia el cursor al pasar sobre el botón */
     transition:bg-color .3s ease-in-out; /* Transición suave para el color de fondo */
 }

 button:hover {
     background-color:#155ab2; /* Color más oscuro al pasar sobre el botón */
 }

 ul.carrito-lista {
     list-style:none; /* Elimina los puntos de la lista */
     padding-left:0; /* Elimina padding por defecto */
 }

 .carrito-item {
     display:flex; /* Usar flexbox para alinear elementos dentro de la lista */
     justify-content: space-between; /* Espacia los elementos a los extremos */
     align-items:center; /* Alinea verticalmente los elementos en el centro */
     margin-bottom:.5rem; /* Espacio entre elementos de la lista */
 }

 .btn-eliminar {
     background-color: #e74c3c; /* Color rojo para botón de eliminar */
     color:white;
     border:none;
     padding:.2rem .5rem; /* Reduce padding para hacer el botón más corto pero aún usable */
     border-radius:.25rem;
     cursor:pointer;
     font-size:.8rem; /* Tamaño de fuente más pequeño para que sea compacto pero legible */
     width:auto; /* Ajustar ancho automático para que sea corto pero no demasiado pequeño*/
 }

 .btn-eliminar:hover {
     background-color:#c0392b; /* Color más oscuro al pasar sobre el botón eliminar*/
 }
</style>