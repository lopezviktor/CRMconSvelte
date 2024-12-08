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
    <!-- Opción Home -->
    <li class="menu-item">
      <a href="/" class="nav-link">Home</a>
    </li>
    <!-- Opción Clientes -->
    <li class="menu-item">
      <span class="dropdown-trigger">Clientes</span>
      <ul class="submenu">
        <li><a href="/clientes/anadir">Añadir Cliente</a></li>
        <li><a href="/clientes/listar">Lista de Clientes</a></li>
        <li><a href="/clientes/historialClientes">Historial de Clientes</a></li>
      </ul>
    </li>
    <!-- Opción Ventas -->
    <li class="menu-item">
      <span class="dropdown-trigger">Ventas</span>
      <ul class="submenu">
        <li><a href="/ventas/anadir">Añadir Venta</a></li>
        <li><a href="/ventas/listar">Historial de Ventas</a></li>
        <li><a href="/ventas/reportes/mas-vendidos">Reportes</a></li>
      </ul>
    </li>
    
    <!-- Opción Empleados -->
    <li class="menu-item">
      <span class="dropdown-trigger">Empleados</span>
      <ul class="submenu">
        <li><a href="/empleados/anadir">Añadir Empleado</a></li>
        <li><a href="/empleados/listar">Lista de Empleados</a></li>
      </ul>
    </li>

    <!-- Opción Productos -->
    <li class="menu-item">
      <span class="dropdown-trigger">Productos</span>
      <ul class="submenu">
        <li><a href="/productos/anadir">Añadir producto</a></li>
        <li><a href="/productos/listar">Lista de productos</a></li>
      </ul>
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
