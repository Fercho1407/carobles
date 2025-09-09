package robles.carobles.carobles_app.model.enums;

import lombok.Getter;


@Getter
@SuppressWarnings("SpellCheckingInspection")
public enum EstadoVehiculoEnum {
    DISPONIBLE("Disponible"),
    VENDIDO("Vendido"),
    EN_REPARACION("Reparacion"),
    RESERVADO("Reservado"),
    DADO_DE_BAJA("Dado de baja"),
    REVISION("Vehiculo devuelto y en revision");

    private final String nombre;

    EstadoVehiculoEnum(String nombre) {
        this.nombre = nombre;
    }

}