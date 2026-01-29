import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '..', '.env') });

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: 'localhost',
    database: process.env.POSTGRES_DB || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '19000',
    port: process.env.POSTGRES_PORT || 5432,
});

const seedDatabase = async () => {
    try {
        console.log("🚀 Connexion à PostgreSQL...");

        // Nettoyage
        await pool.query('TRUNCATE TABLE products CASCADE');

        // On ajoute NOW() pour les colonnes createdAt et updatedAt
        // Dans seed.js, remplace la variable queryText par celle-ci :
        const queryText = `
  INSERT INTO products (id, name, categorie, prix, description, image_url, created_at, updated_at) VALUES 
  (gen_random_uuid(), 'Burger Signature', 'Burger', 12.00, 'Le classique de la maison', '/images/card1.png', NOW(), NOW()),
  (gen_random_uuid(), 'Frites Maison', 'Frites', 4.50, 'Pommes de terre fraîches', '/images/card2.png', NOW(), NOW()),
  (gen_random_uuid(), 'Wings de Poulet', 'Poulets', 10.00, 'Ailes croustillantes', '/images/card3.png', NOW(), NOW()),
  (gen_random_uuid(), 'Coca-Cola', 'Boissons', 2.50, 'Canette 33cl', '/images/card4.png', NOW(), NOW())
`;

        await pool.query(queryText);
        console.log("✅ SEED RÉUSSI ! Tes 4 produits sont créés avec leurs images.");

    } catch (err) {
        console.error("❌ Erreur pendant le seed :", err);
    } finally {
        await pool.end();
    }
};

seedDatabase();