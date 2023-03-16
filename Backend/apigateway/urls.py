from django.urls import path, register_converter, include
from . import converts
from .views import get_model, post_model, put_model, delete_model, get_all_models, get_all_distributions
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'models', views.GDPM_ModelViewSet)

register_converter(converts.FloatUrlParameterConverter, 'float')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('getmodel/<slug:title>/', get_model),
    # path('postmodel/<slug:id>/', post_model),
    # path('putmodel/<slug:id>/', put_model),
    # path('deletemodel/<slug:id>/', delete_model),
    # path('getallmodels/<slug:id>/', get_all_models),
    # path('getalldistributions/<slug:id>/', get_all_distributions),
]
