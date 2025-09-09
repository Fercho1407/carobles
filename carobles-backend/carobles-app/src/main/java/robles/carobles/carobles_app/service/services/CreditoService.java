package robles.carobles.carobles_app.service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import robles.carobles.carobles_app.dto.CreditoDTO;
import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.ventas.Credito;
import robles.carobles.carobles_app.repository.CreditoRepository;
import robles.carobles.carobles_app.service.Interfaces.ICreditoService;

@Service
public class CreditoService implements ICreditoService {

    @Autowired
    CreditoRepository creditoRepository;

    @Override
    public CreditoDTO obtenerCreditoPorIdVenta(Integer id_venta) {
        Credito credito = creditoRepository.findByVentaId(id_venta)
                .orElseThrow(() -> new RecurosNoEncontradoExcepcion(
                        "No se encontró un crédito con id de venta: " + id_venta));

        // La URL se arma en el controller
        return new CreditoDTO(
                credito.getId_credito(),
                credito.getEnganche(),
                credito.getTotal_mensualidades(),
                credito.getCosto_mensualidad(),
                credito.getDia_maximo_pago_por_mes(),
                null
        );
    }

}
