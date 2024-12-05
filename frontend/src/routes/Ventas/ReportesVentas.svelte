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
  <table class="productos-table">
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
          <td>{producto.total_vendido}€</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333; /* Color del texto */
  }

  canvas {
      width: 90%;
      max-width: 400px; /* Ajustar tamaño máximo */
      margin: 1rem auto; /* Margen superior e inferior y centrado */
      display: block;
  }

  .productos-table {
      width: 100%;
      border-collapse: collapse; /* Elimina el espacio entre bordes */
      margin-top: 20px; /* Espacio superior de la tabla */
  }

  th, td {
      padding: 0.8rem; /* Espaciado dentro de las celdas */
      text-align: left; /* Alineación a la izquierda */
      border-bottom: 1px solid #ddd; /* Borde inferior en las celdas */
  }

  th {
      background-color: #f4f4f4; /* Fondo de las cabeceras */
      color: #333; /* Color del texto en las cabeceras */
      font-weight: bold; /* Negrita para las cabeceras */
  }

  tr:nth-child(even) {
      background-color: #f9f9f9; /* Fondo gris claro para filas pares */
  }

  @media screen and (max-width: 600px) {
      canvas {
          width: 100%; /* Usar todo el ancho disponible en pantallas pequeñas */
          max-width: none; /* Sin límite de ancho */
      }
      
      .productos-table {
          font-size: .9rem; /* Reducir tamaño de fuente en pantallas pequeñas */
      }
      
      th, td {
          padding: .5rem; /* Reducir espaciado en celdas en pantallas pequeñas */
      }
  }
</style>