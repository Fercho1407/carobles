// FormDevolucion.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/styleForm.css";
import { calcularTotalPagadoCredito, getCreditoId } from "./utilsCredito";

export default function FormDevolucion() {
  // admite /devolucion/:id_venta o /devolucion/:idVenta
  const params = useParams();
  const id_venta = params.id_venta || params.idVenta;

  const navigate = useNavigate();

  const API_HOST = window.location.hostname; // p.ej. "localhost" o "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;
  const endpoint = `${urlBase}/devolucion`;

  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [motivo, setMotivo] = useState("");
  const [montoPagado, setMontoPagado] = useState(0); // enganche + mensualidades
  const [montoRembolsado, setMontoRembolsado] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [calculando, setCalculando] = useState(false);

  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);
  const [idDevolucionCreada, setIdDevolucionCreada] = useState(null);

  // Nuevo: control para habilitar edición solo si no se puede calcular
  const [puedeEditarMontoPagado, setPuedeEditarMontoPagado] = useState(false);
  const [msgMontoPagado, setMsgMontoPagado] = useState("");

  const calcularMontoPagado = async () => {
    try {
      setError(null);
      setCalculando(true);

      // 1) Traer datos de la venta/crédito
      const { data: credito } = await axios.get(`${urlBase}/venta/${id_venta}`);

      // 2) Resolver id del crédito si existe (id_credito | idCredito | idCredtio | id)
      const creditoId = getCreditoId(credito);

      // 3) Traer mensualidades si hay crédito
      let mensualidades = [];
      if (creditoId) {
        const { data } = await axios.get(`${urlBase}/mensualidades/${creditoId}`);
        mensualidades = Array.isArray(data) ? data : [];
      }

      // 4) Determinar si hay información suficiente para calcular
      const enganche = credito?.enganche;
      const tieneEnganche = Number.isFinite(enganche);
      const tieneMensualidades = (mensualidades?.length || 0) > 0;

      if (tieneEnganche || tieneMensualidades) {
        const total = calcularTotalPagadoCredito(credito ?? {}, mensualidades);
        setMontoPagado(total);
        setPuedeEditarMontoPagado(false); // bloquea edición porque sí se pudo calcular
        setMsgMontoPagado("Calculado automáticamente (enganche + mensualidades).");
      } else {
        // No hay datos para calcular (contado o sin registros) -> habilita edición manual
        setPuedeEditarMontoPagado(true);
        setMsgMontoPagado("No fue posible calcular automáticamente. Ingrésalo manualmente.");
        // Si quieres, puedes inicializar con 0 o dejar lo que haya tecleado el usuario
        setMontoPagado(0);
      }
    } catch (e) {
      console.error(e);
      // Error al consultar servicios -> habilita edición manual
      setPuedeEditarMontoPagado(true);
      setMsgMontoPagado("Error al calcular. Ingresa el monto manualmente.");
      setMontoPagado(0);
    } finally {
      setCalculando(false);
    }
  };

  useEffect(() => {
    if (id_venta) {
      calcularMontoPagado();
    }
  }, [id_venta]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    setOkMsg(null);
    setIdDevolucionCreada(null);

    try {
      // Payload en snake_case (como tu entidad Devolucion)
      const payload = {
        fecha,                                   // 'YYYY-MM-DD'
        motivo,
        monto_pagado: Number(montoPagado) || 0, // calculado o capturado
        monto_rembolsado: Number(montoRembolsado) || 0,
        observaciones,
        id_venta: Number(id_venta),
      };

      const { data: resp } = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setIdDevolucionCreada(resp?.id_devolucion ?? null);
      setOkMsg("Devolución registrada correctamente.");
      navigate(`/ventas`);
    } catch (e) {
      console.error(e);
      setError("No se pudo registrar la devolución.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <div className="formbold-form-title">
          <h2>Registrar Devolución</h2>
          <p>Complete los datos para registrar la devolución de la venta.</p>
        </div>

        {error && <p style={{ color: "crimson", marginBottom: 12 }}>{error}</p>}
        {okMsg && (
          <p style={{ color: "green", marginBottom: 12 }}>
            {okMsg}
            {idDevolucionCreada ? ` (ID: ${idDevolucionCreada})` : ""}
          </p>
        )}

        <form onSubmit={onSubmit}>
          <div className="formbold-input-flex">
            <div>
              <label className="formbold-form-label">ID Venta</label>
              <input className="formbold-form-input" type="text" value={id_venta ?? ""} readOnly />
            </div>

            <div>
              <label className="formbold-form-label">Fecha</label>
              <input
                className="formbold-form-input"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="formbold-mb-3">
            <label className="formbold-form-label">Motivo</label>
            <textarea
              className="formbold-form-input"
              rows="3"
              placeholder="Describa el motivo de la devolución…"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
          </div>

          <div className="formbold-input-flex">
            <div>
              <label className="formbold-form-label">Monto pagado</label>
              <input
                className="formbold-form-input"
                type="number"
                step="0.01"
                value={Number.isFinite(montoPagado) ? montoPagado : 0}
                readOnly={!puedeEditarMontoPagado}               // <-- sólo editable si no se pudo calcular
                onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
                title={
                  puedeEditarMontoPagado
                    ? "No se pudo calcular automáticamente. Puedes escribirlo."
                    : "Valor calculado automáticamente (no editable)."
                }
              />
              <small style={{ display: "block", marginTop: 6 }}>
                {msgMontoPagado}
              </small>
              <button
                type="button"
                className="formbold-btn"
                style={{ width: "100%", marginTop: 10 }}
                onClick={calcularMontoPagado}
                disabled={calculando}
              >
                {calculando ? "Calculando…" : "Recalcular monto pagado"}
              </button>
            </div>

            <div>
              <label className="formbold-form-label">Monto reembolsado</label>
              <input
                className="formbold-form-input"
                type="number"
                step="0.01"
                value={montoRembolsado}
                onChange={(e) => setMontoRembolsado(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="formbold-mb-3">
            <label className="formbold-form-label">Observaciones</label>
            <textarea
              className="formbold-form-input"
              rows="3"
              placeholder="Notas adicionales…"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="formbold-btn" type="submit" disabled={enviando || calculando}>
              {enviando ? "Enviando..." : "Guardar devolución"}
            </button>
            <button
              className="formbold-btn"
              type="button"
              onClick={() => navigate(-1)}
              style={{ backgroundColor: "#6a64f1" }}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
