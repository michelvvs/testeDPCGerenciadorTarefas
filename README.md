# TaskManager

> **Teste técnico para a Empresa Domingues e Pinho Contadores** · Desenvolvido por **Michel Victor**
> Vaga: Desenvolvedor Fullstack (.NET / C# + React)

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

---

## 2. Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Backend | .NET 10, ASP.NET Core Web API, C# |
| Persistência | Entity Framework Core + SQLite (migrations) |
| Autenticação | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`), BCrypt (`BCrypt.Net-Next`) |
| Documentação da API | Swagger / OpenAPI (Swashbuckle) |
| Frontend | React 19, TypeScript, Vite |
| Estilo | Tailwind CSS v4 |
| Ícones | lucide-react |
| Cliente HTTP | Axios |
| Testes (backend) | xUnit, `WebApplicationFactory`, SQLite em memória |
| Testes (frontend) | Vitest, Testing Library, jsdom |
| Qualidade | ESLint, `tsc`, Husky (hook de pre-commit) |

---

## 3. Como executar

### Pré-requisitos

| Ferramenta | Versão | Verificar |
|---|---|---|
| .NET SDK | 10.x | `dotnet --version` |
| Node.js | 20.19+ ou 22.12+ | `node -v` |
| npm | 10+ | `npm -v` |
| Git | qualquer recente | `git --version` |

### Passo a passo

**1. Clonar o repositório**

```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_REPOSITORIO>
```

**2. Subir a API** (terminal 1)

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

**3. Subir o frontend** (terminal 2)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- A aplicação abre em **http://localhost:5173**

**4. Usar**

1. Acesse http://localhost:5173 e clique em **Cadastre-se** para criar uma conta
   (nome, e-mail e senha com no mínimo 8 caracteres). Você entra logado automaticamente.
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
| `frontend/.env` | `VITE_API_URL` | `http://localhost:5080` | URL base da API |

Qualquer valor do backend pode ser sobrescrito por variável de ambiente (ex.:
`ConnectionStrings__Default`, `Cors__Origins__0`, `Jwt__Key`).

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
| Quer recomeçar com banco limpo | — | Apagar `backend/TaskManager.Api/taskmanager.db*` e subir a API de novo |

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

Base URL: `http://localhost:5080` · Documentação interativa: `/swagger`

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
├── package.json            # scripts de teste e Husky (somente tooling)
├── .husky/pre-commit       # roda os testes da parte alterada
├── backend/
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
    └── src/
        ├── api/            # cliente HTTP (com interceptors de token/401) e chamadas à API
        ├── auth/           # contexto, provider, hook e armazenamento da sessão
        ├── components/     # componentes de interface (inclui AuthPage)
        ├── hooks/          # lógica reutilizável (useTasks, useDebounce)
        ├── types/          # tipos que espelham os DTOs
        ├── constants.ts    # rótulos, estilos e ações por status
        └── ui.ts           # classes reutilizáveis do Tailwind
```

---

## 7. Decisões técnicas relevantes

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
| **Camada `api/` e hooks no frontend** | Componentes não conhecem HTTP; lógica de busca e debounce reutilizável. |
| **Interceptors do Axios para token e 401** | Envio do `Authorization` e *logout* automático centralizados, sem repetir em cada chamada. |
| **Tailwind com tokens no `@theme` e helpers de classe** | Visual consistente e centralizado, sem CSS global; reuso por componentes. |
| **Ações de status guiadas por dados** (`STATUS_ACTIONS`) | Cada status declara suas ações; novo status = nova entrada, sem cadeia de `if`. |
| **Estados de UI tratados** | Carregando, vazio, erro (com "tentar novamente") e feedback por toast. |

---

## 8. Como foi feito, dificuldades e facilidades

**Contexto.** Minha experiência anterior é com Node.js e React; este foi o meu primeiro projeto
em .NET/C#. Por isso, a abordagem foi mapear o que eu já conhecia para o ecossistema novo
(Express/Nest → ASP.NET Core, Prisma/TypeORM → EF Core, Jest → xUnit) e então construir de
dentro para fora.

**Ordem de construção**

1. Modelo de dados e `DbContext`, com a primeira migration.
2. DTOs, serviço com as regras de negócio e controller.
3. Tratamento global de erros e Swagger; validação dos endpoints pelo Swagger.
4. Frontend: tipos, camada de API, hooks e componentes.
5. Refinamento de UX: ações por botão com ícones, cor da linha por status e simplificação da tabela.
6. Autenticação: entidade de usuário, JWT, isolamento de tarefas por dono, tela de login/cadastro.
7. Camada de testes (backend e frontend) e hook de pre-commit com Husky.

**Dificuldades**

- Entender o modelo de tipagem estática e *nullable reference types* do C#, e ler as mensagens do
  compilador (erros de namespace e de declaração de tipo).
- Conceitos novos para mim: injeção de dependência nativa, ciclo de vida (*scoped*), middleware
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

**Facilidades**

- Swagger e validação automática com `[ApiController]` aceleraram muito o ciclo de teste da API.
- A CLI do .NET (`dotnet new/add/ef/watch`) é consistente e rápida.
- O padrão Controller/Service/DI é muito próximo do NestJS, o que facilitou a transição.
- TypeScript no frontend permitiu espelhar os DTOs e detectar divergências de contrato ainda na
  compilação.
- Ter injetado `ICurrentUser` por interface tornou o serviço trivial de testar sem HTTP nem token.

---

## 9. Limitações conhecidas e próximos passos

| Limitação | Evolução possível |
|---|---|
| Token guardado em `localStorage` (exposto a XSS) | Cookie `HttpOnly` com proteção CSRF |
| Sem *refresh token*: a sessão expira em 2 h | Par access/refresh token com rotação |
| Sem limite de tentativas de login | Rate limiting (`AddRateLimiter`) |
| Sem verificação de e-mail nem recuperação de senha | Fluxo de confirmação e redefinição |
| Qualquer status é aceito a partir de qualquer outro | Validar transições de status no servidor |
| Docker/Compose ainda não adicionados | `docker compose up --build` para subir tudo |
| Sem pipeline de CI | Executar `npm test` a cada push (Bitbucket Pipelines / GitHub Actions) |
| SQLite como banco | PostgreSQL em ambiente de produção |
| Sem publicação online | Deploy do frontend e da API |

---

## 10. Autor

**Michel Victor**
Teste técnico para a **Empresa Domingues e Pinho Contadores**
