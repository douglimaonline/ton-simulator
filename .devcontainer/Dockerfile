# Last Node Image
FROM node:24-alpine

# Navigate to app
WORKDIR /app

# Activate pnpm
RUN corepack enable

# Install pnpm
RUN npm install -g pnpm@10.33.0

# Keep the container running
CMD [ "sh", "-c", "while sleep 1000; do :; done" ]

