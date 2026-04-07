# Last Node Image
FROM node:24-alpine

WORKDIR /app

# evita prompt do corepack
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# ativa corepack e instala pnpm
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# opcional (se precisar git)
RUN apk update && apk add git

CMD [ "sh", "-c", "while sleep 1000; do :; done" ]
