# 🛰️ GeoTrack — Gestão de Frota e Rastreamento Geográfico

[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15-A42E2B?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-15--3.4-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net/)
[![Celery](https://img.shields.io/badge/Celery-5.3-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

O **GeoTrack** é uma plataforma para gestão e rastreamento geográfico de frotas desenvolvida como solução para o desafio técnico do processo seletivo de Desenvolvedor de Inovação Pleno do Instituto SENAI de Inovação em Sistemas Embarcados.

A aplicação foi construída utilizando **Django 5**, **PostGIS** e **Celery**, com foco em:
- processamento assíncrono;
- consultas geoespaciais;
- resiliência;
- observabilidade;
- integração com APIs externas;
- execução completa via Docker Compose.

---

# ✨ Principais Funcionalidades

- 📍 CRUD completo de veículos
- 🌎 Consultas geográficas utilizando PostGIS
- 🔄 Simulação automática da movimentação da frota
- ⛅ Integração climática com Open-Meteo
- 🛡️ Circuit Breaker para tolerância a falhas externas
- 📊 Logs estruturados para observabilidade
- 📚 Swagger/OpenAPI para documentação e testes
- 🐳 Infraestrutura completa via Docker Compose
- 🗺️ Dashboard frontend opcional com mapa interativo

---

# 🏛️ Arquitetura do Sistema

O sistema foi estruturado utilizando arquitetura baseada em serviços/containerização.

| Componente | Tecnologia | Responsabilidade |
|---|---|---|
| API Backend | Django + DRF | Endpoints REST, regras de negócio e consultas espaciais |
| Banco de Dados | PostgreSQL + PostGIS | Persistência e operações geográficas |
| Background Jobs | Celery + Redis | Simulação da frota e integração climática |
| Resiliência | PyBreaker | Circuit Breaker para APIs externas |
| Frontend (Opcional) | Next.js 15 + Leaflet | Dashboard visual da frota |

---

# 🐳 Como Executar o Projeto

## Pré-requisitos

- Docker
- Docker Compose

---

# 🚀 Inicialização Rápida

## 1. Clonar o repositório

```bash
git clone <repo-url>
cd geotrack
```

---

## 2. Criar arquivo `.env`

```bash
cp .env.example .env
```

---

## 3. Subir toda a infraestrutura

Executar na raiz do projeto

```bash
docker compose up --build -d
```

Esse comando iniciará:
- backend Django;
- PostgreSQL + PostGIS;
- Redis;
- Celery Worker;
- Celery Beat;
- frontend Next.js (opcional).

---

## 4. Executar migrations

```bash
docker compose exec app python manage.py migrate
```

---

## 5. Popular banco com dados iniciais

```bash
docker compose exec app python manage.py seed
```

O sistema criará automaticamente:
- 20 veículos;
- cidades reais de Santa Catarina;
- coordenadas geográficas reais.

---

# 🌐 Acessos

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Backend | http://localhost:8000/api |
| Swagger/OpenAPI | http://localhost:8000/api/docs/ |

---

# 📡 Endpoints Principais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/cars/` | Lista veículos |
| POST | `/api/cars/` | Cria veículo |
| PUT | `/api/cars/{id}/` | Atualiza veículo |
| DELETE | `/api/cars/{id}/` | Remove veículo |
| GET | `/api/cars/?status=WORKING` | Filtra por status |
| GET | `/api/cars/nearby/` | Consulta veículos por raio |
| GET | `/api/docs/` | Swagger/OpenAPI |

---

# 🌍 Consulta Geográfica

O endpoint de proximidade utiliza recursos nativos do PostGIS para buscas espaciais.

## Exemplo

```http
GET /api/cars/nearby/?lat=-27.5954&lon=-48.5480&radius_km=10
```

---

# 🔄 Simulação Automática da Frota

O sistema executa tarefas periódicas em background utilizando Celery.

A cada ciclo:
- os veículos são movimentados aleatoriamente;
- o status é atualizado;
- os dados climáticos são sincronizados;
- logs são registrados.

---

## Configuração do intervalo

Variável:
```env
SIMULATION_INTERVAL_SECONDS=30
```

---

# ⛅ Integração Climática

API utilizada:
- Open-Meteo

Dados sincronizados:
- temperatura;
- umidade;
- código climático.

---

# 🛡️ Resiliência e Circuit Breaker

A integração climática utiliza o padrão Circuit Breaker via `pybreaker`.

Configuração:
- abertura após 3 falhas consecutivas;
- retry automático após 60 segundos.

Objetivo:
- evitar falhas em cascata;
- manter o sistema operacional mesmo durante indisponibilidade da API externa.

---

# 📊 Observabilidade e Logs

Os ciclos da simulação geram logs estruturados contendo:
- início da execução;
- veículos processados;
- falhas de integração;
- finalização da tarefa.

---

## Acompanhar logs do worker

```bash
docker compose logs -f celery_worker
```

---

# 🎨 Frontend (Opcional)

O projeto inclui uma interface visual desenvolvida em Next.js 15.

Funcionalidades:
- dashboard da frota;
- mapa com Leaflet;
- CRUD visual;
- busca geográfica;
- indicadores em tempo real.

O frontend foi desenvolvido apenas como complemento visual da API, mantendo o backend como foco principal do desafio.

---

# ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| DEBUG | Modo debug | True |
| POSTGRES_DB | Nome do banco | geotrack |
| POSTGRES_USER | Usuário do banco | postgres |
| POSTGRES_PASSWORD | Senha do banco | postgres |
| POSTGRES_HOST | Host do banco | postgres |
| POSTGRES_PORT | Porta do banco | 5432 |
| REDIS_HOST | Host Redis | redis |
| REDIS_PORT | Porta Redis | 6379 |
| SIMULATION_INTERVAL_SECONDS | Intervalo da simulação | 30 |
| OPEN_METEO_TIMEOUT | Timeout API externa | 5 |

---

# 📂 Estrutura do Projeto

```text
geotrack/
├── backend/
│   ├── app/
│   ├── cars/
│   ├── simulation/
│   ├── weather/
│   └── core/
│
├── frontend/
│
├── docker/
│
├── docs/
│   ├── PRD.md
│   ├── FRONTEND.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 🧠 Decisões Técnicas

## PostGIS
Foi utilizado PostGIS para delegar cálculos espaciais diretamente ao banco de dados, garantindo:
- melhor performance;
- consultas geográficas nativas;
- precisão geoespacial.

---

## Celery + Redis
A simulação da frota foi desacoplada da API principal utilizando processamento assíncrono.

Benefícios:
- melhor escalabilidade;
- isolamento de tarefas;
- menor impacto na API HTTP.

---

## Circuit Breaker
A integração climática utiliza Circuit Breaker para evitar:
- retries infinitos;
- degradação geral do sistema;
- falhas em cascata.

---

# 🧪 Fluxo de Teste Recomendado

## 1. Abrir Swagger
Acesse:
```text
http://localhost:8000/api/docs/
```

---

## 2. Criar um veículo

Exemplo:
```json
{
  "name": "Carro Teste",
  "plate": "ABC1234",
  "city": "Florianopolis",
  "latitude": -27.5954,
  "longitude": -48.5480,
  "status": "WORKING"
}
```

---

## 3. Validar movimentação automática

Aguardar alguns segundos e acompanhar:
```bash
docker compose logs -f celery_worker
```

---

## 4. Testar consulta geográfica

Exemplo:
```http
GET /api/cars/nearby/?lat=-27.5954&lon=-48.5480&radius_km=10
```

---

## 5. Validar frontend

Acesse:
```text
http://localhost:3000
```

---

# 📌 Requisitos do Desafio Atendidos

- [x] CRUD completo de veículos
- [x] PostgreSQL com PostGIS
- [x] Seed inicial com 20 veículos
- [x] Coordenadas geográficas reais
- [x] Simulação automática em background
- [x] Logs estruturados
- [x] Integração com Open-Meteo
- [x] Circuit Breaker
- [x] Consulta geográfica por raio
- [x] Swagger/OpenAPI
- [x] Docker Compose
- [x] Frontend complementar (diferencial)

---

# 🚧 Possíveis Evoluções Futuras

- autenticação JWT;
- WebSockets para atualização em tempo real;
- métricas Prometheus/Grafana;
- filas distribuídas avançadas;
- paralelização por veículo;
- monitoramento avançado do Celery.

---

# 👨‍💻 Autor

Desenvolvido como solução para o desafio técnico:
**Processo Seletivo 01365/2026 — Instituto SENAI de Inovação em Sistemas Embarcados**
