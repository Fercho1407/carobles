package robles.carobles.carobles_app.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import robles.carobles.carobles_app.model.entity.vehiculos.Inversion;

public interface InversionRepository extends JpaRepository<Inversion, Integer> {

    @Query("SELECT i FROM Inversion i WHERE i.automovil.id_automovil = :carId")
    List<Inversion> listarInversiones(@Param("carId") Integer carId);


}
