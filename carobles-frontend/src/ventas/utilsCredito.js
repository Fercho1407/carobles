import axios from "axios";

export const calcularTotalPagadoCredito = (credito, mensualidades) => {
  const enganche = Number(credito?.enganche) || 0;

  const sumaMensualidades = Array.isArray(mensualidades)
    ? mensualidades.reduce(
        (acc, m) => acc + (Number(m?.monto_mensualidad) || 0),
        0
      )
    : 0;

  return enganche + sumaMensualidades;
};


export const getCreditoId = (credito) =>
  credito?.id_credito ??
  credito?.idCredito ??
  credito?.idCredtio ?? 
  credito?.id ??
  null;

export const obtenerCreditoPorVenta = async (urlBase, idVenta) => {
  if (!idVenta) return null;
  const { data } = await axios.get(`${urlBase}/venta/${idVenta}`);
  return data ?? null;
};

export const obtenerMensualidadesPorCredito = async (urlBase, credito) => {
  const idCred = getCreditoId(credito);
  if (!idCred) return [];
  const { data } = await axios.get(`${urlBase}/mensualidades/${idCred}`);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.mensualidades)) return data.mensualidades;
  return [];
};

export const calcularTotalRecaudadoVenta = async (urlBase, venta) => {
  if (!venta) return 0;

  const idVenta =
    venta.idVenta ?? venta.id_venta ?? venta.ventaId ?? venta.venta_id ?? null;

  // ¿Es crédito? Puede venir como objeto o como boolean:
  const creditoFlag = !!(venta.esCredito || venta.credito);
  if (!creditoFlag) {
    // Contado → valorVenta
    return Number(venta.valorVenta) || 0;
  }

  const creditoEsObjeto =
    venta?.credito && typeof venta.credito === "object" && !Array.isArray(venta.credito);

  let credito = creditoEsObjeto ? venta.credito : null;
  if (!credito) {
    credito = await obtenerCreditoPorVenta(urlBase, idVenta);
  }
  if (!credito) return 0;

  const mensualidades = await obtenerMensualidadesPorCredito(urlBase, credito);
  return calcularTotalPagadoCredito(credito, mensualidades);
};
