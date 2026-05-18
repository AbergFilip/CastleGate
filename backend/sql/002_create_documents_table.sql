-- Skapa documents-tabellen för att lagra alla dokument
-- Migrerad från Supabase: RLS och auth.users referenser borttagna
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'personal', 'contracts', 'health', 'grades', 'ice', 'school'
  subcategory VARCHAR(100), -- 'visa', 'gift_letters', 'wills', 'prenuptial', 'work_agreements', 'licenses', etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT, -- URL till filen (kan vara Supabase Storage eller annan storage)
  file_name VARCHAR(255),
  file_type VARCHAR(50), -- 'pdf', 'jpg', 'png', etc.
  file_size INTEGER, -- i bytes
  metadata JSONB, -- Extra metadata (datum, relation, telefonnummer, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT documents_category_check CHECK (category IN ('personal', 'contracts', 'health', 'grades', 'ice', 'school'))
);

-- Index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_subcategory ON public.documents(subcategory);
CREATE INDEX IF NOT EXISTS idx_documents_title ON public.documents USING gin(to_tsvector('swedish', title));

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Skapa tabell för ICE (In Case of Emergency) kontakter
CREATE TABLE IF NOT EXISTS public.ice_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relation VARCHAR(100), -- 'Fru', 'Make', 'Barn', etc.
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för ICE kontakter
CREATE INDEX IF NOT EXISTS idx_ice_contacts_user_id ON public.ice_contacts(user_id);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_ice_contacts_updated_at ON public.ice_contacts;
CREATE TRIGGER update_ice_contacts_updated_at
  BEFORE UPDATE ON public.ice_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Skapa tabell för skolor
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'preschool', 'elementary', 'high_school'
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för skolor
CREATE INDEX IF NOT EXISTS idx_schools_user_id ON public.schools(user_id);
CREATE INDEX IF NOT EXISTS idx_schools_type ON public.schools(type);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_schools_updated_at ON public.schools;
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Skapa tabell för skolkontakter
CREATE TABLE IF NOT EXISTS public.school_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100), -- 'Lärare', 'Rektor', etc.
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för skolkontakter
CREATE INDEX IF NOT EXISTS idx_school_contacts_school_id ON public.school_contacts(school_id);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_school_contacts_updated_at ON public.school_contacts;
CREATE TRIGGER update_school_contacts_updated_at
  BEFORE UPDATE ON public.school_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Skapa tabell för betyg
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  education_level VARCHAR(100) NOT NULL, -- 'Grundskola', 'Gymnasium', 'Högskola och universitet'
  school_name VARCHAR(255),
  program VARCHAR(255), -- Program/linje
  year INTEGER,
  semester VARCHAR(50), -- 'Höst', 'Vår'
  courses JSONB, -- Array med kurser och betyg
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL, -- Länk till dokument om det finns
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för betyg
CREATE INDEX IF NOT EXISTS idx_grades_user_id ON public.grades(user_id);
CREATE INDEX IF NOT EXISTS idx_grades_education_level ON public.grades(education_level);

-- Trigger för updated_at
DROP TRIGGER IF EXISTS update_grades_updated_at ON public.grades;
CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
