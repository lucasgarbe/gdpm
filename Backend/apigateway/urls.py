from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'models', views.GDPM_ModelViewSet)
router.register(r'download', views.DownloadViewSet, basename='download')
router.register(r'discrete', views.DiscreteViewSet)
router.register(r'continuous', views.ContinuousViewSet)
router.register(r'pymc', views.PymcViewSet, basename='pymc')
router.register(r'ipynb', views.IpynbViewSet, basename='ipynb')

"""gdpmdjango URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
