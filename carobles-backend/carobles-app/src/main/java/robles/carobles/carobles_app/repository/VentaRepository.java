package robles.carobles.carobles_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import robles.carobles.carobles_app.dto.VentasTotalesDTO;
import robles.carobles.carobles_app.model.entity.ventas.Venta;

public interface VentaRepository extends JpaRepository<Venta, Integer>{
    @Query("""
    SELECT new robles.carobles.carobles_app.dto.VentasTotalesDTO(
        v.id_venta,
        v.fecha_venta,
        v.valor_total,
        cte.nombre,
        cte.apellido_paterno,
        cte.apellido_materno,
        auto.id_automovil,
        auto.marca,
        auto.modelo,
        auto.anio,
        auto.no_serie,
        CASE WHEN cred.id_credito IS NULL THEN false ELSE true END
    )
    FROM Venta v
    JOIN Cliente cte ON cte.id_cliente = v.id_cliente
    JOIN Automovil auto ON auto.id_automovil = v.id_automovil
    LEFT JOIN Credito cred ON cred.venta.id_venta = v.id_venta
    """)
    public List<VentasTotalesDTO> listarVentasTotalesDTO();
}
