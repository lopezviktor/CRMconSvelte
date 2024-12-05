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
      venta.idVenta.toString().includes(busqueda)
  );
</script>

<h1>Ventas</h1>

<!-- Campo de búsqueda -->
<div class="buscador">
  <input 
      type="text" 
      placeholder="Buscar por cliente o ID de venta" 
      bind:value={busqueda} 
  />
</div>

{#if cargando}
  <p>Cargando ventas...</p>
{:else}
  <table>
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
      {#each ventas as venta}
        <tr>
          <td>{venta.idVenta}</td>
          <td>{venta.cliente}</td>
          <td>{venta.empleado}</td>
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
  margin-bottom: 20px;
}

.buscador {
  text-align: center; /* Centrar el campo de búsqueda */
  margin-bottom: 20px; /* Espacio inferior */
}

.buscador input {
  width: 80%; /* Ancho del campo de búsqueda */
  max-width: 400px; /* Ancho máximo */
  padding: 10px; /* Relleno interno */
  border-radius: 4px; /* Bordes redondeados */
  border: 1px solid #ccc; /* Borde gris claro */
}

.ventas-table {
  width: 100%;
  border-collapse: collapse; /* Elimina el espacio entre bordes */
  margin-top: 20px; /* Espacio superior de la tabla */
}

th, td {
  padding: 10px; /* Espaciado dentro de las celdas */
  border-bottom: 1px solid #ddd; /* Borde inferior en las celdas */
  text-align: left; /* Alineación a la izquierda */
}

th {
  background-color: #f4f4f4; /* Fondo de las cabeceras */
  color: #333; /* Color del texto en las cabeceras */
  font-weight: bold; /* Negrita para las cabeceras */
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* Fondo gris claro para filas pares */
}

.productos-lista {
  list-style-type: none; /* Elimina los puntos de la lista */
  padding-left: 0; /* Elimina padding por defecto */
  margin: 0; /* Elimina margen por defecto */
}

.productos-lista li {
  margin-bottom: 5px; /* Espacio entre elementos de la lista */
}

.acciones {
  text-align: center; /* Centra el contenido en la celda de acciones */
}

.btn-editar,
.btn-eliminar {
  background-color: #1a73e8; /* Color azul para botón de editar */
  color: white;
  border: none;
  padding: .3rem .5rem; /* Relleno interno del botón */
  border-radius: .25rem; /* Bordes redondeados en el botón */
  cursor: pointer;
  font-size: .9rem; /* Tamaño de fuente para botones */
}

.btn-editar:hover {
  background-color: #155ab2; /* Color más oscuro al pasar el ratón sobre editar */
}

.btn-eliminar {
  background-color: #e74c3c; /* Color rojo para botón de eliminar */
}

.btn-eliminar:hover {
  background-color: #c0392b; /* Color más oscuro al pasar el ratón sobre eliminar */
}
</style>