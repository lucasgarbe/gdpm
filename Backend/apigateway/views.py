from django.shortcuts import render
from storage.models import GDPM_Model
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import ModelSerializer


class GDPM_ModelViewSet(viewsets.ModelViewSet):
    queryset = GDPM_Model.objects.all().order_by('title')
    serializer_class = ModelSerializer

# def get_all_models(request):
#   pass


# def get_all_distributions(request):
#   pass


# def get_model(request, title=None):
#   message = f'You submitted ID {title}'
#  model = GDPM_Model()
# return HttpResponse(message)


# def post_model(request):
#   if request.method == 'POST':
#      print('Received data:', request.POST['type', 'upper', 'lower', 'upperInclusive', 'lowerInclusive'])
#     Support.objects.create(type=request.POST['type'], upper=request.POST['upper'], lower=request.POST['lower'],
#                           upperInclusive=request.POST['upperInclusive'],
#                          lowerInclusive=request.POST['lowerInclusive'])
# return render(request, 'index.tsx')


# def put_model(self, request):
#   return self.operation(request)


# def delete_model(self, request):
#   return self.operation(request)
