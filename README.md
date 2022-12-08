# GDPM

## Getting Started

### Local Development

How to run the service

```bash
git clone Projektstudium-HTW-WiSe2022-23/gdpm

docker-compose up
```

Open [http://localhost:8081](http://localhost:3000) with your browser to see the result.

### Local Development with Docker

```bash
docker-compose up
```

- docker image is build from `./Dockerfile`
    - installs dependencies in image
    - maps local volume to sync file/directory changes to container
    - internal port 3000 is mapped to 8080

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

### Docker build for production

This should build a smaller image for production.

```bash
docker-compose -f production.docker-compose.yml up --build
```

- docker image is build from `./production.Dockerfile`
    - installs dependencies in image
    - copies `./.next/static/` and `./next/standalone/`
    - runs server with `./next/standalone/server.js`
    - internal port 3000 is mapped to 8080

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
