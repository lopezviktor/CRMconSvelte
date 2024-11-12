<script>
  import Navbar from './components/Navbar.svelte';
  import Home from './routes/Home.svelte';
  import Sales from './routes/Ventas.svelte';
  import Clientes from './routes/Clientes.svelte';
  import GestionClientes from './routes/GestionClientes.svelte';
  import { Router, Route } from 'svelte-routing';
</script>

<Router>
  <Navbar currentPage="home" />
  <Route path="/" component={Home} />
  <Route path="/ventas" component={Sales} />
  <Route path="/clientes" component={Clientes} />
  <Route path="/gestion-clientes" component={GestionClientes} />
</Router>



