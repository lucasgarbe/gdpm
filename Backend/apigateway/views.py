from storage.models import GDPM_Model, Discrete, Continuous, PortSpecification
from rest_framework import viewsets
from .serializers import GDPMModelSerializer, DiscreteSerializer, ContinuousSerializer, DistributionSerializer
from rest_framework.response import Response
from converter.pymc_converter import convert_model


class GDPM_ModelViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('title')
    serializer_class = GDPMModelSerializer


class DownloadViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('title')
    serializer_class = GDPMModelSerializer
    http_method_names = ['get']


class DiscreteViewSet(viewsets.ModelViewSet):
    queryset = Discrete.objects.all().order_by('name')
    serializer_class = DiscreteSerializer
    http_method_names = ['get']


class ContinuousViewSet(viewsets.ModelViewSet):
    queryset = Continuous.objects.all().order_by('name')
    serializer_class = ContinuousSerializer
    http_method_names = ['get']


class DistributionViewSet(viewsets.ViewSet):

    def list(self, request):
        discrete = Discrete.objects.all().order_by('name')
        continuous = Continuous.objects.all().order_by('name')
        serializer = DistributionSerializer({'discrete': discrete, 'continuous': continuous})
        return Response(serializer.data)


class PymcViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all()
    serializer_class = GDPMModelSerializer
    lookup_field = 'title'
    http_method_names = ['get']

    def retrieve(self, request, *args, **kwargs):
        model_instance = self.get_object()
        pymc_code = convert_model(model_instance.body)
        return Response(pymc_code)
