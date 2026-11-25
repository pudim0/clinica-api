# Clinica Medica API

API REST desenvolvida com NestJS, TypeScript e MongoDB para o cadastro e consulta de pacientes, médicos e consultas.

## Tecnologias

- Node.js
- NestJS
- TypeScript
- MongoDB
- Mongoose
- Vitest

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Uma instância do MongoDB local ou na nuvem

## Configuração

1. Acesse a pasta da API:

```powershell
cd clinica-api
```

2. Instale as dependências:

```powershell
npm install
```

3. Crie o arquivo de ambiente a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

4. Configure a variável `DATABASE_URL` no arquivo `.env`:

```env
DATABASE_URL=mongodb://localhost:27017/clinica
```

Para utilizar MongoDB Atlas, use a URL de conexão fornecida pelo Atlas no lugar do exemplo acima.

## Executando o projeto

### Modo desenvolvimento

Com reinicialização automática ao alterar os arquivos:

```powershell
npm run start:dev
```

### Modo padrão

```powershell
npm start
```

### Compilar e executar em produção

```powershell
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`.

## Endpoints e exemplos

Os exemplos abaixo são para o Postman. Crie um Environment e defina a variável `baseUrl` como `http://localhost:3000`; assim, as requisições podem usar `{{baseUrl}}`. Para requisições `POST`, selecione **Body > raw > JSON** (ou defina o cabeçalho `Content-Type: application/json`). Os campos dos corpos correspondem aos DTOs de criação e os parâmetros da aba **Params** correspondem aos DTOs de filtro. A API valida as entradas e retorna erro para campos inválidos.

### Pacientes

#### Criar paciente — `POST /pacientes`

Campos obrigatórios: `cpf`, `nome` e `idade`. `convenio` e `ativo` são opcionais; se omitidos, assumem `Particular` e `true`, respectivamente. Valores aceitos para `convenio`: `Particular`, `Convênio`, `SUS` ou `Outros`.

No Postman, selecione o método `POST`, use a URL `{{baseUrl}}/pacientes` e envie este JSON:

```json
{
  "cpf": "12345678900",
  "nome": "Ana Silva",
  "idade": 35,
  "convenio": "Particular",
  "ativo": true
}
```

#### Listar pacientes — `GET /pacientes`

Filtros opcionais: `nome`, `convenio`, `page` e `limit`. A paginação usa `page=1` e `limit=10` por padrão.

No Postman, use `GET {{baseUrl}}/pacientes`. Para filtrar, adicione estes valores na aba **Params**:

| Key | Value |
|---|---|
| `nome` | `Ana` |
| `convenio` | `Particular` |
| `page` | `1` |
| `limit` | `10` |

#### Buscar paciente por ID — `GET /pacientes/:id`

Use o `_id` retornado na resposta ao criar o paciente na URL `{{baseUrl}}/pacientes/{id}`. Por exemplo: `{{baseUrl}}/pacientes/665f1a2b3c4d5e6f78901234`.

### Médicos

#### Criar médico — `POST /medicos`

Todos os campos são obrigatórios. Valores aceitos para `especialidade`: `Cardiologia`, `Ortopedia`, `Pediatria` ou `Clínica Geral`.

No Postman, selecione `POST`, use `{{baseUrl}}/medicos` e envie:

```json
{
  "crm": "CRM12345",
  "nome": "Carlos Souza",
  "especialidade": "Cardiologia",
  "valorConsulta": 250
}
```

#### Listar médicos — `GET /medicos`

Filtros opcionais: `especialidade`, `minValor`, `maxValor`, `page` e `limit`. Os valores padrão da paginação são `page=1` e `limit=10`.

No Postman, use `GET {{baseUrl}}/medicos`. Para filtrar, adicione estes valores na aba **Params**:

| Key | Value |
|---|---|
| `especialidade` | `Cardiologia` |
| `minValor` | `100` |
| `maxValor` | `300` |
| `page` | `1` |
| `limit` | `10` |

#### Buscar médico por ID — `GET /medicos/:id`

Use o `_id` retornado na resposta ao criar o médico na URL `{{baseUrl}}/medicos/{id}`. Por exemplo: `{{baseUrl}}/medicos/665f1a2b3c4d5e6f78901234`.

### Consultas

#### Criar consulta — `POST /consultas`

Todos os campos são obrigatórios. `pacienteId` e `medicoId` devem ser IDs MongoDB válidos; use os IDs retornados ao criar os registros. Valores aceitos para `status`: `Agendada`, `Realizada` ou `Cancelada`.

Crie primeiro o paciente e o médico e copie os respectivos `_id` das respostas. No Postman, selecione `POST`, use `{{baseUrl}}/consultas` e substitua os IDs de exemplo:

```json
{
  "codigoAtendimento": "ATD-0001",
  "pacienteId": "665f1a2b3c4d5e6f78901234",
  "medicoId": "665f1a2b3c4d5e6f78901235",
  "valorCobrado": 250,
  "status": "Agendada"
}
```

#### Listar consultas — `GET /consultas`

Filtros opcionais: `status`, `minValor`, `maxValor`, `page` e `limit`. Os valores padrão da paginação são `page=1` e `limit=10`.

No Postman, use `GET {{baseUrl}}/consultas`. Para filtrar, adicione estes valores na aba **Params**:

| Key | Value |
|---|---|
| `status` | `Agendada` |
| `minValor` | `100` |
| `maxValor` | `300` |
| `page` | `1` |
| `limit` | `10` |

#### Buscar consulta por ID — `GET /consultas/:id`

Use o `_id` retornado na resposta ao criar a consulta na URL `{{baseUrl}}/consultas/{id}`. Por exemplo: `{{baseUrl}}/consultas/665f1a2b3c4d5e6f78901236`.

### Verificar a API

No Postman, envie `GET {{baseUrl}}/` para conferir se a API está respondendo.

## Testes

Os testes unitários de controllers e services usam providers mockados e não precisam conectar ao MongoDB. Eles verificam o encaminhamento das operações pelos controllers e, nos services, a criação de registros, filtros e paginação, buscas por ID e tratamento de duplicidades e registros inexistentes. O teste E2E inicializa o módulo completo da aplicação e verifica `GET /`; para executá-lo, mantenha o MongoDB disponível e configure `DATABASE_URL` no `.env`.

Execute os testes unitários:

```powershell
npm test
```

Execute os testes E2E:

```powershell
npm run test:e2e
```

Gere o relatório de cobertura:

```powershell
npm run test:cov
```
