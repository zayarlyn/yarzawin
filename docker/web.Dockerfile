FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build yarzawin-web

FROM nginx:alpine
COPY --from=builder /app/dist/apps/yarzawin-web /usr/share/nginx/html
COPY docker/nginx.web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
