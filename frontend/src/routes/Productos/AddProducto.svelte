<script>
  import { navigate } from "svelte-routing";

  let nombre = "";
  let precio = 0;
  let idCategoria = "";
  let stock = 0;

  async function guardarProducto() {
    if (!nombre || precio <= 0 || !idCategoria || stock < 0) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/productos/anadir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, id_categoria: idCategoria, stock }),
      });
      if (!res.ok) throw new Error("Error al guardar el producto.");
      alert("Producto añadido con éxito.");
      navigate("/productos");
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Error al guardar el producto.");
    }
  }
</script>

<h1>Añadir Producto</h1>

<form on:submit|preventDefault={guardarProducto} class="producto-form">
<label>
  Nombre:
  <input type="text" bind:value={nombre} required />
</label>
<label>
  Precio:
  <input type="number" bind:value={precio} required min="0" step="0.01" />
</label>
<label>
  Categoría:
  <select bind:value={idCategoria} required>
    <option value="" disabled selected>Selecciona una categoría</option>
    <option value="1">Ropa</option>
    <option value="2">Calzado</option>
    <option value="3">Accesorios</option>
  </select>
</label>
<label>
  Stock:
  <input type="number" bind:value={stock} required min="0" />
</label>
<button type="submit">Guardar</button>
</form>

<style>
h1 {
  text-align: center;
}

.producto-form {
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

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input{
  width: 100%;
  box-sizing: border-box;
}
</style>