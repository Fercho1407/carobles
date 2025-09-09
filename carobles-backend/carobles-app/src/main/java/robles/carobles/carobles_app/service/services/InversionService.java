package robles.carobles.carobles_app.service.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.vehiculos.Automovil;
import robles.carobles.carobles_app.model.entity.vehiculos.Inversion;
import robles.carobles.carobles_app.repository.AutomovilRepository;
import robles.carobles.carobles_app.repository.InversionRepository;
import robles.carobles.carobles_app.service.Interfaces.IInversionService;

@Service
public class InversionService implements IInversionService{

    @Autowired
    InversionRepository inversionRepository;

    @Autowired
    AutomovilRepository automovilRepository;

    @Override
    public List<Inversion> listarInversiones() {
        return inversionRepository.findAll(); 
    }

    public List<Inversion> listarInversiones(Integer carId) {
        return inversionRepository.listarInversiones(carId);
    }

    

    @Override
    public void eliminarInversion(Integer id_inversion) {
        inversionRepository.deleteById(id_inversion);
    }

    @Override
    public Inversion buscarInversionId(Integer id_direccion) {
        return inversionRepository.findById(id_direccion).orElse(null);
    }

    @Override
    public Inversion actualizaInversion(Integer id_inversion, Inversion inversion) {
        Inversion inversionExistente = inversionRepository.findById(id_inversion).orElse(null);
        if (inversionExistente == null) {
            throw new RecurosNoEncontradoExcepcion("No existe esa inversión en la base de datos");
        }

        // Campos simples
        inversionExistente.setCosto_inversion(inversion.getCosto_inversion());
        inversionExistente.setComentarios(inversion.getComentarios());
        inversionExistente.setTipoReparacion(inversion.getTipoReparacion());

        // Si también quieres actualizar el automóvil asociado
        if (inversion.getAutomovil() != null) {
            inversionExistente.setAutomovil(inversion.getAutomovil());
        }

        return inversionRepository.save(inversionExistente);
    }

    @Override
    public Inversion obtenerInversion(Integer id) {
        return inversionRepository.findById(id).orElse(null);
    }

    @Override
    public Inversion guardaInversion( Inversion inversion) {
        Integer idAutomovil = inversion.getAutomovil().getId_automovil();
        Automovil automovil = automovilRepository.findById(idAutomovil).orElse(null);
        if (automovil == null){
            throw new RecurosNoEncontradoExcepcion("Automovil no encontrado con ese id");
        }
        inversion.setAutomovil(automovil);
        return inversionRepository.save(inversion);
    }


}
