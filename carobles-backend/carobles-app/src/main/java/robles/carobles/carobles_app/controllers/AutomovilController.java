package robles.carobles.carobles_app.controllers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.vehiculos.Automovil;
import robles.carobles.carobles_app.model.enums.EstadoVehiculoEnum;
import robles.carobles.carobles_app.service.services.AutomovilService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("carobles") //la url se va a mapear como hhtp://localhost:8080/carobles
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class AutomovilController {

    @Autowired
    AutomovilService automovilService;

    @GetMapping("/automovilesConInversiones")
    public List<Automovil> listarConInversiones() {
        return automovilService.listarVehiculosConInversiones();
    }

    @PostMapping("/automovil")
    public ResponseEntity<Map<String, Boolean>> guardarAutomovil(@RequestBody Automovil automovil) {
        var auto = automovilService.guardarAutomovil(automovil);
        if (auto == null) throw new RecurosNoEncontradoExcepcion("No se pudo guardar el automovil");
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Guardado", true);
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/automovil/{id}")
    public Automovil obtenerAutomovilId(@PathVariable Integer id) {
        return automovilService.buscarAutomovilId(id);
    }
    

    @PutMapping("/automovil/{id}")
    public Automovil actualizarAutomovil(@RequestBody Automovil automovil, @PathVariable Integer id) {
        return automovilService.actualizarAutomovil(automovil, id);
    }

    @GetMapping("/estadosVehiculo")
    public List<String> getEstadosVehiculo() {
        return Arrays.stream(EstadoVehiculoEnum.values())
                     .map(Enum::name)
                     .toList();
    }
    
    @DeleteMapping("/automovil/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarAutomovil(@PathVariable Integer id){
        automovilService.eliminarAutomovil(id);
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Eliminado", true);
        return ResponseEntity.ok(respuesta);
    }
}
