# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app

COPY . .

# Instala o pnpm globalmente
RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

# Instala dependências com pnpm
RUN pnpm install --frozen-lockfile

# Gera Prisma Client
RUN pnpm prisma generate --schema=shared/prisma-config/prisma/schema.prisma

# Faz build dos apps (NestJS)
RUN pnpm nx build api-gateway && pnpm nx build product-service && pnpm nx build coupon-service


# Etapa 2: produção
FROM node:20

WORKDIR /app

# Copia os artefatos da etapa de build
COPY --from=builder /app /app

# Expõe as portas dos microserviços
EXPOSE 8080 3015 3016

# Roda as migrations e seed antes de iniciar
RUN pnpm prisma migrate deploy --schema=shared/prisma-config/prisma/schema.prisma && pnpm run erp:seed

# Inicializa os serviços em paralelo
CMD pnpm exec concurrently \
  "pnpm nx serve api-gateway" \
  "pnpm nx serve product-service" \
  "pnpm nx serve coupon-service"
