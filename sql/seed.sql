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
SELECT p.id_persona, v.numero
FROM persona p
JOIN (
  VALUES
    ('ana.lopez@example.com', '9999-0001'),
    ('ana.lopez@example.com', '2234-1001'),
    ('carlos.mejia@example.com', '9999-0002'),
    ('laura.santos@example.com', '9999-0003'),
    ('miguel.rivera@example.com', '9999-0004'),
    ('sofia.martinez@example.com', '9999-0005')
) AS v(correo, numero)
  ON p.correo = v.correo
WHERE NOT EXISTS (
  SELECT 1
  FROM telefono t
  WHERE t.id_persona = p.id_persona
    AND t.numero = v.numero
);

INSERT INTO sede (nombre, direccion)
VALUES
('Sede Este', 'Col. Prado Alto, San Pedro Sula'),
('Sede Oeste', 'Col. Rivera Hernandez, San Pedro Sula');
select * from sede;

INSERT INTO actividad (nombre, horario, cupo_max, costo, id_sede)
SELECT v.nombre, v.horario, v.cupo_max, v.costo, s.id_sede
FROM (
  VALUES
    ('Yoga Matutino', '2026-04-01 08:00:00'::timestamp, 20, 15.00::decimal(10,2), 'Sede Centro'),
    ('Spinning', '2026-04-01 18:00:00'::timestamp, 15, 18.50::decimal(10,2), 'Sede Sur'),
    ('Cross Training', '2026-04-02 06:30:00'::timestamp, 12, 22.00::decimal(10,2), 'Sede Centro'),
    ('Pilates', '2026-04-02 17:00:00'::timestamp, 18, 16.75::decimal(10,2), 'Sede Norte'),
    ('Zumba', '2026-04-03 19:00:00'::timestamp, 25, 12.00::decimal(10,2), 'Sede Sur')
) AS v(nombre, horario, cupo_max, costo, nombre_sede)
JOIN sede s
  ON s.nombre = v.nombre_sede
WHERE NOT EXISTS (
  SELECT 1
  FROM actividad a
  WHERE a.nombre = v.nombre
    AND a.horario = v.horario
    AND a.id_sede = s.id_sede
);

INSERT INTO reserva (id_persona, id_actividad, fecha_hora, estado, precio_aplicado)
SELECT p.id_persona, a.id_actividad, v.fecha_hora, v.estado, v.precio_aplicado
FROM (
  VALUES
    ('ana.lopez@example.com', 'Yoga Matutino', '2026-03-28 09:15:00'::timestamp, 'confirmada', 15.00::decimal(10,2)),
    ('carlos.mejia@example.com', 'Spinning', '2026-03-28 10:00:00'::timestamp, 'pendiente', 18.50::decimal(10,2)),
    ('sofia.martinez@example.com', 'Pilates', '2026-03-28 11:30:00'::timestamp, 'confirmada', 16.75::decimal(10,2)),
    ('ana.lopez@example.com', 'Zumba', '2026-03-29 08:45:00'::timestamp, 'cancelada', 12.00::decimal(10,2)),
    ('carlos.mejia@example.com', 'Cross Training', '2026-03-29 12:10:00'::timestamp, 'confirmada', 22.00::decimal(10,2))
) AS v(correo, nombre_actividad, fecha_hora, estado, precio_aplicado)
JOIN persona p
  ON p.correo = v.correo
JOIN actividad a
  ON a.nombre = v.nombre_actividad
WHERE NOT EXISTS (
  SELECT 1
  FROM reserva r
  WHERE r.id_persona = p.id_persona
    AND r.id_actividad = a.id_actividad
    AND r.fecha_hora = v.fecha_hora
);

INSERT INTO membresia (id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado)
SELECT p.id_persona, 'Mensual', '2026-03-01'::date, '2026-03-31'::date, 35.00::decimal(10,2), 'activa'
FROM persona p
WHERE p.correo = 'ana.lopez@example.com'
  AND NOT EXISTS (
    SELECT 1
    FROM membresia m
    WHERE m.id_persona = p.id_persona
      AND m.tipo_plan = 'Mensual'
      AND m.fecha_inicio = '2026-03-01'::date
  );

INSERT INTO membresia (id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado)
SELECT p.id_persona, 'Trimestral', '2026-02-01'::date, '2026-04-30'::date, 95.00::decimal(10,2), 'activa'
FROM persona p
WHERE p.correo = 'carlos.mejia@example.com'
  AND NOT EXISTS (
    SELECT 1
    FROM membresia m
    WHERE m.id_persona = p.id_persona
      AND m.tipo_plan = 'Trimestral'
      AND m.fecha_inicio = '2026-02-01'::date
  );

INSERT INTO membresia (id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado)
SELECT p.id_persona, 'Mensual', '2026-03-15'::date, '2026-04-14'::date, 35.00::decimal(10,2), 'activa'
FROM persona p
WHERE p.correo = 'sofia.martinez@example.com'
  AND NOT EXISTS (
    SELECT 1
    FROM membresia m
    WHERE m.id_persona = p.id_persona
      AND m.tipo_plan = 'Mensual'
      AND m.fecha_inicio = '2026-03-15'::date
  );

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