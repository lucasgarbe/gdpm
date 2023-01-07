import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings.production'
os.environ['SECRET_KEY'] = 'django-insecure-&^z0q55rqn3mm@dk87y9jkx63x1caaxdq9)4^gz1%@9!pmv^x-'
os.environ['DB_USER'] = 'admin'
os.environ['DB_PASSWORD'] = 'admin'

from django.core.wsgi import get_wsgi_application
from django.contrib.staticfiles.handlers import StaticFilesHandler

application = StaticFilesHandler(get_wsgi_application())
