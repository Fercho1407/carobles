package robles.carobles.carobles_app.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VentasTotalesDTO {
    private Integer idVenta;
    private LocalDate fechaVenta;
    private Float valorVenta;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private Integer idAutomovil;
    private String marca;
    private String modelo;
    private Integer anio;
    private String noSerie;
    private Boolean credito; // true si tiene crédito


}
