// FormVenta.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/styleForm.css";

export default function FormVenta() {
  const { id_automovil, id_cliente } = useParams();
  const navigate = useNavigate();

  const API_HOST = window.location.hostname;
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;

  const [valorTotal, setValorTotal] = useState("");
  const [enganche, setEnganche] = useState(""); // Nuevo campo
  const [fechaVenta, setFechaVenta] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [tipoPago, setTipoPago] = useState("contado");

  // Campos de crédito
  const [totalMensualidades, setTotalMensualidades] = useState("");
  const [costoMensualidad, setCostoMensualidad] = useState("");
  const [diaMaximoPago, setDiaMaximoPago] = useState("");
  const [fotoPagareFile, setFotoPagareFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const FILE_PART_NAME = "fotoPagare";  // @RequestPart("fotoPagare")
  const JSON_PART_NAME = "venta";       // @RequestPart("venta")

  const [submitting, setSubmitting] = useState(false);

  const onSelectFile = (e) => {
    const f = e.target.files?.[0];
    setFotoPagareFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const pretty = (obj) => JSON.stringify(obj, null, 2);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      if (tipoPago === "contado") {
        const ventaContadoPayload = {
          valor_total: Number(valorTotal),
          fecha_venta: fechaVenta,
          id_cliente: Number(id_cliente),
          id_automovil: Number(id_automovil),
        };

        if (!Number.isFinite(ventaContadoPayload.valor_total)) {
          alert("El valor total es obligatorio y debe ser numérico.");
          setSubmitting(false);
          return;
        }

        console.log("[PREVIEW] POST /ventaContado payload:", ventaContadoPayload);
        const ok = window.confirm("¿Confirmar venta?");
        if (!ok) {
          setSubmitting(false);
          return;
        }

        await axios.post(`${urlBase}/ventaContado`, ventaContadoPayload, {
          headers: { "Content-Type": "application/json" },
        });

        alert("Venta registrada con éxito");
        navigate("/ventas");
        return;
      }

      // === CRÉDITO ===
      const ventaCreditoJson = {
        id_cliente: Number(id_cliente),
        id_automovil: Number(id_automovil),
        fecha_venta: fechaVenta,
        valor_total: Number(valorTotal),
        enganche: Number(enganche), // agregado solo en crédito
        total_mensualidades: Number(totalMensualidades),
        costo_mensualidad: Number(costoMensualidad),
        dia_maximo_pago_por_mes: Number(diaMaximoPago),
      };

      if (!Number.isFinite(ventaCreditoJson.valor_total)) {
        alert("El valor total es obligatorio y debe ser numérico.");
        setSubmitting(false);
        return;
      }
      if (!Number.isFinite(ventaCreditoJson.enganche)) {
        alert("El enganche es obligatorio y debe ser numérico.");
        setSubmitting(false);
        return;
      }
      if (
        !Number.isFinite(ventaCreditoJson.total_mensualidades) ||
        !Number.isFinite(ventaCreditoJson.costo_mensualidad) ||
        !Number.isFinite(ventaCreditoJson.dia_maximo_pago_por_mes)
      ) {
        alert("Completa correctamente los campos de crédito (números válidos).");
        setSubmitting(false);
        return;
      }

      const fd = new FormData();
      const jsonFile = new File(
        [JSON.stringify(ventaCreditoJson)],
        "venta.json",
        { type: "application/json" }
      );
      fd.append(JSON_PART_NAME, jsonFile);
      if (fotoPagareFile) {
        fd.append(FILE_PART_NAME, fotoPagareFile, fotoPagareFile.name);
      }

      console.log("[PREVIEW] POST /ventaCredito JSON part:", ventaCreditoJson);

      const ok = window.confirm(
        `Se enviará a /ventaCredito como multipart/form-data.\n\nParte "${JSON_PART_NAME}" (JSON):\n${pretty(ventaCreditoJson)}\n\n` +
        `Parte "${FILE_PART_NAME}" (archivo): ${fotoPagareFile ? fotoPagareFile.name : "—(no adjunto)—"}\n\n` +
        "¿Confirmar envío?"
      );
      if (!ok) {
        setSubmitting(false);
        return;
      }

      await axios.post(`${urlBase}/ventaCredito`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Venta registrada con éxito");
      navigate("/ventas");
    } catch (err) {
      console.error(err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Ocurrió un error registrando la venta.";
      alert(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={onSubmit}>
          <div className="formbold-form-title">
            <h2>Registrar Venta</h2>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label className="formbold-form-label">ID Automóvil</label>
              <input className="formbold-form-input" value={id_automovil ?? ""} readOnly />
            </div>
            <div>
              <label className="formbold-form-label">ID Cliente</label>
              <input className="formbold-form-input" value={id_cliente ?? ""} readOnly />
            </div>
          </div>

          <div className="formbold-mb-3">
            <label className="formbold-form-label">Fecha de venta</label>
            <input
              type="date"
              className="formbold-form-input"
              value={fechaVenta}
              onChange={(e) => setFechaVenta(e.target.value)}
              required
            />
          </div>

          <div className="formbold-mb-3">
            <label className="formbold-form-label">Valor total</label>
            <input
              type="number"
              step="0.01"
              className="formbold-form-input"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              required
            />
          </div>

          <div className="formbold-mb-3">
            <label className="formbold-form-label">Tipo de pago</label>
            <div>
              <label className="formbold-checkbox-label" style={{ marginRight: 16 }}>
                <input
                  type="radio"
                  name="tipoPago"
                  value="contado"
                  checked={tipoPago === "contado"}
                  onChange={() => setTipoPago("contado")}
                />
                <span style={{ marginLeft: 8 }}>Contado</span>
              </label>

              <label className="formbold-checkbox-label">
                <input
                  type="radio"
                  name="tipoPago"
                  value="credito"
                  checked={tipoPago === "credito"}
                  onChange={() => setTipoPago("credito")}
                />
                <span style={{ marginLeft: 8 }}>Crédito</span>
              </label>
            </div>
          </div>

          {tipoPago === "credito" && (
            <>
              {/* Enganche visible solo si es crédito */}
              <div className="formbold-mb-3">
                <label className="formbold-form-label">Enganche</label>
                <input
                  type="number"
                  step="0.01"
                  className="formbold-form-input"
                  value={enganche}
                  onChange={(e) => setEnganche(e.target.value)}
                  required
                />
              </div>

              <div className="formbold-mb-3">
                <label className="formbold-form-label">Total mensualidades</label>
                <input
                  type="number"
                  className="formbold-form-input"
                  value={totalMensualidades}
                  onChange={(e) => setTotalMensualidades(e.target.value)}
                  required
                />
              </div>
              <div className="formbold-mb-3">
                <label className="formbold-form-label">Costo mensualidad</label>
                <input
                  type="number"
                  step="0.01"
                  className="formbold-form-input"
                  value={costoMensualidad}
                  onChange={(e) => setCostoMensualidad(e.target.value)}
                  required
                />
              </div>
              <div className="formbold-mb-3">
                <label className="formbold-form-label">Día máximo pago por mes</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="formbold-form-input"
                  value={diaMaximoPago}
                  onChange={(e) => setDiaMaximoPago(e.target.value)}
                  required
                />
              </div>
              <div className="formbold-mb-3">
                <label className="formbold-form-label">Foto pagaré</label>
                <input
                  type="file"
                  accept="image/*"
                  className="formbold-form-input"
                  onChange={onSelectFile}
                  required
                />
                {preview && (
                  <img src={preview} alt="Pagaré" style={{ maxHeight: 150, marginTop: 10 }} />
                )}
              </div>
            </>
          )}

          <button className="formbold-btn" type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar venta"}
          </button>
        </form>
      </div>
    </div>
  );
}
