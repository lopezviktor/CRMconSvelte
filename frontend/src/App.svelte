<script>
  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';
  import Home from './routes/Home.svelte';
  import Sales from './routes/Ventas.svelte';
  import Clientes from './routes/Clientes.svelte';
  import AddCliente from './routes/AddCliente.svelte';
  import GestionClientes from './routes/GestionClientes.svelte';
  import NotFound from './routes/NotFound.svelte';
  import { Router, Route } from 'svelte-routing';
</script>

<Router>
  <Navbar />
  <main>
    <Route path="/" component={Home} />
    <Route path="/ventas" component={Sales} />
    <Route path="/clientes" component={Clientes} />
    <Route path="/gestion-clientes" component={GestionClientes} />
    <Route path="/addCliente" component={AddCliente} />
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