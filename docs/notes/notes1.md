## anotações

npm install -g nx

npx create-nx-workspace@latest project-name --preset=apps --pm=pnpm
cd project-name

pnpm add -D @nx/nest

nx generate @nx/nest:application gateway

nx generate @nx/nest:application auth

Todos os erviços devem estar assim no clean-architecture:
src/
├─ main.ts
├─ app.module.ts
├─ presentation/
│  └─ controllers/
├─ application/
│  ├─ use-cases/
│  └─ services/
├─ domain/
│  ├─ entities/
│  ├─ value-objects/
│  └─ events/
└─ infrastructure/
   ├─ prisma/
   └─ kafka/

projeto atual:
micromes$ tree
.
├── auth
│   ├── eslint.config.mjs
│   ├── jest.config.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── prisma
│   │   ├── migrations
│   │   │   ├── 20250614185100_database_started
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma
│   ├── project.json
│   ├── src
│   │   ├── app.module.ts
│   │   ├── assets
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── user.entity.ts
│   │   │   ├── repositories
│   │   │   │   └── user.repository.ts
│   │   │   └── use-cases
│   │   │       └── login.use-case.ts
│   │   ├── infrastructure
│   │   │   ├── kafka
│   │   │   │   └── kafka.module.ts
│   │   │   └── prisma
│   │   │       ├── generated
│   │   │       │   ├── client.d.ts
│   │   │       │   ├── client.js
│   │   │       │   ├── default.d.ts
│   │   │       │   ├── default.js
│   │   │       │   ├── edge.d.ts
│   │   │       │   ├── edge.js
│   │   │       │   ├── index-browser.js
│   │   │       │   ├── index.d.ts
│   │   │       │   ├── index.js
│   │   │       │   ├── libquery_engine-debian-openssl-3.0.x.so.node
│   │   │       │   ├── package.json
│   │   │       │   ├── pnpm-lock.yaml
│   │   │       │   ├── runtime
│   │   │       │   │   ├── edge-esm.js
│   │   │       │   │   ├── edge.js
│   │   │       │   │   ├── index-browser.d.ts
│   │   │       │   │   ├── index-browser.js
│   │   │       │   │   ├── library.d.ts
│   │   │       │   │   ├── library.js
│   │   │       │   │   ├── react-native.js
│   │   │       │   │   ├── wasm-compiler-edge.js
│   │   │       │   │   └── wasm-engine-edge.js
│   │   │       │   ├── schema.prisma
│   │   │       │   ├── wasm.d.ts
│   │   │       │   └── wasm.js
│   │   │       ├── prisma.module.ts
│   │   │       ├── prisma.service.ts
│   │   │       └── repositories
│   │   │           └── user.repository.ts
│   │   ├── main.ts
│   │   └── presentation
│   │       ├── controllers
│   │       │   └── auth.controller.ts
│   │       └── dtos
│   │           └── login.dto.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.spec.json
│   └── webpack.config.js
├── auth-e2e
│   ├── eslint.config.mjs
│   ├── jest.config.ts
│   ├── project.json
│   ├── src
│   │   ├── auth
│   │   │   └── auth.spec.ts
│   │   └── support
│   │       ├── global-setup.ts
│   │       ├── global-teardown.ts
│   │       └── test-setup.ts
│   ├── tsconfig.json
│   └── tsconfig.spec.json
├── docker-compose.yml
├── docs
│   └── notes.md
├── eslint.config.mjs
├── gateway
│   ├── eslint.config.mjs
│   ├── jest.config.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── project.json
│   ├── src
│   │   ├── app.module.ts
│   │   ├── assets
│   │   ├── infrastructure
│   │   │   └── kafka
│   │   │       └── kafka.module.ts
│   │   ├── main.ts
│   │   └── presentation
│   │       ├── controllers
│   │       │   └── auth.controller.ts
│   │       └── dtos
│   │           └── login.dto.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.spec.json
│   └── webpack.config.js
├── gateway-e2e
│   ├── eslint.config.mjs
│   ├── jest.config.ts
│   ├── project.json
│   ├── src
│   │   ├── gateway
│   │   │   └── gateway.spec.ts
│   │   └── support
│   │       ├── global-setup.ts
│   │       ├── global-teardown.ts
│   │       └── test-setup.ts
│   ├── tsconfig.json
│   └── tsconfig.spec.json
├── jest.config.ts
├── jest.preset.js
├── nx.json
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.base.json

37 directories, 89 files

---

pnpm add prisma @prisma/client

pnpm prisma init
mkdir -p auth/prisma
mv prisma/schema.prisma auth/prisma/
mv .env auth/.env - nao funcionou
rmdir prisma

pnpm prisma generate --schema=auth/prisma/schema.prisma

nest generate module kafka --project auth

pnpm install @nestjs/microservices@10.3.3 --prefix auth
pnpm install @nestjs/microservices@10.3.3 --prefix gateway

#### apaga tudo no docker

docker stop $(docker ps -aq) &&
docker rm $(docker ps -aq) &&
docker-compose down -v &&
docker volume prune -f &&
docker-compose up --build

#### para rodar após tudo instalado:

Subindo kafka
docker-compose -f docker-compose.dev.yml up ou docker-compose up

subindo consumidor/workers
nx run auth:serve → sobe como microservice Kafka

subindo api-gateway
nx serve gateway → HTTP em localhost:3000/api

agora testar (curl, postman, etc) na rota acima ^^^

cuidado com bugs em instalações com o NX

pnpm install -D @nx-tools/nx-prisma

pnpm run auth:migrate

docker stop $(docker ps -aq) - lembrar para parar os containers