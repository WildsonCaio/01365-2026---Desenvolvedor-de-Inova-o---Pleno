# 🛰️ GeoTrack - Gestão de Frota e Rastreamento em Tempo Real

[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15-A42E2B?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-15--3.4-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgis.net/)
[![Celery](https://img.shields.io/badge/Celery-5.3-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

O **GeoTrack** é uma API backend de alta performance desenvolvida para gestão de frotas e rastreamento geográfico em tempo real. Construído com **Django 5** e **PostGIS**, o sistema lida com consultas espaciais complexas, simulação automatizada de veículos e integração climática, mantendo a resiliência como pilar central.

---

## 🏛️ Arquitetura do Sistema

O projeto segue uma arquitetura baseada em containers orientada a serviços:

| Componente | Tecnologia | Responsabilidade |
| :--- | :--- | :--- |
| **API Backend** | Django 5 + DRF | Endpoints RESTful, lógica de negócio e API espacial. |
| **Banco de Dados** | PostgreSQL + PostGIS | Armazenamento e consultas espaciais nativas. |
| **Fila de Tarefas** | Celery + Redis | Simulação assíncrona e integração com APIs externas. |
| **Resiliência** | PyBreaker | Implementação de Circuit Breaker para a API de clima. |
| **Documentação** | DRF-Spectacular | Documentação automática OpenAPI 3.0 (Swagger). |

---

## 🚀 Principais Funcionalidades

- **📍 Consultas Espaciais Avançadas**: Integração nativa com PostGIS para buscas por raio (km) de alta performance.
- **🔄 Simulação Automatizada de Frota**: Tarefas em background que simulam movimento e atualizam o status dos veículos automaticamente.
- **⛅ Integração Climática em Tempo Real**: Sincronização automática de dados meteorológicos via Open-Meteo com base na posição do veículo.
- **🛡️ Tolerância a Falhas**: Implementação do padrão **Circuit Breaker** para garantir estabilidade durante quedas de APIs externas.
- **📊 Observabilidade**: Sistema de logs estruturado para acompanhamento detalhado do ciclo de vida das tarefas.
- **📚 Documentação Interativa**: Interface Swagger completa para testes rápidos da API.

---

## 🛠️ Início Rápido

### 1. Configuração do Ambiente
Clone o repositório e crie seu arquivo de ambiente local:
```bash
cp .env.example .env
```

### 2. Subir a Infraestrutura
Construa e inicie todos os serviços usando Docker Compose:
```bash
docker compose up --build -d
```

### 3. Inicializar Banco e Dados de Teste
Execute as migrações e popule o sistema com 20 veículos reais distribuídos em Santa Catarina (SC):
```bash
docker compose exec app python manage.py migrate
docker compose exec app python manage.py seed
```

### 4. Explorar a API
A documentação interativa está disponível em:
👉 [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

---

## 📡 Endpoints Principais

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/cars/` | Lista todos os veículos (suporta filtro de `status`). |
| `POST` | `/api/cars/` | Registra um novo veículo na frota. |
| `GET` | `/api/cars/nearby/` | **Busca Espacial**: Encontra veículos dentro de um raio (km). |
| `GET` | `/api/docs/` | Interface Swagger UI interativa. |

---

## 🧪 Testando a Simulação

Para monitorar a simulação em tempo real (movimento + atualizações de clima), acompanhe os logs do worker:
```bash
docker compose logs -f celery_worker
```

**Regras da simulação:**
- Executa a cada `SIMULATION_INTERVAL_SECONDS` (padrão: 30s).
- Move os veículos aleatoriamente (~1km de raio).
- Atualiza dados climáticos via Open-Meteo.
- Altera o status aleatoriamente para simular problemas mecânicos.

---

## ⚙️ Configurações de Ambiente

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `DEBUG` | `True` | Ativa/Desativa o modo de depuração. |
| `SIMULATION_INTERVAL_SECONDS` | `30` | Intervalo entre os ciclos de atualização da frota. |
| `OPEN_METEO_TIMEOUT` | `5` | Tempo limite para requisições à API externa de clima. |
| `POSTGRES_DB` | `geotrack` | Nome do banco de dados. |

---

## 📜 Decisões Técnicas e Trade-offs

- **Consultas Espaciais Nativas**: Ao utilizar `Distance` e `D(km=...)` do PostGIS, delegamos cálculos matemáticos complexos ao banco de dados, garantindo respostas em milissegundos.
- **Estratégia de Circuit Breaker**: Escolhemos o `pybreaker` com `fail_max=3` e `reset_timeout=60` para evitar "falhas em cascata" quando os serviços externos de clima estão lentos ou fora do ar.
- **Logística de Background**: O uso de Celery permite que o sistema escale horizontalmente, processando milhares de atualizações de veículos sem impactar o tempo de resposta da API para o usuário final.

---

## 🏁 Roadmap Futuro

- [ ] **Paralelização de Tarefas**: Implementar sub-tarefas por veículo para maior escalabilidade dos workers.
- [ ] **Autenticação JWT**: Adicionar controle de acesso seguro para endpoints de gerenciamento.
- [ ] **Integração com WebSockets**: Notificar o frontend em tempo real sobre mudanças de posição em vez de pooling.
