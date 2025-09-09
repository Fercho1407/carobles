import mysql.connector

class ConnectionDB:
    _instance = None  # Una unica instancia

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, user, password, host, database, port=3306):
        # Evitar reconfigurar si ya existe
        if not hasattr(self, "_initialized"):
            self.user = user
            self.password = password
            self.host = host
            self.database = database
            self.port = port
            self._conn = None
            self._initialized = True
            print("Conexion creada con exito")

    def connect(self):
        if self._conn is None or not self._conn.is_connected():
            self._conn = mysql.connector.connect(
                user=self.user,
                password=self.password,
                host=self.host,
                database=self.database,
                port=self.port
            )
            print("Conexión exitosa a la base de datos.")
        return self._conn
    
    def execute_query(self, query, params=None, fetch=True):
        """
        Ejecuta un query SQL.
        :param query: Query SQL (puede contener placeholders %s).
        :param params: Tupla o lista de parámetros para el query.
        :param fetch: Si True, retorna resultados (fetchall), si False solo ejecuta.
        """
        conn = self.connect()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params or ())
            if fetch:
                resultados = cursor.fetchall()
                return resultados
            else:
                conn.commit()
                return cursor.rowcount  # filas afectadas
        except mysql.connector.Error as e:
            print(f"Error al ejecutar query: {e}")
            return None
        finally:
            cursor.close()

    def close(self):
        if self._conn and self._conn.is_connected():
            self._conn.close()
            self._conn = None
            print("Conexión cerrada.")