# TaskManager

> **Teste técnico para a Empresa Domingues e Pinho Contadores** · Desenvolvido por **Michel Victor**
> Vaga: Desenvolvedor Fullstack (.NET / C# + React)
> **Acesso online:** https://testedpc.michelvvs.com/
> **Uso de IA:** os **testes** e a **documentação** foram desenvolvidos com apoio de IA (Claude). Detalhes na [seção 9](#9-como-foi-feito-dificuldades-e-facilidades).

Aplicação web de gerenciamento de tarefas, com API REST em .NET/C#, autenticação JWT e interface em React.

---

## 1. Visão geral

O TaskManager permite que cada pessoa organize as próprias tarefas: criar, editar, excluir e
acompanhar o andamento de cada uma por meio de três status (**Pendente**, **Em andamento** e
**Concluída**). Cada usuário enxerga **apenas a sua lista**.

**Funcionalidades**

- Cadastro e login de usuários, com sessão por token JWT
- Lista de tarefas **individual por usuário** (isolamento garantido no servidor)
- CRUD completo de tarefas (título, descrição, prioridade e prazo)
- Controle de status por botões de ação em cada linha (iniciar, concluir e desfazer)
- Cor da linha conforme o status e título riscado nas tarefas concluídas
- Busca por texto, filtros por status e prioridade, e paginação
- Indicação visual de tarefas atrasadas
- Persistência em banco de dados (SQLite) com migrations
- Documentação interativa da API (Swagger / OpenAPI), com suporte ao token Bearer
- Tratamento padronizado de erros (ProblemDetails) refletido em mensagens na interface
- Testes automatizados no backend e no frontend, executados antes de cada commit (Husky)
- Execução completa com **um comando** via Docker Compose (API + frontend + banco persistente)
- Interface moderna com a **identidade visual da DPC** (paleta extraída da logo e do site), tipografia
  Hanken Grotesk, cantos arredondados, sombras suaves, alertas com ícone e modais com desfoque
- Totalizadores coloridos com ícones translúcidos ao fundo e percentual sobre o total
- Rodapé enxuto, em uma linha, com os dados do projeto e do autor
- CI/CD: a cada push na `main`, o GitHub Actions roda os testes e, se passarem, atualiza a VPS

---

## 2. Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Backend | .NET 10, ASP.NET Core Web API, C# |
| Persistência | Entity Framework Core + SQLite (migrations) |
| Autenticação | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`), BCrypt (`BCrypt.Net-Next`) |
| Documentação da API | Swagger / OpenAPI (Swashbuckle) |
| Frontend | React 19, TypeScript, Vite |
| Estilo | Tailwind CSS v4 (tokens de tema no `@theme`) |
| Tipografia | Hanken Grotesk (Fontsource, auto-hospedada) |
| Ícones | lucide-react |
| Cliente HTTP | Axios |
| Testes (backend) | xUnit, `WebApplicationFactory`, SQLite em memória |
| Testes (frontend) | Vitest, Testing Library, jsdom |
| Qualidade | ESLint, `tsc`, Husky (hook de pre-commit) |
| Infraestrutura | Docker (build multi-stage), Docker Compose, nginx (servindo o frontend) |

---

## 3. Como executar

### Acesso online

| O quê | Endereço |
|---|---|
| Aplicação | https://testedpc.michelvvs.com/ |
| Documentação da API (Swagger) | https://testedpc.michelvvs.com/swagger |

Basta abrir o endereço, clicar em **Cadastre-se** e criar uma conta; cada conta tem a sua própria
lista de tarefas.

### Executar na sua máquina

Há duas formas: **com Docker** (mais simples, não exige instalar .NET nem Node) ou **localmente**.

**Clonar o repositório (vale para as duas)**

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_REPOSITORIO>
```

### Opção A: Docker (recomendado)

**Pré-requisito:** Docker Desktop (ou Docker Engine + Compose) em execução.

**1. Criar o arquivo de variáveis** (na raiz do repositório)

```bash
cp .env.example .env
```

O `.env` define a chave de assinatura do JWT (`JWT_KEY`, mínimo de 32 caracteres). O valor de
exemplo serve para uso local; troque-o em qualquer outro ambiente. O arquivo `.env` não é
versionado.

**2. Subir tudo**

```bash
docker compose up --build
```

Na primeira vez o Docker baixa as imagens base e compila API e frontend (alguns minutos).

**3. Acessar**

| O quê | URL |
|---|---|
| Aplicação (frontend) | http://localhost:3000 |
| API / Swagger | http://localhost:5080/swagger |

**4. Parar**

```bash
docker compose down        # para os contêineres e mantém os dados
docker compose down -v     # para e apaga também o banco (volume)
```

**O que o Compose sobe**

| Serviço | Imagem | Porta (host → contêiner) | Observações |
|---|---|---|---|
| `api` | `dotnet/aspnet:10.0` (build com `dotnet/sdk:10.0`) | 5080 → 8080 | Executa como usuário não-root; aplica as migrations ao iniciar |
| `web` | `nginx:alpine` (build com `node:22-alpine`) | 3000 → 80 | Serve o build estático do React; a URL da API é embutida no build |
| volume `db-data` | — | — | Guarda `taskmanager.db`; os dados persistem entre execuções |

### Opção B: execução local (sem Docker)

**Pré-requisitos**

| Ferramenta | Versão | Verificar |
|---|---|---|
| .NET SDK | 10.x | `dotnet --version` |
| Node.js | 20.19+ ou 22.12+ | `node -v` |
| npm | 10+ | `npm -v` |
| Git | qualquer recente | `git --version` |

**Passo a passo**

**1. Subir a API** (terminal 1)

```bash
cd backend/TaskManager.Api
dotnet run --launch-profile http
```

- A API fica em **http://localhost:5080**
- A documentação Swagger abre em **http://localhost:5080/swagger**
- O banco SQLite (`taskmanager.db`) é **criado e migrado automaticamente** na primeira execução;
  não há nenhum comando de banco a executar.
- Em desenvolvimento, a chave de assinatura do JWT já vem em `appsettings.Development.json`;
  não é preciso configurar nada para rodar localmente.

**2. Subir o frontend** (terminal 2)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- A aplicação abre em **http://localhost:5173**

### Usando a aplicação

1. Acesse a aplicação (http://localhost:3000 no Docker, ou http://localhost:5173 localmente) e
   clique em **Cadastre-se** para criar uma conta (nome, e-mail e senha com no mínimo 8
   caracteres). Você entra logado automaticamente.
2. Crie tarefas em **Nova tarefa** e use os botões de cada linha para iniciar, concluir ou desfazer.
3. Use **Sair** e entre com outra conta para ver que cada usuário tem a sua própria lista.

### Configuração

| Onde | Chave | Padrão | Para quê |
|---|---|---|---|
| `backend/TaskManager.Api/appsettings.json` | `ConnectionStrings:Default` | `Data Source=taskmanager.db` | Arquivo do banco SQLite |
| `backend/TaskManager.Api/appsettings.json` | `Cors:Origins` | `http://localhost:5173` | Origens do frontend autorizadas |
| `backend/TaskManager.Api/appsettings.json` | `Jwt:Issuer` / `Jwt:Audience` | `TaskManager` / `TaskManagerWeb` | Emissor e público do token |
| `backend/TaskManager.Api/appsettings.json` | `Jwt:ExpiresMinutes` | `120` | Validade do token, em minutos |
| `backend/TaskManager.Api/appsettings.Development.json` | `Jwt:Key` | chave de desenvolvimento | Chave de assinatura (mín. 32 caracteres) |
| `frontend/.env` | `VITE_API_URL` | `http://localhost:5080` | URL base da API (execução local) |
| `.env` (raiz) | `JWT_KEY` | valor de exemplo em `.env.example` | Chave do JWT usada pelo Docker Compose (mín. 32 caracteres) |
| `docker-compose.yml` | `args.VITE_API_URL` | `http://localhost:5080` | URL da API embutida no build do frontend (Docker) |

Qualquer valor do backend pode ser sobrescrito por variável de ambiente (ex.:
`ConnectionStrings__Default`, `Cors__Origins__0`, `Jwt__Key`). É assim que o Docker Compose
configura a API.

> **Segurança:** a chave de `appsettings.Development.json` existe só para facilitar a execução
> local. Em qualquer outro ambiente, defina `Jwt__Key` por variável de ambiente ou cofre de
> segredos. A aplicação **não inicia** se a chave tiver menos de 32 caracteres.

### Comandos úteis

```bash
# backend
dotnet build                                   # compilar
dotnet watch run --launch-profile http         # executar recarregando ao salvar
dotnet ef migrations add NomeDaMigration       # nova migration (após alterar o modelo)

# frontend
npm run build                                  # checagem de tipos + build de produção
npm run lint                                   # análise estática
```

### Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Erro de CORS no navegador | Frontend em origem diferente da configurada | Ajustar `Cors:Origins` e reiniciar a API |
| `ERR_CONNECTION_REFUSED` no frontend | API parada ou `VITE_API_URL` incorreta | Subir a API e conferir o `.env` (reiniciar o `npm run dev` após editar) |
| Sessão volta para a tela de login | Token expirou (2 h) ou foi rejeitado (401) | Entrar novamente |
| API não inicia: `Jwt:Key deve ter ao menos 32 caracteres` | Ambiente sem a chave configurada | Definir `Jwt__Key` (ou usar o ambiente Development) |
| Vite reclama da versão do Node | Node abaixo de 20.19 | Atualizar o Node |
| Porta 5080 em uso | Outro processo ocupando a porta | Encerrar o processo ou alterar `applicationUrl` em `Properties/launchSettings.json` (e `VITE_API_URL`) |
| Quer recomeçar com banco limpo (local) | — | Apagar `backend/TaskManager.Api/taskmanager.db*` e subir a API de novo |
| Quer recomeçar com banco limpo (Docker) | — | `docker compose down -v` e `docker compose up --build` |
| Docker: `required variable JWT_KEY is missing` | Arquivo `.env` ausente na raiz | `cp .env.example .env` (na mesma pasta do `docker-compose.yml`) |
| Docker: a API reinicia em loop | `JWT_KEY` com menos de 32 caracteres | Aumentar a chave no `.env` e `docker compose up -d` |
| Docker: erro de CORS | Acesso por `127.0.0.1:3000` (origem diferente da configurada) | Usar `http://localhost:3000` |
| Docker: front chama a URL errada da API | `VITE_API_URL` é fixada no **build** | Ajustar o `args` do compose e rodar `docker compose build --no-cache web` |
| Docker: `port is already allocated` | Servidores locais usando 5080/3000 | Encerrar a API/`npm run dev` locais |

### Deploy em VPS (como está publicado)

A aplicação roda em uma VPS (Hostinger) com Docker Compose. O acesso público passa por um proxy
reverso (Caddy), que entrega o frontend em `/` e encaminha `/api` e `/swagger` para a API, na
**mesma origem** (sem CORS) e com HTTPS automático para o domínio.

| Arquivo | Papel |
|---|---|
| `docker-compose.prod.yml` | Serviços `api`, `web` e `proxy` (o `proxy` próprio é opcional: perfil `standalone-proxy`) |
| `docker-compose.edge.yml` | Conecta `api` e `web` à rede de um proxy reverso **já existente** na VPS (`EDGE_NETWORK`), com *aliases* únicos |
| `Caddyfile` | Roteamento do proxy: `/api/*` e `/swagger*` → API; o restante → frontend |
| `.env.prod.example` | Modelo das variáveis de produção |

Variáveis do `.env` de produção (não versionado):

| Variável | Para quê |
|---|---|
| `PUBLIC_URL` | URL pública, sem barra final (ex.: `https://testedpc.michelvvs.com`); entra no build do frontend e no CORS |
| `JWT_KEY` | Chave do JWT (mín. 32 caracteres), gerada no servidor, nunca versionada |
| `SITE_ADDRESS` | Domínio (HTTPS automático) ou `:80`, usado só pelo proxy próprio |
| `EDGE_NETWORK` | Rede do proxy existente (ao usar `docker-compose.edge.yml`) |
| `PROXY_HTTP_PORT` / `PROXY_HTTPS_PORT` | Portas do proxy próprio quando 80/443 já estão ocupadas |

#### Deploy automatizado (GitHub Actions)

O workflow `.github/workflows/deploy.yml` roda a cada push na `main`:

```
push na main ──► backend (dotnet test) ─┐
                                        ├──► deploy na VPS (SSH) ──► scripts/deploy.sh
                 frontend (tsc, lint,  ─┘
                 vitest, build)
```

- Em *pull requests* roda apenas a verificação (testes), sem deploy.
- O deploy só acontece se **backend e frontend** passarem.
- Deploys não se sobrepõem (`concurrency`), e o token do workflow só tem `contents: read`.
- Na VPS, `scripts/deploy.sh` valida o compose, reconstrói os serviços, confere se a API ficou
  **estável** (mesmo `StartedAt` em duas leituras) e, se não ficar, imprime o log e falha.
  O modo é escolhido pelo `.env`: com `EDGE_NETWORK` usa o proxy compartilhado; sem ele, o proxy próprio.

**Segredos do repositório** (*Settings → Secrets and variables → Actions*):

| Segredo | Conteúdo |
|---|---|
| `VPS_HOST` | IP ou nome do servidor |
| `VPS_USER` | Usuário do SSH (`root`, no caso atual) |
| `VPS_SSH_KEY` | Chave **privada** exclusiva do CI (par `ed25519` sem passphrase) |
| `VPS_KNOWN_HOSTS` | Linha da chave pública do host, para o SSH rejeitar um servidor falso |

**Segurança do acesso:** a chave pública do CI está no `authorized_keys` da VPS com um comando
**forçado** e sem terminal, sem *port forwarding* e sem *agent forwarding*:

```
command="cd /root/taskmanager && git fetch --quiet origin main && git reset --quiet --hard origin/main && exec bash scripts/deploy.sh",no-pty,no-port-forwarding,no-X11-forwarding,no-agent-forwarding ssh-ed25519 <chave> github-actions:taskmanager-deploy
```

Ou seja, mesmo que a chave vaze, ela só consegue executar o deploy da `main`, não abrir um shell.
Para revogar, basta remover essa linha do `authorized_keys`.

Execução manual (se o CI estiver indisponível), na VPS:

```bash
cd ~/taskmanager && git pull && bash scripts/deploy.sh
```

---

## 4. Testes

### Executar tudo

```bash
npm install        # na raiz, uma vez por clone: instala o Husky e ativa o hook de pre-commit
npm test           # backend (dotnet test) + frontend (typecheck + vitest + lint)
```

Ou cada parte isolada:

```bash
npm run test:backend        # dotnet test backend
npm run test:frontend       # tsc + vitest + eslint
```

### O que é coberto

| Camada | Tipo | Cobertura |
|---|---|---|
| Backend | Unitário (`TaskService`) | Criação como `Pending` e dono da tarefa, regra de prazo no passado (422), `CompletedAt` ao concluir/reabrir, 404, **isolamento entre usuários** (leitura e exclusão), filtros, busca, paginação e resumo por usuário |
| Backend | Unitário (`AuthService`) | Senha armazenada como hash BCrypt, e-mail normalizado, e-mail duplicado (409), senha errada e e-mail inexistente com a **mesma** resposta (401), login válido |
| Backend | Integração (`WebApplicationFactory`) | API completa em memória: 401 sem token, login inválido, criação (201 + `Location`), validação (400), mudança de status e **isolamento entre usuários** (404) |
| Frontend | Unitário | Mapa de ações por status, tradução de erros da API em mensagens |
| Frontend | Componente | `TaskTable`: ações por status, status concluído riscado, botões bloqueados durante requisição, editar/excluir |
| Frontend | Componente | `Footer`: dados do projeto e do autor, links corretos e links externos sem expor o `opener` |

**Estratégia:** os testes do serviço usam **SQLite em memória** (um banco real, com constraints e
SQL de verdade) e um `ICurrentUser` falso; a integração cobre o caminho completo (rota,
serialização, `[Authorize]`, tratamento de erros). Os testes do frontend consultam elementos por
papel e nome acessível, o que também valida a acessibilidade dos botões só com ícone.

### Verificação automática antes de cada commit (Husky)

O hook `pre-commit` (`.husky/pre-commit`) roda **apenas o que mudou**:

- arquivos em `backend/` → `dotnet test`
- arquivos em `frontend/` → typecheck, testes e lint

Se algum teste falhar, o commit é bloqueado. A configuração é ativada por `npm install` na raiz.

> O hook é uma rede de segurança local (`git commit --no-verify` o ignora). A garantia definitiva
> seria rodar os mesmos comandos em um pipeline de CI a cada push.

---

## 5. API

Base URL local: `http://localhost:5080` · Produção: `https://testedpc.michelvvs.com` ·
Documentação interativa: `/swagger`

### Autenticação

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| POST | `/api/auth/register` | Cria a conta e já devolve o token | 201, 400, 409 |
| POST | `/api/auth/login` | Autentica e devolve o token | 200, 400, 401 |

Resposta de sucesso (`register` e `login`):

```json
{
  "token": "<jwt>",
  "expiresAt": "2026-10-13T17:44:39Z",
  "user": { "id": 1, "name": "Michel", "email": "michel@exemplo.com" }
}
```

Todas as rotas de `/api/tasks` exigem o cabeçalho `Authorization: Bearer <token>`.
Sem ele, a API responde **401**. No Swagger, use o botão **Authorize** e cole o token.

### Tarefas (requer autenticação)

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/api/tasks` | Lista paginada **do usuário logado**. Query: `search`, `status`, `priority`, `page`, `pageSize` | 200, 401 |
| GET | `/api/tasks/summary` | Contagem de tarefas por status | 200, 401 |
| GET | `/api/tasks/{id}` | Detalhe de uma tarefa | 200, 401, 404 |
| POST | `/api/tasks` | Cria (status inicial: `Pending`) | 201, 400, 401, 422 |
| PUT | `/api/tasks/{id}` | Atualiza os campos editáveis | 200, 400, 401, 404, 422 |
| PATCH | `/api/tasks/{id}/status` | Altera somente o status | 200, 400, 401, 404 |
| DELETE | `/api/tasks/{id}` | Remove | 204, 401, 404 |

A tarefa de **outro usuário** responde **404** (e não 403), para não revelar que o id existe.

**Valores aceitos**

- `status`: `Pending`, `InProgress`, `Done`
- `priority`: `Low`, `Medium`, `High`

**Exemplo**

```bash
# 1) criar conta (ou usar /api/auth/login)
curl -s -X POST http://localhost:5080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Michel","email":"michel@exemplo.com","password":"Senha@1234"}'

# 2) usar o token retornado
curl -s -X POST http://localhost:5080/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Preparar apresentação","priority":"High","dueDate":"2026-12-01"}'
```

**Formato de erro** (ProblemDetails, RFC 9457)

```json
{
  "status": 404,
  "title": "Recurso não encontrado",
  "detail": "Tarefa 99 não encontrada.",
  "instance": "/api/tasks/99"
}
```

| Status | Quando |
|---|---|
| 400 | Entrada inválida (validação) |
| 401 | Sem token, token inválido/expirado ou credenciais incorretas |
| 404 | Tarefa inexistente (ou pertencente a outro usuário) |
| 409 | E-mail já cadastrado |
| 422 | Regra de negócio violada (ex.: prazo no passado ao criar) |
| 500 | Erro inesperado (sem vazar detalhes internos) |

---

## 6. Estrutura do projeto

```
.
├── docker-compose.yml      # sobe API + frontend + volume do banco (uso local)
├── docker-compose.prod.yml # produção: api + web (+ proxy opcional)
├── docker-compose.edge.yml # liga api/web a um proxy reverso já existente
├── Caddyfile               # roteamento do proxy de produção
├── .github/workflows/deploy.yml  # CI (testes) e deploy automático na VPS
├── scripts/deploy.sh       # atualiza os serviços na VPS e verifica a API
├── .env.example            # modelo das variáveis do Compose (JWT_KEY)
├── .env.prod.example       # modelo das variáveis de produção
├── package.json            # scripts de teste e Husky (somente tooling)
├── .husky/pre-commit       # roda os testes da parte alterada
├── backend/
│   ├── Dockerfile          # imagem da API (multi-stage, usuário não-root)
│   ├── TaskManager.slnx
│   ├── TaskManager.Api/
│   │   ├── Controllers/    # endpoints HTTP (finos): Auth e Tasks
│   │   ├── Services/       # regras de negócio, autenticação e token
│   │   ├── Dtos/           # contratos de entrada e saída
│   │   ├── Models/         # entidades (User, TaskItem) e enums
│   │   ├── Data/           # DbContext (mapeamento EF Core)
│   │   ├── Exceptions/     # exceções de domínio
│   │   ├── Middleware/     # tratamento global de erros
│   │   ├── Migrations/     # histórico do esquema do banco
│   │   └── Program.cs      # composição da aplicação
│   └── TaskManager.Tests/  # testes unitários e de integração (xUnit)
└── frontend/
    ├── Dockerfile          # imagem do frontend (build com Node, servida por nginx)
    └── src/
        ├── api/            # cliente HTTP (com interceptors de token/401) e chamadas à API
        ├── auth/           # contexto, provider, hook e armazenamento da sessão
        ├── components/     # componentes de interface (AuthPage, Alert, Modal, Footer...)
        ├── hooks/          # lógica reutilizável (useTasks, useDebounce)
        ├── types/          # tipos que espelham os DTOs
        ├── constants.ts    # rótulos, estilos e ações por status
        ├── projectInfo.ts  # dados do projeto e do autor (usados no rodapé)
        ├── ui.ts           # botões, campos e badges reutilizáveis (Tailwind)
        └── index.css       # tokens de tema: cores da marca, raios, sombras, fonte
```

---

## 7. Identidade visual e interface

A interface usa as cores da **Domingues e Pinho Contadores**, extraídas diretamente do
[site da empresa](https://www.dpc.com.br/) e da logo, e centralizadas como *design tokens* em
`frontend/src/index.css` (Tailwind `@theme`). Trocar a identidade visual é editar um único arquivo.

### Paleta

| Papel | Cor | Origem | Token / uso |
|---|---|---|---|
| Azul da marca | `#0a488c` | **Logo** (cor única, 100% dos pixels opacos) | `brand-600`: botões primários, ícone do cabeçalho, links |
| Azul da marca (hover) | `#083a73` | Derivado do azul da marca | `brand-700` |
| Azul de destaque | `#0095eb` | Site: cor de tema, a mais frequente | `accent-500`: gradiente do cartão "Em andamento", detalhes |
| Azul de link | `#0089f7` | Site: links e estado ativo | `accent-600` |
| Azul profundo | `#0e2941` | Site: fundos escuros | `navy-900`: títulos, fundo do desfoque do modal |
| Texto | `#161922` | Site: texto escuro | `base-content` |
| Superfícies | `#ffffff` · `#f4f6fb` · `#e3e8f2` | Aproximação dos cinzas do site (`#f8f8f8`, `#f2f2f2`, `#e1e1e1`), com leve tom azulado | `base-100` · `base-200` · `base-300` |

As cores de **status** (âmbar, azul, verde) e de **prioridade** (cinza, âmbar, vermelho) são
funcionais, não de marca, e seguem convenções de semáforo para leitura rápida.

### Linguagem visual

| Elemento | Tratamento |
|---|---|
| Tipografia | Hanken Grotesk (variável, auto-hospedada via Fontsource: sem chamadas a terceiros) |
| Formas | Tokens `rounded-box` (1rem), `rounded-field` (0.625rem) e `rounded-selector` (pílula) |
| Profundidade | Sombras suaves (`shadow-soft`), sombra de botão com realce interno (`shadow-btn`) e de sobreposição (`shadow-pop`) |
| Botões | Variantes `primary`, `ghost`, `outline`, `danger`, `success`, `info` e tamanhos `md`, `sm`, `icon` (função `btn()` em `ui.ts`) |
| Alertas e toasts | Componente `Alert` com ícone e tom (`error`/`success`), com `role` adequado para leitores de tela |
| Modal | Desfoque de fundo, animação de entrada (respeita `prefers-reduced-motion`), fecha com Esc e clique fora |
| Totalizadores | Cartões com gradiente, ícone translúcido ao fundo e percentual do total |
| Tabela | Cabeçalho discreto, linha colorida por status, *badges* de prioridade em pílula |
| Rodapé | Uma linha: projeto, autor e links (repositório, API, GitHub, site); dados em `src/projectInfo.ts` |

### Bibliotecas de UI avaliadas

Foram avaliados pacotes prontos que oferecem uma aparência moderna. A decisão foi **não adicionar
nova dependência** e reproduzir a linguagem visual com tokens próprios, mantendo o estilo
totalmente controlado e os testes inalterados.

| Opção | Resultado da avaliação |
|---|---|
| daisyUI 5 | Boa opção (plugin do Tailwind, classes semânticas); descartada por exigir migrar todos os componentes e sobrepor o tema da marca |
| HeroUI v3 | Compatível com a stack (React 19, Tailwind 4); migração ampla (React Aria, API diferente de `onClick`/`disabled`) |
| shadcn/ui | Suporta Tailwind v4 e React 19; componentes copiados para o projeto e visual neutro; exigiria configuração de aliases e novas dependências |
| FlyonUI | Semelhante ao daisyUI; partes interativas dependem de JavaScript próprio, pouco natural em React |
| Mantine / Flowbite | Visual próximo de MUI / Bootstrap, justamente o que se queria evitar |

---

## 8. Decisões técnicas relevantes

| Decisão | Motivo |
|---|---|
| **SQLite + EF Core (migrations)** | Execução sem instalar servidor de banco. Trocar de provider (PostgreSQL, SQL Server) exige apenas mudar o pacote e a configuração. |
| **Camadas Controller → Service → DbContext** | Controllers finos (só HTTP); regras de negócio isoladas e testáveis no serviço. |
| **Injeção de dependência por interface** (`ITaskService`, `ICurrentUser`, `ITokenService`) | Baixo acoplamento e troca fácil de implementação (fakes nos testes). |
| **DTOs separados da entidade** | Contrato estável e proteção contra *over-posting* (o cliente não define `Id`, `UserId`, datas ou `CompletedAt`). |
| **Validação declarativa + regra de negócio no serviço** | DataAnnotations para formato; `BusinessRuleException` para regras (resulta em 422). |
| **Handler global de exceções + ProblemDetails** | Um único ponto converte exceções em respostas HTTP padronizadas, sem `try/catch` nos controllers. |
| **JWT stateless (HS256, validade de 2 h)** | API sem sessão em servidor, escalável horizontalmente; a chave vem da configuração e é validada na inicialização. |
| **Senha com BCrypt** | Hash lento e com sal; a senha nunca é armazenada nem registrada em log. |
| **Dono da tarefa vem do token, nunca do corpo** | O cliente não consegue agir em nome de outro usuário. |
| **Filtro por usuário em um ponto único** (`UserTasks()`) | Nenhuma consulta de tarefa parte diretamente de `db.Tasks`, reduzindo o risco de esquecer o filtro em algum endpoint. |
| **404 em vez de 403 para tarefa alheia** | Não revela a existência do recurso (evita enumeração de ids). |
| **Mesma mensagem para e-mail inexistente e senha errada** | Evita enumeração de contas cadastradas. |
| **Enums serializados como texto** | JSON, Swagger e banco legíveis; não quebra se a ordem do enum mudar. |
| **Datas em UTC** | Evita inconsistências de fuso entre servidor, banco e navegador. |
| **Filtro e paginação no banco** (`IQueryable`) | Escala melhor que filtrar em memória; leitura com `AsNoTracking`. |
| **Mapeamento manual (sem AutoMapper)** | Poucos campos; explícito e sem dependência extra. |
| **Testes com SQLite em memória, sem provider "InMemory"** | Comportamento fiel ao banco real (constraints, índices, SQL traduzido). |
| **Husky na raiz, rodando só a parte alterada** | Um único ponto de ativação para backend e frontend; hook rápido para não ser desligado. |
| **Docker com build multi-stage** | Imagens finais pequenas (só runtime/nginx), sem SDK nem código-fonte; camadas de dependências em cache. |
| **Contêiner da API sem privilégios de root** | Menor privilégio: um eventual comprometimento do processo tem alcance limitado. |
| **Configuração por variáveis de ambiente (12-Factor)** | A mesma imagem roda em qualquer ambiente; a chave JWT é injetada em execução e **nunca** embutida na imagem. |
| **Compose falha cedo sem `JWT_KEY`** | Evita subir uma API que cairia na inicialização; a mensagem diz o que fazer. |
| **Banco em volume nomeado** | Os dados persistem entre `down`/`up`; remover é uma ação explícita (`down -v`). |
| **Camada `api/` e hooks no frontend** | Componentes não conhecem HTTP; lógica de busca e debounce reutilizável. |
| **Interceptors do Axios para token e 401** | Envio do `Authorization` e *logout* automático centralizados, sem repetir em cada chamada. |
| **Tailwind com tokens no `@theme` e helpers de classe** | Visual consistente e centralizado, sem CSS global; reuso por componentes. |
| **Ações de status guiadas por dados** (`STATUS_ACTIONS`) | Cada status declara suas ações; novo status = nova entrada, sem cadeia de `if`. |
| **Estados de UI tratados** | Carregando, vazio, erro (com "tentar novamente") e feedback por toast. |
| **Tokens de design da marca** (`index.css`) | Cores extraídas da logo e do site da DPC em um só lugar; mudar a identidade não exige tocar nos componentes. |
| **Componentes próprios, sem nova biblioteca de UI** | Visual moderno com controle total e sem migração arriscada (avaliação na seção 7). |
| **Fonte auto-hospedada (Fontsource)** | Sem requisição a terceiros: funciona offline, no Docker e em produção, sem questão de privacidade. |
| **Dados do projeto e do autor em um único módulo** (`projectInfo.ts`) | O rodapé e seus links vêm de uma fonte única, testada. |
| **Deploy só depois dos testes** (`needs`) | Código quebrado nunca chega à produção; o pipeline é o mesmo `npm test`/`dotnet test` do desenvolvimento. |
| **Chave SSH exclusiva do CI, com comando forçado** | Princípio do menor privilégio: a chave só executa o deploy, sem shell, e é revogável isoladamente. |
| **Chave do host fixada (`known_hosts`)** | O CI recusa conectar a um servidor diferente do esperado (proteção contra MITM). |
| **Script de deploy idempotente com verificação de estabilidade** | Rodar de novo não recria o que não mudou, e uma API que reinicia em loop faz o deploy falhar em vez de passar em silêncio. |
| **Proxy reverso na mesma origem** | Frontend e API sob o mesmo domínio: HTTPS único, sem CORS e sem URL da API fixa no bundle. |

---

## 9. Como foi feito, dificuldades e facilidades

**Contexto.** Minha experiência anterior é com Node.js e React; tenho um pouco menos de experiência
em .NET/C#. Por isso, a abordagem foi mapear o que eu já conhecia para o ecossistema novo
(Express/Nest → ASP.NET Core, Prisma/TypeORM → EF Core, Jest → xUnit) e então construir de
dentro para fora.

**Uso de IA.** Para os **testes automatizados** e para a **documentação** (este README), utilizei
ajuda de IA (**Claude**, da Anthropic) para conduzir e avançar essas partes do trabalho. Todo o
resultado está versionado no repositório, e os testes podem ser executados com `npm test`.

**Ordem de construção**

1. Modelo de dados e `DbContext`, com a primeira migration.
2. DTOs, serviço com as regras de negócio e controller.
3. Tratamento global de erros e Swagger; validação dos endpoints pelo Swagger.
4. Frontend: tipos, camada de API, hooks e componentes.
5. Refinamento de UX: ações por botão com ícones, cor da linha por status e simplificação da tabela.
6. Autenticação: entidade de usuário, JWT, isolamento de tarefas por dono, tela de login/cadastro.
7. Camada de testes (backend e frontend) e hook de pre-commit com Husky.
8. Containerização: Dockerfiles multi-stage e `docker-compose.yml`.
9. Interface: identidade visual da DPC (paleta da logo e do site), tipografia, novos componentes e rodapé.
10. Publicação na VPS com Docker Compose e proxy reverso.
11. Pipeline de CI/CD (GitHub Actions) com deploy automático por SSH.

**Dificuldades**

- Entender o modelo de tipagem estática e *nullable reference types* do C#, e ler as mensagens do
  compilador (erros de namespace e de declaração de tipo).
- Conceitos a se fortalecer: injeção de dependência nativa, ciclo de vida (*scoped*), middleware
  pipeline e migrations do EF Core.
- Detalhes de ambiente: versão de Node exigida pelo Vite, expansão de `*` no zsh ao instalar
  ferramentas com `--version`, e porta 5000 ocupada no macOS.
- Datas: garantir UTC de ponta a ponta (o SQLite não preserva o `Kind` do `DateTime`).
- Autenticação: ordem do pipeline (`UseAuthentication` antes de `UseAuthorization`), claims do
  token (`sub`) e garantir que **toda** consulta de tarefa respeite o dono. Uma recursão acidental
  no método de filtro por usuário (stack overflow) só apareceu ao exercitar a API com token.
- Testes: o Vitest não limpa o DOM entre testes sem configuração (`cleanup` no `afterEach`), e o
  ESLint com regras novas do React (`set-state-in-effect`) exigiu repensar o hook `useTasks`
  (estado derivado em vez de `setState` síncrono no efeito).
- Docker: dentro do contêiner o ambiente é *Production*, então o `appsettings.Development.json`
  (com a chave de desenvolvimento) não é carregado e a chave JWT precisa chegar por variável de
  ambiente; e, como o Vite lê `VITE_*` **no build**, a URL da API precisa ser um *build arg*.

**Facilidades**

- Swagger e validação automática com `[ApiController]` aceleraram muito o ciclo de teste da API.
- A CLI do .NET (`dotnet new/add/ef/watch`) é consistente e rápida.
- O padrão Controller/Service/DI é muito próximo do NestJS, o que facilitou a transição.
- TypeScript no frontend permitiu espelhar os DTOs e detectar divergências de contrato ainda na
  compilação.
- Ter injetado `ICurrentUser` por interface tornou o serviço trivial de testar sem HTTP nem token.

---

## 10. Limitações conhecidas e próximos passos

| Limitação | Evolução possível |
|---|---|
| Token guardado em `localStorage` (exposto a XSS) | Cookie `HttpOnly` com proteção CSRF |
| Sem *refresh token*: a sessão expira em 2 h | Par access/refresh token com rotação |
| Sem limite de tentativas de login | Rate limiting (`AddRateLimiter`) |
| Sem verificação de e-mail nem recuperação de senha | Fluxo de confirmação e redefinição |
| Qualquer status é aceito a partir de qualquer outro | Validar transições de status no servidor |
| Imagens sem *healthcheck* e `depends_on` sem esperar a API ficar saudável | Endpoint `/health` e `condition: service_healthy` no Compose |
| Frontend com URL da API fixada em tempo de build | Proxy reverso no nginx (`/api` → `api:8080`) para usar a mesma origem e dispensar CORS |
| SQLite como banco | PostgreSQL em ambiente de produção |
| Deploy automático sem etapa de aprovação, sem *rollback* automático e sem notificação | Ambiente `production` com revisores, rollback para a imagem anterior e aviso de falha (e-mail/chat) |
| Build das imagens feito na própria VPS | Publicar imagens versionadas em um registro e só fazer `pull` na VPS |

---

## 11. Autor

**Michel Victor** · Desenvolvedor Fullstack
Teste técnico para a **Domingues e Pinho Contadores**

- GitHub: https://github.com/michelvvs
- Site: https://michelvvs.com
- Repositório: https://github.com/michelvvs/testeDPCGerenciadorTarefas

> Testes automatizados e documentação desenvolvidos com apoio de IA (Claude).
