from django.contrib import admin
from .models import Continuous, Discrete, PortSpecification, GDPM_Model, Support

admin.site.register(Continuous)
admin.site.register(Discrete)
admin.site.register(PortSpecification)
admin.site.register(GDPM_Model)
admin.site.register(Support)
