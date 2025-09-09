// EditarCliente.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditarCliente() {
  const API_HOST = window.location.hostname;        
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles/clientes`;

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [cliente, setCliente] = useState({
    id_cliente: null,
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    curp: "",
    direccion: {
      id_direccion: null,
      codigo_postal: "",
      calle: "",
      numero: "",
      colonia: "",
      ciudad: "",
    },
  });

  // Cargar cliente por ID
  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const { data } = await axios.get(`${urlBase}/${id}`, {
          validateStatus: (s) => s >= 200 && s < 300,
        });

        setCliente({
          id_cliente: data?.id_cliente ?? id,
          nombre: data?.nombre ?? "",
          apellido_paterno: data?.apellido_paterno ?? "",
          apellido_materno: data?.apellido_materno ?? "",
          telefono: data?.telefono ?? "",
          curp: data?.curp ?? "",
          direccion: {
            id_direccion: data?.direccion?.id_direccion ?? null,
            codigo_postal: data?.direccion?.codigo_postal ?? "",
            // Si tu backend usa "nombre" en lugar de "calle", se mapea aquí:
            calle: data?.direccion?.calle ?? data?.direccion?.nombre ?? "",
            numero: data?.direccion?.numero ?? "",
            colonia: data?.direccion?.colonia ?? "",
            ciudad: data?.direccion?.ciudad ?? "",
          },
        });
      } catch (e) {
        console.error(e);
        const msg = e?.response
          ? `Error ${e.response.status}: ${JSON.stringify(e.response.data)}`
          : e?.message || "Error desconocido";
        setError(`No se pudo cargar el cliente. ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    cargarCliente();
  }, [id, urlBase]);

  // Handlers
  const onInputChangeCliente = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: name === "curp" ? value.toUpperCase() : value,
    }));
  };

  const onInputChangeDireccion = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        [name]: value,
      },
    }));
  };

  const onSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setGuardando(true);

  try {
    const payload = {
      ...cliente,
      direccion: {
        ...cliente.direccion,
        codigo_postal:
          cliente.direccion.codigo_postal === ""
            ? null
            : Number(cliente.direccion.codigo_postal),
        numero:
          cliente.direccion.numero === ""
            ? null
            : Number(cliente.direccion.numero),
      },
    };

    const res = await axios.put(`${urlBase}/${id}`, payload, {
      validateStatus: (s) => s >= 200 && s < 300, // acepta 2xx (incluye 204)
    });

    // Éxito: navegar al listado (reemplaza historial)
    console.log("PUT OK:", res.status);
    navigate("/clientes", { replace: true });

    // Fallback duro por si la navegación SPA es bloqueada por algo del entorno:
    setTimeout(() => {
      if (window?.location?.pathname !== "/clientes") {
        window.location.assign("/clientes");
      }
    }, 100);
  } catch (e) {
    console.error(e);
    const msg = e?.response
      ? `Error ${e.response.status}: ${JSON.stringify(e.response.data)}`
      : e?.message || "Error desconocido";
    setError(`No se pudo guardar el cliente. ${msg}`);
  } finally {
    setGuardando(false);
  }
};

  if (loading) {
    return <div className="container">Cargando cliente…</div>;
  }

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={onSubmit}>
          <div className="formbold-form-title">
            <h2>Editar cliente</h2>
            <p>Actualiza los datos del cliente.</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="nombre" className="formbold-form-label">
                Nombre(s)
              </label>
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
              <label htmlFor="apellido_paterno" className="formbold-form-label">
                Apellido Paterno
              </label>
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
              <label htmlFor="apellido_materno" className="formbold-form-label">
                Apellido Materno
              </label>
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
              <label htmlFor="telefono" className="formbold-form-label">
                Número telefónico
              </label>
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
            <label htmlFor="curp" className="formbold-form-label">
              CURP
            </label>
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
              <label htmlFor="codigo_postal" className="formbold-form-label">
                Código Postal
              </label>
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
              <label htmlFor="calle" className="formbold-form-label">
                Calle
              </label>
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
              <label htmlFor="numero" className="formbold-form-label">
                Número exterior
              </label>
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
              <label htmlFor="colonia" className="formbold-form-label">
                Colonia
              </label>
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
            <label htmlFor="ciudad" className="formbold-form-label">
              Ciudad
            </label>
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

          <button className="formbold-btn" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>

          <div style={{ marginTop: 16 }}>
            <Link to="/clientes" className="btn btn-secondary btn-sm">
              Regresar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
