import Navbar from "./components/navbar"
import Home from "./components/home"
import Estoque from "./components/estoque"
import Pedidos from "./components/pedidosCompra"
import Entrada from "./components/entrada"
import Saida from "./components/saida"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App()
{
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="SupplyFlow/home" element={<Home />}></Route>
        <Route path="SupplyFlow/estoque" element={<Estoque />}></Route>
        <Route path="SupplyFlow/pedidos" element={<Pedidos />}></Route>
        <Route path="SupplyFlow/entrada" element={<Entrada />}></Route>
        <Route path="SupplyFlow/saida" element={<Saida />}></Route>
      </Routes>
    </Router>
  )
}

export default App
