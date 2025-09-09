package robles.carobles.carobles_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import robles.carobles.carobles_app.model.entity.ventas.Mensualidad;

public interface MensualidadRepository extends JpaRepository<Mensualidad, Integer> {

    // JPQL usando el nombre del campo tal cual está en la entidad (con guión bajo)
    @Query("SELECT m FROM Mensualidad m WHERE m.id_credito = :idCredito ORDER BY m.fecha_pago_mensualidad ASC")
    List<Mensualidad> findByIdCredito(@Param("idCredito") Integer idCredito);
}
