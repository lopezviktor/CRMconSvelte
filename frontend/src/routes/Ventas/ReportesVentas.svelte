<script>
    import { onMount } from "svelte";
    import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

    // Registrar los componentes necesarios de Chart.js
    Chart.register(PieController, ArcElement, Tooltip, Legend);

    let productosMasVendidos = [];
    let chart = null;
    let chartCanvas;

    async function cargarProductosMasVendidos() {
      try {
            const res = await fetch("http://localhost:3000/api/ventas/reportes/mas-vendidos");
            productosMasVendidos = await res.json();

            // Ordenar los productos por total vendido y tomar los 8 más vendidos
            productosMasVendidos = productosMasVendidos
                .sort((a, b) => b.total_vendido - a.total_vendido)
                .slice(0, 8);

            // Crear la gráfica después de cargar los datos
            crearGrafica();
        } catch (error) {
            console.error("Error al cargar productos más vendidos:", error);
        }
    }

    function crearGrafica() {
      if (chart) {
          chart.destroy();
      }

      const labels = productosMasVendidos.map(producto => producto.nombre);
      const data = productosMasVendidos.map(producto => producto.total_vendido);

      chart = new Chart(chartCanvas, {
          type: "pie",
          data: {
              labels: labels,
              datasets: [
                  {
                      label: "Productos más vendidos",
                      data: data,
                      backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9F40",
                          "#8BC34A",
                          "#CDDC39"
                      ],
                      hoverOffset: 4,
                  },
              ],
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      display: true,
                      position: "top",
                      labels: {
                          boxWidth: 20, // Tamaño del cuadro de color
                          font: {
                              size: 12, // Tamaño de fuente
                          },
                          padding: 10, // Espaciado entre los elementos
                      },
                  },
                  tooltip: {
                      callbacks: {
                          label: (context) => `${context.label}: ${context.raw}`,
                      },
                  },
              },
              layout: {
                  padding: {
                      top: 20,
                  },
              },
          },
      });
  }

    onMount(() => {
        cargarProductosMasVendidos();
    });
</script>

<h2>Productos más vendidos</h2>

<div>
    <canvas bind:this={chartCanvas}></canvas>
</div>

{#if productosMasVendidos.length === 0}
  <p>No hay datos de ventas disponibles.</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Producto</th>
        <th>Total Vendido</th>
      </tr>
    </thead>
    <tbody>
      {#each productosMasVendidos as producto}
        <tr>
          <td>{producto.nombre}</td>
          <td>{producto.total_vendido}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  canvas {
    width: 90%;
    max-width: 400px; /* Ajustar tamaño máximo */
    margin: 1rem auto;
    display: block;
  }

  table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem auto;
  }

  th, td {
      padding: 0.8rem;
      text-align: left;
      border: 1px solid #ddd;
  }

  th {
      background-color: #f4f4f4;
  }

  @media screen and (max-width: 600px) {
      canvas {
          width: 100%;
          max-width: 100%; /* Ancho completo */
      }
  }
</style>