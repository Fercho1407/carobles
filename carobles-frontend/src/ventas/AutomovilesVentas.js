import axios from "axios";
import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import $ from "jquery";
import "datatables.net-dt";
import "./styles/styleBtnVenta.css";
import "./styles/styleTables.css";
import { Link } from "react-router-dom";

export default function AutomovilesVentas() {
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;

  const [vehiculos, setVehiculos] = useState([]);

  const mxn = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n)
      : "";

  const totalInversion = (inversiones = []) =>
    inversiones.reduce((acc, it) => acc + (it.costo_inversion || 0), 0);

  const cargarVehiculos = async () => {
    try {
      const { data } = await axios.get(`${urlBase}/automovilesConInversiones`);

      const soloDisponibles = Array.isArray(data)
        ? data.filter(a =>
            String(a?.estado_vehiculo ?? "").trim().toUpperCase() === "DISPONIBLE"
          )
        : [];

      setVehiculos(soloDisponibles);
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  useEffect(() => {
    const tableId = "#tabla-vehiculos";
    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    if (vehiculos.length > 0) {
      const table = $(tableId).DataTable({
        scrollX: true,
        autoWidth: false,
        deferRender: true,
        columnDefs: [
          { targets: 0, width: 35 },                // ID
          { targets: [1, 2], width: 150 },          // No. Serie, Marca
          { targets: [4, 5, 6, 7], className: "dt-body-right" }, // Año, Costo compra, Costo inversión, Costo total
          { targets: -1, orderable: false, searchable: false, className: "nowrap", width: 80 }, // Acciones
          { targets: -8, orderable: false, searchable: false, className: "nowrap", width: 130 } // Acciones
        ],
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros por página",
          info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 a 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros)",
          paginate: { previous: "Anterior", next: "Siguiente" },
        },
        dom:
          "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
          "rt" +
          "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        initComplete: function () {
          this.api().columns.adjust();
        },
      });

      setTimeout(() => {
        table.columns.adjust();
      }, 100);

      $(window).on("resize", () => {
        table.columns.adjust();
      });
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
      $(window).off("resize");
    };
  }, [vehiculos]);


  return (
    <div className="container-fluid px-2">
      <div className="container text-center" style={{ margin: "30px" }}>
        <h1 align="center">Vehículos</h1>
      </div>

      <div className="table-container">
        <table
          id="tabla-vehiculos"
          className="table table-striped table-hover align-middle display"
        >
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>No. Serie</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Costo <br />compra</th>
              <th>Costo <br />Inversion</th>
              <th>Costo<br />total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {vehiculos.map((a) => {
              const inversiones = a.inversiones ?? [];
              const inversionTotal = totalInversion(inversiones);
              const costoCompra = Number(a?.costo_compra || 0);
              const costoTotal = costoCompra + inversionTotal; // <-- total por automóvil

              return (
                <tr key={a.id_automovil}>
                  <td>{a.id_automovil}</td>
                  <td>{a.no_serie}</td>
                  <td>{a.marca}</td>
                  <td>{a.modelo}</td>
                  <td className="text-end">{a.anio}</td>
                  <td className="text-end">{mxn(costoCompra)}</td>
                  <td className="text-end">{mxn(inversionTotal)}</td>
                  <td className="text-end">{mxn(costoTotal)}</td> {/* penúltima columna */}
                  <td className="nowrap">
                    <div className="d-flex gap-2">
                      <Link to={`/venta/${a.id_automovil}/cliente`} className="btn-warning-custom">
                        Vender
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
