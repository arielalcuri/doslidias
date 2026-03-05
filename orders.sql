-- Crear tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  customer_last_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_dni TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  items JSONB,
  total NUMERIC,
  status TEXT DEFAULT 'pendiente',
  tracking_number TEXT
);

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política simple para permitir todo (igual que productos por ahora)
CREATE POLICY "Public full access to orders" ON orders
  FOR ALL USING (true);

-- Notificar a PostgREST para recargar el esquema
NOTIFY pgrst, 'reload schema';
