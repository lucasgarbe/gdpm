from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'models', views.GDPM_ModelViewSet)
router.register(r'download', views.DownloadViewSet, basename='download')
router.register(r'discrete', views.DiscreteViewSet)
router.register(r'continuous', views.ContinuousViewSet)
router.register(r'distribution', views.DistributionViewSet, basename='distribution')
router.register(r'pymc', views.PymcViewSet, basename='pymc')


urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
