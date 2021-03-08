FROM ianwalter/pnpm:v1.4.0

RUN mkdir -p /opt/commit-action

COPY pnpm-lock.yaml /opt/commit-action
COPY package.json /opt/commit-action
RUN cd /opt/commit-action && pnpm i && cd $HOME

COPY index.js /opt/commit-action

CMD ["node", "/opt/commit-action"]
