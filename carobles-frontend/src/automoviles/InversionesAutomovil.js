// InversionesAutomovil.jsx
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "datatables.net-dt/css/jquery.dataTables.css";
import $ from "jquery";
import "datatables.net-dt";

import "./styles/styleBtnAutomovil.css";
import "./styles/styleTables.css";

export default function InversionesAutomovil() {
  const { id } = useParams(); // id del automóvil
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const API = `http://${API_HOST}:${API_PORT}/carobles`;

  const [inversiones, setInversiones] = useState([]);

  // Formato MXN
  const mxn = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)
      : "";

  // Etiquetas para tipo de reparación
  const tipoLabels = useMemo(
    () => ({
      MECANICA: "Mecánica general",
      MANTENIMIENTO: "Mantenimiento preventivo",
      SUSPENSION_Y_DIRECCION: "Suspensión y dirección",
      HOJALATERIA: "Hojalatería",
      LLANTAS: "Cambio de llantas",
      REFACCIONES: "Compra de refacciones",
      OTROS: "Otros",
    }),
    []
  );

  // Calcular total invertido
  const totalInvertido = useMemo(
    () => inversiones.reduce((acc, it) => acc + (it.costo_inversion || 0), 0),
    [inversiones]
  );

  // Cargar inversiones
  const cargarInversiones = async () => {
    try {
      const invResp = await axios.get(`${API}/inversiones/${id}`);
      setInversiones(invResp.data || []);
    } catch (error) {
      console.error("Error al cargar inversiones:", error);
    }
  };

  useEffect(() => {
    cargarInversiones();
  }, [id]);

  // Configuración DataTable
  useEffect(() => {
    const tableId = "#tabla-inversiones";

    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    if (inversiones.length > 0) {
      $(tableId).DataTable({
        scrollX: true,
        autoWidth: false,
        deferRender: true,
        order: [[0, "desc"]],
        columnDefs: [
          { targets: [0, 3], className: "dt-body-right" },
          { targets: -1, orderable: false, searchable: false, width: 160, className: "nowrap" },
        ],
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros por página",
          info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 a 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros)",
          paginate: { previous: "Anterior", next: "Siguiente" },
        },
      });
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
    };
  }, [inversiones]);

  // Eliminar inversión
  const eliminarInversion = async (idInversion) => {
    try {
      if ($.fn.DataTable.isDataTable("#tabla-inversiones")) {
        $("#tabla-inversiones").DataTable().destroy();
      }
      await axios.delete(`${API}/inversiones/${idInversion}`);
      await cargarInversiones();
    } catch (error) {
      console.error("Error al eliminar inversión:", error);
      alert("No se pudo eliminar la inversión");
    }
  };

  return (
    <fieldset className="fieldset-fluid">
      <div className="container-fluid px-2">
        <div className="container text-center" style={{ margin: "30px" }}>
          <h1>Inversiones</h1>
        </div>

        <div className="d-flex justify-content-end mb-2">
          <Link to={`/automovil/${id}/inversiones/nuevaInversion`} className="btn-primary-custom">
            + Agregar inversión
          </Link>
        </div>

        {/* Tabla de inversiones */}
        <div className="table-container">
          <table
            id="tabla-inversiones"
            className="table table-striped table-hover align-middle display w-100"
            style={{ width: "100%" }}
          >
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tipo reparación</th>
                <th>Comentarios</th>
                <th>Costo</th>
                <th>######</th>
              </tr>
            </thead>
            <tbody>
              {inversiones.map((inv) => (
                <tr key={inv.id_inversion}>
                  <td>{inv.id_inversion}</td>
                  <td>{tipoLabels[inv.tipoReparacion] || inv.tipoReparacion}</td>
                  <td>{inv.comentarios}</td>
                  <td>{mxn(inv.costo_inversion)}</td>
                  <td className="nowrap">
                    <div className="d-flex gap-2">
                      <Link
                        to={`/automovil/${id}/inversiones/${inv.id_inversion}/editarInversion`}
                        className="btn-warning-custom"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => eliminarInversion(inv.id_inversion)}
                        className="btn-danger-custom"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {inversiones.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Sin inversiones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-end">
          <strong>Total invertido:</strong> {mxn(totalInvertido)}
        </div>
      </div>
    </fieldset>
  );
}
