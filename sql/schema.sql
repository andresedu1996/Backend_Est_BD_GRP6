CREATE TABLE IF NOT EXISTS persona (
  id_persona SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) UNIQUE NOT NULL,
  fecha_nacimiento DATE,
  direccion TEXT,
  rol VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS telefono (
  id_telefono SERIAL PRIMARY KEY,
  id_persona INT NOT NULL,
  numero VARCHAR(20) NOT NULL,
  CONSTRAINT fk_telefono_persona
    FOREIGN KEY (id_persona)
    REFERENCES persona(id_persona)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sede (
  id_sede SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS actividad (
  id_actividad SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  horario TIMESTAMP NOT NULL,
  cupo_max INT NOT NULL CHECK (cupo_max > 0),
  costo DECIMAL(10,2) NOT NULL CHECK (costo >= 0),
  id_sede INT,
  CONSTRAINT fk_actividad_sede
    FOREIGN KEY (id_sede)
    REFERENCES sede(id_sede)
);

CREATE TABLE IF NOT EXISTS reserva (
  id_reserva SERIAL PRIMARY KEY,
  id_persona INT NOT NULL,
  id_actividad INT NOT NULL,
  fecha_hora TIMESTAMP NOT NULL,
  estado VARCHAR(30) NOT NULL,
  precio_aplicado DECIMAL(10,2),
  
  CONSTRAINT fk_reserva_persona
    FOREIGN KEY (id_persona)
    REFERENCES persona(id_persona),

  CONSTRAINT fk_reserva_actividad
    FOREIGN KEY (id_actividad)
    REFERENCES actividad(id_actividad),

  CONSTRAINT uq_reserva UNIQUE (id_persona, id_actividad, fecha_hora)
);

CREATE TABLE IF NOT EXISTS membresia (
  id_membresia SERIAL PRIMARY KEY,
  id_persona INT NOT NULL,
  tipo_plan VARCHAR(50) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  costo DECIMAL(10,2) NOT NULL,
  estado VARCHAR(30),

  CONSTRAINT fk_membresia_persona
    FOREIGN KEY (id_persona)
    REFERENCES persona(id_persona)
);

CREATE TABLE IF NOT EXISTS pago (
  id_pago SERIAL PRIMARY KEY,
  id_reserva INT,
  id_membresia INT,
  fecha TIMESTAMP NOT NULL,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  metodo VARCHAR(50),
  referencia VARCHAR(100),

  CONSTRAINT fk_pago_reserva
    FOREIGN KEY (id_reserva)
    REFERENCES reserva(id_reserva),

  CONSTRAINT fk_pago_membresia
    FOREIGN KEY (id_membresia)
    REFERENCES membresia(id_membresia)
);