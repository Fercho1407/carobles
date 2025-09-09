package robles.carobles.carobles_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreditoDTO {
    private Integer idCredtio;
    private Float enganche;
    private Integer total_mensualidades;
    private Float CostoMensualidad;
    private Integer dia_maximo_pago_por_mes;
    private String url_foto_pagare;
}
