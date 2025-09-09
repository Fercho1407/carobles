CREATE DATABASE carobles;
-- drop database carobles;
use carobles;

CREATE TABLE direccion (
    id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    codigo_postal INT,
    calle VARCHAR(100),
    numero INT,
    colonia VARCHAR(100),
    ciudad VARCHAR(100)
);

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    telefono VARCHAR(15),
    curp VARCHAR(18) UNIQUE,
    id_direccion int,
    
    CONSTRAINT fk_direccion_cliente FOREIGN KEY (id_direccion)
        REFERENCES direccion(id_direccion)
        ON DELETE set null
        ON UPDATE CASCADE
);


CREATE TABLE automovil (
    id_automovil INT PRIMARY KEY AUTO_INCREMENT,
    no_motor VARCHAR(50),
    no_serie VARCHAR(50),
    marca VARCHAR(100),
    anio INT,
    modelo VARCHAR(100),
    kilometraje INT,
    costo_compra FLOAT,
    estado_vehiculo TEXT
);

CREATE TABLE inversion (
    id_inversion INT PRIMARY KEY AUTO_INCREMENT,
    costo_inversion FLOAT,
    comentarios TEXT,
    tipo_reparacion text,
    id_automovil int,
    
    CONSTRAINT fk_inversion_automovil FOREIGN KEY(id_automovil) REFERENCES automovil(id_automovil)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);



CREATE TABLE venta (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    valor_total FLOAT,
    fecha_venta DATE DEFAULT (current_date()),
    id_cliente INT,
    id_automovil INT,
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    CONSTRAINT fk_venta_automovil FOREIGN KEY (id_automovil) REFERENCES automovil(id_automovil)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE devolucion (
    id_devolucion INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE,
    motivo TEXT,
    monto_pagado FLOAT,
    monto_rembolsado FLOAT,
    observaciones TEXT,
    id_venta INT
);

CREATE TABLE credito (
    id_credito INT PRIMARY KEY AUTO_INCREMENT,
    enganche float, 
    total_mensualidades INT,
    costo_mensualidad FLOAT,
    dia_maximo_pago_por_mes INT,
	path_foto_pagare TEXT,
    id_venta INT,
    CONSTRAINT fk_credito_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE mensualidad (
	id_mensualidad int primary key auto_increment,
	fecha_pago_mensualidad DATE DEFAULT (current_date()),
    monto_mensualidad FLOAT ,
    cargos_moratorios float,
    path_comprobante_mensualidad TEXT,
    id_credito INT,
    
    CONSTRAINT fk_mensualidad_credito FOREIGN KEY (id_credito) REFERENCES credito(id_credito)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE usuarios_telegram(
id_telegram BIGINT PRIMARY KEY,
curp VARCHAR(18),
nombre text);