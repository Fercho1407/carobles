package robles.carobles.carobles_app.service.Interfaces;

import java.util.List;

import robles.carobles.carobles_app.model.entity.vehiculos.Automovil;

public interface IAutomovilService {

    public List<Automovil> listarVehiculos ();
    public Automovil buscarAutomovilId(Integer id);
    public Automovil guardarAutomovil(Automovil automovil);
    public Automovil actualizarAutomovil(Automovil automovil, Integer id);
    public void eliminarAutomovil(Integer id);
}
