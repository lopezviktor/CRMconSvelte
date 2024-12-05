<script>
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    Chart.register(...registerables);

    let clientesPorMes = [];
    let dineroGastado = [];
    // Array con nombres de los meses
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    // Obtener datos de clientes registrados por mes
    async function cargarClientesPorMes() {
        try {
            const res = await fetch('http://localhost:3000/api/clientes/registradosPorMes');
            if (!res.ok) throw new Error('Error al cargar clientes registrados por mes');

            // Obtener los datos y asegurarse de que estén en orden de enero a diciembre
            let datos = await res.json();
            clientesPorMes = meses.map((mes, index) => {
                const mesData = datos.find((d) => d.mes === index + 1);
                return {
                    mes,
                    cantidad: mesData ? mesData.cantidad : 0, // Si no hay datos para un mes, 0
                };
            });

            dibujarGraficaClientesMes();
        } catch (error) {
            console.error('Error en cargarClientesPorMes:', error);
        }
    }

     // Obtener datos de dinero gastado por los clientes
     async function cargarDineroGastado() {
        try {
            const res = await fetch('http://localhost:3000/api/clientes/dineroGastado');
            if (!res.ok) throw new Error('Error al cargar datos de dinero gastado');
            let datos = await res.json();

            // Ordenar por amount_ultimo_anio y tomar los primeros 5
            dineroGastado = datos
                .sort((a, b) => b.amount_ultimo_anio - a.amount_ultimo_anio)
                .slice(0, 5);

            dibujarGraficaDinero();
        } catch (error) {
            console.error('Error en cargarDineroGastado:', error);
        }
    }

    // Dibujar gráfica de clientes registrados por mes
    function dibujarGraficaClientesMes() {
        const ctx = document.getElementById("clientesMesChart").getContext("2d");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: clientesPorMes.map((c) => c.mes),
                datasets: [
                    {
                        label: "Clientes Registrados",
                        data: clientesPorMes.map((c) => c.cantidad),
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    // Dibujar gráfica de dinero gastado por los clientes
    function dibujarGraficaDinero() {
        const ctx = document.getElementById("dineroGastadoChart").getContext("2d");

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: dineroGastado.map((c) => `${c.nombre} ${c.apellidos}`), // Mostrar nombre y apellidos
                datasets: [
                    {
                        data: dineroGastado.map((c) => c.amount_ultimo_anio), // Cambiar "totalGastado" por "amount_ultimo_anio"
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
            },
        });
    }

    onMount(() => {
        cargarClientesPorMes();
        cargarDineroGastado();
    });
</script>

<h2>Clientes Registrados por Mes</h2>
<canvas id="clientesMesChart"></canvas>
<h2>Dinero Gastado por Clientes</h2>
<canvas id="dineroGastadoChart"></canvas>

<style>
    h2 {
        text-align: center;
    }
    #clientesMesChart {
        width: 90%;
        max-width: 900px;
        margin: 20px auto;
        display: block;
    }
    #dineroGastadoChart{
        width: 60%;
        max-width: 400px;
        margin: 20px auto;
        display: block;
    }

    @media screen and (max-width: 600px) {
        #clientesMesChart, #dineroGastadoChart {
            width: 100%; /* Usar todo el ancho disponible */
            max-width: 100%; /* Sin límite de ancho */
            margin: 10px auto; /* Reducir el margen */
        }
    }
</style>