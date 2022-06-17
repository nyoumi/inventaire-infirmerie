FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY ["package*.json","./"]
RUN npm install --production --silent
COPY . .
EXPOSE 8080
CMD npm start