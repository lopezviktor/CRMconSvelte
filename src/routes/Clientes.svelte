<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let clientes = writable([]);
    let filtroNombre = '';
    let filtroCiudad = '';
    let filtroCompras = '';
    let filtroMonto = '';

    onMount(async () => {
        try {
            const respuesta = await fetch('/data/clientes.json');
            if (!respuesta.ok) {
                throw new Error("Error al cargar el archivo JSON");
            }
            const data = await respuesta.json();
            clientes.set(data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    });

    $: clientesFiltrados = $clientes.filter(cliente => {
        return (
            (filtroNombre === '' || cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) &&
            (filtroCiudad === '' || cliente.ciudad.toLowerCase().includes(filtroCiudad.toLowerCase())) &&
            (filtroCompras === '' || cliente.num_compras_ultimo_anio >= parseInt(filtroCompras)) &&
            (filtroMonto === '' || cliente.amount_ultimo_anio >= parseFloat(filtroMonto))
        );
    });
</script>

<h2>Lista de Clientes</h2>

<form class="filter-form">
    <label>
        Nombre:
        <input type="text" bind:value={filtroNombre} placeholder="Filtrar por nombre" />
    </label>
    <label>
        Ciudad:
        <input type="text" bind:value={filtroCiudad} placeholder="Filtrar por ciudad" />
    </label>
    <label>
        Número de compras:
        <input type="text" bind:value={filtroCompras} placeholder="Filtrar por nº de compras" />
    </label>
    <label>
        Amount de compras:
        <input type="text" bind:value={filtroMonto} placeholder="Filtrar por monto de compras" />
    </label>
</form>

<div class="clientes-container">
    {#each clientesFiltrados as cliente}
        <div class="cliente-card">
            <h3>{cliente.nombre} {cliente.apellidos}</h3>
            <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
            <p><strong>Compras:</strong> {cliente.num_compras_ultimo_anio}</p>
            <p><strong>Monto total:</strong> {cliente.amount_ultimo_anio}€</p>
        </div>
    {/each}
</div>

<style>
    /* Estilos generales */
    h2 {
        text-align: center;
        color: #1A73E8;
        margin-bottom: 1.5rem;
    }

    .filter-form {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .filter-form label {
        flex: 1 1 200px;
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
        color: #333;
    }

    .filter-form input {
        padding: 0.5rem;
        margin-top: 0.25rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 0.9rem;
    }

    .filter-form input:focus {
        outline: none;
        border-color: #1A73E8;
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
    }

    /* Estilos de la lista de clientes */
    .clientes-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
    }

    .cliente-card {
        background-color: #f5faff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 1.5rem;
        width: 280px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .cliente-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .cliente-card h3 {
        margin-top: 0;
        font-size: 1.3rem;
        color: #1A73E8;
        margin-bottom: 0.5rem;
    }

    .cliente-card p {
        margin: 0.3rem 0;
        font-size: 0.9rem;
        color: #555;
    }

    .cliente-card p strong {
        color: #333;
    }
</style>