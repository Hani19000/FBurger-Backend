# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# Stage 2: Production
FROM node:20-alpine
# Installation de curl pour le HEALTHCHECK
RUN apk add --no-cache curl

WORKDIR /app
# On récupère tout depuis le builder
COPY --from=builder /app /app

USER node


EXPOSE 3000 


HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD curl -f http://localhost:3000/api/health || exit 1


CMD ["node", "--import", "./src/config/instruments.js", "src/server.js"]