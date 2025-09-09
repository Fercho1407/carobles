package robles.carobles.carobles_app.service.services;
import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import robles.carobles.carobles_app.model.entity.ventas.Mensualidad;
import robles.carobles.carobles_app.repository.MensualidadRepository;
import robles.carobles.carobles_app.service.Interfaces.IMensualidadService;

@Service
public class MensualidadService implements IMensualidadService {

    @Autowired
    MensualidadRepository mensualidadRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Mensualidad> listarMensualidades() {
        return mensualidadRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Mensualidad buscarPorId(Integer id_mensualidad) {
        return mensualidadRepository.findById(id_mensualidad).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Mensualidad> listarPorIdCredito(Integer id_credito) {
        return mensualidadRepository.findByIdCredito(id_credito)
            .stream()
            .map(m -> {
                // Cambiar path local por URL accesible
                String fileName = new File(m.getPath_comprobante_mensualidad()).getName();
                m.setPath_comprobante_mensualidad("http://localhost:8080/comprobantes_mensualidades/" + fileName);
                return m;
            })
            .toList();
    }

    @Override
    public Mensualidad guardar(Mensualidad mensualidad) {
        return mensualidadRepository.save(mensualidad);
    }

    @Override
    public void eliminar(Integer id_mensualidad) {
        mensualidadRepository.deleteById(id_mensualidad);
    }
}
    
