<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let idProducto;
  let nombre = "";
  let precio = 0;
  let idCategoria = "";
  let stock = 0;

  async function cargarProducto() {
    const res = await fetch(`http://localhost:3000/api/productos/listar/${idProducto}`);
    const producto = await res.json();
    nombre = producto.nombre;
    precio = producto.precio;
    idCategoria = producto.id_categoria;
    stock = producto.stock;
  }

  async function actualizarProducto() {
    if (!nombre || precio <= 0 || !idCategoria || stock < 0) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/productos/editar/${idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, id_categoria: idCategoria, stock }),
      });
      if (!res.ok) throw new Error("Error al actualizar el producto.");
      alert("Producto actualizado con éxito.");
      navigate("/productos");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al actualizar el producto.");
    }
  }

  onMount(() => {
    cargarProducto();
  });
</script>

<h1>Editar Producto</h1>

<form on:submit|preventDefault={actualizarProducto} class="producto-form">
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
    <option value="1">Ropa</option>
    <option value="2">Calzado</option>
    <option value="3">Accesorios</option>
  </select>
</label>
<label>
  Stock:
  <input type="number" bind:value={stock} required min="0" />
</label>
<button type="submit">Actualizar</button>
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
    box-sizing: border-box;
  }

  label {
        width: 100%;
    }

    input {
        width: 100%;
        box-sizing: border-box;
    }
</style>