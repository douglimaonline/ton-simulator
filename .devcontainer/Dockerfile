# Last Node Image
FROM node:24-alpine

# Navigate to app
WORKDIR /app

# Activate pnpm
RUN corepack enable

# Add git to container
RUN apk update && apk add git

# Keep the container running
CMD [ "sh", "-c", "while sleep 1000; do :; done" ]

