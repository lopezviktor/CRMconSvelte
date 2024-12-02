<script>
    import { onMount } from 'svelte';

    let productos = [];
    let error = '';

    // LLamada al backend para obtenerlos
    async function fetchProductos() {
        try {
            const response = await fetch('http://localhost:3000/api/productos/listar');
            if (!response.ok) {
                throw new Error('Error al obtener los productos.');
            }
            productos = await response.json();
        } catch (err) {
        error = err.message;
        console.error('Error al obtener productos:', err);
        }
    }
    onMount(() => {
        fetchProductos();
    });
</script>

<main>
    <h2>Lista de Productos</h2>
  
    {#if error}
      <p class="error">{error}</p>
    {:else if productos.length === 0}
      <p>No hay productos disponibles.</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {#each productos as producto (producto.idProducto)}
            <tr>
              <td>{producto.idProducto}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.categoria}</td>
              <td>{producto.stock}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </main>
  
  <style>
    main {
      padding: 1rem;
    }
  
    h2 {
      text-align: center;
      color: var(--color-primary);
    }
  
    .error {
      color: var(--color-error);
      text-align: center;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
  
    th, td {
      border: 1px solid var(--color-border);
      padding: 0.5rem;
      text-align: left;
    }
  
    th {
      background-color: var(--color-primary);
      color: white;
    }
  
    tbody tr:nth-child(odd) {
      background-color: #f9f9f9;
    }
  
    tbody tr:nth-child(even) {
      background-color: #fff;
    }
  </style>