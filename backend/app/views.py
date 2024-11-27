import random

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import *


def get_draft_applicant():
    return Applicant.objects.filter(status=1).first()


def get_user():
    return User.objects.filter(is_superuser=False).first()


def get_moderator():
    return User.objects.filter(is_superuser=True).first()


@api_view(["GET"])
def search_specializations(request):
    specialization_name = request.GET.get("specialization_name", "")

    specializations = Specialization.objects.filter(status=1)

    if specialization_name:
        specializations = specializations.filter(name__icontains=specialization_name)

    serializer = SpecializationsSerializer(specializations, many=True)
    
    draft_applicant = get_draft_applicant()

    resp = {
        "specializations": serializer.data,
        "specializations_count": SpecializationApplicant.objects.filter(applicant=draft_applicant).count() if draft_applicant else None,
        "draft_applicant": draft_applicant.pk if draft_applicant else None
    }

    return Response(resp)


@api_view(["GET"])
def get_specialization_by_id(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)
    serializer = SpecializationSerializer(specialization)

    return Response(serializer.data)


@api_view(["PUT"])
def update_specialization(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)

    serializer = SpecializationSerializer(specialization, data=request.data, partial=True)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def create_specialization(request):
    serializer = SpecializationSerializer(data=request.data, partial=False)

    serializer.is_valid(raise_exception=True)

    Specialization.objects.create(**serializer.validated_data)

    specializations = Specialization.objects.filter(status=1)
    serializer = SpecializationSerializer(specializations, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_specialization(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)
    specialization.status = 2
    specialization.save()

    specializations = Specialization.objects.filter(status=1)
    serializer = SpecializationSerializer(specializations, many=True)

    return Response(serializer.data)


@api_view(["POST"])
def add_specialization_to_applicant(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)

    draft_applicant = get_draft_applicant()

    if draft_applicant is None:
        draft_applicant = Applicant.objects.create()
        draft_applicant.owner = get_user()
        draft_applicant.date_created = timezone.now()
        draft_applicant.save()

    if SpecializationApplicant.objects.filter(applicant=draft_applicant, specialization=specialization).exists():
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
    item = SpecializationApplicant.objects.create()
    item.applicant = draft_applicant
    item.specialization = specialization
    item.save()

    serializer = ApplicantSerializer(draft_applicant)
    return Response(serializer.data["specializations"])


@api_view(["POST"])
def update_specialization_image(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)

    image = request.data.get("image")
    if image is not None:
        specialization.image = image
        specialization.save()

    serializer = SpecializationSerializer(specialization)

    return Response(serializer.data)


@api_view(["GET"])
def search_applicants(request):
    status = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    applicants = Applicant.objects.exclude(status__in=[1, 5])

    if status > 0:
        applicants = applicants.filter(status=status)

    if date_formation_start and parse_datetime(date_formation_start):
        applicants = applicants.filter(date_formation__gte=parse_datetime(date_formation_start))

    if date_formation_end and parse_datetime(date_formation_end):
        applicants = applicants.filter(date_formation__lt=parse_datetime(date_formation_end))

    serializer = ApplicantsSerializer(applicants, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_applicant_by_id(request, applicant_id):
    if not Applicant.objects.filter(pk=applicant_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)
    serializer = ApplicantSerializer(applicant, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_applicant(request, applicant_id):
    if not Applicant.objects.filter(pk=applicant_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)
    serializer = ApplicantSerializer(applicant, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_user(request, applicant_id):
    if not Applicant.objects.filter(pk=applicant_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)

    if applicant.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    applicant.status = 2
    applicant.date_formation = timezone.now()
    applicant.save()

    serializer = ApplicantSerializer(applicant, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
def update_status_admin(request, applicant_id):
    if not Applicant.objects.filter(pk=applicant_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    request_status = int(request.data["status"])

    if request_status not in [3, 4]:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    applicant = Applicant.objects.get(pk=applicant_id)

    if applicant.status != 2:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    if request_status == 3:
        applicant.score = random.randint(200, 310)

    applicant.date_complete = timezone.now()
    applicant.status = request_status
    applicant.moderator = get_moderator()
    applicant.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_applicant(request, applicant_id):
    if not Applicant.objects.filter(pk=applicant_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)

    if applicant.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    applicant.status = 5
    applicant.save()

    serializer = ApplicantSerializer(applicant, many=False)

    return Response(serializer.data)


@api_view(["DELETE"])
def delete_specialization_from_applicant(request, applicant_id, specialization_id):
    if not SpecializationApplicant.objects.filter(applicant_id=applicant_id, specialization_id=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = SpecializationApplicant.objects.get(applicant_id=applicant_id, specialization_id=specialization_id)
    item.delete()

    items = SpecializationApplicant.objects.filter(applicant_id=applicant_id)
    data = [SpecializationItemSerializer(item.specialization, context={"priority": item.priority}).data for item in items]

    return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_specialization_in_applicant(request, applicant_id, specialization_id):
    if not SpecializationApplicant.objects.filter(specialization_id=specialization_id, applicant_id=applicant_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = SpecializationApplicant.objects.get(specialization_id=specialization_id, applicant_id=applicant_id)

    serializer = SpecializationApplicantSerializer(item, data=request.data,  partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    serializer = UserSerializer(user)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = User.objects.get(pk=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    return Response(serializer.data)