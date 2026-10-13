# TaskManager

> **Teste técnico para a Empresa Domingues e Pinho Contadores** · Desenvolvido por **Michel Victor**
> Vaga: Desenvolvedor Fullstack (.NET / C# + React)

Aplicação web de gerenciamento de tarefas, com API REST em .NET/C# e interface em React.

---

## 1. Visão geral

O TaskManager permite organizar tarefas do dia a dia: criar, editar, excluir e acompanhar o
andamento de cada uma por meio de três status (**Pendente**, **Em andamento** e **Concluída**).

**Funcionalidades**

- CRUD completo de tarefas (título, descrição, prioridade e prazo)
- Controle de status por botões de ação em cada linha (iniciar, concluir e desfazer)
- Cor da linha conforme o status e título riscado nas tarefas concluídas
- Busca por texto, filtros por status e prioridade, e paginação
- Indicação visual de tarefas atrasadas
- Persistência em banco de dados (SQLite) com migrations
- Documentação interativa da API (Swagger / OpenAPI)
- Tratamento padronizado de erros (ProblemDetails) refletido em mensagens na interface

---

## 2. Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Backend | .NET 10, ASP.NET Core Web API, C# |
| Persistência | Entity Framework Core + SQLite (migrations) |
| Documentação da API | Swagger / OpenAPI (Swashbuckle) |
| Frontend | React 19, TypeScript, Vite |
| Estilo | Tailwind CSS v4 |
| Ícones | lucide-react |
| Cliente HTTP | Axios |

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

**3. Subir o frontend** (terminal 2)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- A aplicação abre em **http://localhost:5173**

**4. Usar**

Acesse http://localhost:5173, crie uma tarefa em **Nova tarefa** e use os botões de cada linha
para iniciar, concluir ou desfazer.

### Configuração

| Onde | Chave | Padrão | Para quê |
|---|---|---|---|
| `backend/TaskManager.Api/appsettings.json` | `ConnectionStrings:Default` | `Data Source=taskmanager.db` | Arquivo do banco SQLite |
| `backend/TaskManager.Api/appsettings.json` | `Cors:Origins` | `http://localhost:5173` | Origens do frontend autorizadas |
| `frontend/.env` | `VITE_API_URL` | `http://localhost:5080` | URL base da API |

Qualquer valor do backend pode ser sobrescrito por variável de ambiente (ex.:
`ConnectionStrings__Default`, `Cors__Origins__0`).

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
| Vite reclama da versão do Node | Node abaixo de 20.19 | Atualizar o Node |
| Porta 5080 em uso | Outro processo ocupando a porta | Encerrar o processo ou alterar `applicationUrl` em `Properties/launchSettings.json` (e `VITE_API_URL`) |
| Quer recomeçar com banco limpo | — | Apagar `backend/TaskManager.Api/taskmanager.db*` e subir a API de novo |

---

## 4. API

Base URL: `http://localhost:5080` · Documentação interativa: `/swagger`

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| GET | `/api/tasks` | Lista paginada. Query: `search`, `status`, `priority`, `page`, `pageSize` | 200 |
| GET | `/api/tasks/summary` | Contagem de tarefas por status | 200 |
| GET | `/api/tasks/{id}` | Detalhe de uma tarefa | 200, 404 |
| POST | `/api/tasks` | Cria (status inicial: `Pending`) | 201, 400, 422 |
| PUT | `/api/tasks/{id}` | Atualiza os campos editáveis | 200, 400, 404, 422 |
| PATCH | `/api/tasks/{id}/status` | Altera somente o status | 200, 400, 404 |
| DELETE | `/api/tasks/{id}` | Remove | 204, 404 |

**Valores aceitos**

- `status`: `Pending`, `InProgress`, `Done`
- `priority`: `Low`, `Medium`, `High`

**Exemplo**

```bash
curl -X POST http://localhost:5080/api/tasks \
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
| 404 | Tarefa inexistente |
| 422 | Regra de negócio violada (ex.: prazo no passado ao criar) |
| 500 | Erro inesperado (sem vazar detalhes internos) |

---

## 5. Estrutura do projeto

```
.
├── backend/
│   ├── TaskManager.slnx
│   └── TaskManager.Api/
│       ├── Controllers/    # endpoints HTTP (finos)
│       ├── Services/       # regras de negócio
│       ├── Dtos/           # contratos de entrada e saída
│       ├── Models/         # entidade e enums
│       ├── Data/           # DbContext (mapeamento EF Core)
│       ├── Exceptions/     # exceções de domínio
│       ├── Middleware/     # tratamento global de erros
│       ├── Migrations/     # histórico do esquema do banco
│       └── Program.cs      # composição da aplicação
└── frontend/
    └── src/
        ├── api/            # cliente HTTP e chamadas à API
        ├── components/     # componentes de interface
        ├── hooks/          # lógica reutilizável (useTasks, useDebounce)
        ├── types/          # tipos que espelham os DTOs
        ├── constants.ts    # rótulos, estilos e ações por status
        └── ui.ts           # classes reutilizáveis do Tailwind
```

---

## 6. Decisões técnicas relevantes

| Decisão | Motivo |
|---|---|
| **SQLite + EF Core (migrations)** | Execução sem instalar servidor de banco. Trocar de provider (PostgreSQL, SQL Server) exige apenas mudar o pacote e a configuração. |
| **Camadas Controller → Service → DbContext** | Controllers finos (só HTTP); regras de negócio isoladas e testáveis no serviço. |
| **Injeção de dependência por interface** (`ITaskService`) | Baixo acoplamento e troca fácil de implementação (ex.: fakes em testes). |
| **DTOs separados da entidade** | Contrato estável e proteção contra *over-posting* (o cliente não define `Id`, datas ou `CompletedAt`). |
| **Validação declarativa + regra de negócio no serviço** | DataAnnotations para formato; `BusinessRuleException` para regras (resulta em 422). |
| **Handler global de exceções + ProblemDetails** | Um único ponto converte exceções em respostas HTTP padronizadas, sem `try/catch` nos controllers. |
| **Enums serializados como texto** | JSON, Swagger e banco legíveis; não quebra se a ordem do enum mudar. |
| **Datas em UTC** | Evita inconsistências de fuso entre servidor, banco e navegador. |
| **Filtro e paginação no banco** (`IQueryable`) | Escala melhor que filtrar em memória; leitura com `AsNoTracking`. |
| **Mapeamento manual (sem AutoMapper)** | Poucos campos; explícito e sem dependência extra. |
| **Camada `api/` e hooks no frontend** | Componentes não conhecem HTTP; lógica de busca e debounce reutilizável. |
| **Tailwind com tokens no `@theme` e helpers de classe** | Visual consistente e centralizado, sem CSS global; reuso por componentes. |
| **Ações de status guiadas por dados** (`STATUS_ACTIONS`) | Cada status declara suas ações; novo status = nova entrada, sem cadeia de `if`. |
| **Estados de UI tratados** | Carregando, vazio, erro (com "tentar novamente") e feedback por toast. |

---

## 7. Como foi feito, dificuldades e facilidades

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

**Dificuldades**

- Entender o modelo de tipagem estática e *nullable reference types* do C#, e ler as mensagens do
  compilador (erros de namespace e de declaração de tipo).
- Conceitos novos para mim: injeção de dependência nativa, ciclo de vida (*scoped*), middleware
  pipeline e migrations do EF Core.
- Detalhes de ambiente: versão de Node exigida pelo Vite, expansão de `*` no zsh ao instalar
  ferramentas com `--version`, e porta 5000 ocupada no macOS.
- Datas: garantir UTC de ponta a ponta (o SQLite não preserva o `Kind` do `DateTime`).

**Facilidades**

- Swagger e validação automática com `[ApiController]` aceleraram muito o ciclo de teste da API.
- A CLI do .NET (`dotnet new/add/ef/watch`) é consistente e rápida.
- O padrão Controller/Service/DI é muito próximo do NestJS, o que facilitou a transição.
- TypeScript no frontend permitiu espelhar os DTOs e detectar divergências de contrato ainda na
  compilação.

---

## 8. Limitações conhecidas e próximos passos

- Testes automatizados (xUnit no backend; Vitest no frontend)
- Docker e Docker Compose para subir tudo com um comando
- Autenticação e autorização (JWT) com tarefas por usuário
- Validação das transições de status no servidor (hoje qualquer status é aceito)
- Migração para PostgreSQL em ambiente de produção
- Pipeline de CI (build e testes a cada push)
- Publicação online (frontend e API)

---

## 9. Autor

**Michel Victor**
Teste técnico para a **Empresa X**
