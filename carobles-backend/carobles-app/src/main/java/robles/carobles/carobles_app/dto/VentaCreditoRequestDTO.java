// VentaCreditoRequestDTO.java
package robles.carobles.carobles_app.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class VentaCreditoRequestDTO {
  // venta
  @JsonProperty("id_cliente")
  private Integer idCliente;

  @JsonProperty("id_automovil")
  private Integer idAutomovil;

  @JsonProperty("fecha_venta")
  @JsonFormat(pattern = "yyyy-MM-dd")   // asegura el parseo de LocalDate
  private LocalDate fechaVenta;

  @JsonProperty("valor_total")
  private Float valorTotal;

  // crédito
  @JsonProperty("enganche")
  private Float enganche;

  @JsonProperty("total_mensualidades")
  private Integer totalMensualidades;

  @JsonProperty("costo_mensualidad")
  private Float costoMensualidad;

  @JsonProperty("dia_maximo_pago_por_mes")
  private Integer diaMaximoPagoPorMes;
}
