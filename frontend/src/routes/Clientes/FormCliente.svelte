<script>
  let nombre = "";
  let email = "";
  let telefono = "";
  let mensaje = "";

  let emailValido = true;

  function validarEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailValido = regex.test(email.trim());
  }

  function limpiarFormulario() {
      // Limpiar los campos del formulario
      nombre = "";
      email = "";
      telefono = "";
      mensaje = "";
  }

  function enviarFormulario() {
      // Validación de campos
      if (!nombre || !email || !mensaje) {
          alert("Todos los campos son obligatorios.");
          return;
      }

      if (!emailValido) {
          alert("Por favor, ingrese un email válido.");
          return;
      }

      // Crear el enlace mailto para abrir la aplicación de correo
      const mailtoLink = `mailto:contacto@crmsvelte.com?subject=Contacto desde el formulario&body=Nombre: ${nombre}%0AEmail: ${email}%0ATeléfono: ${telefono || 'No proporcionado'}%0AMensaje: ${mensaje}`;

      // Limpiar el formulario
      limpiarFormulario();

      // Abrir el cliente de correo predeterminado
      window.location.href = mailtoLink;
  }
</script>

<h2>Formulario de Contacto</h2>

<form on:submit|preventDefault={enviarFormulario} class="contact-form">
  <label>
      Nombre:
      <input type="text" bind:value={nombre} required />
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
      <input type="text" bind:value={telefono} />
  </label>
  <label>
      Mensaje:
      <textarea bind:value={mensaje} required></textarea>
  </label>
  <button type="submit">Enviar</button>
</form>

<style>
  h2 {
    text-align: center;
    margin-bottom: 20px; /* Espacio inferior */
    color: var(--color-text); /* Color del texto */
    font-size: 2rem; /* Tamaño del texto */
  }

  .contact-form {
    max-width: 400px; /* Ancho máximo del formulario */
    margin: 0 auto; /* Centra el formulario */
    padding: 20px; /* Relleno interno */
    border: 1px solid var(--color-border); /* Borde según color global */
    border-radius: 8px; /* Bordes redondeados */
    background-color: var(--color-bg); /* Fondo según color global */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra suave */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
  }

  label {
    display: block; /* Cada etiqueta ocupa toda la línea */
    margin-bottom: 10px; /* Espacio entre etiquetas */
    font-weight: bold; /* Negrita para las etiquetas */
    color: var(--color-text); /* Color del texto de las etiquetas */
  }

  input[type="text"],
  input[type="email"],
  textarea {
    width: calc(100% - 20px); /* Campos ocupan todo el ancho disponible menos el padding */
    padding: 10px; /* Relleno interno */
    border: 1px solid var(--color-border); /* Borde según color global */
    border-radius: 4px; /* Bordes redondeados en los campos de entrada */
    margin-top: 5px; /* Espacio entre etiqueta y campo de entrada */
    font-size: 1rem; /* Tamaño de fuente en los campos de entrada */
    transition: border-color 0.3s ease; /* Transición suave para el borde */
    box-sizing: border-box; /* Incluye padding y borde en el ancho total */
  }

  input[type="text"]:focus,
  input[type="email"]:focus,
  textarea:focus {
    border-color: var(--color-primary); /* Color del borde al enfocar */
    outline: none; /* Elimina el contorno por defecto */
    box-shadow: 0 0 5px rgba(26, 115, 232, 0.2); /* Sombra suave al enfocar */
  }

  .error {
    color: var(--color-error); /* Color rojo para mensajes de error según variable global */
    font-size: 0.9rem; /* Tamaño de fuente más pequeño para mensajes de error */
    margin-top: 5px; /* Espacio superior del mensaje de error respecto al campo de entrada */
  }
</style>