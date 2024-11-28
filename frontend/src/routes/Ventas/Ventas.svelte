<script>
    import { onMount } from "svelte";
  
    let ventas = [];
    let cargando = true;
  
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
  </script>
    
<h1>Ventas</h1>

{#if cargando}
  <p>Cargando ventas...</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>ID Venta</th>
        <th>Cliente</th>
        <th>Fecha</th>
        <th>Total</th>
        <th>Productos</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each ventas as venta}
        <tr>
          <td>{venta.idVenta}</td>
          <td>{venta.cliente}</td>
          <td>{new Date(venta.fecha).toLocaleDateString()}</td>
          <td>{venta.total}€</td>
          <td>
            <ul>
              {#each venta.productos as producto}
                <li>
                  {producto.cantidad} x {producto.producto} ({producto.subtotal}€)
                </li>
              {/each}
            </ul>
          </td>
          <td style="text-align: center; vertical-align: middle;">
            <div style="display: inline-block; text-align: center;">
              <a href={`/ventas/editar/${venta.idVenta}`} style="margin-right: 15px;">Editar</a>
              <button class="btn-rojo" on:click={() => eliminarVenta(venta.idVenta)}>Eliminar</button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
