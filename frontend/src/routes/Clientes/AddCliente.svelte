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
    }

    .cliente-form {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background-color: var(--color-bg);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    label {
        width: 100%;
    }

    input {
        width: 100%;
        box-sizing: border-box;
    }
</style>