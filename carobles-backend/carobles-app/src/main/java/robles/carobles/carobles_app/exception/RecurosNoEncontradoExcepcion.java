package robles.carobles.carobles_app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class RecurosNoEncontradoExcepcion extends RuntimeException{
    public RecurosNoEncontradoExcepcion(String mensaje){
        super(mensaje);
    }
}