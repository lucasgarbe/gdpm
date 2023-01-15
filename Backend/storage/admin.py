from django.contrib import admin
from .models import Continuous, Discrete, PortSpecification

admin.site.register(Continuous)
admin.site.register(Discrete)
admin.site.register(PortSpecification)
