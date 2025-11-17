# Trabalho Aplicações Web - Gestão de Filmes e Séries

## Descrição

Este projeto consiste na criação de uma **API RESTful** desenvolvida em **NODEjs** com a utilização de **Express**, que permite fazer a gestão de filmes e séries, sistema de autenticação, criar uma biblioteca pessoal, deixar comentários e marcar os conteúdos como favoritos ou vistos.

O objetivo principal é aplicar os conhecimentos desenvolvidos ao longo da disciplina de **Aplicações Web** sob a orientação da **Professora Célia Soares**.
Estes conhecimentos são: 
    **- Validação de dados;**
    **- Autenticação JWT (JSON Web Token);**
    **- Segurança com bcrypt;**
    **- Persistência de dados através do PRISMA ORM e MySQL (em container via Docker);**

---

## Tecnologias utilizadas

- **Node.js + Express** → servidor e definição das rotas da API  
- **MySQL** → base de dados relacional para armazenar toda a informação  
- **Prisma ORM** → comunicação entre a API e a base de dados  
- **Docker** → execução da base de dados em container isolado  
- **JWT (JSON Web Token)** → autenticação e proteção das rotas privadas  
- **bcrypt** → encriptação e verificação de passwords  
- **zod** → validação dos dados de entrada enviados pelo utilizador  

---

### Arquitetura do Servidor

O servidor foi construído com **Node.js** e **Express**, que gere as rotas e processa pedidos HTTP.  
A arquitetura segue uma estrutura modular, dividida por áreas funcionais:

*   `/auth` → registo e autenticação de utilizadores
    
*   `/media` → gestão de filmes e séries
    
*   `/library` → biblioteca pessoal (favoritos, notas, calendário)
    
*   `/comments` → comentários dos utilizadores
    

As rotas estão protegidas por _middlewares_ responsáveis por validar tokens JWT, verificar passwords e assegurar a integridade dos dados.

* * *

### Fluxo de Funcionamento

1.  **Registo de utilizador**
    
    *   Validação dos dados com **Zod**
        
    *   Verificação se o email já existe (Prisma)
        
    *   Encriptação da password (**bcrypt**)
        
    *   Criação do utilizador e geração do token (**JWT**)
        
2.  **Login**
    
    *   Verificação de credenciais
        
    *   Geração e envio de um token JWT
        
3.  **Pedidos autenticados**
    
    *   O token JWT é incluído nos cabeçalhos (`Authorization: Bearer <token>`)
        
    *   O utilizador autenticado pode adicionar conteúdos à biblioteca, marcar como vistos, deixar notas e comentar filmes/séries.
        

Todos os dados são validados com **Zod** e guardados de forma segura via **Prisma** no **MySQL**.

* * *

### Base de Dados

A base de dados contém quatro tabelas principais:

| Tabela | Função | Relações | Tipo |
| --- | --- | --- | --- |
| User | Guarda dados dos utilizadores (login e perfil). | 1:N → UserMedia, 1:N → Comment | Principal |
| Media | Contém os dados dos filmes e séries (título, tipo, categoria, ano, imagem). | 1:N → UserMedia, 1:N → Comment | Principal |
| UserMedia | Liga o utilizador ao conteúdo, registando o estado pessoal (favorite, watched, notes, rating, calendarAt). | N:1 → User, N:1 → Media | Intermédia |
| Comment | Armazena comentários dos utilizadores sobre filmes e séries. | N:1 → User, N:1 → Media | Intermédia |

#### Explicação do Modelo Relacional

*   **User (Utilizadores)** – armazena informação de autenticação e perfil.  
    Cada utilizador pode ter vários filmes/séries e comentários.
    
*   **Media (Filmes e Séries)** – guarda os dados gerais de cada conteúdo e permite pesquisa e categorização.
    
*   **UserMedia (Biblioteca Pessoal)** – tabela intermédia que relaciona utilizadores com filmes/séries, guardando o estado de cada conteúdo (visto, favorito, notas, etc.).
    
*   **Comment (Comentários)** – gere a interação entre utilizadores através de comentários associados a um filme/série.
    

* * *

### Sistema de Autenticação JWT

O sistema de autenticação baseia-se em **JWT (JSON Web Token)**, garantindo que apenas utilizadores autenticados têm acesso às rotas privadas.

#### Principais Características

*   **Stateless:** o servidor não guarda sessões, toda a informação necessária é incluída no token.
    
*   **Compacto:** o token é pequeno e pode ser enviado via cabeçalho HTTP.
    
*   **Seguro:** o token é assinado digitalmente com uma chave secreta.
    

#### Fluxo de Autenticação

1.  O utilizador faz login → o servidor gera um token JWT.
    
2.  O cliente guarda o token e envia-o nos pedidos seguintes.
    
3.  O middleware **verifyToken** valida o token antes de permitir o acesso à rota.
    

* * *

### Sistema de Roles e Permissões

A API implementa também um sistema simples de permissões baseado em roles, atribuído durante o registo:

 * o primeiro utilizador criado na BD recebe automaticamente o papel de ADMIN;
 * Todos os utilizadores seguintes são registados com o papel MEMBER.

 Este sistema permite criar áreas restritas para administração e gestão.

### Rota exclusiva para ADMIN

`GET /api/v1/users`

* * *

### Middlewares

| Middleware | Função |
| --- | --- |
| verifyToken | Verifica se o pedido contém um token JWT válido. |
| bcrypt | Encripta e compara passwords de forma segura. |
| zod | Valida dados de entrada (body, params, etc.). |
| errorHandler | Captura e formata erros globais de forma consistente. |

* * *

### Instalação e Execução (com Docker)

Este projeto foi desenvolvido para ser executado integralmente em Docker, evitando configuração manuais na máquina do utilizador.

O sistema levanta automaticamente:

* um container MySQL;
* um container Nodejs/Express com o backend;
* rede docker partilhada;
* volumes persistentes para os dados.


#### 1. Clonar o repositório:

* `git clone https://github.com/Telmo1337/Aplica-es-Web---Projeto-Backend`

* `cd <nome da pasta>`

#### 2. Criar o ficheiro .env (ou usar .env.example)

* ` DATABASE_URL="mysql://root:root@mysql:3306/media_app"
  JWT_SECRET="super_secret_key"
  PORT=5050
  MYSQL_ROOT_PASSWORD=root
  MYSQL_DATABASE=media_app`

Este ficheiro é usado tanto pelo Prisma como pelo Docker compose.

#### 3. Subir toda a stack com o Docker

No terminal:
* `docker compose up -d`

O docker vai automaticamente:
    * criar o container MySQL;
    * criar o container do backend;
    * instalar dependências (npm install);
    * gerar o Prisma client (npx prisma generate);
    * arrancar o servidor com npm run dev

#### 4. Executar migrações (se necessário)

No terminal:
* `docker exec -it aw-backend npx prisma migrate dev --name init`

#### Lista de comandos principais de gestão:

\`docker compose up -d          # iniciar os serviços

docker compose down           # desligar containers

docker compose down -v        # desligar e apagar volumes (reset da BD)

docker exec -it aw-mysql sh   # entrar no container MySQL

docker exec -it aw-backend sh # entrar no container do backend \`


* * *

### Estrutura de Módulos

| Módulo | Estado | Descrição |
| --- | --- | --- |
| app.js | Verificado | Configuração principal do servidor Express e importação dos routers. |
| auth.routes.js | Verificado | Registo e login de utilizadores com JWT. |
| media.routes.js | Verificado | CRUD de filmes e séries. |
| library.routes.js | Verificado | Biblioteca pessoal do utilizador. |
| comments.routes.js | Verificado | Comentários sobre filmes e séries. |
| db/prisma.js | Verificado | Ligação ao MySQL através do Prisma. |
| utils/auth.js | Verificado | Funções de encriptação e geração de tokens. |
| middlewares/errorHandler.js | Verificado | Tratamento global de erros. |
| .env | Verificado | Configurações de ambiente (PORT, DB, JWT_SECRET, etc.). |

* * *

### Exemplos de Endpoints

#### Registar Utilizador

**POST** `/api/v1/auth/register`

`{ 
   "email": "telmo@ipvc.pt", 
   "firstName": "Telmo", 
   "lastName": "Regalado", 
   "nickName": "TR25", 
   "password": "teste1234" 
}`

#### Adicionar Filme/Série

**POST** `/api/v1/media`

`{   
   "title": "O Resgate do Soldado Ryan",   
   "type": "MOVIE",   
   "category": "Drama, Guerra",   
   "releaseYear": 1998,   
   "rating": 8.9,   
   "description": "Depois de chegar à Normandia...",   
   "image": "https://m.media-amazon.com/images/...jpg" 
}`

#### Adicionar à Biblioteca

**POST** `/api/v1/library/{{mediaId}}`

#### Atualizar Estado na Biblioteca

**PUT** `/api/v1/library/{{mediaId}}`

`{   "favorite": true,   "watched": true,   "rating": 9,   "notes": "Excelente série" }`

* * *

**© 2025 – Projeto académico desenvolvido para a unidade curricular Aplicações Web - Telmo Regalado e Tiago Silva**
