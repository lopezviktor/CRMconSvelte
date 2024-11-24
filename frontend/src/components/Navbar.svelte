<script>
  import { Link } from 'svelte-routing';

  // Obtener la ruta actual desde el navegador
  let currentPath = window.location.pathname;

  // Escuchar cambios en la ruta (por si cambia dinámicamente)
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
  </ul>
</nav>