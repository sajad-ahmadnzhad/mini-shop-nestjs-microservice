FROM node:alpine

RUN addgroup -g 1001 gateway
RUN adduser -D -u 1001 -G gateway app_user

WORKDIR /app

COPY package*.json ./

RUN chown -R app_user:gateway /app

USER app_user

RUN npx yarn install

COPY --chown=app_user:gateway . .

EXPOSE 4000

CMD [ "npx" , "yarn" , "start:dev" ]