<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { Link } from 'svelte-routing';

    let clientes = writable([]);
    
    let filtroNombre = '';
    let filtroCiudad = '';
    let filtroCompras = '';
    let filtroMonto = '';

    onMount(async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/clientes');
            if (!respuesta.ok) {
                throw new Error("Error al cargar los clientes");
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
<Link to="/addCliente">
    <button>Nuevo cliente</button>
</Link>
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
        Monto total:
        <input type="text" bind:value={filtroMonto} placeholder="Filtrar por monto total" />
    </label>
</form>

<table class="clientes-table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Compras</th>
            <th>Monto Total</th>
        </tr>
    </thead>
    <tbody>
        {#each clientesFiltrados as cliente}
            <tr>
                <td>{cliente.idCliente}</td>
                <td>{cliente.nombre} {cliente.apellidos}</td>
                <td>{cliente.ciudad}</td>
                <td>{cliente.num_compras_ultimo_anio}</td>
                <td>{cliente.amount_ultimo_anio}€</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    h2 {
        text-align: center;
        color: #1A73E8;
        margin-bottom: 1.5rem;
    }

    button {
        background-color: #1A73E8;
        color: white;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 1rem;
    }

    button:hover {
        background-color: #155ab2;
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

    .clientes-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0 auto;
        font-size: 0.9rem;
        text-align: center;
    }

    .clientes-table thead {
        background-color: #1A73E8;
        color: white;
    }

    .clientes-table th,
    .clientes-table td {
        border: 1px solid #ddd;
        padding: 0.8rem;
    }

    .clientes-table tbody tr:nth-child(even) {
        background-color: #f0f7ff;
    }

    .clientes-table tbody tr:hover {
        background-color: #e0eaff;
    }
</style>