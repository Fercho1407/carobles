package robles.carobles.carobles_app.controllers;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import robles.carobles.carobles_app.dto.MensualidadDTO;
import robles.carobles.carobles_app.model.entity.ventas.Mensualidad;
import robles.carobles.carobles_app.repository.MensualidadRepository;
import robles.carobles.carobles_app.service.services.MensualidadService;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;


@RestController
@RequestMapping("carobles")
@CrossOrigin(origins = "*")
public class MensualidadController {

    @Autowired
    MensualidadService mensualidadService;

    @Autowired
    MensualidadRepository mensualidadRepository;


    
    @PutMapping("/mensualidad/{id}")
    public ResponseEntity<Mensualidad> actualizar(@PathVariable Integer id,
                                                @RequestBody Mensualidad mensualidad) {
        Mensualidad existe = mensualidadService.buscarPorId(id);
        if (existe == null) return ResponseEntity.notFound().build();


        existe.setFecha_pago_mensualidad(mensualidad.getFecha_pago_mensualidad());
        existe.setMonto_mensualidad(mensualidad.getMonto_mensualidad());
        existe.setCargos_moratorios(mensualidad.getCargos_moratorios());

        Mensualidad actualizado = mensualidadService.guardar(existe);

        return ResponseEntity.ok(actualizado);
    }


    

    @GetMapping("/mensualidades/{id_credito}")
    public List<MensualidadDTO> listar(@PathVariable Integer id_credito, HttpServletRequest request) {
        List<Mensualidad> lista = mensualidadService.listarPorIdCredito(id_credito);

        String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(request.getContextPath())
                .build()
                .toUriString();

        return lista.stream().map(m -> {
            MensualidadDTO dto = new MensualidadDTO();
            dto.setId_mensualidad(m.getId_mensualidad());
            dto.setFecha_pago_mensualidad(m.getFecha_pago_mensualidad());
            dto.setMonto_mensualidad(m.getMonto_mensualidad());
            dto.setCargos_moratorios(m.getCargos_moratorios());
            dto.setId_credito(m.getId_credito());

            String url = baseUrl + "/carobles/mensualidades/" + m.getId_mensualidad() + "/comprobante";
            dto.setUrl_comprobante_mensualidad(url);

            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/mensualidades/{id_mensualidad}/comprobante")
    public ResponseEntity<Resource> servirComprobante(@PathVariable Integer id_mensualidad) {
        Mensualidad m = mensualidadRepository.findById(id_mensualidad).orElse(null);
        if (m == null || m.getPath_comprobante_mensualidad() == null || m.getPath_comprobante_mensualidad().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path path = Paths.get(m.getPath_comprobante_mensualidad()).normalize();
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Detecta content-type, default a imagen jpeg
            MediaType mediaType;
            try {
                String detected = Files.probeContentType(path);
                mediaType = (detected != null) ? MediaType.parseMediaType(detected) : MediaType.IMAGE_JPEG;
            } catch (Exception e) {
                mediaType = MediaType.IMAGE_JPEG;
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .cacheControl(CacheControl.maxAge(java.time.Duration.ofHours(1)).cachePublic())
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

   @PostMapping(
    path = "/mensualidades",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> crearMensualidad(
            @RequestParam("id_credito") Integer idCredito,
            @RequestParam("fecha_pago_mensualidad")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaPago,
            @RequestParam("monto_mensualidad") Float montoMensualidad,
            @RequestParam(value = "cargos_moratorios", required = false) Float cargosMoratorios,
            @RequestPart("comprobante") MultipartFile comprobante) {

        // 1) Validaciones básicas
        if (idCredito == null || fechaPago == null || montoMensualidad == null ||
            comprobante == null || comprobante.isEmpty()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Datos incompletos en la solicitud.")
            );
        }

        // 2) Asegurar carpeta destino
        Path raizProyecto = Paths.get(System.getProperty("user.dir")).toAbsolutePath().normalize();
        Path carpetaMensualidades = raizProyecto.resolve("comprobantes_mensualidades");

        try {
            Files.createDirectories(carpetaMensualidades);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo crear la carpeta de comprobantes.",
                                "detalle", e.getMessage()));
        }

        // 3) Determinar extensión real
        String originalName = comprobante.getOriginalFilename();
        String extension = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";

        // 4) Generar nombre único: yyyyMMdd_HHmmss_idCredito_uuid8.ext
        String ts = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss").format(LocalDateTime.now());
        String uuid8 = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String nombreArchivo = ts + "_" + idCredito + "_" + uuid8 + extension;
        Path destino = carpetaMensualidades.resolve(nombreArchivo).normalize();

        // 5) Guardar archivo en disco
        try {
            if (!destino.getParent().equals(carpetaMensualidades)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Ruta de destino inválida."));
            }
            Files.copy(comprobante.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "No se pudo guardar el comprobante en disco.",
                                "detalle", e.getMessage()));
        }

        // 6) Construir entidad
        Mensualidad mensualidad = new Mensualidad();
        mensualidad.setId_credito(idCredito);
        mensualidad.setFecha_pago_mensualidad(fechaPago);
        mensualidad.setMonto_mensualidad(montoMensualidad);
        mensualidad.setCargos_moratorios(cargosMoratorios != null ? cargosMoratorios : 0.0f);
        mensualidad.setPath_comprobante_mensualidad(destino.toString());

        // 7) Guardar en BD con manejo de errores
        try {
            Mensualidad guardada = mensualidadService.guardar(mensualidad);

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("id_mensualidad", guardada.getId_mensualidad());
            resp.put("id_credito", guardada.getId_credito());
            resp.put("fecha_pago_mensualidad", guardada.getFecha_pago_mensualidad());
            resp.put("monto_mensualidad", guardada.getMonto_mensualidad());
            resp.put("cargos_moratorios", guardada.getCargos_moratorios());
            resp.put("path_comprobante_mensualidad", guardada.getPath_comprobante_mensualidad());

            return ResponseEntity.status(HttpStatus.CREATED).body(resp);

        } catch (Exception ex) {
            ex.printStackTrace(); // log en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno al guardar mensualidad",
                                "detalle", ex.getMessage()));
        }
    }

}
