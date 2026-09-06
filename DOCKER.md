# Docker

Comandos para subir a aplicacao em uma rede Docker simples.

## 1. Criar a network

```bash
docker network create planeja-network
```

## 2. Subir o PostgreSQL

```bash
docker run -d \
  --name planeja-postgres \
  --network planeja-network \
  -p 5432:5432 \
  -e POSTGRES_DB=planeja \
  -e POSTGRES_USER=planeja \
  -e POSTGRES_PASSWORD=planeja123 \
  postgres:17-alpine
```

## 3. Build da API Spring Boot

```bash
docker build -t planeja-api ./planeja-api
```

## 4. Subir a API Spring Boot

```bash
docker run -d \
  --name planeja-api \
  --network planeja-network \
  -p 8080:8080 \
  planeja-api
```

## 5. Build do Angular

```bash
docker build -t planeja-app ./planeja-app
```

## 6. Subir o Angular

```bash
docker run -d \
  --name planeja-app \
  --network planeja-network \
  -p 4200:4200 \
  planeja-app
```

## Acesso

- Frontend: `http://localhost:4200`
- API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
