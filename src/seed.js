// seed.js
const pool = new Pool({
    connectionString: "TON_URL_EXTERNE_POSTGRES_RENDER", // Trouve-la dans le dashboard Render
    ssl: { rejectUnauthorized: false }
});

const seedDatabase = async () => {
    try {
        console.log("🚀 Connexion à Render...");
        await pool.query('TRUNCATE TABLE products CASCADE');

        const queryText = `
          INSERT INTO products (id, name, categorie, prix, description, image_url, created_at, updated_at) VALUES 
          (gen_random_uuid(), 'Burger Signature', 'Burger', 12.00, 'Le classique de la maison', '/images/card1.png', NOW(), NOW()),
          (gen_random_uuid(), 'Frites Maison', 'Frites', 4.50, 'Pommes de terre fraîches', '/images/card2.png', NOW(), NOW()),
          (gen_random_uuid(), 'Wings de Poulet', 'Poulets', 10.00, 'Ailes croustillantes', '/images/card3.png', NOW(), NOW()),
          (gen_random_uuid(), 'Coca-Cola', 'Boissons', 2.50, 'Canette 33cl', '/images/card4.png', NOW(), NOW())
        `;

        await pool.query(queryText);
        console.log("✅ SEED RÉUSSI !");
    } catch (err) {
        console.error("❌ Erreur :", err);
    } finally {
        await pool.end();
    }
};