# syntax=docker/dockerfile:1
FROM python:3.10-alpine

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /code

COPY ./ ./
COPY ./docker-entrypoint.sh /docker-entrypoint.sh

RUN pip install -r requirements.txt

RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
