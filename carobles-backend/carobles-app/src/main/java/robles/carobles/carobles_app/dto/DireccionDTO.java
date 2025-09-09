package robles.carobles.carobles_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DireccionDTO {
    private Integer id_direccion;
    private Integer codigo_postal;
    private String calle;
    private Integer numero;
    private String colonia;
    private String ciudad;
}