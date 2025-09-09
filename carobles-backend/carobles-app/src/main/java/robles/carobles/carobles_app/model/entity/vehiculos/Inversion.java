package robles.carobles.carobles_app.model.entity.vehiculos;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import robles.carobles.carobles_app.model.enums.TipoReparacionEnum;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Inversion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_inversion;
    
    private Float costo_inversion;
    private String comentarios;

    @Enumerated(EnumType.STRING) // Guarda el nombre del enum en la BD
    @Column(name = "tipo_reparacion", length = 50, nullable = false)
    private TipoReparacionEnum tipoReparacion;

    // Relación con Automovil
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_automovil", nullable = true)
    @JsonBackReference
    private Automovil automovil;
}
