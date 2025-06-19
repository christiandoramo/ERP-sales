# ERP-sales

## Diagramas ERs

## Arquitetura: Clean Architecture

<div style="width: 100%; display: flex; justify-content: center; align-items: center">

<div style="width: 400px;">

![arquitetura](./docs/imgs/ca-diagram.png)

</div>

</div>

* Clean Architecture baseada nas versão de Steve "Ardalis" Smith
 * Domain: Entidades(com regras básicas), Interfaces de use cases e Repositórios - (fundamentos/core)
 * Application: Repositórios, Casos de uso - (implementação sem acoplamento externo) 
 * Infrastructure: Implementações reais com Banco, APIs, arquivos, Middlewares etc - (com acoplamento externo)
 * Presentation: DTOs/Validações com Clientes, Controllers - (adaptadores/portas para web)

* Monorepo, gerenciado com NX: libs e apps
 * apps: serviços reais
 * libs: código único e reaproveitável

* API-gateway como entrada e cliente do middleware de comunicação Kafka

* DDD do framework Clean Architecture de Ardalis
 * Domain, Application, Presentation, Infrastructure
 * https://github.com/ardalis/CleanArchitecture
 * Domain: entidades de negócio puras (sem dependências)
 * Application: casos de uso + interfaces (sem dependência da infraestrutura)
 * Infrastructure: implementações técnicas (banco, APIs, arquivos, Kafka etc.)
 * Web (ou Presentation/UI/API): camada de entrada (controladores, HTTP, SSR, GraphQL)

## Links Importantes

* Nx: https://nx.dev/getting-started/intro 
* Padrões de Commit: https://github.com/iuricode/padroes-de-commits.git 
* Nx + Nestjs + Prisma: https://github.com/nrwl/nx-recipes/tree/main/nestjs-prisma#nx--nestjs--prisma 

## 🧠 Backend

- **NestJS**: framework modular, com suporte nativo a TypeScript e ótima integração com arquitetura de microsserviços. Facilita a organização em camadas (DDD, Clean Architecture) e comunicação assíncrona com Kafka.
- **Kafka + Zookeeper**: permite comunicação desacoplada entre serviços, ideal para um sistema distribuído que precisa escalar módulos como descontos e cupons separadamente.
- **PostgreSQL**: banco de dados relacional robusto e amplamente utilizado, ideal para garantir integridade dos dados e facilitar joins entre entidades como produtos e cupons.
- **Prisma ORM**: fornece tipagem forte, velocidade de desenvolvimento e integração perfeita com NestJS + Postgres.
- **Redis**: usado como cache para otimizar buscas frequentes ou armazenar estados temporários.
- **Zod**: utilizado para validações de dados tanto na entrada de APIs quanto nas pipelines internas dos serviços NestJS.
- **Docker + docker-compose**: facilita o ambiente de desenvolvimento e testes integrados com Kafka, Redis, NGINX e banco de dados.
- **NGINX**: atua como proxy reverso, roteando requisições para frontend e API Gateway com controle eficiente de tráfego.
- **Nx Monorepo**: permite gerenciar todos os serviços (backend e frontend) com CI/CD unificado, build incremental e reutilização de código entre libs.

## 🎨 Frontend

- **Next.js**: framework moderno baseado em React, com SSR e SSG ideais para projetos que envolvem SEO, como catálogos de produto.
- **React Query + Axios**: juntos oferecem cache, sincronização e refetch automático de dados com controle total de requisições HTTP.
- **Zustand**: biblioteca leve e intuitiva para controle de estado local/global, ideal para projetos que não exigem complexidade como Redux.
- **React Hook Form + Zod**: integração direta para validações declarativas e performance superior em formulários.
- **Shadcn/UI + TailwindCSS**: proporcionam desenvolvimento rápido e responsivo com componentes acessíveis e estilização moderna e consistente.
