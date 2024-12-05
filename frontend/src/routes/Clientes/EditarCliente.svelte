<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let idCliente; // ID del cliente que se va a editar
  let cliente = {}; // Datos del cliente a editar
  let cargando = true; // Indicador de carga

  // Cargar los datos del cliente seleccionado
  async function cargarCliente() {
      cargando = true;
      try {
          const res = await fetch(`http://localhost:3000/api/clientes/${idCliente}`);
          if (!res.ok) throw new Error("Error al cargar el cliente.");
          cliente = await res.json();
      } catch (error) {
          console.error(error);
          alert("No se pudo cargar la información del cliente.");
      } finally {
          cargando = false;
      }
  }

  // Actualizar los datos del cliente
  async function actualizarCliente() {
      try {
          const res = await fetch(`http://localhost:3000/api/clientes/editar/${idCliente}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(cliente),
          });
          if (!res.ok) throw new Error("Error al actualizar el cliente.");
          alert("Cliente actualizado con éxito.");
          navigate("/clientes/listar"); // Volver a la lista de clientes después de guardar
      } catch (error) {
          console.error(error);
          alert("Hubo un problema al actualizar el cliente.");
      }
  }

  onMount(() => {
      cargarCliente();
  });
</script>

{#if cargando}
  <p>Cargando datos del cliente...</p>
{:else}
  <h2>Editar Cliente</h2>

  <form on:submit|preventDefault={actualizarCliente} class="cliente-form">
      <label>
          Nombre:
          <input type="text" bind:value={cliente.nombre} required />
      </label>
      <label>
          Apellidos:
          <input type="text" bind:value={cliente.apellidos} required />
      </label>
      <label>
          Email:
          <input type="email" bind:value={cliente.email} required />
      </label>
      <label>
          Teléfono:
          <input type="text" bind:value={cliente.telefono} required />
      </label>
      <label>
          Ciudad:
          <input type="text" bind:value={cliente.ciudad} required />
      </label>
      <button type="submit">Guardar Cambios</button>
  </form>
{/if}

<style>
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333; /* Color del texto */
    font-size: 2rem; /* Tamaño del texto */
  }

  .cliente-form {
    max-width: 400px; /* Ancho máximo del formulario */
    margin: 0 auto; /* Centra el formulario */
    padding: 20px; /* Relleno interno */
    border: 1px solid #ddd; /* Borde gris claro */
    border-radius: 8px; /* Bordes redondeados */
    background-color: #fff; /* Fondo blanco */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra suave */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
  }

  label {
    display: block; /* Cada etiqueta ocupa toda la línea */
    margin-bottom: 10px; /* Espacio entre etiquetas */
    font-weight: bold; /* Negrita para las etiquetas */
    color: #555; /* Color del texto de las etiquetas */
  }

  input[type="text"],
  input[type="email"] {
    width: calc(100% - 20px); /* Campos ocupan todo el ancho disponible menos el padding */
    padding: 10px; /* Relleno interno */
    border: 1px solid #ccc; /* Borde gris claro */
    border-radius: 4px; /* Bordes redondeados en los campos de entrada */
    margin-top: 5px; /* Espacio entre etiqueta y campo de entrada */
    font-size: 1rem; /* Tamaño de fuente en los campos de entrada */
    transition: border-color 0.3s ease; /* Transición suave para el borde */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
  }

  input[type="text"]:focus,
  input[type="email"]:focus {
    border-color: #1a73e8; /* Color del borde al enfocar */
    outline: none; /* Elimina el contorno por defecto */
    box-shadow: 0 0 5px rgba(26, 115, 232, 0.2); /* Sombra suave al enfocar */
  }

  button {
    background-color: #1a73e8; /* Color de fondo del botón */
    color: white; /* Color del texto del botón */
    padding: 10px; /* Relleno interno del botón */
    border: none; /* Sin borde */
    border-radius: 4px; /* Bordes redondeados en el botón */
    cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
    font-size: 1rem; /* Tamaño de fuente en el botón */
    transition: background-color 0.3s ease; /* Transición suave para el color de fondo */
    margin-top: 10px; /* Espacio superior del botón respecto a otros elementos */
    width: calc(100% - 20px); /* Botón ocupa todo el ancho disponible menos el padding */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
  }

  button:hover {
    background-color: #155ab2; /* Color más oscuro al pasar el ratón sobre el botón */
  }
</style>