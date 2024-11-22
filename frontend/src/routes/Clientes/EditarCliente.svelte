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
        navigate("/clientes"); // Volver a la lista de clientes
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
  
    <form on:submit|preventDefault={actualizarCliente}>
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
    form {
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: 0 auto;
    }
  
    label {
      margin-bottom: 1rem;
    }
  
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-top: 0.5rem;
    }
  
    button {
      background-color: #1A73E8;
      color: white;
      font-size: 1rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 1rem;
    }
  
    button:hover {
      background-color: #155ab2;
    }
  </style>