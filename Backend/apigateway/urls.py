from django.urls import path, register_converter, include, re_path
from . import converts
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'models', views.GDPM_ModelViewSet)
router.register(r'discrete', views.DiscreteViewSet)
router.register(r'continuous', views.ContinuousViewSet)
router.register(r'distribution', views.DistributionViewSet, basename='distribution')
router.register(r'download', views.DownloadViewSet)

register_converter(converts.FloatUrlParameterConverter, 'float')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
