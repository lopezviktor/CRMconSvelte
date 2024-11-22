<script>
  import { Router, Route } from 'svelte-routing';
  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';
  import Home from './routes/Home.svelte';
  import NotFound from './routes/NotFound.svelte';

  import AddVenta from './routes/Ventas/AddVenta.svelte';
  import Ventas from './routes/Ventas/Ventas.svelte';
  import GestionVentas from './routes/Ventas/GestionVentas.svelte';

  import AddCliente from './routes/Clientes/AddCliente.svelte';
  import Clientes from './routes/Clientes/Clientes.svelte';
  import EditarCliente from "./routes/Clientes/EditarCliente.svelte";
  import GestionClientes from './routes/Clientes/GestionClientes.svelte';

  import AddEmpleado from './routes/Empleados/AddEmpleado.svelte';
  import Empleados from './routes/Empleados/Empleados.svelte';
  import GestionEmpleados from './routes/Empleados/GestionEmpleados.svelte';

</script>

<Router>
  <Navbar />
  <main>
    <Route path="/" component={Home} />
    <!--ventas-->
    <Route path="/ventas/anadir" component={AddVenta} />
    <Route path="/ventas/listar" component={Ventas} />
    <Route path="/ventas/gestionar" component={GestionVentas} />
        <!--ventas-->
    <Route path="/clientes/anadir" component={AddCliente} />
    <Route path="/clientes/listar" component={Clientes} />
    <Route path="/clientes/editar/:id" let:params>
      <EditarCliente idCliente={params.id} />
    </Route>
    <Route path="/clientes/gestionar" component={GestionClientes} />
        <!--ventas-->
    <Route path="/empleados/anadir" component={AddEmpleado} />
    <Route path="/empleados/listar" component={Empleados} />
    <Route path="/empleados/gestionar" component={GestionEmpleados} />
    <Route path="*" component={NotFound} />
  </main>
  <Footer />
</Router>

<style>
  main {
    margin: 2rem 0; 
    padding: 1rem; 
    min-height: calc(100vh - 10rem); 
  }
</style>