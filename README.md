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

## Endpoints

| Recurso | Método | Rota |
|---|---|---|
| API | `GET` | `/` |
| Pacientes | `POST` | `/pacientes` |
| Pacientes | `GET` | `/pacientes` |
| Pacientes | `GET` | `/pacientes/:id` |
| Médicos | `POST` | `/medicos` |
| Médicos | `GET` | `/medicos` |
| Médicos | `GET` | `/medicos/:id` |
| Consultas | `POST` | `/consultas` |
| Consultas | `GET` | `/consultas` |
| Consultas | `GET` | `/consultas/:id` |

Exemplo de verificação da API:

```powershell
Invoke-RestMethod http://localhost:3000/
```

## Testes

Os testes unitários de controllers e services usam providers mockados para verificar a configuração da injeção de dependências sem conectar ao MongoDB. O teste E2E inicializa o módulo completo da aplicação e verifica `GET /`; para executá-lo, mantenha o MongoDB disponível e configure `DATABASE_URL` no `.env`.

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
