FROM node:22 AS demo-ui-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build 
WORKDIR /app/dist
EXPOSE 5000
CMD ["node", "index.js"] 