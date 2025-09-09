package robles.carobles.carobles_app.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import robles.carobles.carobles_app.model.entity.Devolucion;
import robles.carobles.carobles_app.service.services.DevolucionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("carobles")
@CrossOrigin(origins = "*")
public class DevolucionController {

    @Autowired
    DevolucionService devolucionService;

    @PostMapping("/devolucion")
    public Devolucion guardarDevolucion(@RequestBody Devolucion devolucion) {
        return devolucionService.guardarDevolucion(devolucion);
    }

    @GetMapping("/devoluciones")
    public List<Devolucion> listarDevoluciones(){
        return devolucionService.listarDevoluciones();
    }
    
    
}
