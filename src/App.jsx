import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Difuntos from "./components/Difuntos/Difuntos";
import Encargados from "./components/Encargados/Encargados";
import Locaciones from "./components/Locaciones/Locaciones";
import Panteones from "./components/Panteones/Panteones";
import Espacios from "./components/Espacios/Espacios";
import Transacciones from "./components/Transacciones/Transacciones";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="difuntos" element={<Difuntos />} />
            <Route path="encargados" element={<Encargados />} />
            <Route path="locaciones" element={<Locaciones />} />
            <Route path="panteones" element={<Panteones />} />
            <Route path="espacios" element={<Espacios />} />
            <Route path="transacciones" element={<Transacciones />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;