criando libs, ex: nx generate @nx/nest:lib libs/product-service.presentation
libs serão importadas nos apps (serviços) para colocar de fato para rodar

pnpm add prisma prisma @prisma/client
pnpm prisma init => mover para a pasta desejada
pnpm prisma generate --schema=libs/product-service.infrastructure/src/lib/database/prisma/schema.prisma
inserir configs para migrações facilitadas com nx
script
    "product-service:migrate": "cd libs/product-service.infrastructure/src/lib/database/prisma && npx prisma migrate dev"
isso ou puxar a pasta prisma para a raiz da lib

pnpm run product-service:migrate

para rodar tudo 
    docker compose up -d
    nx


 nx run-many --target=serve --projects=api-gateway,product-service --parallel

 ver erros de build: nx build product-service --verbose

 novo prisma compartilhada já que só tem 1 banco:

 pnpm prisma generate --schema=shared/prisma-config/prisma/schema.prisma

pnpm run erp:migrate

nx run-many --target=test --projects=api-product-service

// testar um lib
pnpm nx test product-service.lib --skip-nx-cache

-- criando agora COUPONS
nx generate @nx/nest:application apps/coupon-service
nx generate @nx/nest:lib libs/coupon-service.lib

nx run apps/coupon-service:serve
nx run apps/product-service:serve
nx run apps/api-gateway:serve