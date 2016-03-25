FROM iron/node

RUN mkdir client
COPY client client/

RUN mkdir common
COPY client common/

COPY iron.json ./

WORKDIR /app
ADD . /app

ENTRYPOINT ["node", "translate_worker.js"]