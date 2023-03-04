"""
Django settings for gdpm backend (Development)
"""

from .base import *
import mongoengine

mongoengine.connect(host='mongodb://db_model:27017')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&^z0q55rqn3mm@dk87y9jkx63x1caaxdq9)4^gz1%@9!pmv^x-'

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
    'models': {
        'ENGINE': 'djongo',
        'NAME': 'db_mongo_models',
    }

}
