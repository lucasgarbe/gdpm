from rest_framework import serializers
from storage.models import GDPM_Model, Job
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Serializers are used to convert complex data types, such as Django model instances or complex Python data
# structures, into JSON, XML, or other content types that can be easily rendered into HTTP responses.
# For more information please see: https://www.django-rest-framework.org/api-guide/serializers/

# ModelSerializer is a subclass of Serializer that provides a shorthand way of creating serializers for Django model
# instances.
class GDPMModelSerializer(serializers.ModelSerializer):
    jobs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = GDPM_Model
        fields = ['id', 'title', 'jobs', 'owner', 'body']


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    gdpm_models = serializers.PrimaryKeyRelatedField(many=True, queryset=GDPM_Model.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'gdpm_models']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token
