#!/bin/sh

# Apply database migrations
echo "Apply database migrations"
python manage.py makemigrations --settings=settings.development
python manage.py migrate --settings=settings.development

# Collect static files
echo "Collect static files"
python manage.py collectstatic --settings=settings.development --noinput

#load data into db
python manage.py loaddata portspecs.json discrete_distributions.json continuous_distributions.json

# Start server
echo "Starting server"
#Uncomment for production
#python manage.py runserver 127.0.0.1:8081 --settings=settings.production

python manage.py runserver 0.0.0.0:8000 --settings=settings.development
