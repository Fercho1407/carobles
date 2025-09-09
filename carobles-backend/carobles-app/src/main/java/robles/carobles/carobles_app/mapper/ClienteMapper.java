// ClienteMapper.java
package robles.carobles.carobles_app.mapper;

import robles.carobles.carobles_app.dto.ClienteConDireccionDTO;
import robles.carobles.carobles_app.dto.DireccionDTO;
import robles.carobles.carobles_app.model.entity.Cliente;
import robles.carobles.carobles_app.model.entity.Direccion;

public class ClienteMapper {

    public static ClienteConDireccionDTO toDto(Cliente cliente) {
        if (cliente == null) {
            return null;
        }

        DireccionDTO direccionDTO = null;
        if (cliente.getDireccion() != null) {
            direccionDTO = new DireccionDTO(
                cliente.getDireccion().getId_direccion(),
                cliente.getDireccion().getCodigo_postal(),
                cliente.getDireccion().getCalle(),
                cliente.getDireccion().getNumero(),
                cliente.getDireccion().getColonia(),
                cliente.getDireccion().getCiudad()
            );
        }

        return new ClienteConDireccionDTO(
            cliente.getId_cliente(),
            cliente.getNombre(),
            cliente.getApellido_paterno(),
            cliente.getApellido_materno(),
            cliente.getTelefono(),
            cliente.getCurp(),
            direccionDTO
        );
    }

    public static Cliente toEntity(ClienteConDireccionDTO dto) {
        if (dto == null) {
            return null;
        }

        Direccion direccion = null;
        if (dto.getDireccion() != null) {
            direccion = new Direccion(
                dto.getDireccion().getId_direccion(),
                dto.getDireccion().getCodigo_postal(),
                dto.getDireccion().getCalle(),
                dto.getDireccion().getNumero(),
                dto.getDireccion().getColonia(),
                dto.getDireccion().getCiudad()
            );
        }

        Cliente cliente = new Cliente();
        cliente.setId_cliente(dto.getId_cliente());
        cliente.setNombre(dto.getNombre());
        cliente.setApellido_paterno(dto.getApellido_paterno());
        cliente.setApellido_materno(dto.getApellido_materno());
        cliente.setTelefono(dto.getTelefono());
        cliente.setCurp(dto.getCurp());
        cliente.setDireccion(direccion);

        return cliente;
    }
}