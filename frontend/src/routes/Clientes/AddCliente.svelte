<script>
    import { navigate } from 'svelte-routing';

    let nombre = "";
    let apellidos = "";
    let email = "";
    let telefono = "";
    let ciudad = "";

    let emailValido = true;
    let telefonoValido = true;

    function validarEmail() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailValido = regex.test(email.trim());
    }

    function validarTelefono() {
        const regex = /^[+\d\s-]+$/;
        telefonoValido = regex.test(telefono.trim());
    }

    async function agregarCliente() {
        validarEmail();
        validarTelefono();

        if (!nombre || !apellidos || !email || !telefono || !ciudad) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (!emailValido || !telefonoValido) {
            alert("Por favor, corrija los errores antes de continuar.");
            return;
        }

        const nuevoCliente = { nombre, apellidos, email, telefono, ciudad };
        console.log(nuevoCliente);

        try {
            const respuesta = await fetch('http://localhost:3000/api/clientes/anadir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoCliente)
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                console.error("Error en la API:", errorData);
                alert(`Error al guardar el cliente: ${errorData.message || 'Desconocido'}`);
                return;
            }

            alert('Cliente agregado con éxito');
            resetFormulario();
            navigate('/clientes/listar');
        } catch (error) {
            console.error('Error al agregar el cliente:', error);
            alert('Hubo un problema al guardar el cliente.');
        }
    }

    function resetFormulario() {
        nombre = "";
        apellidos = "";
        email = "";
        telefono = "";
        ciudad = "";
        emailValido = true;
        telefonoValido = true;
    }
</script>

<h2>Agregar Cliente</h2>

<form on:submit|preventDefault={agregarCliente} class="cliente-form">
    <label>
        Nombre:
        <input type="text" bind:value={nombre} required />
    </label>
    <label>
        Apellidos:
        <input type="text" bind:value={apellidos} required />
    </label>
    <label>
        Email:
        <input type="email" bind:value={email} on:input={validarEmail} required />
        {#if !emailValido}
            <span class="error">Por favor, ingrese un email válido.</span>
        {/if}
    </label>
    <label>
        Teléfono:
        <input type="text" bind:value={telefono} on:input={validarTelefono} required />
        {#if !telefonoValido}
            <span class="error">El teléfono solo puede contener números.</span>
        {/if}
    </label>
    <label>
        Ciudad:
        <input type="text" bind:value={ciudad} required />
    </label>
    <button type="submit">Guardar Cliente</button>
</form>

<style>
    h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333; /* Color del texto */
      font-size: 1.5rem; /* Tamaño del texto */
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

    .error {
      color: #e74c3c; /* Color rojo para mensajes de error */
      font-size: 0.9rem; /* Tamaño de fuente más pequeño para mensajes de error */
      margin-top: 5px; /* Espacio superior del mensaje de error respecto al campo de entrada */
    }
</style>