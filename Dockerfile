FROM node:15-buster

RUN mkdir -p /opt/commit-action

COPY yarn.lock /opt/commit-action
COPY package.json /opt/commit-action
RUN cd /opt/commit-action && yarn && cd $HOME

COPY index.js /opt/commit-action

CMD ["node", "/opt/commit-action"]
