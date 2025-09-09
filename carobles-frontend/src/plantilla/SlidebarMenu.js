import React, { useState } from "react";
import "./styles/SlidebarMenu.css";

export default function SlidebarMenu() {
  // Cambia aquí a `true` si quieres que inicie abierto
  const [isActive, setIsActive] = useState(true);

  

  const toggleMenu = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="container">
      {/* Navigation */}
      <div className={`navigation ${isActive ? "active" : ""}`}>
        <ul>
          <li>
            <a href="/">
              <span className="icon">
                <ion-icon name="car-outline"></ion-icon>
              </span>
              <span className="title">CAROBLES</span>
            </a>
          </li>

          <li>
            <a href="/clientes">
              <span className="icon">
                <ion-icon name="people-outline"></ion-icon>
              </span>
              <span className="title">Clientes</span>
            </a>
          </li>

          <li>
            <a href="/registrarCliente">
              <span className="icon">
                <ion-icon name="person-add-outline"></ion-icon>
              </span>
              <span className="title">Registrar Clientes</span>
            </a>
          </li>

          <li>
            <a href="/automoviles">
              <span className="icon">
                <ion-icon name="car-outline"></ion-icon>
              </span>
              <span className="title">Vehiculos</span>
            </a>
          </li>

          <li>
            <a href="/registrarAutomovil">
              <span className="icon">
                <ion-icon name="clipboard-outline"></ion-icon>
              </span>
              <span className="title">Agregar vehiculo</span>
            </a>
          </li>

          <li>
            <a href="/venta">
              <span className="icon">
                <ion-icon name="pricetags-outline"></ion-icon>
              </span>
              <span className="title">Vender vehiculo</span>
            </a>
          </li>

          <li>
            <a href="/ventas">
              <span className="icon">
                <ion-icon name="cash-outline"></ion-icon>
              </span>
              <span className="title">Ventas</span>
            </a>
          </li>

          <li>
            <a href="/devoluciones">
              <span className="icon">
                <ion-icon name="log-out-outline"></ion-icon>
              </span>
              <span className="title">Devoluciones</span>
            </a>
          </li>

        </ul>
      </div>

      {/* Main Content */}
      <div className={`main ${isActive ? "active" : ""}`}>
        <div className="topbar">
          <div className="toggle" onClick={toggleMenu}>
            <ion-icon name="menu-outline"></ion-icon>
          </div>
        </div>
      </div>
    </div>
  );
}
