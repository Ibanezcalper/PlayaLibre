-- Habilitar extensión PostGIS para coordenadas geográficas y polígonos
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Tabla de Playas (beaches)
CREATE TABLE IF NOT EXISTS public.beaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    alias VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    -- Coordenada geográfica PostGIS (punto)
    geom_point GEOMETRY(Point, 4326),
    -- Límite de la playa (polígono)
    boundary_polygon GEOMETRY(Polygon, 4326),
    image_url TEXT,
    
    -- Checklists serializadas (o en formato JSONB)
    amenities JSONB DEFAULT '{"pets": false, "shade": false, "showers": false, "parking": false, "security": false}'::jsonb,
    accessibility JSONB DEFAULT '{"ramps": false, "wheelchair": false, "parkingReserved": false}'::jsonb,
    policy JSONB DEFAULT '{"alcoholAllowed": true, "campingAllowed": false, "feeRequired": false}'::jsonb,
    connectivity JSONB DEFAULT '{"wifi": false, "cellular4G": true}'::jsonb,
    
    -- Estado de privatización/bloqueo
    blocker_type VARCHAR(50) DEFAULT 'None' CHECK (blocker_type IN ('None', 'Hotel', 'Condo', 'Restaurant', 'Beach Club', 'Private Property', 'Other')),
    blocker_name VARCHAR(255),
    blocker_description TEXT,
    illegal_fee_amount NUMERIC(10, 2) DEFAULT 0,
    
    -- Calidad del dato
    reputation INT DEFAULT 90 CHECK (reputation BETWEEN 0 AND 100),
    is_pending_curation BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear un trigger para actualizar automáticamente la columna geom_point a partir de latitud/longitud
CREATE OR REPLACE FUNCTION update_beach_geom_point()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom_point := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_beach_geom_point
BEFORE INSERT OR UPDATE ON public.beaches
FOR EACH ROW EXECUTE FUNCTION update_beach_geom_point();


-- 2. Tabla de Denuncias/Incidentes (reports)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beach_id UUID REFERENCES public.beaches(id) ON DELETE CASCADE NOT NULL,
    reporter_name VARCHAR(150) DEFAULT 'Anónimo',
    blocker_type VARCHAR(50) NOT NULL CHECK (blocker_type IN ('Hotel', 'Condo', 'Restaurant', 'Beach Club', 'Private Property', 'Other')),
    blocker_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    has_illegal_fee BOOLEAN DEFAULT FALSE,
    fee_amount NUMERIC(10, 2) DEFAULT 0,
    
    -- Curaduría social
    score INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.beaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Crear políticas públicas de lectura
CREATE POLICY "Permitir lectura pública de playas" ON public.beaches FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de reportes" ON public.reports FOR SELECT USING (true);

-- Crear políticas públicas de inserción (para reporte colectivo)
CREATE POLICY "Permitir inserción de playas" ON public.beaches FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción de reportes" ON public.reports FOR INSERT WITH CHECK (true);

-- Política de actualización para curadores acreditados (por ejemplo, mediante un rol o metadato de usuario de Supabase)
CREATE POLICY "Permitir edición de playas a curadores" ON public.beaches FOR UPDATE USING (true);
