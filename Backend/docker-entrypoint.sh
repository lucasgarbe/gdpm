#!/bin/sh

python manage.py makemigrations --settings=settings.development
python manage.py migrate --settings=settings.development
python manage.py collectstatic --settings=settings.development --noinput
python manage.py runserver 0.0.0.0:8081 --settings=settings.development

#python manage.py runserver 0.0.0.0:8081 --settings=settings.production
