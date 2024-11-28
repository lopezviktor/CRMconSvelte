<script>
  export let isDarkMode = false;
  export let toggleTheme;

  import { Link } from 'svelte-routing';

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
        <li><Link to="/clientes/anadir">Añadir Cliente</Link></li>
        <li><Link to="/clientes/listar">Lista de Clientes</Link></li>
        <li><Link to="/clientes/historial">Historial de Clientes</Link></li>
      </ul>
    </li>
    <!-- Opción Ventas -->
    <li class="menu-item">
      <span class="dropdown-trigger">Ventas</span>
      <ul class="submenu">
        <li><Link to="/ventas/anadir">Añadir Venta</Link></li>
        <li><Link to="/ventas/listar">Historial de Ventas</Link></li>
        <li><Link to="/ventas/reportes">Reportes</Link></li>
      </ul>
    </li>
    <!-- Opción Empleados -->
    <li class="menu-item">
      <span class="dropdown-trigger">Empleados</span>
      <ul class="submenu">
        <li><Link to="/empleados/anadir">Añadir Empleado</Link></li>
        <li><Link to="/empleados/listar">Lista de Empleados</Link></li>
        <li><Link to="/empleados/turnos">Turnos</Link></li>
      </ul>
    </li>
    <li class="menu-item">      
      <button on:click={toggleTheme} class="theme-toggle">
        {#if isDarkMode}
        <img src="/images/lightMode.png" alt="sol de modo claro" class="theme-icon" id="solModoClaro"> 

        {:else}
          <img src="/images/darkMode.png" alt="luna de modo oscuro" class="theme-icon"> 
        {/if}
      </button>
    </li>
  </ul>
</nav>
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