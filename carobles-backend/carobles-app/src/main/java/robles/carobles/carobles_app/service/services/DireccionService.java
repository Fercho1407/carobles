package robles.carobles.carobles_app.service.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import robles.carobles.carobles_app.model.entity.Direccion;
import robles.carobles.carobles_app.repository.DireccionRepository;
import robles.carobles.carobles_app.service.Interfaces.IDireccionService;

@Service
public class DireccionService implements IDireccionService {

    @Autowired
    DireccionRepository direccionRepository;

    @Override
    public List<Direccion> listarDirecciones() {
        return direccionRepository.findAll();
    }

    @Override
    public Direccion buscarDireccionId(Integer id_direccion) {
        return direccionRepository.findById(id_direccion).orElse(null);
    }

    @Override
    public Direccion guardaDireccion(Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    @Override
    public void eliminarDireccionId(Integer id_direccion) {
         direccionRepository.deleteById(id_direccion);
    }


    

}
