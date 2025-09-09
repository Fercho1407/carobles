package robles.carobles.carobles_app.service.Interfaces;

import java.util.List;

import robles.carobles.carobles_app.model.entity.vehiculos.Inversion;

public interface IInversionService {
    public List<Inversion> listarInversiones();
    public void eliminarInversion(Integer id_inversion);
    public Inversion buscarInversionId(Integer id_direccion);
    public Inversion actualizaInversion(Integer id_inversion, Inversion inversion);
    public Inversion obtenerInversion(Integer id);
    public Inversion guardaInversion (Inversion inversion);
}
