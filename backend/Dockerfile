FROM node:20

WORKDIR /app

COPY . .

# Instala o Nx globalmente
RUN npm install -g nx

# Ativa e prepara o PNPM
RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

# Instala dependências com lockfile travado
RUN pnpm install --frozen-lockfile

# Gera o client do Prisma
RUN pnpm prisma generate --schema=shared/prisma-config/prisma/schema.prisma

# Roda migration e seed
RUN pnpm run erp:migrate-deploy
RUN pnpm run erp:seed

# Instala `wait-on` e `concurrently` para orquestrar boot sequencial
RUN pnpm add -D concurrently wait-on

# Exponha apenas a porta do API Gateway
EXPOSE 8080

# Comando para rodar os serviços de forma sequencial
CMD ["pnpm", "exec", "concurrently", \
  "--kill-others-on-fail", \
  "\"nx serve coupon-service\"", \
  "\"nx serve product-service\"", \
  "\"wait-on tcp:3015 tcp:3016 && nx serve api-gateway\""]
