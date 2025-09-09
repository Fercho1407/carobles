// Devoluciones.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-dt/css/jquery.dataTables.css";
import "./styles/styleTables.css";

export default function Devoluciones() {
  const API_HOST = window.location.hostname; // ej. "localhost" o "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;

  const [devoluciones, setDevoluciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const fmtMXN = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)
      : "";

  const fmtFecha = (iso) => {
    if (!iso) return "";
    const [y, m, d] = String(iso).split("-");
    return d && m && y ? `${d}/${m}/${y}` : iso;
  };

  const cargarDevoluciones = async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await axios.get(`${urlBase}/devoluciones`);
      setDevoluciones(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar las devoluciones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDevoluciones();
  }, []);

  useEffect(() => {
    const tableId = "#tabla-devoluciones";
    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    if (devoluciones.length > 0) {
      const dt = $(tableId).DataTable({
        scrollX: true,
        autoWidth: false,
        deferRender: true,
        columnDefs: [
          { targets: 0, width: 70 },   // ID
          { targets: 1, width: 110 },  // Fecha
          { targets: 2, width: 220 },  // Motivo
          { targets: [3, 4], width: 130, className: "text-end" }, // Montos
          { targets: 5, width: 280 },  // Observaciones
          { targets: 6, width: 90 },   // ID Venta
        ],
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros por página",
          info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 a 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros)",
          paginate: { previous: "Anterior", next: "Siguiente" },
          zeroRecords: "Sin resultados",
        },
        dom:
          "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
          "rt" +
          "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        initComplete: function () {
          this.api().columns.adjust();
        },
      });

      setTimeout(() => dt.columns.adjust(), 100);
      $(window).on("resize", () => dt.columns.adjust());
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
      $(window).off("resize");
    };
  }, [devoluciones]);

  return (
    <div className="fieldset-fluid">
      <fieldset>
        <legend>Devoluciones</legend>

        {cargando && <p>Cargando devoluciones...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!cargando && !error && (
          <div className="table-container">
            <table
              id="tabla-devoluciones"
              className="dataTable stripe table-hover"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Motivo</th>
                  <th>Monto pagado</th>
                  <th>Monto reembolsado</th>
                  <th>Observaciones</th>
                  <th>ID Venta</th>
                </tr>
              </thead>

              <tbody>
                {devoluciones.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      Sin registros
                    </td>
                  </tr>
                ) : (
                  devoluciones.map((d) => (
                    <tr key={d.id_devolucion}>
                      <td>{d.id_devolucion}</td>
                      <td>{fmtFecha(d.fecha)}</td>
                      <td>{d.motivo}</td>
                      <td className="text-end">{fmtMXN(d.monto_pagado)}</td>
                      <td className="text-end">{fmtMXN(d.monto_rembolsado)}</td>
                      <td title={d.observaciones || ""}>{d.observaciones}</td>
                      <td>{d.id_venta}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </fieldset>
    </div>
  );
}
