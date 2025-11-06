FROM node:20-alpine AS builder

WORKDIR /repeat-nest
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /repeat-nest

COPY --from=builder /repeat-nest ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:prod"]
