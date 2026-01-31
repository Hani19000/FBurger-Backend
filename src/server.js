import http from 'http';
import app from './app.js';
import { ENV } from './config/environment.js';
import { connectPostgres, connectMongoDB, closeDatabases } from './config/database.js';
import { initRoles } from '../scripts/initRoles.js';
import { logger } from './utils/logger.js';
import { initDatabase } from '../scripts/initDatabase.js';
import { passwordService } from './src/services/password.service.js';
const salt = passwordService.generateSalt();
const hash = await passwordService.hashPassword('Admin123!', salt);
console.log('--- COPIE CECI DANS TABLEPLUS ---');
console.log('SALT:', salt);
console.log('HASH:', hash);
const server = http.createServer(app);

// UNE SEULE FONCTION DE DÉMARRAGE
async function startServer() {
    try {
        // 1. Connexions aux bases
        await connectPostgres();
        await connectMongoDB();

        // 2. Synchronisation et Initialisation
        await initDatabase();
        await initRoles();

        logger.info('Databases ready and initialized');

        // 3. Lancement du serveur sur le port unique
        server.listen(ENV.server.port, () => {
            logger.info(`Server running on port ${ENV.server.port}`);
        });
    } catch (err) {
        logger.error('Server initialization failed', err);
        process.exit(1);
    }
}

// Lancement sécurisé
startServer();

// Gestion de l'arrêt gracieux
const shutdown = async () => {
    logger.info('Shutting down server...');
    server.close(async () => {
        try {
            await closeDatabases();
            logger.info('Server closed safely');
            process.exit(0);
        } catch (err) {
            logger.error('Error during shutdown', err);
            process.exit(1);
        }
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);