BEGIN;

INSERT INTO persona (nombre, correo, fecha_nacimiento, direccion, rol)
VALUES
('Juan Perez', 'juanperez@example.com', '2000-05-10', 'Tegucigalpa, Honduras', 'cliente'),
('Pabloe Perez', 'pabloperez@example.com', '2000-05-10', 'Colonia Pedregal SPS, Honduras', 'cliente'),
('Andres Lopez', 'alopez@example.com', '1996-03-08', 'Rio Piedras San Pedro Sula, Honduras', 'cliente'),
('Ana Lopez', 'ana.lopez@example.com', '1998-04-12', 'Col. Palmira, Tegucigalpa', 'cliente'),
('Carlos Mejia', 'carlos.mejia@example.com', '1995-08-29', 'Col. Kennedy, Tegucigalpa', 'cliente'),
('Laura Santos', 'laura.santos@example.com', '1992-02-18', 'Col. Tepeyac, Tegucigalpa', 'administrador'),
('Miguel Rivera', 'miguel.rivera@example.com', '1990-11-03', 'Res. El Trapiche, Tegucigalpa', 'entrenador'),
('Sofia Martinez', 'sofia.martinez@example.com', '2001-06-21', 'Col. Miraflores, Tegucigalpa', 'cliente')
('Luis Herrera', 'luis.herrera@example.com', '1993-07-15', 'Col. Florencia, San Pedro Sula', 'cliente'),
('Mariana Castillo', 'mariana.castillo@example.com', '1999-01-22', 'Barrio Guamilito, San Pedro Sula', 'cliente'),
('Jose Alvarez', 'jose.alvarez@example.com', '1988-09-10', 'Col. Trejo, San Pedro Sula', 'entrenador'),
('Gabriela Torres', 'gabriela.torres@example.com', '1996-03-05', 'Col. Moderna, San Pedro Sula', 'cliente'),
('Fernando Pineda', 'fernando.pineda@example.com', '1991-12-30', 'Col. Satelite, San Pedro Sula', 'entrenador')
ON CONFLICT (correo) DO NOTHING;
select * from persona;

INSERT INTO telefono (id_persona, numero)
VALUES
(1, '9999-0001'),
(1, '2234-1001'),
(5, '9999-0002'),
(6, '9999-0003'),
(7, '9999-0004'),
(8, '9999-0005');
select * from telefono;

INSERT INTO sede (nombre, direccion)
VALUES
('Sede Este', 'Col. Prado Alto, San Pedro Sula'),
('Sede Oeste', 'Col. Rivera Hernandez, San Pedro Sula');
select * from sede;

INSERT INTO actividad (nombre, horario, cupo_max, costo, id_sede)
VALUES
('Yoga Matutino', '2026-04-01 08:00:00', 20, 15.00, 1),
('Spinning', '2026-04-01 18:00:00', 15, 18.50, 2),
('Cross Training', '2026-04-02 06:30:00', 12, 22.00, 1),
('Pilates', '2026-04-02 17:00:00', 18, 16.75, 2),
('Zumba', '2026-04-03 19:00:00', 25, 12.00, 2),
('Boxeo Inicial', '2026-04-04 07:00:00', 10, 20.00, 1),
('HIIT Avanzado', '2026-04-04 18:30:00', 15, 25.00, 2),
('Meditación', '2026-04-05 06:00:00', 12, 10.00, 1);
select * from actividad;

INSERT INTO reserva (id_persona, id_actividad, fecha_hora, estado, precio_aplicado)
VALUES
(1, 1, '2026-03-28 09:15:00', 'confirmada', 15.00),
(5, 2, '2026-03-28 10:00:00', 'pendiente', 18.50),
(8, 4, '2026-03-28 11:30:00', 'confirmada', 16.75),
(1, 5, '2026-03-29 08:45:00', 'cancelada', 12.00),
(5, 3, '2026-03-29 12:10:00', 'confirmada', 22.00),
(6, 6, '2026-04-05 07:00:00', 'confirmada', 20.00),
(7, 7, '2026-04-05 18:30:00', 'pendiente', 25.00),
(1, 8, '2026-04-06 06:00:00', 'confirmada', 10.00);
select * from reserva;

INSERT INTO membresia (id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado)
VALUES
(1, 'Mensual', '2026-03-01', '2026-03-31', 35.00, 'activa'),
(5, 'Trimestral', '2026-02-01', '2026-04-30', 95.00, 'activa'),
(8, 'Mensual', '2026-03-15', '2026-04-14', 35.00, 'activa'),
(6, 'Mensual', '2026-04-01', '2026-04-30', 35.00, 'activa'),
(7, 'Trimestral', '2026-04-01', '2026-06-30', 95.00, 'activa'),
(8, 'Trimestral', '2026-01-12', '2026-05-25', 100.00, 'activa');
select * from membresia;

INSERT INTO pago (id_reserva, id_membresia, fecha, monto, metodo, referencia)
SELECT
  r.id_reserva,
  m.id_membresia,
  v.fecha,
  v.monto,
  v.metodo,
  v.referencia
FROM (
  VALUES
    ('ana.lopez@example.com', 'Yoga Matutino', '2026-03-28 09:15:00'::timestamp, NULL::text, NULL::date, '2026-03-28 09:20:00'::timestamp, 15.00::decimal(10,2), 'tarjeta', 'RES-0001'),
    ('carlos.mejia@example.com', 'Spinning', '2026-03-28 10:00:00'::timestamp, NULL::text, NULL::date, '2026-03-28 10:05:00'::timestamp, 18.50::decimal(10,2), 'efectivo', 'RES-0002'),
    (NULL::text, NULL::text, NULL::timestamp, 'ana.lopez@example.com', '2026-03-01'::date, '2026-03-01 07:30:00'::timestamp, 35.00::decimal(10,2), 'transferencia', 'MEM-0001'),
    (NULL::text, NULL::text, NULL::timestamp, 'carlos.mejia@example.com', '2026-02-01'::date, '2026-02-01 08:00:00'::timestamp, 95.00::decimal(10,2), 'tarjeta', 'MEM-0002'),
    ('sofia.martinez@example.com', 'Pilates', '2026-03-28 11:30:00'::timestamp, NULL::text, NULL::date, '2026-03-28 11:35:00'::timestamp, 16.75::decimal(10,2), 'tarjeta', 'RES-0003'),
    (NULL::text, NULL::text, NULL::timestamp, 'sofia.martinez@example.com', '2026-03-15'::date, '2026-03-15 09:00:00'::timestamp, 35.00::decimal(10,2), 'efectivo', 'MEM-0003')
) AS v(
  reserva_correo,
  reserva_actividad,
  reserva_fecha_hora,
  membresia_correo,
  membresia_fecha_inicio,
  fecha,
  monto,
  metodo,
  referencia
)
LEFT JOIN persona pr
  ON pr.correo = v.reserva_correo
LEFT JOIN actividad a
  ON a.nombre = v.reserva_actividad
LEFT JOIN reserva r
  ON r.id_persona = pr.id_persona
 AND r.id_actividad = a.id_actividad
 AND r.fecha_hora = v.reserva_fecha_hora
LEFT JOIN persona pm
  ON pm.correo = v.membresia_correo
LEFT JOIN membresia m
  ON m.id_persona = pm.id_persona
 AND m.fecha_inicio = v.membresia_fecha_inicio
WHERE NOT EXISTS (
  SELECT 1
  FROM pago p
  WHERE p.referencia = v.referencia
);

COMMIT;