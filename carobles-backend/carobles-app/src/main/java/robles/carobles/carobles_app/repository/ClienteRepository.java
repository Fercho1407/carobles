package robles.carobles.carobles_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import robles.carobles.carobles_app.model.entity.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer>{

    @Query("SELECT c FROM Cliente c JOIN FETCH c.direccion")
    public List<Cliente> findAllClientesDirecciones();

    @Query("SELECT c FROM Cliente c JOIN FETCH c.direccion where c.id_cliente = :id_cliente")
    public Cliente findByClienteIdDireccion(@Param("id_cliente") Integer id_cliente);

    

}
