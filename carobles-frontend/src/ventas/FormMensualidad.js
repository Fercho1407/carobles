import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/styleForm.css"; // tus estilos formbold

export default function FormMensualidad() {
  const { id_venta, id_credito } = useParams(); // obtenemos ambos de la URL
  const navigate = useNavigate();

  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState("");
  const [mora, setMora] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_HOST = window.location.hostname;
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles/mensualidades`;

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setComprobante(null);

    const ok = ["image/jpeg", "image/jpg", "image/png"].includes(f.type);
    if (!ok) {
      alert("El comprobante debe ser JPG/JPEG o PNG.");
      e.target.value = "";
      setComprobante(null);
      return;
    }
    setComprobante(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comprobante) {
      alert("Debes seleccionar una imagen del comprobante.");
      return;
    }

    if (!id_credito) {
      alert("No se encontró el id_credito en la URL.");
      return;
    }

    const formData = new FormData();
    formData.append("id_credito", String(id_credito));
    formData.append("fecha_pago_mensualidad", fecha);
    formData.append("monto_mensualidad", String(monto));
    if (mora !== "") formData.append("cargos_moratorios", String(mora));
    formData.append("comprobante", comprobante);


    try {
      setSubmitting(true);
      await axios.post(urlBase, formData);
      alert("Mensualidad registrada con éxito");

      // Redirige al detalle del crédito o de la venta
      navigate(`/venta/${id_venta}/credito/`);
    } catch (error) {
      console.error("Error al registrar mensualidad:", error);
      const msg =
        error?.response?.data
          ? (typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data))
          : error?.message || "Error desconocido";
      alert(`Hubo un error al registrar la mensualidad ❌\n${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <div className="formbold-form-title">
          <h2>Registrar Mensualidad</h2>
          <p>Ingresa los datos de la mensualidad</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="formbold-mb-3">
            <label className="formbold-form-label">Fecha</label>
            <input
              type="date"
              className="formbold-form-input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="formbold-input-flex">
            <div>
              <label className="formbold-form-label">Monto</label>
              <input
                type="number"
                step="0.01"
                className="formbold-form-input"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="formbold-form-label">Mora (opcional)</label>
              <input
                type="number"
                className="formbold-form-input"
                value={mora}
                onChange={(e) => setMora(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="formbold-mb-3">
            <label className="formbold-form-label">
              Comprobante (JPG, JPEG, PNG)
            </label>
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              className="formbold-form-input"
              onChange={onFileChange}
              required
            />
          </div>

          <button type="submit" className="formbold-btn" disabled={submitting}>
            {submitting ? "Guardando..." : "Registrar Mensualidad"}
          </button>
        </form>
      </div>
    </div>
  );
}