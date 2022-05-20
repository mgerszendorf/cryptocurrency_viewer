# Base build
FROM node:16 AS base

RUN mkdir -p /app

WORKDIR /app

COPY package.json tsconfig*.json nest-cli.json ./

COPY ./src/ ./src/

RUN yarn

# Development build
FROM node:16 AS development

WORKDIR /app

COPY --from=base /app /app

ENTRYPOINT ["yarn", "start:dev"]

# Production build
FROM node:16 AS production

WORKDIR /app

ARG ENVIRONMENT=PROD
ENV ENVIRONMENT=${ENVIRONMENT}

COPY --chown=node:node --from=base /app .

RUN yarn --production

USER node

CMD ["node", "lib/main"]