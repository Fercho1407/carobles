
package robles.carobles.carobles_app.controllers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.vehiculos.Inversion;
import robles.carobles.carobles_app.model.enums.TipoReparacionEnum;
import robles.carobles.carobles_app.service.services.InversionService;

@RestController
@RequestMapping("/carobles")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*")
public class InversionesController {
    @Autowired
    InversionService inversionService;

    @GetMapping("/inversiones/{id}")
    public ResponseEntity<List<Inversion>> listarInversionesPorAuto(@PathVariable Integer id) {
        return ResponseEntity.ok(inversionService.listarInversiones(id));
    }
    
    @DeleteMapping("/inversiones/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarInversion(@PathVariable Integer id){
        var inversion = inversionService.buscarInversionId(id);
        if (inversion == null){
            throw new RecurosNoEncontradoExcepcion("No existe una inversion con ese id");
        }

        inversionService.eliminarInversion(id);
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Eliminado", true);
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/inversiones/{id}")
    public ResponseEntity<Map<String, Boolean>> actualizarInversion(@PathVariable Integer id, 
                                                                    @RequestBody Inversion inversion){
        
        inversionService.actualizaInversion(id, inversion);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Actualizado", true);
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/inversiones")
    public ResponseEntity<Map<String, Boolean>> guardarInversion(@RequestBody Inversion inversion){

        inversionService.guardaInversion(inversion);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("Guardado", true);
        return ResponseEntity.ok(respuesta);
    }
    

    @GetMapping("inversiones/tipoReparacion")
    public List<String> getTipoReparacion() {
        return Arrays.stream(TipoReparacionEnum.values())
                     .map(Enum::name)
                     .toList();
    }

    @GetMapping("inversion/{id}")
    public Inversion obteneInversion(@PathVariable Integer id){
        return inversionService.obtenerInversion(id);
    }


}
