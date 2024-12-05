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
                  <td style="text-align: center; vertical-align: middle;">
                      <div style="display: inline-block; text-align: center;">
                          <a href={`/clientes/editar/${cliente.idCliente}`} class="btn-editar">Editar</a>
                          <button class="btn-rojo" on:click={() => eliminarCliente(cliente.idCliente)}>Eliminar</button>
                      </div>
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
    margin-bottom: 20px;
    color: #333; /* Color del texto */
    font-size: 2rem; /* Tamaño del texto */
  }

  .buscador-container {
    display: flex; /* Usa flexbox para centrar */
    justify-content: center; /* Centra horizontalmente */
    margin-bottom: 20px; /* Espacio inferior */
  }

  .buscador {
    width: 100%; /* Ocupa todo el ancho */
    max-width: 400px; /* Ancho máximo */
    padding: 10px; /* Relleno interno */
    border: 1px solid #ccc; /* Borde gris claro */
    border-radius: 4px; /* Bordes redondeados */
    font-size: 1rem; /* Tamaño de fuente */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
    transition: border-color 0.3s ease; /* Transición suave para el borde */
    outline: none; /* Elimina el contorno por defecto */
  }

  .buscador:focus {
    border-color: #1a73e8; /* Color del borde al enfocar */
    box-shadow: 0 0 5px rgba(26, 115, 232, 0.2); /* Sombra suave al enfocar */
  }

  table {
    width: 100%; /* Tabla ocupa todo el contenedor */
    border-collapse: collapse; /* Elimina el espacio entre bordes */
    margin-top: 20px; /* Espacio superior de la tabla */
  }

  th, td {
    padding: 10px; /* Espaciado dentro de las celdas */
    border-bottom: 1px solid #ddd; /* Borde inferior en las celdas */
    text-align: left; /* Alineación a la izquierda */
  }

  th {
    background-color: #f4f4f4; /* Fondo de las cabeceras */
    color: #333; /* Color del texto en las cabeceras */
    font-weight: bold; /* Negrita para las cabeceras */
  }

  tr:nth-child(even) {
    background-color: #f9f9f9; /* Fondo gris claro para filas pares */
  }

  .btn-editar {
    background-color: #007bff; /* Color azul para botón de editar */
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }

  .btn-editar:hover {
    background-color: #0056b3; /* Color más oscuro al pasar el ratón sobre editar */
  }

  .btn-rojo {
    background-color: #e74c3c; /* Fondo rojo para botón de eliminar */
    color: white;
    border-radius: 4px;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn-rojo:hover {
    background-color: #c0392b; /* Fondo rojo oscuro al pasar el ratón sobre eliminar */
  }
</style>