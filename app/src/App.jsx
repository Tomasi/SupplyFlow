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
        <Route path="/app/home" element={<Home />}></Route>
        <Route path="/app/estoque" element={<Estoque />}></Route>
        <Route path="/app/pedidos" element={<Pedidos />}></Route>
        <Route path="/app/entrada" element={<Entrada />}></Route>
        <Route path="/app/saida" element={<Saida />}></Route>
      </Routes>
    </Router>
  )
}

export default App
