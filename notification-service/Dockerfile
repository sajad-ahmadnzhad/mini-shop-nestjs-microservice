FROM node:alpine 

RUN addgroup -g 10001 notification_service
RUN adduser -D -u 10001 -G app-user notification_service

WORKDIR /app

COPY package*.json ./

RUN chown -R app-user:notification_service /app

USER app-user

RUN npx yarn install

COPY --chown=app-user:notification_service . .

CMD [ "npx", "yarn" , "start:dev" ]