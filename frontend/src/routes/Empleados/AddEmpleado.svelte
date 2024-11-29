<script>
    import { navigate } from 'svelte-routing';

    //`idEmpleado`, `nombre`, `apellidos`, `ciudad`, `email`, `telefono`, `sueldo` 

    let nombre = "";
    let apellidos = "";
    let email = "";
    let telefono = "";
    let ciudad = "";
    let sueldo = "";

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

    async function agregarEmpleado() {
        validarEmail();
        validarTelefono();

        if (!nombre || !apellidos || !email || !telefono || !ciudad || !sueldo) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (!emailValido || !telefonoValido) {
            alert("Por favor, corrija los errores antes de continuar.");
            return;
        }

        const nuevoEmpleado = { nombre, apellidos, email, telefono, ciudad, sueldo };
        console.log(nuevoEmpleado);

        try {
            const respuesta = await fetch('http://localhost:3000/api/empleados/anadir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoEmpleado)
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                console.error("Error en la API:", errorData);
                console.log("Nuevo empleado a agregar:", nuevoEmpleado);
                alert(`Error al guardar el empleado: ${errorData.message || 'Desconocido'}`);
                return;
            }

            alert('Empleado agregado con éxito');
            resetFormulario();
            navigate('/empleados/listar');
        } catch (error) {
            console.error('Error al agregar el empleado:', error);
            alert('Hubo un problema al guardar el empleado.');
        }
    }

    function resetFormulario() {
        nombre = "";
        apellidos = "";
        email = "";
        telefono = "";
        ciudad = "";
        sueldo = "";
        emailValido = true;
        telefonoValido = true;
    }
</script>

<h2>Agregar Empleado</h2>

<form on:submit|preventDefault={agregarEmpleado}>
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
    <label>
        Sueldo:
        <input type="number" bind:value={sueldo} required />
    </label>
    <button type="submit">Guardar Empleado</button>
</form>