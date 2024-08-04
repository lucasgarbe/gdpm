from rest_framework import serializers
from storage.models import GDPM_Model, Job
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password


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
    gdpm_models = serializers.PrimaryKeyRelatedField(many=True,
                                                     queryset=GDPM_Model.objects.all(),
                                                     required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'gdpm_models']

    def create(self, validated_data):
        print(validated_data)
        password = validated_data.pop('password')

        # if password != repassword:
        #     raise serializers.ValidationError("Passwords do not match")

        user = User.objects.create_user(username=validated_data['username'],
                                        password=password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True,
                                         validators=[validate_password])
    repassword = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ['old_password', 'new_password', 'repassword']

    def validate(self, attrs):
        if attrs['password'] != attrs['repassword']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token
