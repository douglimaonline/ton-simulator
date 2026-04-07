# Last Node Image
FROM node:24-alpine

# Navigate to app
WORKDIR /app

# Activate pnpm
RUN corepack enable

# Activate corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Keep the container running
CMD [ "sh", "-c", "while sleep 1000; do :; done" ]

