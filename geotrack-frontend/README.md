# GeoTrack Frontend

Interface moderna para visualização e gerenciamento da frota GeoTrack.

## 🛠 Tecnologias
- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS** (Estilização)
- **Leaflet** (Mapas)
- **Lucide React** (Ícones)
- **Axios** (Consumo de API)

## 🚀 Como Rodar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure a URL da API:**
   Crie um arquivo `.env.local` e adicione:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🗺 Funcionalidades
- Dashboard com indicadores (Total, Operacionais, Problemas).
- Mapa interativo com marcadores coloridos por status.
- Listagem detalhada com busca e filtros.
- Visualização de dados climáticos reais por veículo.
- Busca por proximidade geográfica integrada.
