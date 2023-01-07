# syntax=docker/dockerfile:1
FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN mkdir /code
WORKDIR /code
ADD . /code

COPY requirements.txt /code/
RUN pip install -r requirements.txt

COPY ./docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]
