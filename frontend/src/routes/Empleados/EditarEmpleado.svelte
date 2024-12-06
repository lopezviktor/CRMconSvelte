<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let idEmpleado; // ID del empleado que se va a editar
  let empleado = {}; // Datos del empleado a editar
  let cargando = true; // Indicador de carga

  // Cargar los datos del empleado seleccionado
  async function cargarEmpleado() {
    cargando = true;
    try {
      const res = await fetch(`http://localhost:3000/api/empleados${idEmpleado}`);
      if (!res.ok) throw new Error("Error al cargar el empleado.");
      empleado = await res.json();
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar la información del empleado.");
    } finally {
      cargando = false;
    }
  }

  // Actualizar los datos del empleado
  async function actualizarEmpleado() {
    try {
      const res = await fetch(`http://localhost:3000/api/empleados/editar/${idEmpleado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });
      if (!res.ok) throw new Error("Error al actualizar el empleado.");
      alert("Empleado actualizado con éxito.");
      navigate("/empleados/listar"); // Volver a la lista de empleados
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al actualizar el empleado.");
    }
  }

  onMount(() => {
    cargarEmpleado();
  });
</script>

{#if cargando}
<p>Cargando datos del empleado...</p>
{:else}
<h2>Editar Empleado</h2>

<form on:submit|preventDefault={actualizarEmpleado} class="empleado-form">
  <label>
    Nombre:
    <input type="text" bind:value={empleado.nombre} required />
  </label>
  <label>
    Apellidos:
    <input type="text" bind:value={empleado.apellidos} required />
  </label>
  <label>
    Email:
    <input type="email" bind:value={empleado.email} required />
  </label>
  <label>
    Teléfono:
    <input type="text" bind:value={empleado.telefono} required />
  </label>
  <label>
    Ciudad:
    <input type="text" bind:value={empleado.ciudad} required />
  </label>
  <label>
    Sueldo:
    <input type="number" bind:value={empleado.sueldo} required />
  </label>
  <button type="submit">Guardar Cambios</button>
</form>
{/if}

<style>
h2 {
  text-align: center;
}

.empleado-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background-color: var(--color-bg);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

label {
  width: 100%;
}
input{
  width: 100%;
  box-sizing: border-box;
}

</style>