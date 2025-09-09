package robles.carobles.carobles_app.controllers;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import robles.carobles.carobles_app.dto.CreditoDTO;
import robles.carobles.carobles_app.dto.VentaCreditoRequestDTO;
import robles.carobles.carobles_app.dto.VentasTotalesDTO;
import robles.carobles.carobles_app.exception.RecurosNoEncontradoExcepcion;
import robles.carobles.carobles_app.model.entity.ventas.Credito;
import robles.carobles.carobles_app.model.entity.ventas.Venta;
import robles.carobles.carobles_app.repository.CreditoRepository;
import robles.carobles.carobles_app.service.services.CreditoService;
import robles.carobles.carobles_app.service.services.VentaService;





@RestController
@RequestMapping("carobles") //la url se va a mapear como hhtp://localhost:8080/carobles
@CrossOrigin(origins = "*")
public class VentaController {
    @Autowired
    VentaService ventaService;

    @Autowired
    CreditoService creditoService;

    @Autowired
    CreditoRepository creditoRepository;

    @PostMapping("/ventaContado")
    public Venta ventaContado(@RequestBody Venta venta) {
        return ventaService.guardarVentaContado(venta);
    }

    @PostMapping(value = "/ventaCredito", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Venta ventaCredito(
        @RequestPart("venta")  VentaCreditoRequestDTO req,
        @RequestPart(value = "fotoPagare", required = false) MultipartFile fotoPagare
    ) {
        return ventaService.guardarVentaCredito(req, fotoPagare);
    }
    
    @GetMapping("/ventas")
    public List<VentasTotalesDTO> obtenerVentas() {
        return ventaService.listarVentasTotales();
    }

    @GetMapping("/venta/{idVenta}")
    public CreditoDTO obtenerCreditoVenta(@PathVariable Integer idVenta, HttpServletRequest request) {
        CreditoDTO dto = creditoService.obtenerCreditoPorIdVenta(idVenta);

        // Construir URL de forma dinámica a partir del request actual
        String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(request.getContextPath())  
                .build()
                .toUriString();

        String urlFoto = baseUrl + "/carobles/venta/" + idVenta + "/pagare";
        dto.setUrl_foto_pagare(urlFoto);

        return dto;
    }

    @GetMapping("/venta/{idVenta}/pagare")
    public ResponseEntity<Resource> obtenerPagare(@PathVariable Integer idVenta, HttpServletRequest request) {
        Credito credito = creditoRepository.findByVentaId(idVenta)
                .orElseThrow(() -> new RecurosNoEncontradoExcepcion(
                        "No se encontró un crédito para la venta con id: " + idVenta));

        Path ruta = Paths.get(credito.getPath_fotoPagare());

        try {
            Resource recurso = new UrlResource(ruta.toUri());

            // Usa directamente la interfaz Resource
            if (!recurso.exists() || !recurso.isReadable()) {
                throw new RecurosNoEncontradoExcepcion("Archivo no accesible: " + ruta);
            }

            // Determinar content-type con varios fallbacks
            String contentType = null;
            try {
                contentType = Files.probeContentType(ruta); // puede ser null o lanzar IOException
            } catch (IOException ignored) {}

            if (contentType == null) {
                // Fallback con ServletContext si está disponible
                try {
                    contentType = request.getServletContext().getMimeType(ruta.toString());
                } catch (Exception ignored) {}
            }
            if (contentType == null) {
                // Último fallback por nombre
                contentType = URLConnection.guessContentTypeFromName(ruta.getFileName().toString());
            }
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + ruta.getFileName().toString() + "\"")
                    .body(recurso);

        } catch (MalformedURLException e) {
            throw new RuntimeException("Ruta inválida para el archivo: " + ruta, e);
        }
    }
    
    
    
}
