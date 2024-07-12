from rest_framework import serializers
from storage.models import GDPM_Model, Job


# Serializers are used to convert complex data types, such as Django model instances or complex Python data
# structures, into JSON, XML, or other content types that can be easily rendered into HTTP responses.
# For more information please see: https://www.django-rest-framework.org/api-guide/serializers/

# ModelSerializer is a subclass of Serializer that provides a shorthand way of creating serializers for Django model
# instances.
class GDPMModelSerializer(serializers.ModelSerializer):
    jobs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = GDPM_Model
        fields = ['id', 'title', 'jobs']


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
