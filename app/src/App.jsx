import Navbar from "./navbar"
import Home from "./home"
import Estoque from "./estoque"
import Pedidos from "./pedidosCompra"
import Entrada from "./entrada"
import Saida from "./saida"
import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => 
{
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/estoque" element={<Estoque />}></Route>
        <Route path="/pedidos" element={<Pedidos />}></Route>
        <Route path="/entrada" element={<Entrada />}></Route>
        <Route path="/saida" element={<Saida />}></Route>
      </Routes>
    </Router>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

export default App
