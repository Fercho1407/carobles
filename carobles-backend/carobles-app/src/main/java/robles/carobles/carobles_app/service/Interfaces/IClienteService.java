package robles.carobles.carobles_app.service.Interfaces;

import java.util.List;

import robles.carobles.carobles_app.dto.ClienteConDireccionDTO;
import robles.carobles.carobles_app.model.entity.Cliente;

public interface IClienteService {


    public List<Cliente> listarClientes();

    public Cliente buscarClientePorId(Integer id_cliente);

    public Cliente guardarCliente (Cliente cliente);

    public void eliminarCliente (Cliente cliente);

    public List<Cliente> listarClientesDirecciones();

    public Cliente buscarClienteIdDireccion(Integer id_cliente);


    public ClienteConDireccionDTO actualizarCliente(Integer id, ClienteConDireccionDTO clienteDTO);

}
