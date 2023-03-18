from storage.models import GDPM_Model, Discrete, Continuous
from rest_framework import viewsets
from .serializers import GDPMModelSerializer, DiscreteSerializer, ContinuousSerializer


class GDPM_ModelViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('title')
    serializer_class = GDPMModelSerializer


class DiscreteViewSet(viewsets.ModelViewSet):
    queryset = Discrete.objects.all().order_by('name')
    serializer_class = DiscreteSerializer


class ContinuousViewSet(viewsets.ModelViewSet):
    queryset = Continuous.objects.all().order_by('name')
    serializer_class = ContinuousSerializer
