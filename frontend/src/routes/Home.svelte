<script>
  import { onMount } from "svelte";

  let productosBajoStock = [];
  let totalVentasMes = 0;
  let totalProductosVendidosMes = 0;
  let ultimasVentas = [];

  // Llamada al endpoint de productos con bajo stock
  async function cargarProductosBajoStock() {
      try {
          const res = await fetch("http://localhost:3000/api/productos/bajo-stock");
          if (!res.ok) throw new Error("Error al cargar productos con bajo stock.");
          productosBajoStock = await res.json();
      } catch (error) {
          console.error("Error en cargarProductosBajoStock:", error);
      }
  }

  async function cargarVentasMes() {
      try {
          const res = await fetch("http://localhost:3000/api/ventas/reportes/ventas-mes");
          if (!res.ok) throw new Error("Error al cargar la cantidad de ventas del mes.");
          const data = await res.json();
          totalVentasMes = data.totalVentas;
      } catch (error) {
          console.error("Error en cargarVentasMes:", error);
      }
  }

  async function cargarProductosVendidosMes() {
      try {
          const res = await fetch("http://localhost:3000/api/ventas/reportes/productos-vendidos-mes");
          if (!res.ok) throw new Error("Error al cargar la cantidad de productos vendidos este mes.");
          const data = await res.json();
          totalProductosVendidosMes = data.totalProductosVendidos || 0; // Si es null, ponlo a 0
      } catch (error) {
          console.error("Error en cargarProductosVendidosMes:", error);
      }
  }

  // Llamada al endpoint para cargar las últimas ventas
  async function cargarUltimasVentas() {
      try {
          const res = await fetch("http://localhost:3000/api/ventas/ultimas-ventas");
          if (!res.ok) throw new Error("Error al cargar últimas ventas.");
          ultimasVentas = await res.json();
          console.log("Últimas ventas:", ultimasVentas);
      } catch (error) {
          console.error("Error en cargarUltimasVentas:", error);
      }
  }

  onMount(() => {
      cargarProductosBajoStock();
      cargarVentasMes();
      cargarProductosVendidosMes();
      cargarUltimasVentas();
  });
</script>

<h1>DASHBOARD</h1>

<div class="dashboard-section">
  <div class="card">
      <h3>Ventas/Mes</h3>
      <p>{totalVentasMes}</p>
  </div>
  <div class="card">
      <h3>Productos Vendidos/mes</h3>
      <p>{totalProductosVendidosMes}</p>
  </div>
</div>

<h2>Productos con Bajo Stock (-5)</h2>
{#if productosBajoStock.length === 0}
<p>Todos los productos tienen suficiente stock.</p>
{:else}
<table>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    {#each productosBajoStock as producto}
      <tr>
        <td>{producto.producto}</td>
        <td>{producto.stock}</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}

<h2>Últimas Ventas</h2>
{#if !ultimasVentas || ultimasVentas.length === 0}
<p>No hay ventas recientes para mostrar.</p>
{:else}
<table>
  <thead>
    <tr>
      <th>Fecha</th>
      <th>Cliente</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {#each ultimasVentas as venta}
      <tr>
        <td>{new Date(venta.fecha).toLocaleDateString()}</td>
        <td>{venta.cliente}</td>
        <td>{parseFloat(venta.total).toFixed(2)} €</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}

<style>
  body {
    background-color: #ffffff; /* Fondo blanco */
    color: #333333; /* Texto oscuro */
    font-family: 'Arial', sans-serif; /* Fuente estándar */
    margin: 0;
    padding: 20px;
    transition: background-color 0.3s, color 0.3s; /* Transición suave entre colores */
  }

  h1, h2 {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
    color: #333333; /* Texto oscuro */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  th, td {
    text-align: left;
    padding: 10px;
    border: 1px solid #dddddd; /* Borde gris claro */
  }

  th {
    background-color: #f4f4f4; /* Fondo gris claro para encabezados */
    color: #333333; /* Texto oscuro para encabezados */
  }

  tr:nth-child(even) {
    background-color: #f9f9f9; /* Fondo gris claro para filas pares */
  }

  .dashboard-section {
      display: flex;
      justify-content: space-evenly;
      margin: 20px 0;
  }

  .card {
      padding: 20px;
      border: 1px solid #dddddd; /* Borde gris claro */
      border-radius: 8px; /* Bordes redondeados */
      text-align: center;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Sombra suave */
      background-color: #ffffff; /* Fondo blanco para las tarjetas */
      transition: box-shadow 0.3s ease; /* Transición suave para la sombra */
  }

  .card:hover {
      box-shadow: 4px 4px 10px rgba(0,0,0,0.2); /* Efecto al pasar el ratón */
  }

  .card h3 {
      margin-bottom: 10px;
      font-size: 1.2rem; /* Tamaño de fuente para el encabezado de la tarjeta */
      color: #333333; /* Texto oscuro */
  }

  .card p {
      font-size: 1.5rem; /* Tamaño de fuente para el contenido de la tarjeta */
      font-weight: bold; /* Negrita para el contenido */
      color: #1a73e8; /* Color azul para el contenido */
  }
</style>
