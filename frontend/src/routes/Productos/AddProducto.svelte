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

<form on:submit|preventDefault={guardarProducto}>
  <label>Nombre: <input bind:value={nombre} required /></label>
  <label>Precio: <input type="number" bind:value={precio} required min="0" /></label>
  <label>Categoría:
    <select bind:value={idCategoria} required>
      <option value="" disabled selected>Selecciona una categoría</option>
      <option value="1">Ropa</option>
      <option value="2">Calzado</option>
      <option value="3">Accesorios</option>
    </select>
  </label>
  <label>Stock: <input type="number" bind:value={stock} required min="0" /></label>
  <button type="submit">Guardar</button>
</form>