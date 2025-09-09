import React, { useState } from 'react'
import "./styles/styleForm.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FormClientes() {
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles/clientes`;
  const navegacion = useNavigate();

  const [cliente, setCliente] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    curp: "",
    direccion: {
      codigo_postal: "",
      calle: "",
      numero: "",
      colonia: "",
      ciudad: ""
    }
  });

  // Campos cliente (nivel 1)
  const onInputChangeCliente = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  // Campos dirección (nivel 2)
  const onInputChangeDireccion = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      direccion: { ...prev.direccion, [name]: value }
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Normalizar numéricos si aplica
    const payload = {
      ...cliente,
      direccion: {
        ...cliente.direccion,
        codigo_postal: cliente.direccion.codigo_postal !== "" ? Number(cliente.direccion.codigo_postal) : null,
        numero: cliente.direccion.numero !== "" ? Number(cliente.direccion.numero) : null
      }
    };

    try {
      console.log("Enviando:", payload); // útil para depurar
      await axios.post(urlBase, payload);
      alert("Cliente registrado correctamente");
      navegacion("/clientes");
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      alert("Hubo un error al registrar el cliente");
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">

        <form onSubmit={onSubmit}>
          <div className="formbold-form-title">
            <h2>Registrar cliente</h2>
            <p>Ingresa los datos del nuevo cliente.</p>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="nombre" className="formbold-form-label">Nombre(s)</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="formbold-form-input"
                value={cliente.nombre}
                onChange={onInputChangeCliente}
                required
              />
            </div>
            <div>
              <label htmlFor="apellido_paterno" className="formbold-form-label">Apellido Paterno</label>
              <input
                type="text"
                id="apellido_paterno"
                name="apellido_paterno"
                className="formbold-form-input"
                value={cliente.apellido_paterno}
                onChange={onInputChangeCliente}
                required
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="apellido_materno" className="formbold-form-label">Apellido Materno</label>
              <input
                type="text"
                id="apellido_materno"
                name="apellido_materno"
                className="formbold-form-input"
                value={cliente.apellido_materno}
                onChange={onInputChangeCliente}
                required
              />
            </div>
            <div>
              <label htmlFor="telefono" className="formbold-form-label">Número telefónico</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                className="formbold-form-input"
                value={cliente.telefono}
                onChange={onInputChangeCliente}
                required
              />
            </div>
          </div>

          <div className="formbold-mb-3">
            <label htmlFor="curp" className="formbold-form-label">CURP</label>
            <input
              type="text"
              id="curp"
              name="curp"
              className="formbold-form-input"
              value={cliente.curp}
              onChange={onInputChangeCliente}
              required
            />
          </div>

          {/* Dirección */}
          <div className="formbold-input-flex">
            <div>
              <label htmlFor="codigo_postal" className="formbold-form-label">Código Postal</label>
              <input
                type="text"
                id="codigo_postal"
                name="codigo_postal"
                className="formbold-form-input"
                value={cliente.direccion.codigo_postal}
                onChange={onInputChangeDireccion}
                required
              />
            </div>
            <div>
              <label htmlFor="calle" className="formbold-form-label">Calle</label>
              <input
                type="text"
                id="calle"
                name="calle"
                className="formbold-form-input"
                value={cliente.direccion.calle}
                onChange={onInputChangeDireccion}
                required
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="numero" className="formbold-form-label">Número exterior</label>
              <input
                type="number"
                id="numero"
                name="numero"
                className="formbold-form-input"
                value={cliente.direccion.numero}
                onChange={onInputChangeDireccion}
                required
              />
            </div>
            <div>
              <label htmlFor="colonia" className="formbold-form-label">Colonia</label>
              <input
                type="text"
                id="colonia"
                name="colonia"
                className="formbold-form-input"
                value={cliente.direccion.colonia}
                onChange={onInputChangeDireccion}
                required
              />
            </div>
          </div>

          <div className="formbold-mb-3">
            <label htmlFor="ciudad" className="formbold-form-label">Ciudad</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              className="formbold-form-input"
              value={cliente.direccion.ciudad}
              onChange={onInputChangeDireccion}
              required
            />
          </div>

          <button className="formbold-btn" type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
}
