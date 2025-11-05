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
| UserMedia | Liga o utilizador ao conteúdo, registando o estado pessoal (favorito, visto, notas, rating, calendário). | N:1 → User, N:1 → Media | Intermédia |
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

### Middlewares

| Middleware | Função |
| --- | --- |
| verifyToken | Verifica se o pedido contém um token JWT válido. |
| bcrypt | Encripta e compara passwords de forma segura. |
| zod | Valida dados de entrada (body, params, etc.). |
| errorHandler | Captura e formata erros globais de forma consistente. |

* * *

### Docker

O projeto utiliza **Docker** para criar e gerir o container do MySQL.  
O ficheiro `docker-compose.yml` define o serviço principal da base de dados.

#### Comandos principais:

*   `docker compose up -d` – inicia o container
    
*   `docker compose down` – remove o container
    
*   `docker exec -it aw-mysql mysql -uroot -proot media_app` – acede à base de dados
    

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

### Instalação e Execução

1.  **Clonar o repositório:**
    
    `git clone <url> cd projeto-backend`
    
2.  **Instalar dependências:**
    
    `npm install`
    
3.  **Criar o ficheiro .env:**
    
    `PORT=5050 DATABASE_URL="mysql://root:root@localhost:3307/media_app" JWT_SECRET="chave_super_secreta"`
    
4.  **Executar o Docker e as migrações:**
    
    `docker compose up -d npx prisma migrate dev --name init`
    
5.  **Iniciar o servidor:**
    
    `npm run dev`
    
    Servidor disponível em: [http://localhost:5050](http://localhost:5050)
    

* * *

### Exemplos de Endpoints

#### Registar Utilizador

**POST** `/api/v1/auth/register`

`{   "name": "Telmo",   "email": "telmo@ipvc.pt",   "password": "teste1234" }`

#### Adicionar Filme/Série

**POST** `/api/v1/media`

`{   "title": "O Resgate do Soldado Ryan",   "type": "MOVIE",   "category": "Drama, Guerra",   "releaseYear": 1998,   "rating": 8.9,   "description": "Depois de chegar à Normandia...",   "image": "https://m.media-amazon.com/images/...jpg" }`

#### Adicionar à Biblioteca

**POST** `/api/v1/library/{{mediaId}}`

#### Atualizar Estado na Biblioteca

**PUT** `/api/v1/library/{{mediaId}}`

`{   "favorite": true,   "watched": true,   "rating": 9,   "notes": "Excelente série" }`

* * *

**© 2025 – Projeto académico desenvolvido para a unidade curricular Aplicações Web - Telmo Regalado e Tiago Silva**
