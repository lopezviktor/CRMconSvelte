<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let productos = [];
  let cargando = true;
  let busqueda = "";
  let error = "";

  async function fetchProductos() {
    cargando = true;
    try {
      const response = await fetch(
        "http://localhost:3000/api/productos/listar",
      );
      if (!response.ok) {
        throw new Error("Error al obtener los productos.");
      }
      productos = await response.json();
    } catch (err) {
      error = err.message;
      console.error("Error al obtener productos:", err);
    } finally {
      cargando = false;
    }
  }

  async function eliminarProducto(idProducto) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await fetch(
          `http://localhost:3000/api/productos/eliminar/${idProducto}`,
          {
            method: "DELETE",
          },
        );
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

  $: productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase()),
  );
</script>

<main>
  <h1>Lista de Productos</h1>
  <div class="buscador-container">
    <input
      type="text"
      placeholder="Buscar por nombre o categoría"
      bind:value={busqueda}
      class="buscador"
    />
  </div>

  {#if cargando}
    <p>Cargando productos...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if productosFiltrados.length === 0}
    <p>No se encontraron resultados para la búsqueda.</p>
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
        {#each productosFiltrados as producto (producto.idProducto)}
          <tr>
            <td>{producto.idProducto}</td>
            <td>{producto.nombre}</td>
            <td>{producto.precio}</td>
            <td>{producto.categoria}</td>
            <td>{producto.stock}</td>
            <td style="text-align: center;">
              <a
                href={`/productos/editar/${producto.idProducto}`}
                class="btn-editar">Editar</a
              >
              <button
                class="btn-rojo"
                on:click={() => eliminarProducto(producto.idProducto)}
                >Eliminar</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  h1 {
    text-align: center;
  }

  .buscador-container {
    display: flex;
    justify-content: center;
    align-items: stretch; /* Asegura que todos los elementos tengan la misma altura */
    margin-bottom: 20px;
    gap: 10px; /* Espacio uniforme entre los elementos */
    flex-wrap: wrap; /* Permite ajuste en pantallas pequeñas */
  }

  .buscador {
    flex: 1; /* Hace que el buscador ocupe el espacio disponible */
    max-width: 400px; /* Ancho máximo para el input */
    padding: 10px;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    outline: none;
  }

  .btn-add {
    display: inline-flex; /* Usa flexbox interno para centrar contenido */
    justify-content: center;
    align-items: center;
    background-color: #28a745;
    color: white;
    padding: 5px 15px; /* Solo padding horizontal */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    height: auto; /* Elimina altura fija */
    white-space: nowrap; /* Evita que el texto se divida */
    line-height: 1; /* Ajusta el espaciado interno del texto */
  }

  .btn-add:hover {
    background-color: #218838;
  }
  
  .btn-editar {
    background-color: var(--color-primary);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }

  .btn-editar:hover {
    background-color: var(--color-primary-hover);
  }
</style>
