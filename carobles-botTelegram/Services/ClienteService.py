from Repositories import ClienteRepository

def obtenerNombreCliente(CURP: str):
    cliente = ClienteRepository.findClienteByCURP(CURP)
    if cliente is None:
         print("No se encuentra cliente con ese CURP")
         return None
    
    nombre = " ".join(cliente[0])
    return nombre

def obtenerNombreClienteByIdTelegram(idTelegram):
     nombre = ClienteRepository.findClienteByIdTelegram(idTelegram)
     if not nombre:
          return None
     
     return nombre[0][0]

def obtenerCURPClienteByIdTelegram(idTelegram):
     curp = ClienteRepository.findCURPByIdTelegram(idTelegram)
     if not curp:
          return None
     
     return curp[0][0]

def guaradrUsuarioTelegram(idTelegram, CURP, nombre):
     ClienteRepository.saveClienteTelegram(idTelegram, CURP, nombre)

def obtenerAutosACredito(CURP):
     resultados = ClienteRepository.getAutomovilesACredito(CURP)
     return resultados

def guardarComprobanteMensualidad(monto_mensualidad, path_comprobante_mensualidad, id_credito):
     ClienteRepository.saveMensualidad(monto_mensualidad, path_comprobante_mensualidad, id_credito)