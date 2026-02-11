# Estágio 1: Build do React
FROM node:22-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx (Produção)
FROM nginx:alpine
# Copia o build do React para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# (NOTA: Se o seu projeto cria uma pasta 'build' em vez de 'dist', mude a linha acima para /app/build)

# Copia nossa configuração personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]