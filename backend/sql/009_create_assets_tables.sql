-- Skapa tabeller för tillgångar (inventarier, fordon, båtar, försäkringar)
-- Migrerad från Supabase: RLS policies borttagna

-- Inventarier (vitvaror och lösöre)
CREATE TABLE IF NOT EXISTS public.inventories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'appliance' (vitvaror) eller 'belonging' (lösöre)
  category VARCHAR(100) NOT NULL, -- 'Kök', 'Badrum', 'Ljud, bild och musik', etc.
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(255),
  model VARCHAR(255),
  serial_number VARCHAR(255),
  purchase_date DATE,
  purchase_price DECIMAL(10, 2),
  current_value DECIMAL(10, 2),
  location VARCHAR(255), -- Var i hemmet det finns
  warranty_expiry DATE,
  receipt_url TEXT, -- URL till kvitto
  images JSONB, -- Array med bild-URLs
  metadata JSONB, -- Extra metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT inventories_type_check CHECK (type IN ('appliance', 'belonging'))
);

-- Index för inventarier
CREATE INDEX IF NOT EXISTS idx_inventories_user_id ON public.inventories(user_id);
CREATE INDEX IF NOT EXISTS idx_inventories_type ON public.inventories(type);
CREATE INDEX IF NOT EXISTS idx_inventories_category ON public.inventories(category);
CREATE INDEX IF NOT EXISTS idx_inventories_name ON public.inventories USING gin(to_tsvector('swedish', name));

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_inventories_updated_at ON public.inventories;
CREATE TRIGGER update_inventories_updated_at
  BEFORE UPDATE ON public.inventories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fordon
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'car', 'motorcycle', 'trailer', 'other'
  make VARCHAR(255) NOT NULL, -- Tillverkare (t.ex. Volvo)
  model VARCHAR(255) NOT NULL, -- Modell (t.ex. XC90)
  registration_number VARCHAR(50), -- Registreringsnummer (t.ex. MLB 102)
  year INTEGER,
  color VARCHAR(100),
  vin VARCHAR(100), -- Vehicle Identification Number
  purchase_date DATE,
  purchase_price DECIMAL(10, 2),
  current_value DECIMAL(10, 2),
  insurance_policy_number VARCHAR(255),
  insurance_company VARCHAR(255),
  insurance_expiry DATE,
  service_history JSONB, -- Array med servicehistorik
  documents JSONB, -- Array med dokument-URLs
  images JSONB, -- Array med bild-URLs
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT vehicles_type_check CHECK (type IN ('car', 'motorcycle', 'trailer', 'other'))
);

-- Index för fordon
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON public.vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration_number ON public.vehicles(registration_number);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Båtar
CREATE TABLE IF NOT EXISTS public.boats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'motorboat', 'sailboat', 'other'
  make VARCHAR(255) NOT NULL, -- Tillverkare (t.ex. Aquador)
  model VARCHAR(255) NOT NULL, -- Modell (t.ex. 26HT)
  registration_number VARCHAR(50), -- Registreringsnummer
  year INTEGER,
  length DECIMAL(5, 2), -- Längd i meter
  engine_type VARCHAR(255),
  engine_power VARCHAR(100),
  purchase_date DATE,
  purchase_price DECIMAL(10, 2),
  current_value DECIMAL(10, 2),
  insurance_policy_number VARCHAR(255),
  insurance_company VARCHAR(255),
  insurance_expiry DATE,
  mooring_location VARCHAR(255), -- Var båten ligger
  service_history JSONB,
  documents JSONB,
  images JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT boats_type_check CHECK (type IN ('motorboat', 'sailboat', 'other'))
);

-- Index för båtar
CREATE INDEX IF NOT EXISTS idx_boats_user_id ON public.boats(user_id);
CREATE INDEX IF NOT EXISTS idx_boats_type ON public.boats(type);
CREATE INDEX IF NOT EXISTS idx_boats_registration_number ON public.boats(registration_number);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_boats_updated_at ON public.boats;
CREATE TRIGGER update_boats_updated_at
  BEFORE UPDATE ON public.boats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Försäkringar
CREATE TABLE IF NOT EXISTS public.insurances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL, -- 'property', 'inventory', 'vehicle', 'boat', 'bicycle', 'payment_protection', 'income', 'healthcare', 'alarm', 'travel', 'funds'
  type VARCHAR(255) NOT NULL, -- 'Hemförsäkring', 'Mobilförsäkring', etc.
  insurance_company VARCHAR(255) NOT NULL,
  policy_number VARCHAR(255),
  coverage_amount DECIMAL(12, 2), -- Täckningsbelopp
  premium DECIMAL(10, 2), -- Premie per månad/år
  premium_frequency VARCHAR(50), -- 'monthly', 'yearly'
  start_date DATE,
  expiry_date DATE,
  renewal_date DATE,
  deductible DECIMAL(10, 2), -- Självrisk
  linked_property_id UUID, -- Länk till fordon/båt/fastighet etc.
  linked_property_type VARCHAR(50), -- 'vehicle', 'boat', 'inventory', 'property'
  documents JSONB, -- Array med försäkringsbrev och dokument
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för försäkringar
CREATE INDEX IF NOT EXISTS idx_insurances_user_id ON public.insurances(user_id);
CREATE INDEX IF NOT EXISTS idx_insurances_category ON public.insurances(category);
CREATE INDEX IF NOT EXISTS idx_insurances_expiry_date ON public.insurances(expiry_date);
CREATE INDEX IF NOT EXISTS idx_insurances_linked_property ON public.insurances(linked_property_id, linked_property_type);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_insurances_updated_at ON public.insurances;
CREATE TRIGGER update_insurances_updated_at
  BEFORE UPDATE ON public.insurances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
