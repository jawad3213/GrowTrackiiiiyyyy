FROM node:22

# Set working directory
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Clean install and avoid cache issues
RUN rm -rf node_modules && npm install

# Then copy the rest of the files
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
