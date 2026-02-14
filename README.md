# Scoops API - Plataforma de Gestão de Entregas

![Net](https://img.shields.io/badge/.NET%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![SqlServer](https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)

Este repositório contém a solução do desafio técnico para a vaga **Full Stack .NET**. O projeto consiste em um MVP (Minimum Viable Product) de uma arquitetura de microsserviços para gerenciar autenticação, fornecedores e entregas de estoque. O tema foi inspirado em uma ideia de e-commerce para um pequeno empreendimento em que eu e minha namorada trabalhamos.

## Arquitetura e Decisões Técnicas

O sistema foi desenvolvido seguindo os princípios da **Clean Architecture** e **Microsserviços**, garantindo separação de responsabilidades, testabilidade e escalabilidade.

### Diagrama da Solução

```mermaid
graph TD
    User[Usuário / Navegador] -->|Acessa| Frontend[Frontend React :3000]
    Frontend -->|Login/Register| AuthAPI[Scoops.Auth.API :5001]
    Frontend -->|Gestão de Entregas| MgmtAPI[Scoops.Management.API :5000]

    AuthAPI -->|Lê/Escreve| DB[(SQL Server :1433)]
    MgmtAPI -->|Lê/Escreve| DB
```

### Componentes

- Scoops.Auth.API: Microsserviço responsável pelo cadastro de usuários e emissão de tokens JWT.

- Scoops.Management.API: Microsserviço responsável pelo cadastro de Fornecedores, Produtos e Registro de Entregas.

- Scoops Web: Frontend desenvolvido em React para interação com as APIs.

- SQL Server: Banco de dados relacional containerizado.

### Tecnologias Utilizadas

Backend: .NET 8, C#, ASP.NET Core Web API

Design Patterns: Clean Architecture, Repository Pattern, Dependency Injection

ORM: Entity Framework Core (Code First)

Banco de Dados: SQL Server 2022 (Docker)

Autenticação: JWT (JSON Web Token) + BCrypt (Hash de Senha)

Frontend: React.js, Axios, TailwindCSS, Framer Motion

Infraestrutura: Docker & Docker Compose

Documentação: Swagger (OpenAPI)

## Segurança e Configuração

    Para garantir a segurança e seguir as boas práticas do 12-Factor App, segredos como Connection Strings e Chaves JWT foram removidos do código fonte (appsettings.json) e são injetados via Variáveis de Ambiente no Docker.

    Nota para o Avaliador:
    Em um ambiente de produção real, o arquivo .env contendo as credenciais jamais seria versionado no Git (estaria no .gitignore).

    No entanto, para facilitar a execução deste teste técnico, mantive o arquivo .env no repositório. Basta clonar e rodar, sem necessidade de configuração manual de chaves.

## Como Rodar o Projeto

A maneira mais fácil e recomendada de rodar o projeto é utilizando o **Docker Compose**.

Pré-requisitos

- Docker Desktop instalado e rodando.

- .NET SDK 8.0 (necessário apenas para rodar as migrations do banco).

## Passo a passo para rodar

1. Clonar o repositório:

```bash
git clone https://github.com/luiz-eduardo-ramirez/Scoops-API
```

2. Rodar o Docker Compose:

```bash
docker compose up --build -d
```

3. Aguarde a inicialização:

O SQL Server pode levar de 10 a 30 segundos para estar pronto na primeira execução. Verifique o status com docker ps ou docker logs scoops-sql-server.

## Configuração de Segurança

1. Verifique se o arquivo .env existe na raiz (foi criado com base no .env.example).

2. Execute docker compose up --build.

## Endpoints e Acesso

Após subir os containers, os serviços estarão disponíveis nas seguintes URLs:

```bash
Serviço	    URL	                                    Descrição
Frontend	http://localhost:3000	                Interface do Usuário
Auth        http://localhost:5001/swagger	        Documentação da API de Autenticação
Management  http://localhost:5050/swagger	        Documentação da API de Gestão
```

## Como Testar o Fluxo (MVP)

1. Acessar o Frontend em http://localhost:3000

2. Login com um usuário cadastrado admin@scoopsamanda.com | password

3. Acesso completo ao Frontend

### Estrutura do Projeto

```bash
ScoopsProject/
├── Scoops.Auth.API/          # Microsserviço de Autenticação
│   ├── Controllers/          # Endpoints da API (Camada de Apresentação)
│   ├── Domain/               # Entidades (User) e Regras de Negócio
│   ├── Infrastructure/       # DbContext e Configurações de Banco
│   └── Application/          # DTOs (Data Transfer Objects)
│
├── Scoops.Management.API/    # Microsserviço de Gestão
│   ├── Controllers/          # Endpoints (Deliveries, Products, Suppliers)
│   ├── Domain/               # Entidades (Supplier, Product, Delivery)
│   └── Infrastructure/       # DbContext e Migrations
│
├── scoops-web/               # Frontend React
│   ├── src/                  # Código fonte React
│   └── Dockerfile            # Configuração de Build e Nginx
│
├── docker-compose.yml        # Orquestração dos containers
└── README.md                 # Documentação do Projeto
```

## Autor

Desenvolvido por Luiz Eduardo.
