<script>
    import { onMount } from "svelte";
  
    let clientes = []; // Lista de clientes cargada desde el backend
    let cargando = true; // Indicador de carga
  
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
  </script>
  
  <h1>Clientes</h1>
  
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
        {#each clientes as cliente}
          <tr>
            <td>{cliente.nombre}</td>
            <td>{cliente.apellidos}</td>
            <td>{cliente.email}</td>
            <td>{cliente.telefono}</td>
            <td>{cliente.ciudad}</td>
            <td>
              <button on:click={() => eliminarCliente(cliente.idCliente)}>Eliminar</button>
              <a href={`/clientes/editar/${cliente.idCliente}`}>Editar</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  