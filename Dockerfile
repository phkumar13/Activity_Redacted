# Install Dependencies
FROM testlabacr.azurecr.io/node:18.14.2-buster-slim as deps
WORKDIR /app
COPY --chown=node:node . .
USER node
RUN yarn install --frozen-lockfile

# Build
FROM testlabacr.azurecr.io/node:18.14.2-buster-slim as build
WORKDIR /app
USER node
COPY --from=deps --chown=node:node /app /app
ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn compile

# Prepare Runtime
FROM testlabacr.azurecr.io/node:18.14.2-buster-slim as runtime
LABEL name="activity-ms"
LABEL maintainer="Test Onbrdng Lab"
WORKDIR /app
USER node
COPY --from=deps --chown=node:node /app/secrets /app/secrets
COPY --from=deps --chown=node:node /app/package.json /app/package.json
COPY --from=deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/dist /app/dist
ENV NODE_ENV=production
EXPOSE 8085
CMD ["yarn", "start:int"]