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

            // Una vez cargados los datos, crea la gráfica
            crearGrafica();
        } catch (error) {
            console.error("Error al cargar productos más vendidos:", error);
        }
    }

    function crearGrafica() {
        // Si ya existe una gráfica, destrúyela antes de crear una nueva
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
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}`,
                        },
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
  h1, h2 {
    text-align: center;
  }

  canvas {
    max-width: 400px;
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
</style>