import axios from "axios";
import React, { useEffect, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import $ from "jquery";
import "datatables.net-dt";
import "./styles/styleBtnAutomovil.css";
import "./styles/styleTables.css";
import { Link } from "react-router-dom";
import {
  cargarAutomovilesConInversiones,
  calcularCostoTotalVehiculo,
} from "./utilsVehiculos";

export default function ListadoVehiculos() {
  const API_HOST = window.location.hostname;
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;

  const [vehiculos, setVehiculos] = useState([]);

  const mxn = (n) =>
    typeof n === "number"
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(n)
      : "";

  const cargarVehiculos = async () => {
    const lista = await cargarAutomovilesConInversiones(urlBase);
    setVehiculos(lista);
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
          { targets: 0, width: 20 },
          { targets: [1, 2], width: 130 },
          { targets: [6, 7], width: 100 },
          { targets: [3, 5], width: 50 },
          { targets: [4], width: 100 },
          {
            targets: -1,
            orderable: false,
            searchable: true,
            width: 190,
            className: "nowrap",
          },
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

  const eliminarVehiculo = async (id) => {
    const confirmar = window.confirm("¿Seguro deseas eliminar el automovil?");
    if (!confirmar) return;

    try {
      if ($.fn.DataTable.isDataTable("#tabla-vehiculos")) {
        $("#tabla-vehiculos").DataTable().destroy();
      }
      await axios.delete(`${urlBase}/automovil/${id}`);
      await cargarVehiculos();
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      alert("No se pudo eliminar el vehículo");
    }
  };

  const totalCostoCompraTabla = vehiculos.reduce(
    (acc, a) => acc + (a?.costo_compra || 0),
    0
  );
  const totalInversionTabla = vehiculos.reduce(
    (acc, a) =>
      acc +
      (a.inversiones || []).reduce(
        (sum, inv) => sum + (inv.costo_inversion || 0),
        0
      ),
    0
  );
  const totalGeneralInvertido = totalCostoCompraTabla + totalInversionTabla;

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
              <th>No. Motor</th>
              <th>No. Serie</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Costo <br /> compra</th>
              <th>Estado</th>
              <th>Costo <br /> Inversiones</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {vehiculos.map((a) => {
              const totalFila = calcularCostoTotalVehiculo(a);
              const totalInv =
                (a.inversiones || []).reduce(
                  (sum, inv) => sum + (inv.costo_inversion || 0),
                  0
                );
              return (
                <tr key={a.id_automovil}>
                  <td>{a.id_automovil}</td>
                  <td>{a.no_motor}</td>
                  <td>{a.no_serie}</td>
                  <td>{a.marca}</td>
                  <td>{a.modelo}</td>
                  <td className="text-end">{a.anio}</td>
                  <td className="text-end">{mxn(a.costo_compra)}</td>
                  <td>{a.estado_vehiculo}</td>
                  <td className="text-end">{mxn(totalInv)}</td>
                  <td className="text-end">{mxn(totalFila)}</td>
                  <td className="nowrap">
                    <div className="d-flex gap-2">
                      <Link
                        to={`/editarAutomovil/${a.id_automovil}`}
                        className="btn-warning-custom"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/automovil/${a.id_automovil}/inversiones`}
                        className="btn-primary-custom"
                      >
                        inversiones
                      </Link>
                      <button
                        onClick={() => eliminarVehiculo(a.id_automovil)}
                        className="btn-danger-custom"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <th colSpan={6}></th>
              <th className="text-end">Total</th>
              <th></th>
              <th className="text-end">Total</th>
              <th className="text-end">Total</th>
              <th className="text-end">Suma</th>
            </tr>
            <tr>
              <th colSpan={6}></th>
              <th className="text-end">{mxn(totalCostoCompraTabla)}</th>
              <th></th>
              <th className="text-end">{mxn(totalInversionTabla)}</th>
              <th className="text-end">{mxn(totalGeneralInvertido)}</th>
              <th className="text-end">{mxn(totalGeneralInvertido)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
