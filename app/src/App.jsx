import Navbar from "./components/navbar"
import Home from "./components/home"
import Estoque from "./components/estoque"
import Pedidos from "./components/pedidosCompra"
import Entrada from "./components/entrada"
import Saida from "./components/saida"

import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App()
{
  return (
    <BrowserRouter>
      <Switch>
        {"./src/components/home"}
      </Switch>
      <Switch>
        {"./src/components/estoque"}
      </Switch>
      <Switch>
        {"./src/components/pedidos"}
      </Switch>
      <Switch>
        {"./src/components/entrada"}
      </Switch>
      <Switch>
        {"./src/components/saida"}
      </Switch>
    </BrowserRouter>
  );
  // <Router>
  //   <Navbar />
  //   <Routes>
  //     <Route path="/home" element={<Home />}></Route>
  //     <Route path="/estoque" element={<Estoque />}></Route>
  //     <Route path="/pedidos" element={<Pedidos />}></Route>
  //     <Route path="/entrada" element={<Entrada />}></Route>
  //     <Route path="/saida" element={<Saida />}></Route>
  //   </Routes>
  // </Router>
  // )
}

export default App
