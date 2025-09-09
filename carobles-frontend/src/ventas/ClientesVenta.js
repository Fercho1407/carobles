import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "datatables.net-dt/css/jquery.dataTables.css";
import "./styles/styleBtnVenta.css";
import "./styles/styleTables.css";
import "./styles/styleForm.css"
import $ from "jquery";
import "datatables.net-dt";
import { Link } from 'react-router-dom';

export default function ClientesVenta() {
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles/clientesConDireccion`;

  const [clientes, setClientes] = useState([]);

  const cargarClientes = async () => {
    try {
      const { data } = await axios.get(urlBase);
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  useEffect(() => { cargarClientes(); }, []);

  useEffect(() => {
    const tableId = '#tabla-clientes-venta';

    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    if (clientes.length > 0) {
      const dt = $(tableId).DataTable({
        scrollX: true,
        scrollCollapse: true,
        autoWidth: false,
        deferRender: true,
        responsive: false,
        columnDefs: [
          { targets: 0, width: 50 },            // ID
          { targets: 4, width: 180 },           // CURP
          { targets: 6, width: 80 },            // No.
          { targets: -1, orderable: false, searchable: false, className: "nowrap", width: 90 } // Acciones
        ],
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros por página",
          info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 a 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros)",
          paginate: { previous: "Anterior", next: "Siguiente" }
        },
        dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>rt<'row'<'col-sm-6'i><'col-sm-6'p>>",
        initComplete: function () { this.api().columns.adjust(); }
      });

      setTimeout(() => dt.columns.adjust(), 100);
      $(window).on("resize.clientes-venta", () => dt.columns.adjust());
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
      $(window).off("resize.clientes-venta");
    };
  }, [clientes]);

  return (
    <div className="container-fluid px-2">
      <div className="titulo-centrado">
        <h1>Clientes (Venta)</h1>
      </div>

      <div className="table-container table-compact table-compact--clientes">
        <table
          id="tabla-clientes-venta"
          className="table table-striped table-hover align-middle display nowrap"
          style={{ width: "100%" }}
        >
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre (s)</th>
              <th>Apellido<br/>Paterno</th>
              <th>Apellido<br/>Materno</th>
              <th>CURP</th>
              <th>Calle</th>
              <th>No.</th>
              <th>Colonia</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((c) => (
              <tr key={c.id_cliente}>
                <td data-label="ID">{c.id_cliente}</td>
                <td data-label="Nombre (s)">{c.nombre}</td>
                <td data-label="Paterno">{c.apellido_paterno}</td>
                <td data-label="Materno">{c.apellido_materno}</td>
                <td data-label="CURP">{c.curp}</td>
                <td data-label="Calle">{c.direccion?.calle ?? ""}</td>
                <td data-label="No.">{c.direccion?.numero ?? ""}</td>
                <td data-label="Colonia">{c.direccion?.colonia ?? ""}</td>
                <td className="nowrap">
                  <div className="table-actions">
                    <Link to={`${c.id_cliente}/formVenta`} className="btn-warning-custom">
                      Vender
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
