# Etapa 1: build
FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g nx

RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate --schema=shared/prisma-config/prisma/schema.prisma

RUN cd shared/prisma-config/prisma && npx prisma migrate dev && cd ../../

RUN ts-node shared/prisma-config/prisma/seed.ts

RUN nx run erp:seed

EXPOSE 8080

RUN nx run-many --target=serve --projects=api-gateway,coupon-service,product-service --parallel
