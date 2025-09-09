package robles.carobles.carobles_app.model.entity.ventas;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "credito")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Credito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_credito;

    private Float enganche;
    private Integer total_mensualidades;
    private Float costo_mensualidad;
    private Integer dia_maximo_pago_por_mes;

    private String path_fotoPagare;

    @OneToOne
    @JoinColumn(name = "id_venta", nullable = false, unique = true) // unique para 1–1 real
    private Venta venta;
}