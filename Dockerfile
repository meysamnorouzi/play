# Build Stage
FROM registry.docker.ir/node:20-alpine AS BUILD_IMAGE
ARG BUILD_ENV
WORKDIR /app
RUN echo $BUILD_ENV
COPY package*.json ./
RUN npm ci --force
COPY . .

# Handle environment file - create empty .env if .env.{BUILD_ENV} doesn't exist
RUN if [ -f .env.${BUILD_ENV} ]; then cp .env.${BUILD_ENV} .env; else echo "Warning: .env.${BUILD_ENV} not found, creating empty .env"; touch .env; fi

RUN npm run build-$BUILD_ENV || (echo "Build failed, checking if dist exists..." && ls -la && exit 1)

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]