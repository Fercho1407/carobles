package robles.carobles.carobles_app.service.Interfaces;

import java.util.List;

import robles.carobles.carobles_app.model.entity.Direccion;

public interface IDireccionService {
    public List<Direccion> listarDirecciones();

    public Direccion buscarDireccionId(Integer id_direccion);

    public Direccion guardaDireccion(Direccion direccion);

    public void eliminarDireccionId(Integer id_direccion);

}