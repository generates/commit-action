FROM ianwalter/pnpm:v1.1.0

RUN mkdir /opt/commit-action && cd /opt/commit-action

COPY pnpm-lock.yaml .
COPY package.json .
RUN pnpm i

COPY index.js .

CMD ["node", "/opt/commit-action"]
