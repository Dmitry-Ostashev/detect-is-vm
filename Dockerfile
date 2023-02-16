FROM node:18 as base
WORKDIR /app
COPY ["./", "./"]
RUN npm install
ENTRYPOINT [ "node", "test.js"]