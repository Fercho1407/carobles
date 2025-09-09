from config import *
from DBConection import ConnectionDB

#Conexion a la base de datos.
bd = ConnectionDB(USER, PASSWORD, HOST, DATABASE, PORT)

def findClienteByCURP(CURP: str):
    query = 'select nombre, apellido_paterno from cliente where curp = %s'
    return bd.execute_query(query, (CURP, ))

def findClienteByIdTelegram(idTelegram):
    query = 'select nombre from usuarios_telegram where id_telegram = %s'
    return bd.execute_query(query, (idTelegram, ))

def findCURPByIdTelegram(idTelegram):
    query = 'select curp from usuarios_telegram where id_telegram = %s'
    return bd.execute_query(query, (idTelegram, ))

def saveClienteTelegram(idTelegram, CURP, nombre):
    query = 'INSERT INTO usuarios_telegram (id_telegram, curp, nombre) values (%s, %s, %s)'
    bd.execute_query(query, (idTelegram, CURP, nombre), fetch=False)


def getAutomovilesACredito (CURP):
    query = '''select cr.id_credito, a.marca, a.modelo, a.anio, a.no_serie from cliente c
            inner join venta v on v.id_cliente = c.id_cliente
            inner join credito cr on cr.id_venta = v.id_venta
            inner join automovil a on a.id_automovil = v.id_automovil
            WHERE c.curp = %s'''

    return bd.execute_query(query, (CURP, ))


def saveMensualidad(monto_mensualidad, path_comprobante_mensualidad, id_credito):
    query = "INSERT INTO mensualidad (monto_mensualidad, path_comprobante_mensualidad, id_credito) values (%s, %s, %s)"
    bd.execute_query(query, (monto_mensualidad, path_comprobante_mensualidad, id_credito), fetch=False)
    

