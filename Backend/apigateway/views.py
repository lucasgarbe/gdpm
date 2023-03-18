from storage.models import GDPM_Model, Discrete, Continuous, PortSpecification
from rest_framework import viewsets, views, response
from .serializers import GDPMModelSerializer, DiscreteSerializer, ContinuousSerializer, DistributionSerializer
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema


class GDPM_ModelViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('title')
    serializer_class = GDPMModelSerializer


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
        print(len(discrete))
        print(len(continuous))
        serializer = DistributionSerializer({'discrete': discrete, 'continuous': continuous})
        return Response(serializer.data)


class DownloadViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('title')
    serializer_class = GDPMModelSerializer
    http_method_names = ['get']


class SwaggerView(views.APIView):
    @swagger_auto_schema(
        request_body=SwaggerRequestSerializer,
        responses={
            200: SwaggerResponseSerializer(),
            400: "Bad Request",
        },
        operation_summary="Summary of the operation",
        operation_description="Description of the operation",
    )
    def post(self, request):
        serializer = SwaggerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data["name"]
        message = f"Hello, {name}!"
        response_data = SwaggerResponseSerializer({"message": message}).data
        return response.Response(response_data)
