<script>
    export let currentPage = 'home';
</script>

<nav>
    <ul>
        <li class="{currentPage === 'home' ? 'active' : ''}">
        <a href="#home">Home</a>
        </li>
        <li class="{currentPage === 'sales' ? 'active' : ''}">
        <a href="#sales">Ventas</a>
        </li>
        <li class="{currentPage === 'customers' ? 'active' : ''}">
        <a href="#customers">Clientes</a>
        </li>
    </ul>
</nav>

<style>
    nav {
        background-color: #f4f4f4;
        padding: 1rem 0;
        width: 100%;
        box-sizing: border-box;
    }
    
    nav ul {
      display: flex;
      justify-content: space-between;
      list-style: none;
      padding: 0;
      margin: 0;
      max-width: 100%;
    }
    
    nav ul li {
      flex: 1;
      margin: 0 30px; 
      text-align: center;
      background-color: #087df2;
      padding: 1rem;
      border-radius: 10px;
      transition: background-color 0.8s;
    }
    
    nav ul li a {
      color: white;
      font-size: 1.2rem;
      text-decoration: none;
      display: block;
      font-weight: bold;
    }
    
    nav ul li:hover {
      background-color: #004e9d;
    }
    
    .active {
      background-color: #004e9d;
    }
</style>