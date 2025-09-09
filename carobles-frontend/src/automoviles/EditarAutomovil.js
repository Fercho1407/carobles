import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditarAutomovil() {
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles/automovil`;

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [vehiculo, setVehiculo] = useState({
    id_automovil: null,
    no_motor: "",
    no_serie: "",
    marca: "",
    anio: "",
    modelo: "",
    kilometraje: "",
    costo_compra: "",
    estado_vehiculo: "",
  });

  // Cargar vehículo por ID
  useEffect(() => {
    const cargarVehiculo = async () => {
      try {
        const { data } = await axios.get(`${urlBase}/${id}`, {
          validateStatus: (s) => s >= 200 && s < 300,
        });

        setVehiculo({
          id_automovil: data?.id_automovil ?? id,
          no_motor: data?.no_motor ?? "",
          no_serie: data?.no_serie ?? "",
          marca: data?.marca ?? "",
          anio: data?.anio ?? "",
          modelo: data?.modelo ?? "",
          kilometraje: data?.kilometraje ?? "",
          costo_compra: data?.costo_compra ?? "",
          estado_vehiculo: data?.estado_vehiculo ?? "",
        });
      } catch (e) {
        console.error(e);
        const msg = e?.response
          ? `Error ${e.response.status}: ${JSON.stringify(e.response.data)}`
          : e?.message || "Error desconocido";
        setError(`No se pudo cargar el vehículo. ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    cargarVehiculo();
  }, [id, urlBase]);

  // Handler genérico para cambios en inputs
  const onInputChangeVehiculo = (e) => {
    const { name, value } = e.target;
    setVehiculo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      const payload = {
        ...vehiculo,
        anio: vehiculo.anio === "" ? null : Number(vehiculo.anio),
        kilometraje: vehiculo.kilometraje === "" ? null : Number(vehiculo.kilometraje),
        costo_compra: vehiculo.costo_compra === "" ? null : Number(vehiculo.costo_compra),
      };

      const res = await axios.put(`${urlBase}/${id}`, payload, {
        validateStatus: (s) => s >= 200 && s < 300,
      });

      console.log("PUT OK:", res.status);
      navigate("/automoviles", { replace: true });

      setTimeout(() => {
        if (window?.location?.pathname !== "/vehiculos") {
        }
      }, 100);
    } catch (e) {
      console.error(e);
      const msg = e?.response
        ? `Error ${e.response.status}: ${JSON.stringify(e.response.data)}`
        : e?.message || "Error desconocido";
      setError(`No se pudo guardar el vehículo. ${msg}`);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <div className="container">Cargando vehículo…</div>;
  }

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={onSubmit}>
          <div className="formbold-form-title">
            <h2>Editar Vehículo</h2>
            <p>Actualiza los datos del vehículo.</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="no_motor" className="formbold-form-label">
                No. Motor
              </label>
              <input
                type="text"
                id="no_motor"
                name="no_motor"
                className="formbold-form-input"
                value={vehiculo.no_motor}
                onChange={onInputChangeVehiculo}
                required
              />
            </div>
            <div>
              <label htmlFor="no_serie" className="formbold-form-label">
                No. Serie
              </label>
              <input
                type="text"
                id="no_serie"
                name="no_serie"
                className="formbold-form-input"
                value={vehiculo.no_serie}
                onChange={onInputChangeVehiculo}
                required
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="marca" className="formbold-form-label">
                Marca
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                className="formbold-form-input"
                value={vehiculo.marca}
                onChange={onInputChangeVehiculo}
                required
              />
            </div>
            <div>
              <label htmlFor="modelo" className="formbold-form-label">
                Modelo
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                className="formbold-form-input"
                value={vehiculo.modelo}
                onChange={onInputChangeVehiculo}
                required
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="anio" className="formbold-form-label">
                Año
              </label>
              <input
                type="number"
                id="anio"
                name="anio"
                className="formbold-form-input"
                value={vehiculo.anio}
                onChange={onInputChangeVehiculo}
                required
              />
            </div>
            <div>
              <label htmlFor="kilometraje" className="formbold-form-label">
                Kilometraje
              </label>
              <input
                type="number"
                id="kilometraje"
                name="kilometraje"
                className="formbold-form-input"
                value={vehiculo.kilometraje}
                onChange={onInputChangeVehiculo}
                required
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="costo_compra" className="formbold-form-label">
                Costo de Compra
              </label>
              <input
                type="number"
                step="0.01"
                id="costo_compra"
                name="costo_compra"
                className="formbold-form-input"
                value={vehiculo.costo_compra}
                onChange={onInputChangeVehiculo}
                required
              />
            </div>
            <div>
              <label htmlFor="estado_vehiculo" className="formbold-form-label">
                Estado del Vehículo
              </label>
              <select
                id="estado_vehiculo"
                name="estado_vehiculo"
                className="formbold-form-input"
                value={vehiculo.estado_vehiculo}
                onChange={onInputChangeVehiculo}
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="DISPONIBLE">Disponible</option>
                <option value="VENDIDO">Vendido</option>
                <option value="EN_REPARACION">En reparación</option>
                <option value="RESERVADO">Reservado</option>
                <option value="DADO_DE_BAJA">Dado de baja</option>
              </select>
            </div>
          </div>

          <button className="formbold-btn" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>

          <div style={{ marginTop: 16 }}>
            <Link to="/automoviles" className="btn btn-secondary btn-sm">
              Regresar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
