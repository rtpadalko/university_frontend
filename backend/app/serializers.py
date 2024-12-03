from rest_framework import serializers

from .models import *


class SpecializationsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, specialization):
        if specialization.image:
            return specialization.image.url.replace("minio", "localhost", 1)

        return "http://localhost:9000/images/default.png"

    class Meta:
        model = Specialization
        fields = ("id", "name", "status", "price", "image")


class SpecializationSerializer(SpecializationsSerializer):
    class Meta:
        model = Specialization
        fields = "__all__"


class ApplicantsSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    moderator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Applicant
        fields = "__all__"


class ApplicantSerializer(ApplicantsSerializer):
    specializations = serializers.SerializerMethodField()

    def get_specializations(self, applicant):
        items = SpecializationApplicant.objects.filter(applicant=applicant)
        return [SpecializationItemSerializer(item.specialization, context={"priority": item.priority}).data for item in items]


class SpecializationItemSerializer(SpecializationSerializer):
    priority = serializers.SerializerMethodField()

    def get_priority(self, _):
        return self.context.get("priority")

    class Meta:
        model = Specialization
        fields = ("id", "name", "price", "image", "priority")


class SpecializationApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecializationApplicant
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username')
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)


class UserProfileSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField(required=False)


class FacultiesSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, faculty):
        if faculty.image:
            return faculty.image.url.replace("minio", "localhost", 1)

        return "http://localhost:9000/images/faculties/default.png"

    class Meta:
        model = Faculty
        fields = ("id", "name", "status", "image")


class FacultySerializer(FacultiesSerializer):
    class Meta:
        model = Faculty
        fields = "__all__"