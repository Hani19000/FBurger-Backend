import express from 'express';
import cookieParser from 'cookie-parser';
import { helmetMiddleware, corsMiddleware, compressionMiddleware, generalLimiter } from './config/security.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware.js';
import router from './routes/index.js';
import * as Sentry from '@sentry/node';
import { getHealth } from './controllers/health.controller.js';
import { fileURLToPath } from 'url';
import path from 'path';
const app = express();

// Logique pour recréer __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Proxy pour Docker/Nginx
app.set('trust proxy', 1);

// Middlewares de base & Sécurité
app.use(loggerMiddleware);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(generalLimiter);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, 'public/images'), {
    setHeaders: (res) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Routes
app.get('/api/health', getHealth);
app.use('/api', router);

Sentry.setupExpressErrorHandler(app);

// Gestion des erreurs finale
app.use(notFoundHandler);
app.use(errorHandler);

export default app;