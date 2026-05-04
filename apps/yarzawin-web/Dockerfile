FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM builder AS development
RUN npm i
EXPOSE 3010
CMD ["npm", "run", "dev", "--", "--host"]

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
