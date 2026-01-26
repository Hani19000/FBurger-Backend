import * as Sentry from '@sentry/node';
import { ENV } from './environment.js';

Sentry.init({
    dsn: ENV.sentry.dsn,
    environment: ENV.server.nodeEnv,
    tracesSampleRate: 1.0,
});