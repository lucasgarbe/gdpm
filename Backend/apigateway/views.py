from storage.models import GDPM_Model, Discrete, Continuous, PortSpecification
from rest_framework import viewsets
from .serializers import GDPMModelSerializer, DiscreteSerializer, ContinuousSerializer
from rest_framework.response import Response
from converter.pymc_converter import convert_model
from converter import utils
from django.http import FileResponse
from io import BytesIO


# In the Django Rest Framework, a ViewSet is a class that provides CRUD (Create, Retrieve, Update, Delete) operations
# for a specific resource or model. It also provides a default routing mechanism for mapping URLs to actions.
# For more information please see: www.django-rest-framework.org/api-guide/viewsets/

# ModelViewSet is a subclass of ViewSet. It is designed to work with Django models and provides a lot of built-in
# functionality for handling common operations as well as a shorthand way of creating viewsets for Django model
# instances.


class GDPM_ModelViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('id')
    serializer_class = GDPMModelSerializer


class DownloadViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('title')
    serializer_class = GDPMModelSerializer
    http_method_names = ['get']


class DiscreteViewSet(viewsets.ModelViewSet):
    queryset = Discrete.objects.all()
    serializer_class = DiscreteSerializer
    http_method_names = ['get']


class ContinuousViewSet(viewsets.ModelViewSet):
    queryset = Continuous.objects.all().order_by('name')
    serializer_class = ContinuousSerializer
    http_method_names = ['get']


class PymcViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all()
    serializer_class = GDPMModelSerializer
    lookup_field = 'id'
    http_method_names = ['get']

    def retrieve(self, request, *args, **kwargs):
        model_instance = self.get_object()
        pymc_code = convert_model(model_instance.body)

        byte_io = BytesIO()
        byte_io.write(pymc_code.encode('utf-8'))
        byte_io.seek(0)

        print(request.path)
        print(self)
        filename = str(model_instance.id) + '.py'

        response = FileResponse(
            byte_io,
            as_attachment=True,
            filename=filename)

        return response


class IpynbViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all()
    serializer_class = GDPMModelSerializer
    lookup_field = 'id'
    http_method_names = ['get']

    def retrieve(self, request, *args, **kwargs):
        model_instance = self.get_object()
        pymc_code = utils.to_ipynb(convert_model(model_instance.body))
        return Response(pymc_code)
