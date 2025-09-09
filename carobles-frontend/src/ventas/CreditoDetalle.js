// CreditoDetalle.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./styles/styleTables.css";
import { calcularTotalPagadoCredito, getCreditoId } from "./utilsCredito";

export default function CreditoDetalle() {
  const { id_venta } = useParams();

  const [credito, setCredito] = useState(null);
  const [loadingCredito, setLoadingCredito] = useState(true);
  const [errorCredito, setErrorCredito] = useState(null);

  const [mensualidades, setMensualidades] = useState([]);
  const [loadingMens, setLoadingMens] = useState(false);
  const [errorMens, setErrorMens] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editFecha, setEditFecha] = useState("");
  const [editMonto, setEditMonto] = useState("");
  const [editMora, setEditMora] = useState("");

  const API_HOST = window.location.hostname;
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;

  const mxn = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)
      : "";

  const fmtFecha = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };
  const toInputDate = (iso) => iso || "";

  const isHttpUrl = (s) => typeof s === "string" && /^https?:\/\//i.test(s);
  const fileName = (pOrUrl) => {
    if (typeof pOrUrl !== "string") return "";
    const clean = pOrUrl.replace(/\\/g, "/");
    const parts = clean.split("/");
    return parts[parts.length - 1] || pOrUrl;
  };

  useEffect(() => {
    setLoadingCredito(true);
    setErrorCredito(null);
    axios
      .get(`${urlBase}/venta/${id_venta}`)
      .then((res) => setCredito(res.data))
      .catch(() => setErrorCredito("No se pudo cargar el crédito"))
      .finally(() => setLoadingCredito(false));
  }, [id_venta]);

  const creditoId = getCreditoId(credito);

  const cargarMensualidades = () => {
    if (!creditoId) return;
    setLoadingMens(true);
    setErrorMens(null);
    const endpoint = `${urlBase}/mensualidades/${creditoId}`;
    axios
      .get(endpoint)
      .then((res) => setMensualidades(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        const status = err?.response?.status;
        const data = err?.response?.data;
        const msg =
          typeof data === "string"
            ? data
            : data
            ? JSON.stringify(data)
            : err?.message || "Error desconocido";
        setErrorMens(
          `Fallo al cargar mensualidades (${endpoint})${
            status ? ` [HTTP ${status}]` : ""
          }: ${msg}`
        );
      })
      .finally(() => setLoadingMens(false));
  };

  useEffect(() => {
    cargarMensualidades();
  }, [creditoId]);

  const calcMora = (isoDate) => {
    if (!isoDate || !credito?.dia_maximo_pago_por_mes) return 0;
    const parts = isoDate.split("-");
    if (parts.length !== 3) return 0;
    const diaPago = Number(parts[2]);
    const diaMax = Number(credito.dia_maximo_pago_por_mes);
    return Number.isFinite(diaPago) && Number.isFinite(diaMax) && diaPago > diaMax ? 500 : 0;
  };

  const startEdit = (m) => {
    setEditingId(m.id_mensualidad);
    setEditFecha(toInputDate(m.fecha_pago_mensualidad));
    setEditMonto(String(m.monto_mensualidad ?? ""));
    const moraInit =
      typeof m.cargos_moratorios === "number"
        ? m.cargos_moratorios
        : calcMora(m.fecha_pago_mensualidad);
    setEditMora(String(moraInit));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFecha("");
    setEditMonto("");
    setEditMora("");
  };

  const saveEdit = async (m) => {
    try {
      const payload = {
        fecha_pago_mensualidad: editFecha, // "yyyy-MM-dd"
        monto_mensualidad: Number(editMonto),
        cargos_moratorios: Number(editMora),
      };

      await axios.put(`${urlBase}/mensualidad/${m.id_mensualidad}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      cancelEdit();
      cargarMensualidades();
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      alert(
        `No se pudo guardar la mensualidad [HTTP ${status ?? "?"}]: ${
          typeof data === "string" ? data : JSON.stringify(data ?? err.message)
        }`
      );
    }
  };

  const totalMensualidades = mensualidades.length;
  const sumaMensualidades = mensualidades.reduce(
    (acc, m) => acc + (typeof m.monto_mensualidad === "number" ? m.monto_mensualidad : 0),
    0
  );
  const sumaMoratorios = mensualidades.reduce(
    (acc, m) =>
      acc +
      (typeof m.cargos_moratorios === "number"
        ? m.cargos_moratorios
        : calcMora(m.fecha_pago_mensualidad)),
    0
  );

  if (loadingCredito) return <p>Cargando crédito...</p>;
  if (errorCredito) return <p style={{ color: "red" }}>{errorCredito}</p>;
  if (!credito) return <p>No se encontró información del crédito.</p>;

  const totalPagadoIncluyeEnganche = calcularTotalPagadoCredito(credito, mensualidades);

  return (
    <div className="fieldset-fluid">
      <fieldset>
        <legend>Detalles del Crédito</legend>
        <div className="table-container">
          <table className="dataTable stripe table-hover">
            <thead>
              <tr>
                <th>ID Crédito</th>
                <th>Total Mensualidades</th>
                <th>Costo Mensualidad</th>
                <th>Día Máx. Pago</th>
                <th>Enganche</th>
                <th>Pagaré</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{creditoId ?? "—"}</td>
                <td>{credito.total_mensualidades}</td>
                <td>{mxn(credito.costoMensualidad)}</td>
                <td>{credito.dia_maximo_pago_por_mes}</td>
                <td>{mxn(credito.enganche)}</td>
                <td>
                  {isHttpUrl(credito.url_foto_pagare) ? (
                    <a href={credito.url_foto_pagare} target="_blank" rel="noopener noreferrer">
                      <img
                        src={credito.url_foto_pagare}
                        alt="Pagaré"
                        style={{ maxWidth: "120px", borderRadius: "6px", border: "1px solid #ddd" }}
                      />
                    </a>
                  ) : (
                    <span title={credito.url_foto_pagare || ""}>
                      {fileName(credito.url_foto_pagare || "") || "—"}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </fieldset>

      <fieldset style={{ marginTop: 16 }}>
        <Link to={`/venta/${id_venta}/credito/${creditoId}/registrarMensualidad`}>Registrar mensualidad</Link>
        <legend>Mensualidades</legend>

        {loadingMens && <p>Cargando mensualidades...</p>}
        {errorMens && <p style={{ color: "red", whiteSpace: "pre-wrap" }}>{errorMens}</p>}

        {!loadingMens && !errorMens && (
          <div className="table-container">
            <table className="dataTable stripe table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha de Pago</th>
                  <th>Monto</th>
                  <th>Cargos moratorios</th>
                  <th>Comprobante</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {mensualidades.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Sin mensualidades registradas.
                    </td>
                  </tr>
                ) : (
                  mensualidades.map((m) => {
                    const url = m.url_comprobante_mensualidad;
                    const nombre = fileName(url);

                    const isEditing = editingId === m.id_mensualidad;
                    const moraMostrar =
                      typeof m.cargos_moratorios === "number"
                        ? m.cargos_moratorios
                        : calcMora(m.fecha_pago_mensualidad);

                    return (
                      <tr key={m.id_mensualidad}>
                        <td>{m.id_mensualidad}</td>

                        <td>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editFecha}
                              onChange={(e) => setEditFecha(e.target.value)}
                              style={{ width: 150 }}
                            />
                          ) : (
                            fmtFecha(m.fecha_pago_mensualidad)
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editMonto}
                              onChange={(e) => setEditMonto(e.target.value)}
                              style={{ width: 120, textAlign: "right" }}
                            />
                          ) : (
                            mxn(m.monto_mensualidad)
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              step="1"
                              value={editMora}
                              onChange={(e) => setEditMora(e.target.value)}
                              style={{ width: 120, textAlign: "right" }}
                            />
                          ) : (
                            mxn(moraMostrar)
                          )}
                        </td>

                        <td>
                          {isHttpUrl(url) ? (
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt={nombre || "comprobante"}
                                className="comprobante-preview"
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 6,
                                  border: "1px solid #ddd",
                                }}
                              />
                            </a>
                          ) : (
                            <span title={url}>{nombre || "—"}</span>
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(m)}
                                className="btn btn-primary"
                                style={{ marginRight: 8 }}
                              >
                                Guardar
                              </button>
                              <button onClick={cancelEdit} className="btn btn-secondary">
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button onClick={() => startEdit(m)} className="btn btn-outline-primary">
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {mensualidades.length > 0 && (
                <tfoot>
                  <tr>
                    <th colSpan={3} style={{ textAlign: "right" }}>
                      Adeudo por moras:
                    </th>
                    <th>{mxn(sumaMoratorios)}</th>
                    <th>{/* celda comprobante vacía */}</th>
                    <th>{totalMensualidades} registro(s)</th>
                  </tr>
                  <tr>
                    <th colSpan={3} />
                    <th>{mxn(sumaMensualidades)}</th>
                    <th colSpan={2}>Total pagado (mensualidades)</th>
                  </tr>
                  <tr>
                    <th colSpan={3} />
                    <th>{mxn(totalPagadoIncluyeEnganche)}</th>
                    <th colSpan={2}>Total pagado (mensualidades + enganche)</th>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </fieldset>
    </div>
  );
}
