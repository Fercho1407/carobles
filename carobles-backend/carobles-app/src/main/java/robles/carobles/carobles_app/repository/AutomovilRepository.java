// Repository
package robles.carobles.carobles_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import robles.carobles.carobles_app.model.entity.vehiculos.Automovil;

public interface AutomovilRepository extends JpaRepository<Automovil, Integer> {

    @Query("select distinct a from Automovil a left join fetch a.inversiones")
    List<Automovil> findAllConInversiones();
}
