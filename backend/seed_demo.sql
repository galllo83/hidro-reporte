-- ============================================================
-- HU-13: Script de datos de prueba (Demo)
-- Descripción: Limpia tablas de datos operativos (excepto usuarios)
-- y genera ~50 reportes simulados distribuidos en las zonas existentes.
-- ============================================================

-- ----------------------------------------------------------------
-- PASO 1: Limpiar datos operativos (preservar usuarios)
-- ----------------------------------------------------------------
-- Desactivamos restricciones de FK temporalmente para limpiar en orden
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE zones CASCADE;
TRUNCATE TABLE water_services CASCADE;

-- ----------------------------------------------------------------
-- PASO 1.5: Vincular una cuenta de servicio al usuario ciudadano
-- (El primer usuario con role 'user' registrado en el sistema)
-- ----------------------------------------------------------------
INSERT INTO water_services (id, user_id, service_number, street, neighborhood, city, postal_code, created_at, updated_at)
SELECT
  gen_random_uuid(),
  u.id,
  'CAASIM-2025-00142',
  'Blvd. Valle de San Javier',
  'Las Palmas',
  'Pachuca de Soto',
  '42086',
  NOW(),
  NOW()
FROM users u
WHERE u.role = 'user'
ORDER BY u.created_at ASC
LIMIT 1;

-- ----------------------------------------------------------------
-- PASO 2: Insertar zonas de prueba (polígonos en Pachuca, Hidalgo)
-- Estas son zonas reales del área de la colonia real en Pachuca.
-- ----------------------------------------------------------------

INSERT INTO zones (id, name, polygon, status, is_active, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'Zona Norte - El Arbolito',
  ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-98.763,20.115],[-98.757,20.115],[-98.757,20.110],[-98.763,20.110],[-98.763,20.115]]]}'),
  'WATER_FLOWING',
  true,
  NOW() - INTERVAL '30 days',
  NOW()
),
(
  gen_random_uuid(),
  'Zona Centro - Los Pinos',
  ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-98.757,20.110],[-98.751,20.110],[-98.751,20.105],[-98.757,20.105],[-98.757,20.110]]]}'),
  'NO_WATER',
  true,
  NOW() - INTERVAL '25 days',
  NOW()
),
(
  gen_random_uuid(),
  'Zona Sur - Las Palmas',
  ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-98.763,20.105],[-98.757,20.105],[-98.757,20.100],[-98.763,20.100],[-98.763,20.105]]]}'),
  'WATER_FLOWING',
  true,
  NOW() - INTERVAL '20 days',
  NOW()
),
(
  gen_random_uuid(),
  'Zona Oriente - Santa Cruz',
  ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-98.751,20.115],[-98.745,20.115],[-98.745,20.110],[-98.751,20.110],[-98.751,20.115]]]}'),
  'NO_WATER',
  true,
  NOW() - INTERVAL '15 days',
  NOW()
),
(
  gen_random_uuid(),
  'Zona Poniente - La Reforma',
  ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[-98.769,20.110],[-98.763,20.110],[-98.763,20.105],[-98.769,20.105],[-98.769,20.110]]]}'),
  'WATER_FLOWING',
  true,
  NOW() - INTERVAL '10 days',
  NOW()
);

-- ----------------------------------------------------------------
-- PASO 3: Generar 50 reportes simulados distribuidos en las zonas
-- usando un subquery para obtener dinámicamente los IDs de zonas y usuarios
-- ----------------------------------------------------------------

-- Reportes para la Zona Norte (SUPPLY_RESTORED = llega el agua)
INSERT INTO reports (id, user_id, zone_id, type, location, created_at, is_attended, street, neighborhood, postal_code)
SELECT
  gen_random_uuid(),
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
  z.id,
  'SUPPLY_RESTORED',
  ST_SetSRID(ST_MakePoint(-98.760 + (RANDOM() * 0.003), 20.112 + (RANDOM() * 0.002)), 4326),
  NOW() - (INTERVAL '1 hour' * FLOOR(RANDOM() * 24)),
  false,
  'Calle Pino ' || FLOOR(RANDOM() * 100 + 1)::text,
  'El Arbolito',
  '42000'
FROM zones z
WHERE z.name = 'Zona Norte - El Arbolito',
generate_series(1, 12);

-- Reportes de "se fue el agua" para Zona Centro
INSERT INTO reports (id, user_id, zone_id, type, location, created_at, is_attended, street, neighborhood, postal_code)
SELECT
  gen_random_uuid(),
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
  z.id,
  'SUPPLY_ENDED',
  ST_SetSRID(ST_MakePoint(-98.754 + (RANDOM() * 0.003), 20.107 + (RANDOM() * 0.002)), 4326),
  NOW() - (INTERVAL '1 hour' * FLOOR(RANDOM() * 48)),
  false,
  'Av. Los Pinos ' || FLOOR(RANDOM() * 100 + 1)::text,
  'Los Pinos',
  '42010'
FROM zones z
WHERE z.name = 'Zona Centro - Los Pinos',
generate_series(1, 10);

-- Mezcla de reportes para Zona Sur
INSERT INTO reports (id, user_id, zone_id, type, location, created_at, is_attended, street, neighborhood, postal_code)
SELECT
  gen_random_uuid(),
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
  z.id,
  CASE WHEN gs % 3 = 0 THEN 'SUPPLY_ENDED'
       WHEN gs % 3 = 1 THEN 'SUPPLY_RESTORED'
       ELSE 'LEAK_REPORTED' END,
  ST_SetSRID(ST_MakePoint(-98.760 + (RANDOM() * 0.003), 20.102 + (RANDOM() * 0.002)), 4326),
  NOW() - (INTERVAL '2 hours' * FLOOR(RANDOM() * 24)),
  false,
  'Calle Palma ' || FLOOR(RANDOM() * 100 + 1)::text,
  'Las Palmas',
  '42020'
FROM zones z
CROSS JOIN generate_series(1, 12) gs
WHERE z.name = 'Zona Sur - Las Palmas';

-- Reportes "se fue el agua" para Zona Oriente
INSERT INTO reports (id, user_id, zone_id, type, location, created_at, is_attended, street, neighborhood, postal_code)
SELECT
  gen_random_uuid(),
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
  z.id,
  'SUPPLY_ENDED',
  ST_SetSRID(ST_MakePoint(-98.748 + (RANDOM() * 0.003), 20.112 + (RANDOM() * 0.002)), 4326),
  NOW() - (INTERVAL '1 hour' * FLOOR(RANDOM() * 36)),
  false,
  'Callejón Santa Cruz ' || FLOOR(RANDOM() * 50 + 1)::text,
  'Santa Cruz',
  '42030'
FROM zones z
CROSS JOIN generate_series(1, 8) gs
WHERE z.name = 'Zona Oriente - Santa Cruz';

-- Reportes "llegó el agua" para Zona Poniente
INSERT INTO reports (id, user_id, zone_id, type, location, created_at, is_attended, street, neighborhood, postal_code)
SELECT
  gen_random_uuid(),
  (SELECT id FROM users ORDER BY RANDOM() LIMIT 1),
  z.id,
  'SUPPLY_RESTORED',
  ST_SetSRID(ST_MakePoint(-98.766 + (RANDOM() * 0.003), 20.107 + (RANDOM() * 0.002)), 4326),
  NOW() - (INTERVAL '30 minutes' * FLOOR(RANDOM() * 8)),
  false,
  'Blvd. Reforma ' || FLOOR(RANDOM() * 200 + 1)::text,
  'La Reforma',
  '42040'
FROM zones z
CROSS JOIN generate_series(1, 8) gs
WHERE z.name = 'Zona Poniente - La Reforma';

-- ----------------------------------------------------------------
-- PASO 4: Actualizar estado de zonas según proporción de reportes
-- (Simula lo que haría el motor de inferencia)
-- ----------------------------------------------------------------
UPDATE zones SET status = 'WATER_FLOWING', updated_at = NOW()
WHERE name IN ('Zona Norte - El Arbolito', 'Zona Sur - Las Palmas', 'Zona Poniente - La Reforma');

UPDATE zones SET status = 'NO_WATER', updated_at = NOW()
WHERE name IN ('Zona Centro - Los Pinos', 'Zona Oriente - Santa Cruz');

-- ----------------------------------------------------------------
-- Verificación: cantidad de reportes insertados
-- ----------------------------------------------------------------
SELECT
  z.name AS zona,
  z.status AS estado,
  COUNT(r.id) AS total_reportes,
  SUM(CASE WHEN r.type = 'SUPPLY_RESTORED' THEN 1 ELSE 0 END) AS llego_agua,
  SUM(CASE WHEN r.type = 'SUPPLY_ENDED'    THEN 1 ELSE 0 END) AS se_fue_agua,
  SUM(CASE WHEN r.type = 'LEAK_REPORTED'   THEN 1 ELSE 0 END) AS fugas
FROM zones z
LEFT JOIN reports r ON r.zone_id = z.id
GROUP BY z.name, z.status
ORDER BY z.name;
