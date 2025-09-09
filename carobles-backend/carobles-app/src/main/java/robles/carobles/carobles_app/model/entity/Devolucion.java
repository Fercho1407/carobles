package robles.carobles.carobles_app.model.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Devolucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_devolucion;

    private LocalDate fecha;
    private String motivo;
    private Float monto_pagado;
    private Float monto_rembolsado;
    private String observaciones;
    private Integer id_venta;
}
