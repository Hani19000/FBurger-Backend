-- SUPPRESSION DES TABLES EXISTANTES (si besoin de reset)

DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS roles CASCADE;


-- TABLE: ROLES
-- Description: Gestion des rôles utilisateurs (VISITEUR, UTILISATEUR, ADMIN)

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Index pour recherche rapide par nom
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);


-- TABLE: USERS
-- Description: Comptes utilisateurs avec authentification

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);


-- TABLE: PRODUCTS
-- Description: Catalogue des produits

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  categorie VARCHAR(255) NOT NULL,
  image_url TEXT,
  prix DECIMAL(10,2) NOT NULL CHECK (prix > 0),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- TABLE: SESSIONS
-- Description: Gestion des sessions utilisateurs (refresh tokens)

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performance et nettoyage
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);


-- TRIGGER: Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';


-- Appliquer trigger sur products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();



-- INSERTION DES RÔLES PAR DÉFAUT
INSERT INTO roles (name) VALUES 
  ('VISITEUR'),
  ('UTILISATEUR'),
  ('ADMIN')
ON CONFLICT (name) DO NOTHING;


-- INSERTION DES PRODUITS INITIAUX
DELETE FROM products;

-- BURGERS
INSERT INTO products (name, categorie, prix, description, image_url) VALUES 
('Burger Signature', 'Burger', 12.00, 'Le classique de la maison', '/images/card1.png'),
('Frites Maison', 'Frites', 4.50, 'Pommes de terre fraîches et croustillantes', '/images/card2.png'),
('Wings de Poulet', 'Poulets', 10.00, 'Ailes de poulet croustillantes', '/images/card3.png'),
('Coca-Cola', 'Boissons', 2.50, 'Canette 33cl', '/images/card4.png');


-- CRÉATION UTILISATEUR ADMIN 
DO $$
DECLARE
  admin_role_id INTEGER;
BEGIN
  -- Récupérer l'ID du rôle ADMIN
  SELECT id INTO admin_role_id FROM roles WHERE name = 'ADMIN';

  -- Insérer admin si n'existe pas
  INSERT INTO users (userName, email, passwordHash, salt, role_id)
  VALUES (
    'Admin',
    'admin@fastfood.com',
    -- Hash bcrypt de 'Admin123!' avec salt ci-dessous
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW7fKJ5qG.Hy',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCO',
    admin_role_id
  )
  ON CONFLICT (email) DO NOTHING;
END $$;


-- VÉRIFICATIONS FINALES

-- Afficher le nombre de rôles créés
SELECT 'Rôles créés:' AS info, COUNT(*) AS count FROM roles;

-- Afficher le nombre de produits créés
SELECT 'Produits créés:' AS info, COUNT(*) AS count FROM products;

-- Afficher le nombre d'utilisateurs créés
SELECT 'Utilisateurs créés:' AS info, COUNT(*) AS count FROM users;

-- Afficher les catégories de produits disponibles
SELECT DISTINCT categorie, 'Catégories disponibles:' AS info FROM products ORDER BY categorie;