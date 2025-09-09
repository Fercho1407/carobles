import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "datatables.net-dt/css/jquery.dataTables.css";
import "./styles/styleBtnCliente.css";
import "./styles/styleTables.css";
import $ from "jquery";
import "datatables.net-dt";
import { Link } from 'react-router-dom';

export default function ListadoClientes() {
  const API_HOST = window.location.hostname;        // p.ej. "192.168.1.23"
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles/clientesConDireccion`;
  const urlEliminarCliente = "http://localhost:8080/carobles/clientes";
  const [clientes, setClientes] = useState([]);

  const cargarClientes = async () => {
    try {
      const { data } = await axios.get(urlBase);
      setClientes(data || []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  useEffect(() => { cargarClientes(); }, []);

  useEffect(() => {
    const tableId = '#tabla-clientes';

    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    if (clientes.length > 0) {
      $(tableId).DataTable({
        scrollX: true,
        autoWidth: false,
        deferRender: true,
        responsive: true,
         columnDefs: [
          { targets: 0, width: 20},
          { targets: -3, width: 35},
          { targets: 5, width: 55}
          
        ],
        language: {
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros por página",
          info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 a 0 de 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros)",
          paginate: { previous: "Anterior", next: "Siguiente" }
        },
        dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "rt" + "<'row'<'col-sm-6'i><'col-sm-6'p>>"
      });
    }

    return () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
    };
  }, [clientes]);

  const eliminarCliente = async (id) => {
  const confirmado = window.confirm("¿Seguro que deseas eliminar este cliente?");
  if (!confirmado) return;

  try {
    if ($.fn.DataTable.isDataTable('#tabla-clientes')) {
      $('#tabla-clientes').DataTable().destroy();
    }
    await axios.delete(`${urlEliminarCliente}/${id}`);
    await cargarClientes();
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    alert("No se pudo eliminar el cliente");
  }
};

  return (
    <div className="container-fluid px-2">
      <div className="titulo-centrado">
        <h1>Clientes</h1>
      </div>
      <div className="table-container table-compact table-compact--clientes">
        <table
          id="tabla-clientes"
          className="table table-striped table-hover align-middle display"
          style={{ width: "100%" }}
        >
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre (s)</th>
              <th scope="col">Apellido<br></br>Paterno</th>
              <th scope="col">Apellido<br></br>Materno</th>
              <th scope="col">Teléfono</th>
              <th scope="col">Código<br></br>postal</th>
              <th scope="col">Calle</th>
              <th scope="col">No.</th>
              <th scope="col">Colonia</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id_cliente}>
                <th scope="row" data-label="ID">{c.id_cliente}</th>
                <td data-label="Nombre (s)">{c.nombre}</td>
                <td data-label="Paterno">{c.apellido_paterno}</td>
                <td data-label="Materno">{c.apellido_materno}</td>
                <td data-label="Teléfono">{c.telefono}</td>
                <td data-label="Código postal">{c.direccion?.codigo_postal ?? ""}</td>
                <td data-label="Calle">{c.direccion?.calle ?? ""}</td>
                <td data-label="Número">{c.direccion?.numero ?? ""}</td>
                <td data-label="Colonia">{c.direccion?.colonia ?? ""}</td>
                <td data-label="######">
                  <div className="table-actions">
                    <Link to={`/editarCliente/${c.id_cliente}`} className="btn-warning-custom me-2">Editar</Link>
                    <button onClick={() => eliminarCliente(c.id_cliente)} className="btn-danger-custom">Eliminar</button>
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