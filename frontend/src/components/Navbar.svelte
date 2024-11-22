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

<style>
  nav {
    background-color: white;
    padding: 1rem 0;
    border-bottom: 1px solid #ddd;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }

  nav ul {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  nav ul li {
    position: relative;
    margin: 0 20px;
  }
  .submenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    list-style: none;
    padding: 1rem;
    margin: 0;
    width: 200px;
    text-align: left;
  }

  .submenu li {
    margin: 0.5rem 0;
  }

  .submenu li a {
    text-decoration: none;
    color: #333;
    font-size: 0.9rem;
    display: block;
    transition: color 0.3s ease;
  }
  .menu-item:hover .submenu {
    display: block;
  }
</style>