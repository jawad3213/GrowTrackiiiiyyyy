FROM node:22

WORKDIR /app

COPY package*.json ./

# Clean install and avoid Rollup native module issues
RUN rm -rf node_modules package-lock.json && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
