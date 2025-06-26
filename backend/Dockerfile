# Etapa 1: build
FROM node:20

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

RUN pnpm install --frozen-lockfile

RUN pnpm nx build api-gateway && pnpm nx build product-service && pnpm nx build coupon-service

RUN pnpm prisma generate --schema=shared/prisma-config/prisma/schema.prisma

RUN pnpm prisma migrate deploy --schema=shared/prisma-config/prisma/schema.prisma && pnpm run erp:seed

EXPOSE 8080 3015 3016

CMD pnpm exec concurrently \
  "pnpm nx serve api-gateway" \
  "pnpm nx serve product-service" \
  "pnpm nx serve coupon-service"
