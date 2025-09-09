package robles.carobles.carobles_app.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Direccion {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id_direccion;

    private Integer codigo_postal;
    private String calle;
    private Integer numero;
    private String colonia;
    private String ciudad;
    

}
