# syntax=docker/dockerfile:1
FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY ./Backend/ ./

RUN pip install -r requirements.txt

RUN chmod u+x ./docker-entrypoint.sh
