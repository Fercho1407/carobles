// utilsVehiculos.js
import axios from "axios";

let automovilesMap = new Map();

export const cargarAutomovilesConInversiones = async (urlBase) => {
  try {
    const { data } = await axios.get(`${urlBase}/automovilesConInversiones`);
    const lista = Array.isArray(data) ? data : [];
    automovilesMap = new Map(lista.map((a) => [a.id_automovil, a]));
    return lista;
  } catch (error) {
    console.error("Error cargando automóviles con inversiones:", error);
    return [];
  }
};

export const calcularCostoTotalVehiculo = (vehiculo) => {
  if (!vehiculo) return 0;
  const inversiones = vehiculo.inversiones ?? [];
  const totalInversiones = inversiones.reduce(
    (acc, it) => acc + (it?.costo_inversion || 0),
    0
  );
  return (vehiculo.costo_compra || 0) + totalInversiones;
};

export const obtenerAutomovilConInversiones = (id) => {
  return automovilesMap.get(id) || null;
};
