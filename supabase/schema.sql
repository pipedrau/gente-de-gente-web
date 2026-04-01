-- ============================================================
-- Gente de Gente — Esquema de base de datos
-- Ejecutar en Supabase SQL Editor (Settings → SQL Editor)
-- ============================================================

-- 1. TABLAS
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT DEFAULT '',
  price         INTEGER NOT NULL,
  compare_price INTEGER,
  category      TEXT NOT NULL,
  images        TEXT[] DEFAULT '{}',
  sizes         TEXT[] DEFAULT '{"Mini","Mediano"}',
  stock         INTEGER DEFAULT 0,
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT,
  customer_phone   TEXT NOT NULL,
  customer_city    TEXT,
  customer_address TEXT,
  items            JSONB NOT NULL,
  subtotal         INTEGER NOT NULL,
  discount         INTEGER DEFAULT 0,
  total            INTEGER NOT NULL,
  coupon_code      TEXT,
  status           TEXT DEFAULT 'pendiente',
  notes            TEXT DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coupons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT UNIQUE NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value        INTEGER NOT NULL,
  min_purchase INTEGER DEFAULT 0,
  active       BOOLEAN DEFAULT true,
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS RLS
-- ============================================================

-- Products: lectura pública de productos activos
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (active = true);

-- Products: gestión solo para usuarios autenticados (admin)
CREATE POLICY "Admin manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Categories: lectura pública
CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admin manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Orders: cualquiera puede crear un pedido
CREATE POLICY "Anyone create order" ON orders
  FOR INSERT WITH CHECK (true);

-- Orders: solo admin puede leer y actualizar pedidos
CREATE POLICY "Admin read orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Coupons: lectura pública para validar cupones activos
CREATE POLICY "Public validate coupons" ON coupons
  FOR SELECT USING (active = true);

CREATE POLICY "Admin manage coupons" ON coupons
  FOR ALL USING (auth.role() = 'authenticated');

-- 4. DATOS INICIALES — Categorías
-- ============================================================

INSERT INTO categories (id, name, icon) VALUES
  ('personajes', 'Personajes', '🧸'),
  ('ropa',       'Ropa',       '👕'),
  ('papeleria',  'Papelería',  '📓'),
  ('casa',       'Casa',       '🏠')
ON CONFLICT (id) DO NOTHING;

-- 5. DATOS INICIALES — Productos (8 productos de muestra)
-- ============================================================

INSERT INTO products (id, name, slug, description, price, category, images, sizes, stock, active) VALUES
  ('muneco-luna',    'Muñeco Luna',        'muneco-luna',    'Muñeco artesanal con diseño exclusivo de Gente de Gente.',        89000,  'personajes', ARRAY['card-personajes.webp'], ARRAY['Mini','Mediano'], 10, true),
  ('totebag-rio',    'Totebag Río',        'totebag-rio',    'Totebag de tela resistente con diseño original.',                 52000,  'ropa',       ARRAY['card-ropa.webp'],       ARRAY['Único'],          15, true),
  ('cuaderno-viaje', 'Cuaderno Viaje',     'cuaderno-viaje', 'Cuaderno de tapa dura con ilustraciones de viaje.',               39000,  'papeleria',  ARRAY['card-papeleria.webp'],  ARRAY['Único'],          20, true),
  ('lampara-tela',   'Lámpara Tela',       'lampara-tela',   'Lámpara decorativa con pantalla de tela ilustrada.',             125000,  'casa',       ARRAY['card-casa.webp'],       ARRAY['Único'],           5, true),
  ('personaje-nube', 'Personaje Nube',     'personaje-nube', 'Personaje de colección inspirado en las nubes.',                  94000,  'personajes', ARRAY['card-personajes.webp'], ARRAY['Mini','Mediano'],  8, true),
  ('camiseta-manos', 'Camiseta Manos',     'camiseta-manos', 'Camiseta 100% algodón con serigrafía artesanal.',                 68000,  'ropa',       ARRAY['card-ropa.webp'],       ARRAY['S','M','L','XL'], 12, true),
  ('set-postales',   'Set Postales Color', 'set-postales',   'Set de 6 postales ilustradas a color.',                           28000,  'papeleria',  ARRAY['card-papeleria.webp'],  ARRAY['Único'],          30, true),
  ('cojin-mosaico',  'Cojín Mosaico',      'cojin-mosaico',  'Cojín decorativo con diseño de mosaico.',                         74000,  'casa',       ARRAY['card-casa.webp'],       ARRAY['Único'],           7, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- IMPORTANTE: Para crear el usuario admin, ve a:
-- Supabase Dashboard → Authentication → Users → Add user
-- Usa el email y contraseña que prefieras.
-- ============================================================
