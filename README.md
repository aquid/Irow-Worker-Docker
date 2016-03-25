### Irow-Worker-Docker

A simple worker file for IronWorker which translate a messeage sent in english to spanish.The project code is written in `nodejs` with `StrongLoop Framework`.

### Docker
This project uses [Docker](https://www.docker.com/) for building and packaging the code and uploading it to [IronWorker](https://www.iron.io/platform/ironworker/). To understand more about using Docker with nodejs you can take a look at this [Repo](https://github.com/iron-io/dockerworker/tree/master/node)

To run this project you need to create a `iron.json` file in the root directory and provide following details in it

```
{
  "project_id": "IronWorker project id",
  "token": "IronWorker token"
}
```

The worker main code is present in `translate_worker.js` file. Once a task is queued to the worker it attemps to fetch all the params sent and tries make a request to google translate api for translating english text into spanish. Once translation is complete it sends the converted messages back to the server(`loopback server`) using [loopback remote connector](https://docs.strongloop.com/display/public/LB/Remote+connector).

To test the data locally you can download the code create a `payload.json` file in the root directory and use the command

```
docker run --rm -e "PAYLOAD_FILE=payload.json" -v "$PWD":/worker -w /worker iron/node node translate_worker.js
```
