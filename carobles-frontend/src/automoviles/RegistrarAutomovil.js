import React, { useEffect, useState } from "react";
import "./styles/styleForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegistrarAutomovil() {
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;
  const navigate = useNavigate();

  const [estados, setEstados] = useState([]);
  const [cargandoEstados, setCargandoEstados] = useState(false);
  const [errorEstados, setErrorEstados] = useState("");

  useEffect(() => {
    const obtenerEstados = async () => {
      setCargandoEstados(true);
      setErrorEstados("");
      try {
        const response = await axios.get(`${urlBase}/estadosVehiculo`);
        setEstados(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error obteniendo estados del vehículo:", error);
        setErrorEstados("No se pudieron cargar los estados");
      } finally {
        setCargandoEstados(false);
      }
    };
    obtenerEstados();
  }, [urlBase]);

  const [automovil, setAutomovil] = useState({
    no_motor: "",
    no_serie: "",
    marca: "",
    anio: "",
    modelo: "",
    kilometraje: "",
    costo_compra: "",
    estado_vehiculo: ""
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setAutomovil((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...automovil,
      anio: automovil.anio !== "" ? Number(automovil.anio) : null,
      kilometraje: automovil.kilometraje !== "" ? Number(automovil.kilometraje) : null,
      costo_compra: automovil.costo_compra !== "" ? Number(automovil.costo_compra) : null
    };

    try {
      await axios.post(`${urlBase}/automovil`, payload);
      alert("Automóvil registrado correctamente");
      navigate("/automoviles");
    } catch (error) {
      console.error("Error al registrar automóvil:", error);
      alert("Hubo un error al registrar el automóvil");
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={onSubmit}>
          <div className="formbold-form-title">
            <h2>Registrar automóvil</h2>
            <p>Ingresa los datos del nuevo automóvil.</p>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="no_motor" className="formbold-form-label">No. Motor</label>
              <input
                type="text"
                id="no_motor"
                name="no_motor"
                className="formbold-form-input"
                value={automovil.no_motor}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label htmlFor="no_serie" className="formbold-form-label">No. Serie</label>
              <input
                type="text"
                id="no_serie"
                name="no_serie"
                className="formbold-form-input"
                value={automovil.no_serie}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="marca" className="formbold-form-label">Marca</label>
              <input
                type="text"
                id="marca"
                name="marca"
                className="formbold-form-input"
                value={automovil.marca}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label htmlFor="modelo" className="formbold-form-label">Modelo</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                className="formbold-form-input"
                value={automovil.modelo}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="anio" className="formbold-form-label">Año</label>
              <input
                type="number"
                id="anio"
                name="anio"
                className="formbold-form-input"
                value={automovil.anio}
                onChange={onChange}
                required
                min="1900"
                max="2100"
              />
            </div>
            <div>
              <label htmlFor="kilometraje" className="formbold-form-label">Kilometraje</label>
              <input
                type="number"
                id="kilometraje"
                name="kilometraje"
                className="formbold-form-input"
                value={automovil.kilometraje}
                onChange={onChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="costo_compra" className="formbold-form-label">Costo de compra</label>
              <input
                type="number"
                step="0.01"
                id="costo_compra"
                name="costo_compra"
                className="formbold-form-input"
                value={automovil.costo_compra}
                onChange={onChange}
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="estado_vehiculo" className="formbold-form-label">Estado del vehículo</label>
              <select
                id="estado_vehiculo"
                name="estado_vehiculo"
                className="formbold-form-input"
                value={automovil.estado_vehiculo}
                onChange={onChange}
                required
                disabled={cargandoEstados || !!errorEstados}
              >
                <option value="" disabled>
                  {cargandoEstados ? "Cargando estados..." : errorEstados || "Selecciona un estado"}
                </option>
                {estados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="formbold-btn" type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
}
