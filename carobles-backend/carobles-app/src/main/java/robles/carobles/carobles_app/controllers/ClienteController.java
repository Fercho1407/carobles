package robles.carobles.carobles_app.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import robles.carobles.carobles_app.dto.ClienteConDireccionDTO;
import robles.carobles.carobles_app.dto.ClienteSinDireccionDTO;
import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.Cliente;
import robles.carobles.carobles_app.model.entity.Direccion;
import robles.carobles.carobles_app.service.services.ClienteService;
import robles.carobles.carobles_app.service.services.DireccionService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;





@RestController
@RequestMapping("carobles") //la url se va a mapear como hhtp://localhost:8080/carobles
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")

public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private DireccionService direccionService;

    
    

    @GetMapping("/clientes")  // Solo datos del cliente, sin la dirección
    public List<ClienteSinDireccionDTO> obtenerClientes() {
        List<Cliente> clientes = clienteService.listarClientes();
        return clientes.stream()
            .map(cliente -> new ClienteSinDireccionDTO(
                cliente.getId_cliente(),
                cliente.getNombre(),
                cliente.getApellido_paterno(),
                cliente.getApellido_materno(),
                cliente.getTelefono(),
                cliente.getCurp()))
            .collect(Collectors.toList());
    }

    @GetMapping("/clientesConDireccion")  // Datos del cliente con dirección
    public List<Cliente> obtenerClientesConDireccion() {
        List<Cliente> clientes = clienteService.listarClientesDirecciones();
        return clientes.stream()
            .map(cliente -> new Cliente(
                cliente.getId_cliente(),
                cliente.getNombre(),
                cliente.getApellido_paterno(),
                cliente.getApellido_materno(),
                cliente.getTelefono(),
                cliente.getCurp(),
                cliente.getDireccion()))  // Aquí se agrega la dirección
            .collect(Collectors.toList());
    }

    @PostMapping("/clientes")
    public Cliente agregaCliente(@RequestBody Cliente cliente_nuevo){
        Direccion direccion = cliente_nuevo.getDireccion();
        direccion = direccionService.guardaDireccion(direccion);
        cliente_nuevo.setDireccion(direccion);
        return clienteService.guardarCliente(cliente_nuevo);
    }

    @DeleteMapping("/clientes/{id_cliente}")
        public ResponseEntity<Map<String, Boolean>> eliminarCliente(@PathVariable Integer id_cliente) {

        // Buscar cliente
        var cliente = clienteService.buscarClientePorId(id_cliente);
        if (cliente == null) {
            throw new RecurosNoEncontradoExcepcion("El id de este cliente no existe en la base de datos");
        }

        // Guardar id_direccion si existe
        Integer id_direccion = null;
        if (cliente.getDireccion() != null) {
            id_direccion = cliente.getDireccion().getId_direccion();
        }

        // Eliminar cliente
        clienteService.eliminarCliente(cliente);

        // Eliminar dirección solo si existe
        if (id_direccion != null) {
            direccionService.eliminarDireccionId(id_direccion);
        }

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Eliminado", true);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/clientes/{id}")
    public Cliente getCliente(@PathVariable Integer id) {
        return clienteService.buscarClienteIdDireccion(id);
    }

    @PutMapping(path = "/clientes/{id}")
    public ResponseEntity<ClienteConDireccionDTO> actualizarCliente(
        @PathVariable Integer id,
        @RequestBody ClienteConDireccionDTO clienteDTO) {

        ClienteConDireccionDTO actualizado = clienteService.actualizarCliente(id, clienteDTO);
        return ResponseEntity.ok(actualizado);
    }
    
}