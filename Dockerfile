FROM node:20-slim

# Instalar OpenSSL E cliente MySQL
RUN apt-get update -y && \
    apt-get install -y openssl default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5050

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
