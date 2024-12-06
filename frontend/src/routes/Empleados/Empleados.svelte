<script>
  import { onMount } from "svelte";

  let empleados = []; // Lista de empleados cargada desde el backend
  let cargando = true; // Indicador de carga
  let busqueda = ""; // Valor del campo de búsqueda

  // Cargar empleados desde el backend
  async function cargarEmpleados() {
    cargando = true;
    try {
      const res = await fetch("http://localhost:3000/api/empleados/listar");
      if (!res.ok) throw new Error("Error al cargar los empleados");
      empleados = await res.json();
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al cargar los empleados.");
    } finally {
      cargando = false;
    }
  }

  // Eliminar un empleado (botón de la tabla)
  async function eliminarEmpleado(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este empleado?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/empleados/eliminar/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el empleado");
      alert("Empleado eliminado correctamente.");
      cargarEmpleados(); // Recargar la lista de empleados
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al eliminar el empleado.");
    }
  }

  onMount(() => {
    cargarEmpleados();
  });

  // Filtrar empleados según la búsqueda
  $: empleadosFiltrados = empleados.filter(empleado => 
      empleado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.email.toLowerCase().includes(busqueda.toLowerCase())
  );
</script>

<h1>Empleados</h1>

<div class="buscador-container">
<input 
    type="text" 
    placeholder="Buscar por nombre, apellidos o email" 
    bind:value={busqueda} 
    class="buscador"
/>
</div>

{#if cargando}
<p>Cargando empleados...</p>
{:else}
<table>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Apellidos</th>
      <th>Email</th>
      <th>Teléfono</th>
      <th>Ciudad</th>
      <th>Sueldo</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {#each empleadosFiltrados as empleado}
      <tr>
        <td>{empleado.nombre}</td>
        <td>{empleado.apellidos}</td>
        <td>{empleado.email}</td>
        <td>{empleado.telefono}</td>
        <td>{empleado.ciudad}</td>
        <td>{empleado.sueldo}</td>
        <td style="text-align: center; vertical-align: middle;">
          <div style="display: inline-block; text-align: center;">
            <a href={`/empleados/editar/${empleado.idEmpleado}`} class="btn-editar">Editar</a>
            <button class="btn-rojo" on:click={() => eliminarEmpleado(empleado.idEmpleado)}>Eliminar</button>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if empleadosFiltrados.length === 0}
  <p>No se encontraron resultados para la búsqueda.</p>
{/if}
{/if}

<style>
h1 {
  text-align: center;
}

.buscador-container {
  display: flex; /* Usa flexbox para centrar */
  justify-content: center; /* Centra horizontalmente */
  margin-bottom: 20px; /* Espacio inferior */
}

.buscador {
  width: 100%; /* Ocupa todo el ancho */
  max-width: 400px; /* Ancho máximo */
}

.btn-editar {
  background-color: var(--color-primary);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-editar:hover {
  background-color: var(--color-primary-hover);
}

</style>