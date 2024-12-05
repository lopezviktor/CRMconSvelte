<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

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
    // Eliminar productos
    async function eliminarProducto(idProducto){
      if (confirm("¿Estás seguro de eliminar este producto?")) {
        try {
          await fetch(`http://localhost:3000/api/productos/eliminar/${idProducto}`, {
            method: "DELETE",
          });
          alert("Producto eliminado.");
          fetchProductos();
        } catch (error) {
          console.error("Error al eliminar producto:", error);
          alert("Error al eliminar el producto.");
        }
      }
    }

  onMount(() => {
    fetchProductos();
  });

</script>

<main>
    <h2>Lista de Productos</h2>
  
    <button on:click={() => navigate("/productos/anadir")}>Añadir Producto</button>

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
            <th>Acciones</th>
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
              <td>
                <button on:click={() => navigate(`/productos/editar/${producto.idProducto}`)}>Editar</button>
                <button on:click={() => eliminarProducto(producto.idProducto)}>Eliminar</button>
              </td>
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