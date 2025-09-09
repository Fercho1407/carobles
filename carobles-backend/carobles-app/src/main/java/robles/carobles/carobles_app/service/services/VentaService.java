package robles.carobles.carobles_app.service.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import robles.carobles.carobles_app.dto.VentaCreditoRequestDTO;
import robles.carobles.carobles_app.dto.VentasTotalesDTO;
import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.vehiculos.Automovil;
import robles.carobles.carobles_app.model.entity.ventas.Credito;
import robles.carobles.carobles_app.model.entity.ventas.Venta;
import robles.carobles.carobles_app.model.enums.EstadoVehiculoEnum;
import robles.carobles.carobles_app.repository.AutomovilRepository;
import robles.carobles.carobles_app.repository.CreditoRepository;
import robles.carobles.carobles_app.repository.VentaRepository;
import robles.carobles.carobles_app.service.Interfaces.IVentaService;

@Service
public class VentaService implements IVentaService {

    @Autowired
    VentaRepository ventaRepository;
    @Autowired
    AutomovilRepository automovilRepository;
    @Autowired
    CreditoRepository creditoRepository;
    @Autowired
    ClienteService clienteService;
    @Autowired
    AutomovilService automovilService;

    @Override
    public Venta guardarVentaContado(Venta venta) {
        Automovil automovil = automovilRepository.findById(venta.getId_automovil()).orElse(null);
        if (automovil != null && automovil.getEstado_vehiculo() == EstadoVehiculoEnum.DISPONIBLE) {
            automovil.setEstado_vehiculo(EstadoVehiculoEnum.VENDIDO);
            automovilRepository.save(automovil);
            return ventaRepository.save(venta);
        }
        throw new RecurosNoEncontradoExcepcion("No se pudo registrar la venta");
    }

    @Override
    public Venta guardarVentaCredito(VentaCreditoRequestDTO req, MultipartFile fotoPagare) {
        // 1) Validar y actualizar estado del auto
        Automovil automovil = automovilRepository.findById(req.getIdAutomovil())
            .orElseThrow(() -> new RecurosNoEncontradoExcepcion("Automóvil no encontrado"));
        if (automovil.getEstado_vehiculo() != EstadoVehiculoEnum.DISPONIBLE) {
            throw new RecurosNoEncontradoExcepcion("El automóvil no está disponible");
        }

        // 2) Guardar VENTA
        Venta venta = new Venta();
        venta.setId_cliente(req.getIdCliente());
        venta.setId_automovil(req.getIdAutomovil());
        venta.setFecha_venta(req.getFechaVenta());
        venta.setValor_total(req.getValorTotal());
        venta = ventaRepository.save(venta);

        // 3) Marcar auto como vendido
        automovil.setEstado_vehiculo(EstadoVehiculoEnum.VENDIDO);
        automovilRepository.save(automovil);

        // 4) Crear CREDITO
        Credito credito = new Credito();
        credito.setVenta(venta);
        credito.setEnganche(req.getEnganche());
        credito.setTotal_mensualidades(req.getTotalMensualidades());
        credito.setCosto_mensualidad(req.getCostoMensualidad());
        credito.setDia_maximo_pago_por_mes(req.getDiaMaximoPagoPorMes());

        // 5) Guardar pagaré (opcional)
        if (fotoPagare != null && !fotoPagare.isEmpty()) {
            try {
                String uploadDir = "pagares";
                Path uploadPath = Path.of(uploadDir); // ✅ correcto

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFilename = fotoPagare.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }

                String fechaStr = venta.getFecha_venta().toString(); // yyyy-MM-dd
                String uniqueId = UUID.randomUUID().toString().substring(0, 8);
                String fileName = fechaStr + "_" + venta.getId_cliente() + "_" + venta.getId_automovil() +"_"+uniqueId+ extension;

                Path filePath = uploadPath.resolve(fileName); // ✅ correcto
                Files.copy(fotoPagare.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                credito.setPath_fotoPagare(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar el pagaré", e);
            }
        }

        // 6) Guardar crédito
        creditoRepository.save(credito);

        return venta;
    }

    @Override
    public List<VentasTotalesDTO> listarVentasTotales() {
        return ventaRepository.listarVentasTotalesDTO();
    }
}
