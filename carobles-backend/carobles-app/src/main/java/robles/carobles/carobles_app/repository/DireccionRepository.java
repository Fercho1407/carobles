package robles.carobles.carobles_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import robles.carobles.carobles_app.model.entity.Direccion;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion,Integer> {

}
