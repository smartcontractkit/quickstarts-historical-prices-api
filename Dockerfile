FROM node:18

COPY . /opt/chainlink-api

WORKDIR /opt/chainlink-api

RUN yarn install 

RUN yarn build

EXPOSE 3000 

ENTRYPOINT [ "yarn", "start" ]