from rest_framework import serializers
from storage.models import GDPM_Model, Continuous, Discrete, PortSpecification, Support, Job


# Serializers are used to convert complex data types, such as Django model instances or complex Python data
# structures, into JSON, XML, or other content types that can be easily rendered into HTTP responses.
# For more information please see: https://www.django-rest-framework.org/api-guide/serializers/

# ModelSerializer is a subclass of Serializer that provides a shorthand way of creating serializers for Django model
# instances.
class GDPMModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GDPM_Model
        fields = '__all__'


class PortSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortSpecification
        fields = '__all__'


class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = '__all__'


class DiscreteSerializer(serializers.ModelSerializer):
    input = PortSpecificationSerializer(many=True)
    output = SupportSerializer(many=False)

    class Meta:
        model = Discrete
        fields = ('distType', 'name', 'displayName', 'url', 'image_url', 'input', 'output')


class ContinuousSerializer(serializers.ModelSerializer):
    input = PortSpecificationSerializer(many=True)
    output = SupportSerializer(many=False)

    class Meta:
        model = Continuous
        fields = ('distType', 'name', 'displayName', 'url', 'image_url', 'input', 'output')

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
