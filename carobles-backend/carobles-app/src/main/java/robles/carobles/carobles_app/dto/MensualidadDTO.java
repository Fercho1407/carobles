package robles.carobles.carobles_app.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class MensualidadDTO {
    private Integer id_mensualidad;
    private LocalDate fecha_pago_mensualidad;
    private Float monto_mensualidad;
    private Float cargos_moratorios;
    private Integer id_credito;
    private String url_comprobante_mensualidad; 
}
