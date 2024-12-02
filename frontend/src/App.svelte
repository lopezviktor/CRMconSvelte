<script>
  import { Router, Route } from 'svelte-routing';
  import './app.css';

  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';
  import Home from './routes/Home.svelte';
  import NotFound from './routes/NotFound.svelte';

  import AddVenta from './routes/Ventas/AddVenta.svelte';
  import Ventas from './routes/Ventas/Ventas.svelte';
  import ReportesVentas from './routes/Ventas/ReportesVentas.svelte';

  import AddCliente from './routes/Clientes/AddCliente.svelte';
  import Clientes from './routes/Clientes/Clientes.svelte';
  import EditarCliente from "./routes/Clientes/EditarCliente.svelte";
  import GestionClientes from './routes/Clientes/GestionClientes.svelte';
  import FormCliente from './routes/Clientes/FormCliente.svelte';
  import TerminosCliente from './routes/Clientes/TerminosCliente.svelte';

  import AddEmpleado from './routes/Empleados/AddEmpleado.svelte';
  import Empleados from './routes/Empleados/Empleados.svelte';
  import EditarEmpleado from './routes/Empleados/EditarEmpleado.svelte';
  import GestionEmpleados from './routes/Empleados/GestionEmpleados.svelte';

  import Productos from './routes/Productos/Productos.svelte';
  import AddProducto from './routes/Productos/AddProducto.svelte'
  import EditarProducto from './routes/Productos/EditarProducto.svelte';

  let isDarkMode = false;


  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
  }

</script>

<Router>
  <Navbar {isDarkMode} {toggleTheme} />
  <main class:dark-mode={isDarkMode} class:light-mode={!isDarkMode}>
    <Route path="/" component={Home} />

    <!-- Rutas -->
    <Route path="/" component={Home} />

    <!-- Ventas -->
    <Route path="/ventas/anadir" component={AddVenta} />
    <Route path="/ventas/listar" component={Ventas} />
    <Route path="/ventas/reportes/mas-vendidos" component={ReportesVentas} />

    <!-- Clientes -->
    <Route path="/clientes/anadir" component={AddCliente} />
    <Route path="/clientes/listar" component={Clientes} />
    <Route path="/clientes/editar/:id" let:params>
      <EditarCliente idCliente={params.id} />
    </Route>
    <Route path="/clientes/gestionar" component={GestionClientes} />

    <!-- Empleados -->
    <Route path="/empleados/anadir" component={AddEmpleado} />
    <Route path="/empleados/listar" component={Empleados} />
    <Route path="/empleados/editar/:id" let:params>
      <EditarEmpleado idEmpleado={params.id} />
    </Route>
    <Route path="/empleados/gestionar" component={GestionEmpleados} />

    <!-- Productos -->
    <Route path="/productos" component={Productos} />
    <Route path="/productos/anadir" component={AddProducto} />
    <Route path="/productos/editar/:id" let:params>
      <EditarProducto idProducto={params.id} />
    </Route>

    <!-- Contactar -->
    <Route path="/clientes/contacto" component={FormCliente} />
    <Route path="/clientes/terminos" component={TerminosCliente} />

    <!-- 404 -->
    <Route path="*" component={NotFound} />
  </main>
  <Footer />
</Router>

<style>
  main {
    margin: 2rem 0;
    padding: 1rem;
    min-height: calc(100vh - 10rem);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
</style>