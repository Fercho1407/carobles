// EditarInversion.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditarInversion() {
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles/inversion`;

  // URL esperada: /automovil/:id_automovil/inversiones/:id_inversion/editar
  const { id_automovil, id_inversion } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [tiposReparacion, setTiposReparacion] = useState([]);

  const [inversion, setInversion] = useState({
    id_inversion: null,
    costo_inversion: "",
    comentarios: "",
    tipoReparacion: "",
    automovil: { id_automovil: Number(id_automovil) || null },
  });

  // Cargar inversión y tipos de reparación
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar tipos de reparación
        const tiposRes = await axios.get(`${urlBase}es/tipoReparacion`);
        setTiposReparacion(tiposRes.data);

        // Cargar inversión existente
        const { data } = await axios.get(`${urlBase}/${id_inversion}`, {
          validateStatus: (s) => s >= 200 && s < 300,
        });

        setInversion({
          id_inversion: data?.id_inversion ?? Number(id_inversion),
          costo_inversion: data?.costo_inversion ?? "",
          comentarios: data?.comentarios ?? "",
          tipoReparacion: data?.tipoReparacion ?? "",
          automovil: {
            id_automovil:
              data?.automovil?.id_automovil ?? Number(id_automovil) ?? null,
          },
        });
      } catch (e) {
        console.error(e);
        const msg = e?.response
          ? `Error ${e.response.status}: ${JSON.stringify(e.response.data)}`
          : e?.message || "Error desconocido";
        setError(`No se pudieron cargar los datos. ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id_inversion, id_automovil, urlBase]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInversion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      const payload = {
        ...inversion,
        costo_inversion:
          inversion.costo_inversion === "" ? null : Number(inversion.costo_inversion),
        tipoReparacion: inversion.tipoReparacion || null,
        automovil: { id_automovil: Number(id_automovil) },
      };

      await axios.put(`${urlBase}es/${id_inversion}`, payload, {
        validateStatus: (s) => s >= 200 && s < 300,
      });

      navigate(`/automovil/${id_automovil}/inversiones`, { replace: true });
    } catch (e) {
      console.error(e);
      const msg = e?.response
        ? `Error ${e.response.status}: ${JSON.stringify(e.response.data)}`
        : e?.message || "Error desconocido";
      setError(`No se pudo guardar la inversión. ${msg}`);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <div className="container">Cargando inversión…</div>;
  }

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={onSubmit}>
          <div className="formbold-form-title">
            <h2>Editar inversión</h2>
            <p>Actualiza los datos de la inversión.</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="formbold-input-flex">
            <div>
              <label className="formbold-form-label">ID Automóvil</label>
              <input
                type="text"
                className="formbold-form-input"
                value={id_automovil}
                readOnly
              />
            </div>
            <div>
              <label className="formbold-form-label">ID Inversión</label>
              <input
                type="text"
                className="formbold-form-input"
                value={id_inversion}
                readOnly
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="costo_inversion" className="formbold-form-label">
                Costo de inversión
              </label>
              <input
                type="number"
                step="0.01"
                id="costo_inversion"
                name="costo_inversion"
                className="formbold-form-input"
                value={inversion.costo_inversion}
                onChange={onInputChange}
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="tipoReparacion" className="formbold-form-label">
                Tipo de reparación
              </label>
              <select
                id="tipoReparacion"
                name="tipoReparacion"
                className="formbold-form-input"
                value={inversion.tipoReparacion}
                onChange={onInputChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                {tiposReparacion.map((t) => (
                  <option key={t} value={t}>
                    {t.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="formbold-mb-3">
            <label htmlFor="comentarios" className="formbold-form-label">
              Comentarios
            </label>
            <textarea
              id="comentarios"
              name="comentarios"
              className="formbold-form-input"
              rows={3}
              value={inversion.comentarios}
              onChange={onInputChange}
              placeholder="Notas de la reparación, refacciones, etc."
            />
          </div>

          <button className="formbold-btn" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>

          <div style={{ marginTop: 16 }}>
            <Link
              to={`/automovil/${id_automovil}/inversiones`}
              className="btn btn-secondary btn-sm"
            >
              Regresar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
