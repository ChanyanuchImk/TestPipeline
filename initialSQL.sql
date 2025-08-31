CREATE DATABASE noisedb
    WITH OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;

\connect noisedb;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

CREATE TABLE public.noise_spatial_table (
    id SERIAL PRIMARY KEY,
    coordinate geometry(Point,4326),
    noise_level DOUBLE PRECISION,
    "time" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.noise_spatial_table (noise_level, coordinate, time)
SELECT 40 + floor(random()*50),
       ST_SetSRID(ST_MakePoint(100.5018, 13.7563),4326),
       now() - (random() * interval '30 days')
FROM generate_series(1,10);

INSERT INTO public.noise_spatial_table (noise_level, coordinate, time)
SELECT 40 + floor(random()*50),
       ST_SetSRID(ST_MakePoint(98.9793, 18.7961),4326),
       now() - (random() * interval '30 days')
FROM generate_series(1,10);

INSERT INTO public.noise_spatial_table (noise_level, coordinate, time)
SELECT 40 + floor(random()*50),
       ST_SetSRID(ST_MakePoint(98.3923, 7.8804),4326),
       now() - (random() * interval '30 days')
FROM generate_series(1,10);
