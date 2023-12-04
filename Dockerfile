FROM node:20-bullseye-slim as builder

# A GITHUB_TOKEN to authenticate to private GitHub Package Registries
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

RUN npm install -g npm

ADD ./notifications-api /app

WORKDIR /app

RUN npm install
RUN npm run build

FROM node:19-bullseye-slim as target

ADD ./notifications-api /app
WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build

CMD ["node", "/app/build/main.js"]
