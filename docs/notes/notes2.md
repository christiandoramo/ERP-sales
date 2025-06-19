### Úteis
* NestJS SaaS Clean Architecture: https://github.com/VincentJouanne/nest-clean-architecture/tree/master
* CI/CD: https://github.com/aluiziodeveloper/nestjs-clean-arch/tree/main
* UI para containers: https://github.com/jesseduffield/lazydocker

### Anotações

* renovando volumes dos containeres
docker-compose down --volumes
docker image rm calculadora_nginx || true
docker volume prune -f

antes de rodar qualquer projeto individualmente:
docker-compose up -d kafka zookeeper

rodar tudo com docker-compose up --build

quando ficar preso a uma network - porque derrubou e bugou

docker volume rm $(docker volume ls -q) - apaga todos os volumes no docker ps -a

foi necessário criar um arquivo em uma pasta para o nginx com
mkdir -p ./nginx

cat << 'EOF' > ./nginx/nginx.conf
events {}

http {
    upstream frontend {
        server frontend:5173;
    }

    upstream api_gateway {
        server api-gateway:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location /api/ {
            proxy_pass http://api_gateway;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF


e colocar lá o nginx.conf porque apenas foi criado uma pasta no lugar do arquivo nginx.config no docker

bug safado do linux - não entende que é um arquivo e considera sempre uma pasta o nginx.conf
ao mesmo tempo que o docker faz a mesma coisa

rodar docker-compose mais simples (sem back e front apenas kafka) com: # rodar com: 
docker-compose -f docker-compose.dev.yml up