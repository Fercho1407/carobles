package robles.carobles.carobles_app.service.Interfaces;

import java.util.List;

import robles.carobles.carobles_app.model.entity.ventas.Mensualidad;

public interface IMensualidadService {

    List<Mensualidad> listarMensualidades();

    Mensualidad buscarPorId(Integer id_mensualidad);

    List<Mensualidad> listarPorIdCredito(Integer id_credito);

    Mensualidad guardar(Mensualidad mensualidad);

    void eliminar(Integer id_mensualidad);

}
