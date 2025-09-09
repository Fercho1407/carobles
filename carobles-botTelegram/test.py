from config import *
from DBConection import ConnectionDB
from Services import ClienteService

resultados = ClienteService.obtenerAutosACredito('ropl010714hdfbrsa3')
print(resultados)

strings = [" ".join(map(str, fila)) for fila in resultados]
print(strings)