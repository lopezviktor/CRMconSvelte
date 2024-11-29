<script>
    import { onMount } from "svelte";
  
    let empleados = []; // Lista de empleados cargada desde el backend
    let cargando = true; // Indicador de carga

    //`idEmpleado`, `nombre`, `apellidos`, `ciudad`, `email`, `telefono`, `sueldo` 
  
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

  </script>
  
  <h1>Empleados</h1>
  
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
        </tr>
      </thead>
      <tbody>
        {#each empleados as empleado}
          <tr>
            <td>{empleado.nombre}</td>
            <td>{empleado.apellidos}</td>
            <td>{empleado.email}</td>
            <td>{empleado.telefono}</td>
            <td>{empleado.ciudad}</td>
            <td>{empleado.sueldo}</td>
            <td style="text-align: center; vertical-align: middle;">
              <div style="display: inline-block; text-align: center;">
                <a href={`/empleados/editar/${empleado.idEmpleado}`} style="margin-right: 10px;">Editar</a>
                <button class="btn-rojo" on:click={() => eliminarEmpleado(empleado.idEmpleado)}>Eliminar</button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  