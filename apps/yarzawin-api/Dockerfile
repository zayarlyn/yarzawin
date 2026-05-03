# -------- BUILD STAGE --------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -------- DEVELOPMENT STAGE --------
FROM builder AS development
EXPOSE 8010
CMD ["npm", "run", "start:dev"]

# -------- PRODUCTION STAGE (minimal size) --------
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev 
COPY --from=builder /app/dist ./
EXPOSE 8010
CMD ["node", "src/main.js"]