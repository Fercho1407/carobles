package robles.carobles.carobles_app.service.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import robles.carobles.carobles_app.model.entity.Devolucion;
import robles.carobles.carobles_app.model.entity.vehiculos.Automovil;
import robles.carobles.carobles_app.model.entity.ventas.Venta;
import robles.carobles.carobles_app.model.enums.EstadoVehiculoEnum;
import robles.carobles.carobles_app.repository.DevolucionRepository;
import robles.carobles.carobles_app.repository.VentaRepository;

@Service
public class DevolucionService {

    @Autowired
    DevolucionRepository devolucionRepository;

    @Autowired
    AutomovilService automovilService;

    @Autowired
    VentaRepository ventaRepository;

    public Devolucion guardarDevolucion(Devolucion devolucion) {
        Integer idVenta = devolucion.getId_venta();
        Venta venta = ventaRepository.findById(idVenta)
            .orElseThrow(() -> new IllegalArgumentException("No existe la venta " + idVenta));

        Integer idAuto = venta.getId_automovil();
        if (idAuto == null) {
        throw new IllegalStateException("La venta no tiene automóvil asociado");
        }

        Automovil auto = automovilService.buscarAutomovilId(idAuto);
        if (auto == null) {
        throw new IllegalStateException("No existe el automóvil " + idAuto);
        }

        auto.setEstado_vehiculo(EstadoVehiculoEnum.REVISION);
        automovilService.guardarAutomovil(auto);

        ventaRepository.deleteById(idVenta);

        Devolucion devGuardada = devolucionRepository.save(devolucion);

        return devGuardada;
  }

  public List<Devolucion> listarDevoluciones (){
    return devolucionRepository.findAll();
  }
}
