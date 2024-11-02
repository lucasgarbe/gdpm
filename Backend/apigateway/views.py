from storage.models import GDPM_Model, Job
from rest_framework import viewsets, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import (
        GDPMModelSerializer,
        JobSerializer,
        UserSerializer,
        RegisterUserSerializer)
from .permissions import IsOwnerOrReadOnly, IsOwner, ObjIsPublic
from django.contrib.auth.models import User
from converter.pymc_converter import convert_model
from converter import utils
from django.http import FileResponse
from io import BytesIO
import os
import yaml
import logging
from django.http import HttpResponse, JsonResponse
from django.db.models import Q

# In the Django Rest Framework, a ViewSet is a class that provides CRUD (Create, Retrieve, Update, Delete) operations
# for a specific resource or model. It also provides a default routing mechanism for mapping URLs to actions.
# For more information please see: www.django-rest-framework.org/api-guide/viewsets/

# ModelViewSet is a subclass of ViewSet. It is designed to work with Django models and provides a lot of built-in
# functionality for handling common operations as well as a shorthand way of creating viewsets for Django model
# instances.

logger = logging.getLogger(__name__)

class GDPM_ModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser | IsOwner | ObjIsPublic]
    # queryset = GDPM_Model.objects.all()
    serializer_class = GDPMModelSerializer

    def get_queryset(self):
        visibility = self.request.query_params.get('visibility', 'public')
        logger.debug(f"get_queryset action[{self.action}] visibility[{visibility}]")

        if self.request.user.is_authenticated:
            logger.debug(f"request is authenticated")
            if self.request.user.is_staff:
                logger.debug(f"request is staff")
                queryset = GDPM_Model.objects.all().order_by('changed_at').reverse()
                return queryset
            logger.debug(f"request is not staff")

            if visibility == 'private':
                queryset = GDPM_Model.objects.filter(owner=self.request.user).order_by('changed_at').reverse()
                return queryset
            queryset = GDPM_Model.objects.filter(Q(owner=self.request.user) |
                Q(visibility='public')).order_by('changed_at').reverse()
            return queryset
        else:
            logger.debug(f"request is not authenticated")
            queryset = GDPM_Model.objects.filter(visibility='public').order_by('changed_at').reverse()
            return queryset


    # def get_serializer_class(self):
    #     if self.action == 'list':
    #         return GDPMModelSerializer
    #     return GDPMModelSerializer

    # def list(self, request):
    #     logger.debug(f"list {request.user.is_authenticated}")
    #     if request.user.is_authenticated:
    #         queryset = GDPM_Model.objects.filter(
    #             owner=request.user).order_by('id')
    #         serializer = GDPMModelSerializer(queryset, many=True)
    #         return Response(serializer.data)
    #     else:
    #         queryset = GDPM_Model.objects.filter(visibility='public').order_by('id')
    #         serializer = GDPMModelSerializer(queryset, many=True)
    #         return Response(serializer.data)

    # def retrieve(self, request, *args, **kwargs):
    #     logger.debug(f"retrieve {request.user.is_authenticated}")
    #     model_instance = self.get_object()
    #     serializer = GDPMModelSerializer(model_instance)
    #     return Response(serializer.data)

    # def update(self, request, *args, **kwargs):
    #     instance = GDPM_Model.objects.get(id=kwargs['pk'])
    #     serializer = GDPMModelSerializer(instance, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=400)

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)

    # def destroy(self, request, *args, **kwargs):
    #     instance = GDPM_Model.objects.get(id=kwargs['pk'])
    #     instance.delete()
    #     return Response({'success': 'Model deleted'}, status=200)

    @action(detail=True, methods=['get'],
            permission_classes=[permissions.IsAuthenticated])
    def duplicate(self, request, pk=None):
        logger.debug(f"duplicate {request.user.is_authenticated}")
        model_instance = self.get_object()
        logger.debug(f"model_instance {model_instance}")
        model_instance.owner = request.user
        model_instance.title = model_instance.title + ' (copy)'
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
        with open(os.path.join(os.getcwd(),
                               '..',
                               'config.yml'), 'r') as stream:
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
    permission_classes = [IsOwnerOrReadOnly]
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
    serializer_class = RegisterUserSerializer


def headers(request):
    headers = {key: value for key, value in request.headers.items()}
    for i in headers:
        print(i)
    return JsonResponse(headers)
