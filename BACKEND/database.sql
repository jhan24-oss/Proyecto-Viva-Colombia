CREATE DATABASE IF NOT EXISTS viva_colombia;
USE viva_colombia;

-- Usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  estado TINYINT DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservas de destinos
CREATE TABLE reservas_destinos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  destino VARCHAR(150) NOT NULL,
  fecha DATE NOT NULL,
  categoria VARCHAR(80),
  aerolinea VARCHAR(80),
  total_cop BIGINT,
  metodo_pago VARCHAR(80),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Reservas de alojamientos
CREATE TABLE reservas_alojamientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  alojamiento VARCHAR(150) NOT NULL,
  ubicacion VARCHAR(150),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  huespedes INT,
  total_cop BIGINT,
  metodo_pago VARCHAR(80),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Contacto
CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono VARCHAR(40),
  asunto VARCHAR(150),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
