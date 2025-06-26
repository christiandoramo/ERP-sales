# Stage 1: build dependencies
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm prisma generate --schema=shared/prisma-config/prisma/schema.prisma
RUN pnpm nx run-many --target=build --all

# Stage 2: production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production

# expose PORTs if needed for services
EXPOSE 3000 3001 3002

CMD pnpm run erp:migrate && \
    pnpm run erp:seed && \
    pnpm concurrently \
      "nx serve product-service" \
      "nx serve coupon-service" \
      "nx serve api-gateway"
