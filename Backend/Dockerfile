# syntax=docker/dockerfile:1
FROM python:3.10-alpine

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /code

COPY ./ ./
COPY ./docker-entrypoint.sh /docker-entrypoint.sh

# install python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# running migrations (with mysql required to execute migration manually)
# RUN python manage.py migrate

RUN chmod +x /code/docker-entrypoint.sh
ENTRYPOINT ["/code/docker-entrypoint.sh"]
