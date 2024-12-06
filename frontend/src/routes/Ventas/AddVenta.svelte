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

  async function cargarDatos() {
      const [clientesRes, productosRes, empleadosRes] = await Promise.all([
          fetch("http://localhost:3000/api/clientes/listar"),
          fetch("http://localhost:3000/api/productos/listar"),
          fetch("http://localhost:3000/api/empleados/listar"),
      ]);

      clientes = await clientesRes.json();
      productos = await productosRes.json();
      empleados = await empleadosRes.json();
  }

  function agregarProducto(idProducto, cantidad) {
      const producto = productos.find(p => p.idProducto === idProducto);
      if (!producto || cantidad > producto.stock) return alert("Stock insuficiente.");
      const item = carrito.find(p => p.idProducto === idProducto);
      if (item) {
          item.cantidad += cantidad;
          item.subtotal = item.cantidad * producto.precio;
      } else {
          carrito.push({ ...producto, cantidad, subtotal: cantidad * producto.precio });
      }
      producto.stock -= cantidad;
      actualizarPrecioTotal();
  }

  function eliminarProducto(index) {
      const item = carrito.splice(index, 1)[0];
      productos.find(p => p.idProducto === item.idProducto).stock += item.cantidad;
      actualizarPrecioTotal();
  }

  function actualizarPrecioTotal() {
      precioTotal = carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  async function guardarVenta() {
      if (!idCliente || !idEmpleado || carrito.length === 0) {
          return alert("Faltan datos para completar la venta.");
      }

      const venta = {
          idCliente,
          idEmpleado,
          productos: carrito.map(({ idProducto, cantidad, subtotal }) => ({
              idProducto,
              cantidad,
              subtotal,
          }))
      };

      try {
          const res = await fetch("http://localhost:3000/api/ventas/anadir", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(venta)
          });
          if (!res.ok) throw new Error("Error al guardar la venta.");
          alert("Venta guardada.");
          carrito = [];
          idCliente = idEmpleado = "";
          selectedProduct = "";
          precioTotal = 0;
          cargarDatos();
      } catch (error) {
          console.error(error);
          alert("Error al guardar la venta.");
      }
  }

  onMount(cargarDatos);
</script>

<h2>Añadir Venta</h2>

<form on:submit|preventDefault={guardarVenta} class="venta-form">
  <label>
      Empleado:
      <select bind:value={idEmpleado} required>
          <option value="" disabled selected>Selecciona un empleado</option>
          {#each empleados as empleado}
              <option value={empleado.idEmpleado}>{empleado.nombre} {empleado.apellidos}</option>
          {/each}
      </select>
  </label>

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
      <select bind:value={selectedProduct}>
          <option value="" disabled selected>Selecciona un producto</option>
          {#each productos as producto}
              <option value={producto.idProducto} disabled={producto.stock === 0}>
                  {producto.nombre} - {producto.precio}€ (Stock: {producto.stock})
              </option>
          {/each}
      </select>
  </label>

  <label>
      Cantidad:
      <input type="number" min="1" bind:value={selectedCantidad} />
  </label>
  <button type="button" on:click={() => agregarProducto(selectedProduct, selectedCantidad)}>Añadir Producto</button>

  <h3>Carrito</h3>
  {#if carrito.length === 0}
      <p>El carrito está vacío.</p>
  {:else}
      <ul>
          {#each carrito as item, index}
              <li>
                  {item.cantidad} x {item.nombre} - {item.subtotal.toFixed(2)}€
                  <button type="button" on:click={() => eliminarProducto(index)}>Eliminar</button>
              </li>
          {/each}
      </ul>
      <h4>Total: {precioTotal.toFixed(2)}€</h4>
  {/if}

  <button type="submit">Guardar Venta</button>
</form>

<style>
  h2 {
      text-align: center;
  }

  .venta-form {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background-color: var(--color-bg);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

  label {
      display: block;
      margin-bottom: 10px;
  }
  
  input {
        width: 100%;
        box-sizing: border-box;
    }
</style>
