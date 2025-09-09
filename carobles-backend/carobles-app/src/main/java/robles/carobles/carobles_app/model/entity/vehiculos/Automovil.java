package robles.carobles.carobles_app.model.entity.vehiculos;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import robles.carobles.carobles_app.model.enums.EstadoVehiculoEnum;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Automovil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_automovil")
    private Integer id_automovil;

    private String no_motor;
    private String no_serie;
    private String marca;
    private Integer anio;
    private String modelo;
    private Integer kilometraje;
    private Float costo_compra;

    @Enumerated(EnumType.STRING) // Guarda el nombre del enum como texto en la BD
    @Column(name = "estado_vehiculo", length = 100, nullable = false)
    private EstadoVehiculoEnum estado_vehiculo;

    // Relación inversa con Inversion
    @OneToMany(mappedBy = "automovil", cascade = CascadeType.ALL, orphanRemoval = false, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("automovil") // evita ciclo Inversion->Automovil->Inversion...
    private List<Inversion> inversiones = new ArrayList<>();
}