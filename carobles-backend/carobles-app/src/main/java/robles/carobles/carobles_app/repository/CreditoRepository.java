package robles.carobles.carobles_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import robles.carobles.carobles_app.model.entity.ventas.Credito;

@Repository
public interface CreditoRepository extends JpaRepository<Credito, Integer>{

     @Query("SELECT c FROM Credito c WHERE c.venta.id_venta = :idVenta")
    Optional<Credito> findByVentaId(@Param("idVenta") Integer idVenta);

}
