FROM node:20-bullseye-slim

# Install C++, Python, and Java runtimes needed by the judge
RUN apt-get update && apt-get install -y \
    g++ \
    gcc \
    python3 \
    python3-pip \
    default-jdk \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Temp directory for code execution sandboxing
RUN mkdir -p temp

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
