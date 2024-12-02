<script>
  export let isDarkMode = false;
  export let toggleTheme;

  // Obtener la ruta actual desde el navegador
  let currentPath = window.location.pathname;

  window.addEventListener('popstate', () => {
    currentPath = window.location.pathname;
  });
</script>

<nav>
  <ul>
    <!-- Opción Clientes -->
    <li class="menu-item">
      <span class="dropdown-trigger">Clientes</span>
      <ul class="submenu">
        <li><a href="/clientes/anadir">Añadir Cliente</a></li>
        <li><a href="/clientes/listar">Lista de Clientes</a></li>
        <li><a href="/clientes/historial">Historial de Clientes</a></li>
      </ul>
    </li>
    <!-- Opción Ventas -->
    <li class="menu-item">
      <span class="dropdown-trigger">Ventas</span>
      <ul class="submenu">
        <li><a href="/ventas/anadir">Añadir Venta</a></li>
        <li><a href="/ventas/listar">Historial de Ventas</a></li>
        <li><a href="/ventas/reportes">Reportes</a></li>
      </ul>
    </li>
    <!-- Opción Empleados -->
    <li class="menu-item">
      <span class="dropdown-trigger">Empleados</span>
      <ul class="submenu">
        <li><a href="/empleados/anadir">Añadir Empleado</a></li>
        <li><a href="/empleados/listar">Lista de Empleados</a></li>
        <li><a href="/empleados/turnos">Turnos</a></li>
      </ul>
    </li>

    <!-- Opción Productos -->
    <li class="menu-item">
      <a href="/productos" class="nav-link">Productos</a>
    </li>

    <!-- Botón para cambiar el tema -->
    <li class="menu-item">
      <button on:click={toggleTheme} class="theme-toggle">
        {#if isDarkMode}
          <img src="/images/lightMode.png" alt="Sol de modo claro" class="theme-icon" id="solModoClaro">
        {:else}
          <img src="/images/darkMode.png" alt="Luna de modo oscuro" class="theme-icon">
        {/if}
      </button>
    </li>
  </ul>
</nav>

<!--
<style>
  .theme-toggle {
  background-color: transparent; /* Fondo dinámico configurado abajo */
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Ícono del tema */
.theme-icon {
  height: 24px;
  width: 24px;
  transition: filter 0.3s ease, background-color 0.3s ease;
}
/* Hover para ambos modos */
.theme-toggle:hover {
  transform: scale(1.1);
}
#solModoClaro {
    filter: invert(1) brightness(2);
}
</style>
-->