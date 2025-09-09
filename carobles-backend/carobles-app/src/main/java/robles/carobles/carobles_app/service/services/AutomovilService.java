package robles.carobles.carobles_app.service.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.vehiculos.Automovil;
import robles.carobles.carobles_app.repository.AutomovilRepository;
import robles.carobles.carobles_app.service.Interfaces.IAutomovilService;

@Service
@RequiredArgsConstructor
public class AutomovilService implements IAutomovilService{

    @Autowired
    AutomovilRepository automovilRepository;

    @Autowired
    InversionService inversionService;

    @Override
    public List<Automovil> listarVehiculos() {
        return automovilRepository.findAll(); 
    }

    public List<Automovil> listarVehiculosConInversiones() {
        return automovilRepository.findAllConInversiones();
    }

    @Override
    public Automovil buscarAutomovilId(Integer id) {
        return automovilRepository.findById(id).orElse(null);
    }

    @Override
    public Automovil guardarAutomovil(Automovil automovil) {
        return automovilRepository.save(automovil);
    }

    @Override
    public Automovil actualizarAutomovil(Automovil automovil, Integer id) {
        Automovil automovilExistente = automovilRepository.findById(id).orElse(null);
        if (automovilExistente == null) 
            throw new RecurosNoEncontradoExcepcion("No existe automovil con ese id");
        
        automovilExistente.setNo_motor(automovil.getNo_motor());
        automovilExistente.setNo_serie(automovil.getNo_serie());
        automovilExistente.setMarca(automovil.getMarca());
        automovilExistente.setAnio(automovil.getAnio());
        automovilExistente.setModelo(automovil.getModelo());
        automovilExistente.setKilometraje(automovil.getKilometraje());
        automovilExistente.setCosto_compra(automovil.getCosto_compra());
        automovilExistente.setEstado_vehiculo(automovil.getEstado_vehiculo());

        return automovilRepository.save(automovilExistente);
    }

    @Override
    public void eliminarAutomovil(Integer id) {
        automovilRepository.deleteById(id);
    }
    

}
