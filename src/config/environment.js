import 'dotenv/config';

const requiredEnv = [
    'PORT',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'SENTRY_DSN',
];

const missingEnv = requiredEnv.filter((v) => !process.env[v]);

if (missingEnv.length > 0) {
    throw new Error(`Missing environment variables: ${missingEnv.join(', ')}`);
}

export const ENV = {
    server: {
        port: Number(process.env.PORT),
        nodeEnv: process.env.NODE_ENV
    },
    database: {
        postgres: {
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
        },
        mongo: { uri: process.env.MONGO_URI, }

    },
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_SECRET,
        accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY,
        refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
        refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY
    },
    bcrypt: {
        iterations: Number(process.env.BCRYPT_ITERATIONS)
    },
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),
        max: Number(process.env.RATE_LIMIT_MAX),
        authWindowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS),
        authMax: Number(process.env.RATE_LIMIT_AUTH_MAX),
        reviewWindowMs: Number(process.env.RATE_LIMIT_REVIEWS),
        reviewMax: Number(process.env.RATE_LIMIT_REVIEWS_MAX)
    },
    sentry: {
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE) || 1.0,
    },
};