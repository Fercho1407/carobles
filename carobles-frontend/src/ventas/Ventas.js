import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/styleTables.css";
import {
  cargarAutomovilesConInversiones,
  obtenerAutomovilConInversiones,
  calcularCostoTotalVehiculo,
} from "../automoviles/utilsVehiculos";
import { calcularTotalRecaudadoVenta } from "./utilsCredito";

export default function Ventas() {
  const API_HOST = window.location.hostname;
  const API_PORT = 8080;
  const urlBase = `http://${API_HOST}:${API_PORT}/carobles`;
  const endpoint = `${urlBase}/ventas`;

  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [totalRecaudadoMap, setTotalRecaudadoMap] = useState({}); // { [idVenta]: number }

  const fmtMXN = useMemo(
    () => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }),
    []
  );

  const fmtFecha = (iso) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso ?? "";
      return d.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" });
    } catch {
      return iso ?? "";
    }
  };

  // Memoriza normalización para no crear nueva referencia en cada render
  const normalizaVenta = useCallback((v) => {
    const idVenta = v.idVenta ?? v.id_venta ?? v.ventaId ?? v.venta_id ?? null;
    const creditoObj = v.credito ?? null;
    const esCredito = !!creditoObj;
    return { ...v, idVenta, credito: creditoObj, esCredito };
  }, []);

  // Memoriza el enriquecimiento para poder depender de él en cargarVentas/useEffect
  const enriquecerTotales = useCallback(
    async (listaVentas) => {
      const trabajos = listaVentas
        .filter((v) => v.idVenta)
        .map(async (v) => {
          const total = await calcularTotalRecaudadoVenta(urlBase, v);
          return { idVenta: v.idVenta, total: Number(total) || 0 };
        });

      if (trabajos.length === 0) return;

      try {
        const resultados = await Promise.all(trabajos);
        setTotalRecaudadoMap((prev) => {
          const copia = { ...prev };
          resultados.forEach(({ idVenta, total }) => {
            copia[idVenta] = total;
          });
          return copia;
        });
      } catch (e) {
        console.warn("No se pudieron enriquecer totales:", e);
      }
    },
    [urlBase]
  );

  // Memoriza la función principal que usa las 2 anteriores
  const cargarVentas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      await cargarAutomovilesConInversiones(urlBase);
      const { data } = await axios.get(endpoint);
      const lista = Array.isArray(data) ? data.map(normalizaVenta) : [];
      setVentas(lista);
      // Calcula Total Recaudado de forma asíncrona sin bloquear el render
      enriquecerTotales(lista);
    } catch (e) {
      console.error("Error axios:", e);
      setError("No se pudieron cargar las ventas.");
    } finally {
      setCargando(false);
    }
  }, [urlBase, endpoint, normalizaVenta, enriquecerTotales]);

  // Ahora el efecto depende de la versión memoizada de cargarVentas
  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  // ================================
  // Cálculo de totales globales
  // ================================
  const totalInvertido = ventas.reduce((acc, v) => {
    const auto = obtenerAutomovilConInversiones(v.idAutomovil);
    return acc + calcularCostoTotalVehiculo(auto);
  }, 0);

  const totalRecuperado = ventas.reduce((acc, v) => {
    const rec = totalRecaudadoMap[v.idVenta];
    return acc + (typeof rec === "number" ? rec : 0);
  }, 0);

  return (
    <div className="container-fluid px-2">
      <div className="container text-center">
        <h1>Ventas</h1>
        {/* Totales globales */}
        <div className="row my-3">
          <div className="col">
            <strong>Total invertido: </strong>{fmtMXN.format(totalInvertido)}
          </div>
          <div className="col">
            <strong>Total recuperado: </strong>{fmtMXN.format(totalRecuperado)}
          </div>
        </div>
      </div>

      {cargando && <p>Cargando ventas...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="table-container">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Valor<br />venta</th>
                <th>Costo<br />vehículo</th>
                <th>Total<br />recaudado</th>
                <th>Método</th>
                <th>Nombre</th>
                <th>Apellido<br />paterno</th>
                <th>Apellido<br />materno</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>No<br />Serie</th>
                <th>Anular<br />venta</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center">
                    Sin registros
                  </td>
                </tr>
              ) : (
                ventas.map((v, idx) => {
                  const auto = obtenerAutomovilConInversiones(v.idAutomovil);
                  const costoTotal = calcularCostoTotalVehiculo(auto);
                  const totalRecaudado = totalRecaudadoMap[v.idVenta];

                  return (
                    <tr key={idx}>
                      <td>{fmtFecha(v.fechaVenta)}</td>
                      <td className="text-end">
                        {typeof v.valorVenta === "number"
                          ? fmtMXN.format(v.valorVenta)
                          : ""}
                      </td>
                      <td className="text-end">{fmtMXN.format(costoTotal)}</td>
                      <td className="text-end">
                        {totalRecaudado === undefined ? "…" : fmtMXN.format(totalRecaudado)}
                      </td>
                      <td>
                        {v.esCredito ? (
                          v.idVenta ? (
                            <Link
                              to={`/venta/${v.idVenta}/credito`}
                              className="btn btn-sm btn-link p-0"
                            >
                              Crédito
                            </Link>
                          ) : (
                            "Crédito"
                          )
                        ) : (
                          "Contado"
                        )}
                      </td>
                      <td>{v.nombres}</td>
                      <td>{v.apellidoPaterno}</td>
                      <td>{v.apellidoMaterno}</td>
                      <td>{v.marca}</td>
                      <td>{v.modelo}</td>
                      <td className="text-end">{v.anio}</td>
                      <td>{v.noSerie}</td>
                      <td>
                        <a href={`devolucion/${v.idVenta}`}>anular</a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}