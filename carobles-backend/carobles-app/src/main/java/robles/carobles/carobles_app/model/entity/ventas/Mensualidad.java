package robles.carobles.carobles_app.model.entity.ventas;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Mensualidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_mensualidad;
    private LocalDate fecha_pago_mensualidad;
    private Float monto_mensualidad;
    private Float cargos_moratorios;
    private String path_comprobante_mensualidad;
    private Integer id_credito;
}
