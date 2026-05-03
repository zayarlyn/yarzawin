# -------- BUILD STAGE --------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# -------- RUNTIME STAGE --------
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./
EXPOSE 8010

CMD ["node", "src/main.js"]