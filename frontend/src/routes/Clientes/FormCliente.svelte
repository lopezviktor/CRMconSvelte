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

<form on:submit|preventDefault={enviarFormulario}>
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