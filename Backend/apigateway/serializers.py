from rest_framework import serializers
from storage.models import GDPM_Model


# class ModelSerializer(serializers.HyperlinkedModelSerializer):
#   class Meta:
#      model = GDPM_Model
#     fields = ('title', serializers.JSONField())

class ModelSerializer(serializers.ModelSerializer):
    # initialize fields
    class Meta:
        model = GDPM_Model
        fields = '__all__'
