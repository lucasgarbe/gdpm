from rest_framework import serializers
from storage.models import GDPM_Model, Continuous, Discrete, PortSpecification, Support


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
    distType = serializers.CharField(source='distType.name', allow_null=True)
    input = PortSpecificationSerializer(many=True)
    output = SupportSerializer(many=False)

    class Meta:
        model = Discrete
        fields = ('distType', 'name', 'url', 'image_url', 'input', 'output')


class ContinuousSerializer(serializers.ModelSerializer):
    distType = serializers.CharField(source='distType.name', allow_null=True)
    input = PortSpecificationSerializer(many=True)
    output = SupportSerializer(many=False)

    class Meta:
        model = Continuous
        fields = ('distType', 'name', 'url', 'image_url', 'input', 'output')


class DistributionSerializer(serializers.Serializer):
    discrete = DiscreteSerializer()
    continuous = ContinuousSerializer()

    class Meta:
        fields = '__all__'

