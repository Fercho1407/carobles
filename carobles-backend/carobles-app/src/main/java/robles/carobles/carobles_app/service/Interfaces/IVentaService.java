package robles.carobles.carobles_app.service.Interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import robles.carobles.carobles_app.dto.VentaCreditoRequestDTO;
import robles.carobles.carobles_app.dto.VentasTotalesDTO;
import robles.carobles.carobles_app.model.entity.ventas.Venta;

public interface IVentaService {
    //Guarda una venta de contado
    public Venta guardarVentaContado(Venta venta);

    //Guarda una venta a credito
    Venta guardarVentaCredito(VentaCreditoRequestDTO req, MultipartFile fotoPagare);

    List<VentasTotalesDTO> listarVentasTotales();
}
