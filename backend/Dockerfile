FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g nx

RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

RUN pnpm install --frozen-lockfile

# Recebe a URL do banco via build-arg (Railway define via secrets)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN pnpm prisma generate --schema=shared/prisma-config/prisma/schema.prisma

RUN pnpm run erp:migrate-deploy
RUN pnpm run erp:seed

RUN pnpm add -D concurrently wait-on

EXPOSE 8080

CMD ["pnpm", "exec", "concurrently", \
  "--kill-others-on-fail", \
  "\"nx serve coupon-service\"", \
  "\"nx serve product-service\"", \
  "\"wait-on tcp:3015 tcp:3016 && nx serve api-gateway\""]
