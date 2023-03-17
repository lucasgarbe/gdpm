from rest_framework import serializers
from storage.models import GDPM_Model, Continuous, Discrete


class GDPMModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GDPM_Model
        fields = '__all__'


class DiscreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discrete
        fields = '__all__'


class ContinuousSerializer(serializers.ModelSerializer):
    class Meta:
        model = Continuous
        fields = '__all__'
