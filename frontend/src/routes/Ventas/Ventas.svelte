<script>
  import { onMount } from "svelte";

  let ventas = [];
  let cargando = true;
  let busqueda = ""; // Variable para almacenar el texto de búsqueda

  // Función para cargar las ventas desde el backend
  async function cargarVentas() {
      cargando = true;
      try {
          const res = await fetch("http://localhost:3000/api/ventas/listar");
          if (!res.ok) throw new Error("Error al cargar las ventas.");
          ventas = await res.json();
      } catch (error) {
          console.error(error);
          alert("Hubo un problema al cargar las ventas.");
      } finally {
          cargando = false;
      }
  }

  // Función para eliminar una venta
  async function eliminarVenta(idVenta) {
      if (!confirm("¿Estás seguro de que deseas eliminar esta venta?")) return;

      try {
          const res = await fetch(`http://localhost:3000/api/ventas/eliminar/${idVenta}`, {
              method: "DELETE",
          });
          if (!res.ok) throw new Error("Error al eliminar la venta.");
          alert("Venta eliminada correctamente.");
          cargarVentas(); // Recargar las ventas
      } catch (error) {
          console.error(error);
          alert("Hubo un problema al eliminar la venta.");
      }
  }

  onMount(() => {
      cargarVentas();
  });

  // Filtrar ventas según la búsqueda
  $: ventasFiltradas = ventas.filter(venta => 
      venta.cliente.toLowerCase().includes(busqueda.toLowerCase()) || 
      venta.idVenta.toString().includes(busqueda) ||
      venta.empleado.toLowerCase().includes(busqueda.toLowerCase())
  );
</script>

<h1>Ventas</h1>

<!-- Campo de búsqueda -->
<div class="buscador-container">
  <input 
      type="text" 
      placeholder="Buscar por cliente o ID de venta" 
      bind:value={busqueda} 
      class="buscador"
  />
</div>

{#if cargando}
  <p>Cargando ventas...</p>
{:else}
  <table >
    <thead>
      <tr>
        <th>ID Venta</th>
        <th>Cliente</th>
        <th>Empleado</th>
        <th>Fecha</th>
        <th>Total</th>
        <th>Productos</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each ventasFiltradas as venta}
        <tr>
          <td>{venta.idVenta}</td>
          <td>{venta.cliente}</td>
          <td>{venta.empleado}</td>
          <td>{new Date(venta.fecha).toLocaleDateString()}</td>
          <td>{venta.total}€</td>
          <td>
            <ul class="productos-lista">
              {#each venta.productos as producto}
                <li>
                  {producto.cantidad} x {producto.producto} ({producto.subtotal}€)
                </li>
              {/each}
            </ul>
          </td>
          <td class="acciones">
            <div style="display: inline-block; text-align: center;">
              <button class="btn-rojo" on:click={() => eliminarVenta(venta.idVenta)}>Eliminar</button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
 

<style>
h1 {
  text-align: center;
}

.buscador {
    width: 100%;
    max-width: 400px;
}

.buscador-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

.acciones {
  text-align: center; /* Centra el contenido en la celda de acciones */
  vertical-align: middle;
}

</style>