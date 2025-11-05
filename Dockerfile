# Usa a imagem oficial do Node
FROM node:20-slim

# Atualiza pacotes e instala o OpenSSL (necessário para o Prisma)
RUN set -eux; \
    apt-get update; \
    apt-get upgrade -y; \
    apt-get install -y openssl; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os ficheiros de dependências (para aproveitar cache Docker)
COPY package*.json ./

# Instala dependências do projeto
RUN npm install

# Instala o nodemon globalmente (para ambiente de desenvolvimento)
RUN npm install -g nodemon

# Copia o resto do código do projeto
COPY . .

# Gera o cliente Prisma dentro do container
RUN npx prisma generate

# Expõe a porta definida no .env (para documentação)
EXPOSE 5050

# Define o comando padrão (com nodemon)
CMD ["npm", "run", "dev"]
