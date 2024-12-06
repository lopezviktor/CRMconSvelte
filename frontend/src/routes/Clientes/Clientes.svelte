<script>
  import { onMount } from "svelte";

  let clientes = []; // Lista de clientes cargada desde el backend
  let cargando = true; // Indicador de carga
  let busqueda = ""; // Valor del campo de búsqueda

  // Cargar clientes desde el backend
  async function cargarClientes() {
      cargando = true;
      try {
          const res = await fetch("http://localhost:3000/api/clientes/listar");
          if (!res.ok) throw new Error("Error al cargar los clientes");
          clientes = await res.json();
      } catch (error) {
          console.error(error);
          alert("Hubo un problema al cargar los clientes.");
      } finally {
          cargando = false;
      }
  }

  // Eliminar un cliente (botón de la tabla)
  async function eliminarCliente(id) {
      if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

      try {
          const res = await fetch(`http://localhost:3000/api/clientes/eliminar/${id}`, {
              method: "DELETE",
          });
          if (!res.ok) throw new Error("Error al eliminar el cliente");
          alert("Cliente eliminado correctamente.");
          cargarClientes(); // Recargar la lista de clientes
      } catch (error) {
          console.error(error);
          alert("Hubo un problema al eliminar el cliente.");
      }
  }

  onMount(() => {
      cargarClientes();
  });

  // Filtrar clientes según la búsqueda
  $: clientesFiltrados = clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  );
</script>

<h1>Clientes</h1>

<div class="buscador-container">
  <input 
      type="text" 
      placeholder="Buscar por nombre, apellidos o email" 
      bind:value={busqueda} 
      class="buscador"
  />
</div>

{#if cargando}
  <p>Cargando clientes...</p>
{:else}
  <table>
      <thead>
          <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Acciones</th>
          </tr>
      </thead>
      <tbody>
          {#each clientesFiltrados as cliente}
              <tr>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellidos}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.ciudad}</td>
                  <td class="acciones">
                      <a href={`/clientes/editar/${cliente.idCliente}`} class="btn-editar">Editar</a>
                      <button class="btn-rojo" on:click={() => eliminarCliente(cliente.idCliente)}>Eliminar</button>
                  </td>
              </tr>
          {/each}
      </tbody>
  </table>

  {#if clientesFiltrados.length === 0}
      <p>No se encontraron resultados para la búsqueda.</p>
  {/if}
{/if}

<style>
  h1 {
    text-align: center;

  }

  .buscador-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .buscador {
    width: 100%;
    max-width: 400px;
  }

  .acciones {
    text-align: center;
    vertical-align: middle;
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