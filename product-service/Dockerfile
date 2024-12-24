FROM node:alpine

RUN addgroup -g 1001 product-service
RUN adduser -D -u 1001 -G product-service my-user

WORKDIR /app

COPY package*.json ./

RUN chown -R my-user:product-service /app

USER my-user

RUN npx yarn install

COPY --chown=my-user:product-service . .

CMD [ "npx",  "yarn" , "start:dev" ]