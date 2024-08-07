from storage.models import GDPM_Model, Job
from rest_framework import viewsets, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import GDPMModelSerializer, JobSerializer, UserSerializer
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from converter.pymc_converter import convert_model
from converter import utils
from django.http import FileResponse
from io import BytesIO
import os
import yaml


# In the Django Rest Framework, a ViewSet is a class that provides CRUD (Create, Retrieve, Update, Delete) operations
# for a specific resource or model. It also provides a default routing mechanism for mapping URLs to actions.
# For more information please see: www.django-rest-framework.org/api-guide/viewsets/

# ModelViewSet is a subclass of ViewSet. It is designed to work with Django models and provides a lot of built-in
# functionality for handling common operations as well as a shorthand way of creating viewsets for Django model
# instances.


class GDPM_ModelViewSet(viewsets.ModelViewSet):
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                       IsOwnerOrReadOnly]
    queryset = GDPM_Model.objects.filter(visibility='public').order_by('id')
    serializer_class = GDPMModelSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()

    def destroy(self, request, *args, **kwargs):
        instance = GDPM_Model.objects.get(id=kwargs['pk'])
        if instance.owner == request.user:
            self.perform_destroy(instance)
            return Response("success", status=204)
        else:
            return Response(status=403)

    @action(detail=True, methods=['post'],
            permission_classes=[permissions.IsAuthenticated])
    def duplicate(self, request, pk=None):
        model_instance = self.get_object()
        model_instance.owner = request.user
        model_instance.id = None
        model_instance.save()
        return Response({'id': model_instance.id})


class DiscreteView(APIView):
    def get(self, request):
        with open(os.path.join(os.getcwd(), '..', 'config.yml'), 'r') as stream:
            data_loaded = yaml.safe_load(stream)
            discrete = [d for d in data_loaded['distributions']
                        if d['distType'] == 'discrete']

        return Response(discrete)


class ContinuousView(APIView):
    def get(self, request):
        with open(os.path.join(os.getcwd(), '..', 'config.yml'), 'r') as stream:
            data_loaded = yaml.safe_load(stream)
            continuous = [d for d in data_loaded['distributions'] if d['distType']
                          == 'continuous']

        return Response(continuous)


class ConfigView(APIView):
    def get(self, request):
        with open(os.path.join(os.getcwd(), '..', 'config.yml'), 'r') as stream:
            byte_io = BytesIO()
            byte_io.write(stream.read().encode('utf-8'))
            byte_io.seek(0)
            return FileResponse(byte_io, as_attachment=True,
                                filename='config.yml')

        return Response({'error': 'Could not read config file'})

    def post(self, request):
        with open(os.path.join(os.getcwd(), '..', 'config.yml'), 'w') as stream:
            stream.write(request.data['config'])
        return Response({'success': 'Config file updated'})


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


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = UserSerializer

    @action(detail=True)
    def models(self, request, pk):
        user = request.user
        models = GDPM_Model.objects.filter(owner=user)
        serializer = GDPMModelSerializer(models, many=True)
        return Response(serializer.data)


# class UserList(generics.ListAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer


# class UserDetail(generics.RetrieveAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
