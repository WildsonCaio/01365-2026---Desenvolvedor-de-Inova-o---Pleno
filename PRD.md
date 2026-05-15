# PRD — GeoTrack
## Sistema de Rastreamento de Frota com Dados Geográficos

Baseado no desafio técnico do processo seletivo Desenvolvedor de Inovação Pleno do Instituto SENAI de Inovação em Sistemas Embarcados.

---

# 1. Visão Geral

## Objetivo

Desenvolver uma API backend para gerenciamento e rastreamento geográfico de uma frota de veículos distribuídos pelo estado de Santa Catarina.

O sistema deverá:
- gerenciar carros;
- armazenar posições geográficas;
- simular movimentação automática;
- consultar clima via Open-Meteo;
- realizar consultas geoespaciais;
- disponibilizar Swagger;
- executar integralmente via Docker Compose.

---

# 2. Escopo do Projeto

## Incluído
- API REST;
- PostgreSQL + PostGIS;
- processamento em background;
- integração climática;
- logs;
- Docker Compose;
- Swagger.

---

## Fora de escopo
- autenticação;
- frontend React;
- dashboard;
- Leaflet;
- CI/CD;
- Kubernetes;
- microsserviços;
- multi-tenant;
- websocket.

---

# 3. Stack Tecnológica

## Backend
- Python 3.12
- Django 5
- Django REST Framework

## Banco
- PostgreSQL
- PostGIS

## Background
- Celery
- Redis

## Documentação
- drf-spectacular

## Infraestrutura
- Docker
- Docker Compose

---

# 4. Arquitetura

## Containers

### app
API Django principal

### postgres
Banco PostgreSQL + PostGIS

### redis
Broker do Celery

### celery_worker
Execução das tasks

### celery_beat
Agendamento periódico

---

# 5. Modelagem de Dados

# Entidade: Car

| Campo | Tipo |
|---|---|
| id | UUID |
| name | string |
| plate | string |
| city | string |
| status | enum |
| location | PointField |
| last_weather_temperature | float |
| last_weather_humidity | integer |
| last_weather_code | integer |
| last_weather_at | datetime |
| created_at | datetime |
| updated_at | datetime |

---

# Enum Status

Valores:
- WORKING
- PROBLEM

---

# 6. Seed Inicial

## Requisito

Criar automaticamente:
- 20 carros;
- cidades reais de Santa Catarina;
- coordenadas reais.

---

# 7. Endpoints Obrigatórios

## CRUD

### Criar
```http
POST /api/cars/
```

### Listar
```http
GET /api/cars/
```

### Filtrar por status
```http
GET /api/cars/?status=WORKING
```

### Atualizar
```http
PUT /api/cars/{id}/
```

### Remover
```http
DELETE /api/cars/{id}/
```

---

# Consulta Geográfica

### Endpoint
```http
GET /api/cars/nearby/
```

### Query Params

| Param | Tipo |
|---|---|
| lat | float |
| lon | float |
| radius_km | integer |

---

# 8. Simulação Automática

## Objetivo

Atualizar automaticamente:
- posição;
- status;
- clima.

---

## Regras

### Atualização
- movimentar levemente coordenadas;
- alterar status aleatoriamente.

### Intervalo
Configurável por variável:
```env
SIMULATION_INTERVAL_SECONDS=30
```

### Logs
Registrar:
- início;
- sucesso;
- erro;
- quantidade processada.

---

# 9. Integração Climática

## API
Open-Meteo

---

## Dados consultados
- temperature_2m
- relative_humidity_2m
- weather_code

---

## Requisitos obrigatórios
- timeout;
- tratamento de exceção;
- logs;
- sistema continuar funcionando mesmo com falha.

---

# Circuit Breaker

## Biblioteca
- pybreaker

## Regras
- abrir após 3 falhas;
- retry após 60 segundos.

---

# 10. Swagger

## Endpoint
```text
/api/docs/
```

---

## Obrigatório
- todos endpoints;
- exemplos;
- schemas completos.

---

# 11. Docker Compose

## Comando único
```bash
docker compose up --build
```

---

# Serviços obrigatórios
- app
- postgres
- redis
- celery_worker
- celery_beat

---

# 12. Variáveis de Ambiente

```env
DEBUG=True

SECRET_KEY=changeme

POSTGRES_DB=geotrack
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

REDIS_HOST=redis
REDIS_PORT=6379

SIMULATION_INTERVAL_SECONDS=30

OPEN_METEO_TIMEOUT=5
```

---

# 13. Estrutura do Projeto

```text
geotrack/
├── app/
├── cars/
├── simulation/
├── weather/
├── core/
├── docker/
├── requirements/
├── .env
├── docker-compose.yml
├── manage.py
└── README.md
```

---

# 14. Critérios de Aceite

O projeto será considerado válido quando:
- Docker subir corretamente;
- PostGIS estiver funcional;
- CRUD funcionar;
- consulta geográfica funcionar;
- tasks executarem automaticamente;
- Open-Meteo integrar corretamente;
- sistema resistir a falhas externas;
- Swagger estiver completo;
- logs estiverem visíveis;
- seed inicial existir.

---

# 15. Fases do Desenvolvimento

# FASE 1 — Inicialização da Infraestrutura

## Objetivo
Preparar ambiente base do projeto.

---

## Entregas

### Configurar:
- Django;
- DRF;
- PostgreSQL;
- PostGIS;
- Docker;
- Docker Compose.

---

## Containers
- app
- postgres

---

## Validar
- aplicação sobe;
- banco conecta;
- migrations funcionam.

---

# FASE 2 — Modelagem e CRUD

## Objetivo
Implementar entidade principal.

---

## Entregas

### Criar model Car
Com:
- PointField;
- status;
- clima;
- timestamps.

---

## Implementar
- serializers;
- viewsets;
- rotas;
- filtros por status.

---

## Validar
- CRUD completo funcional;
- Swagger funcionando.

---

# FASE 3 — Seed Inicial

## Objetivo
Popular sistema automaticamente.

---

## Entregas

### Criar:
- command seed;
- 20 carros;
- cidades reais;
- coordenadas reais.

---

## Validar
- dados inseridos automaticamente;
- coordenadas válidas.

---

# FASE 4 — Consulta Geográfica

## Objetivo
Implementar busca por raio usando PostGIS.

---

## Entregas

### Endpoint:
```http
GET /api/cars/nearby/
```

---

## Implementar
- cálculo geográfico;
- Distance;
- D(km=...).

---

## Validar
- retorno correto dentro do raio.

---

# FASE 5 — Background Processing

## Objetivo
Implementar atualização automática da frota.

---

## Entregas

### Configurar
- Redis;
- Celery;
- Celery Beat.

---

## Implementar task:
- mover veículos;
- alterar status;
- gerar logs.

---

## Validar
- task executa automaticamente;
- logs aparecem no container.

---

# FASE 6 — Integração Climática

## Objetivo
Integrar Open-Meteo.

---

## Entregas

### Implementar:
- client Open-Meteo;
- timeout;
- tratamento de erro;
- persistência da última previsão.

---

## Validar
- clima salvo corretamente;
- falha externa não quebra task.

---

# FASE 7 — Circuit Breaker

## Objetivo
Garantir resiliência.

---

## Entregas

### Implementar:
- pybreaker;
- proteção contra falhas consecutivas.

---

## Validar
- API externa indisponível;
- sistema continua operacional.

---

# FASE 8 — Logs e Observabilidade

## Objetivo
Melhorar rastreabilidade.

---

## Entregas

### Adicionar logs:
- início do ciclo;
- carro atualizado;
- falhas;
- finalização.

---

## Validar
- logs claros via docker logs.

---

# FASE 9 — Swagger Final

## Objetivo
Finalizar documentação.

---

## Entregas

### Adicionar:
- exemplos;
- schemas;
- descrições.

---

## Validar
- endpoints testáveis sem ferramenta externa.

---

# FASE 10 — README Final

## Objetivo
Documentar projeto.

---

## Entregas

### Documentar:
- arquitetura;
- setup;
- variáveis;
- decisões técnicas;
- funcionalidades;
- limitações.

---

## Validar
- avaliador consegue subir sistema sem ajuda.

---

# 16. Estratégia de Prioridade

## Ordem obrigatória

1. Docker Compose
2. CRUD
3. PostGIS
4. Nearby endpoint
5. Celery
6. Open-Meteo
7. Circuit Breaker
8. Logs
9. Swagger
10. README

---

# 17. Resultado Esperado

Ao executar:

```bash
docker compose up --build
```

O avaliador deverá conseguir:
- acessar Swagger;
- criar carros;
- consultar carros próximos;
- visualizar movimentação automática;
- validar logs;
- verificar integração climática;
- testar resiliência da aplicação.