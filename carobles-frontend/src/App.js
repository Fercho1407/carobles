// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SlidebarMenu from "./plantilla/SlidebarMenu";
import ListadoClientes from "./clientes/ListadoClientes";
import ListadoVehiculos from "./automoviles/ListadoVehiculos";
import FormClientes from "./clientes/FormClientes";
import EditarCliente from "./clientes/EditarCliente";
import InversionesAutomovil from "./automoviles/InversionesAutomovil";
import RegistrarAutomovil from "./automoviles/RegistrarAutomovil";
import EditarAutomovil from "./automoviles/EditarAutomovil";
import EditarInversion from "./automoviles/EditarInversiones";
import AgregarInversion from "./automoviles/AgregarInversion";
import AutomovilesVentas from "./ventas/AutomovilesVentas";
import ClientesVenta from "./ventas/ClientesVenta";
import FormVenta from "./ventas/FormVenta";
import Ventas from "./ventas/Ventas";
import CreditoDetalle from "./ventas/CreditoDetalle";
import FormMensualidad from "./ventas/FormMensualidad";
import FormDevolucion from "./ventas/FormDevolucion";
import Devoluciones from "./ventas/Devoluciones";

export default function App() {
  const [isActive, setIsActive] = useState(true); // true=abierto

  const toggleMenu = () => setIsActive(v => !v);

  return (
    <BrowserRouter>
      {/* Sidebar */}
      <SlidebarMenu isActive={isActive} toggleMenu={toggleMenu} />

      {/* Contenido a la derecha del sidebar */}
      <div className={`main ${isActive ? "" : "active"}`}>
        <div className="topbar">
          <div className="toggle" onClick={toggleMenu}> 
            <ion-icon name="menu-outline"></ion-icon>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<ListadoClientes />} />
          <Route path="/clientes" element={<ListadoClientes />} />
          <Route path="/registrarCliente" element={<FormClientes />} />
          <Route path="/editarCliente/:id" element ={<EditarCliente/>}/>
          <Route path="/automoviles" element ={<ListadoVehiculos/>}/>
          <Route path="/automovil/:id/inversiones" element ={<InversionesAutomovil/>}/>
          <Route path="/registrarAutomovil" element ={<RegistrarAutomovil/>}/>
          <Route path="/editarAutomovil/:id" element ={<EditarAutomovil/>}/>
          <Route path="/automovil/:id_automovil/inversiones/:id_inversion/editarInversion" element ={<EditarInversion/>}/>
          <Route path="/automovil/:id_automovil/inversiones/nuevaInversion" element ={<AgregarInversion/>}/>
          <Route path="/venta" element={<AutomovilesVentas/>} />
          <Route path="/venta/:id_automovil/cliente" element={<ClientesVenta/>} />
          <Route path="/venta/:id_automovil/cliente/:id_cliente/formVenta" element={<FormVenta/>} />
          <Route path="/ventas" element={<Ventas/>} />
          <Route path="/venta/:id_venta/credito" element={<CreditoDetalle/>} />
          <Route path="/venta/:id_venta/credito/:id_credito/registrarMensualidad" element={<FormMensualidad/>} />
          <Route path="/devolucion/:id_venta" element={<FormDevolucion/>} />
          <Route path="/devoluciones" element={<Devoluciones/>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}
