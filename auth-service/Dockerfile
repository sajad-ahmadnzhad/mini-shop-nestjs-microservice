FROM node:alpine

RUN addgroup -g 1001 auth_service
RUN adduser -D -u 1001 -G auth_service app_user

WORKDIR /app

COPY package*.json ./

RUN chown -R app_user:auth_service /app

USER app_user
RUN npx yarn install

COPY --chown=app_user:auth_service . .

CMD [ "npx" , "yarn" , "start:dev" ]