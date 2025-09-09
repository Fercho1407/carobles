package robles.carobles.carobles_app.service.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import robles.carobles.carobles_app.dto.ClienteConDireccionDTO;
import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.mapper.ClienteMapper;
import robles.carobles.carobles_app.model.entity.Cliente;
import robles.carobles.carobles_app.model.entity.Direccion;
import robles.carobles.carobles_app.repository.ClienteRepository;
import robles.carobles.carobles_app.repository.DireccionRepository;
import robles.carobles.carobles_app.service.Interfaces.IClienteService;

@Service
public class ClienteService implements IClienteService{

    @Autowired
    ClienteRepository clienteRepository;

    @Autowired
    DireccionRepository direccionRepository;

    @Override
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente buscarClientePorId(Integer id_cliente) {
        Cliente cliente = clienteRepository.findById(id_cliente).orElse(null);
        return cliente;
    }

    @Override
    public Cliente guardarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public void eliminarCliente(Cliente cliente) {
        clienteRepository.delete(cliente);
    }

    @Override
    public List<Cliente> listarClientesDirecciones() {
        return clienteRepository.findAllClientesDirecciones();
    }

    @Override
    public Cliente buscarClienteIdDireccion(Integer id_cliente) {
        return clienteRepository.findByClienteIdDireccion(id_cliente);
    }

     @Override
    public ClienteConDireccionDTO actualizarCliente(Integer id, ClienteConDireccionDTO clienteDTO) {
        // Convertir DTO a entidad
        Cliente clienteRecibido = ClienteMapper.toEntity(clienteDTO);
        
        // Verificar que el cliente existe
        Cliente clienteExistente = clienteRepository.findById(id)
            .orElseThrow(() -> new RecurosNoEncontradoExcepcion("No existe cliente con ese id en la base de datos"));
        
        // Actualizar campos del cliente
        clienteExistente.setNombre(clienteRecibido.getNombre());
        clienteExistente.setApellido_paterno(clienteRecibido.getApellido_paterno());
        clienteExistente.setApellido_materno(clienteRecibido.getApellido_materno());
        clienteExistente.setTelefono(clienteRecibido.getTelefono());
        clienteExistente.setCurp(clienteRecibido.getCurp());

        // Verificar y actualizar dirección
        if (clienteRecibido.getDireccion() != null) {
            Direccion direccionRecibida = clienteRecibido.getDireccion();
            Direccion direccionExistente = direccionRepository.findById(direccionRecibida.getId_direccion())
                .orElseThrow(() -> new RecurosNoEncontradoExcepcion("Debe haber una dirección asociada"));
            
            // Actualizar campos de la dirección
            direccionExistente.setCodigo_postal(direccionRecibida.getCodigo_postal());
            direccionExistente.setCalle(direccionRecibida.getCalle());
            direccionExistente.setNumero(direccionRecibida.getNumero());
            direccionExistente.setColonia(direccionRecibida.getColonia());
            direccionExistente.setCiudad(direccionRecibida.getCiudad());

            clienteExistente.setDireccion(direccionExistente);
            direccionRepository.save(direccionExistente);
        }

        // Guardar y convertir a DTO antes de devolver
        Cliente clienteActualizado = clienteRepository.save(clienteExistente);
        return ClienteMapper.toDto(clienteActualizado);
    }

    
    /*@Override
    public Cliente actualizarClienteDTOCliente(Integer id, ClienteConDireccionDTO clienteDTO) {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new RecurosNoEncontradoExcepcion("No existe cliente con ese id en la base de datos"));
        
        // Actualizar campos del cliente
        cliente.setNombre(clienteDTO.getNombre());
        cliente.setApellido_paterno(clienteDTO.getApellido_paterno());
        cliente.setApellido_materno(clienteDTO.getApellido_materno());
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setCurp(clienteDTO.getCurp());

        // Verificar y actualizar dirección
        Direccion direccionRecibida = clienteDTO.getDireccion();
        Direccion direccionExistente = direccionRepository.findById(direccionRecibida.getId_direccion())
            .orElseThrow(() -> new RecurosNoEncontradoExcepcion("Debe haber una dirección asociada"));
        
        // Actualizar campos de la dirección
        direccionExistente.setCodigo_postal(direccionRecibida.getCodigo_postal());
        direccionExistente.setCalle(direccionRecibida.getCalle());
        direccionExistente.setNumero(direccionRecibida.getNumero());
        direccionExistente.setColonia(direccionRecibida.getColonia());
        direccionExistente.setCiudad(direccionRecibida.getCiudad());

        cliente.setDireccion(direccionExistente);
        direccionRepository.save(direccionExistente);
        return clienteRepository.save(cliente);
    }*/

    

}
