Desenvolva um frontend simples, moderno e funcional para o projeto GeoTrack utilizando Next.js 15 com App Router e TypeScript.

IMPORTANTE:
- O frontend NÃO é o foco principal do projeto.
- O objetivo é apenas complementar visualmente a API já existente.
- Priorizar simplicidade, organização e boa apresentação visual.
- NÃO criar arquitetura complexa.
- NÃO usar autenticação.
- NÃO usar state management avançado.
- NÃO usar microfrontends.
- NÃO usar SSR complexo.
- NÃO exagerar em animações.
- NÃO transformar em sistema enterprise.

STACK:
- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- Axios
- React Leaflet

OBJETIVO:
Criar uma interface leve para visualização da frota e consumo da API Django já existente.

A aplicação deve consumir os endpoints da API:
- GET /api/cars/
- GET /api/cars/nearby/
- POST /api/cars/
- PUT /api/cars/{id}/
- DELETE /api/cars/{id}/

URL BASE DA API:
Usar variável:
NEXT_PUBLIC_API_URL

ESTRUTURA:
Criar estrutura simples:

src/
  app/
  components/
  services/
  types/
  hooks/

TELAS:

# 1. Dashboard Principal

Criar página inicial moderna e limpa contendo:

## Cards superiores:
- Total de carros
- Carros funcionando
- Carros com problema

Usar cards simples com visual moderno.

---

## Tabela/Listagem

Exibir:
- Nome
- Placa
- Cidade
- Status
- Temperatura atual
- Última atualização

Status:
- verde = funcionando
- vermelho = problema

Adicionar:
- busca simples por nome/placa
- filtro por status

---

## Mapa

Adicionar mapa usando React Leaflet.

Requisitos:
- centralizado em Santa Catarina
- marcador para cada carro
- marcador verde para funcionando
- marcador vermelho para problema

Popup do marcador:
- nome
- placa
- cidade
- temperatura
- status

---

# 2. Modal CRUD

Criar modal simples usando shadcn/ui para:
- criar carro
- editar carro

Campos:
- nome
- placa
- cidade
- latitude
- longitude
- status

Adicionar botão excluir.

---

# 3. Nearby Search

Adicionar pequena seção:
"Buscar carros próximos"

Campos:
- latitude
- longitude
- raio em KM

Botão:
"Buscar"

Exibir resultados abaixo.

---

# REQUISITOS VISUAIS

Visual:
- moderno
- minimalista
- limpo
- profissional
- agradável

Layout:
- responsivo
- centralizado
- espaçamentos consistentes
- cards arredondados
- sombras suaves

NÃO usar:
- excesso de cores
- design exagerado
- animações pesadas

---

# REQUISITOS TÉCNICOS

Criar:
- services/api.ts
- tipagem TypeScript
- hooks simples
- loading states
- tratamento básico de erro

Usar:
- Axios para chamadas
- Tailwind para layout
- shadcn/ui para componentes

---

# IMPORTANTE

- O frontend deve ser pequeno e simples.
- O backend Django é o foco principal do projeto.
- O frontend existe apenas para enriquecer a apresentação final.
- Código deve ser limpo e fácil de entender.
- Não criar complexidade desnecessária.

GERAR:
- Estrutura completa dos arquivos
- Componentes
- Hooks
- Serviços
- Tipagens
- Páginas
- Configuração do Leaflet
- Integração completa com API
- Tailwind estilizado
- README frontend curto