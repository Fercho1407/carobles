package robles.carobles.carobles_app.model.enums;

public enum TipoReparacionEnum {
    MECANICA("Mecánica general"),
    MANTENIMIENTO("Mantenimiento preventivo"),
    SUSPENSION_Y_DIRECCION("Suspensión y dirección"),
    HOJALATERIA("Hojalateria"),
    LLANTAS("Cambio de llantas"),
    REFACCIONES("Compra de refacciones"),
    OTROS("Otros");

    private final String nombre;

    TipoReparacionEnum(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }
}