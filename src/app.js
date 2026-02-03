import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Sentry from '@sentry/node';

import {
    helmetMiddleware,
    corsMiddleware,
    compressionMiddleware,
    generalLimiter
} from './config/security.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware.js';
import router from './routes/index.js';
import { getHealth } from './controllers/health.controller.js';

const app = express();

/**
 * Configuration du contexte de fichier pour les modules ES
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration de la confiance envers le proxy (Docker/Nginx/Render)
 */
app.set('trust proxy', 1);

/**
 * Middlewares de sécurité et optimisation réseau
 */
app.use(loggerMiddleware);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(generalLimiter);

/**
 * Middlewares de parsing des requêtes
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Service de fichiers statiques pour les ressources locales
 * Configuration de la politique CORS pour l'accès inter-origines
 */
app.use('/images', express.static(path.join(__dirname, 'public/images'), {
    setHeaders: (res) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

/**
 * Définition des points d'entrée de l'API
 */
app.get('/api/health', getHealth);
app.use('/api', router);

/**
 * Intégration du gestionnaire d'erreurs Sentry
 */
Sentry.setupExpressErrorHandler(app);

/**
 * Gestion des routes non trouvées et centralisation des erreurs
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;