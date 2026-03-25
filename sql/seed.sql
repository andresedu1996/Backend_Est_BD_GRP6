INSERT INTO persona (nombre, correo, fecha_nacimiento, direccion, rol)
VALUES
  ('Ana Lopez', 'ana@example.com', '1998-04-12', 'Col. Palmira, Tegucigalpa', 'cliente'),
  ('Carlos Mejia', 'carlos@example.com', '1995-08-29', 'Col. Kennedy, Tegucigalpa', 'cliente'),
  ('Laura Santos', 'laura@example.com', '1992-02-18', 'Col. Tepeyac, Tegucigalpa', 'administrador')
ON CONFLICT (correo) DO NOTHING;

INSERT INTO telefono (id_persona, numero)
SELECT id_persona, '9999-0001'
FROM persona
WHERE correo = 'ana@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO telefono (id_persona, numero)
SELECT id_persona, '9999-0002'
FROM persona
WHERE correo = 'carlos@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO sede (nombre, direccion)
VALUES
  ('Sede Centro', 'Boulevard Centroamerica'),
  ('Sede Sur', 'Anillo Periferico')
ON CONFLICT DO NOTHING;

INSERT INTO actividad (nombre, horario, cupo_max, costo, id_sede)
SELECT 'Yoga Matutino', '2026-03-25 08:00:00', 20, 15.00, id_sede
FROM sede
WHERE nombre = 'Sede Centro'
LIMIT 1;

INSERT INTO actividad (nombre, horario, cupo_max, costo, id_sede)
SELECT 'Spinning', '2026-03-25 18:00:00', 15, 18.50, id_sede
FROM sede
WHERE nombre = 'Sede Sur'
LIMIT 1;
