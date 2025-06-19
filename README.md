# ERP-sales

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
