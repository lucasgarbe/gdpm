from rest_framework import serializers
from storage.models import GDPM_Model


# class ModelSerializer(serializers.HyperlinkedModelSerializer):
#   class Meta:
#      model = GDPM_Model
#     fields = ('title', serializers.JSONField())

class ModelSerializer(serializers.Serializer):
    # initialize fields
    string_data = serializers.CharField()
    json_data = serializers.JSONField()
