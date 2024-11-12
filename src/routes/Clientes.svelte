<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

// Variable para almacenar los clientes
let clientes = writable([]);
let filtroNombre = '';
let filtroCiudad = '';
let filtroCompras = '';
let filtroMonto = '';

// Cargar los datos desde el archivo JSON
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

// Filtrar clientes según los criterios de busqueda
$: clientesFiltrados = $clientes.filter(cliente => {
    return (
        (filtroNombre === '' || cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) &&
        (filtroCiudad === '' || cliente.ciudad.toLowerCase().includes(filtroCiudad.toLowerCase())) &&
        (filtroCompras === '' || cliente.num_compras_ultimo_anio >= parseInt(filtroCompras)) &&
        (filtroMonto) === '' || cliente.amount_ultimo_anio >= parseFloat(filtroMonto)
    );
});
</script>

<h2>Lista de clientes</h2>
<form>
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

<ul>
    {#each clientesFiltrados as cliente}
        <li>
            {cliente.nombre} {cliente.apellidos} - {cliente.ciudad} - {cliente.num_compras_ultimo_anio} compras - {cliente.amount_ultimo_anio}€
        </li>
    {/each}
</ul>
<style>
    form {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    label {
      flex: 1;
      min-width: 200px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
    }
  </style>