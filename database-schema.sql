-- Crear tabla de categorías
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de clientes
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  tax_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de ventas
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  total DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  payment_method VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de items de venta
CREATE TABLE sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'cashier',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Función para disminuir el stock de un producto
CREATE OR REPLACE FUNCTION decrease_stock(p_id INTEGER, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a todas las tablas
CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_categories_modtime
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_customers_modtime
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_sales_modtime
BEFORE UPDATE ON sales
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_sale_items_modtime
BEFORE UPDATE ON sale_items
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insertar algunas categorías de ejemplo
INSERT INTO categories (name, description) VALUES
('Electrónicos', 'Productos electrónicos como laptops, smartphones, etc.'),
('Accesorios', 'Accesorios para computadoras y dispositivos móviles'),
('Oficina', 'Productos para oficina'),
('Audio', 'Productos de audio como auriculares, parlantes, etc.'),
('Almacenamiento', 'Dispositivos de almacenamiento como discos duros, memorias USB, etc.');

-- Insertar algunos productos de ejemplo
INSERT INTO products (name, sku, description, category_id, price, cost, stock, image_url) VALUES
('Laptop HP Pavilion', 'LP-HP-001', 'Laptop HP Pavilion con procesador Intel i5', 1, 899.99, 650.00, 15, '/placeholder.svg?height=200&width=200'),
('Monitor Dell 27"', 'MN-DL-027', 'Monitor Dell de 27 pulgadas Full HD', 1, 299.99, 180.00, 23, '/placeholder.svg?height=200&width=200'),
('Teclado Mecánico Logitech', 'KB-LG-001', 'Teclado mecánico Logitech con retroiluminación RGB', 2, 129.99, 75.00, 42, '/placeholder.svg?height=200&width=200'),
('Mouse Inalámbrico', 'MS-WL-001', 'Mouse inalámbrico con sensor óptico', 2, 49.99, 22.00, 67, '/placeholder.svg?height=200&width=200'),
('Auriculares Bluetooth', 'HP-BT-001', 'Auriculares Bluetooth con cancelación de ruido', 4, 79.99, 35.00, 31, '/placeholder.svg?height=200&width=200'),
('Impresora Láser HP', 'PR-HP-001', 'Impresora láser HP monocromática', 3, 249.99, 150.00, 8, '/placeholder.svg?height=200&width=200'),
('Disco Duro Externo 1TB', 'HD-EX-001', 'Disco duro externo de 1TB USB 3.0', 5, 89.99, 45.00, 19, '/placeholder.svg?height=200&width=200');

-- Insertar algunos clientes de ejemplo
INSERT INTO customers (name, email, phone, address, tax_id) VALUES
('Juan Pérez', 'juan.perez@example.com', '555-1234', 'Calle Principal 123', 'TAX123456'),
('María García', 'maria.garcia@example.com', '555-5678', 'Avenida Central 456', 'TAX789012'),
('Carlos Rodríguez', 'carlos.rodriguez@example.com', '555-9012', 'Plaza Mayor 789', 'TAX345678');

-- Crear políticas de seguridad para RLS (Row Level Security)
-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir acceso a usuarios autenticados
CREATE POLICY "Permitir acceso a productos para usuarios autenticados" 
ON products FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Permitir acceso a categorías para usuarios autenticados" 
ON categories FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Permitir acceso a clientes para usuarios autenticados" 
ON customers FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Permitir acceso a ventas para usuarios autenticados" 
ON sales FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Permitir acceso a items de venta para usuarios autenticados" 
ON sale_items FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Permitir acceso a usuarios para usuarios autenticados" 
ON users FOR ALL 
TO authenticated 
USING (true);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_customers_email ON customers(email);
