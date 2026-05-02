FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build yarzawin-api

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/yarzawin-api ./
RUN npm ci --omit=dev
EXPOSE 8010
CMD ["node", "main.js"]
