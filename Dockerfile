FROM node:14.16.0-alpine
ENV NODE_ENV=prod
WORKDIR /daa-api
COPY /package.json /daa-api
COPY /package-lock.json /daa-api
EXPOSE 8000
RUN npm install --production
RUN npm install dotenv -save
COPY . /daa-api
CMD [ "node", "src/index.js" ]
