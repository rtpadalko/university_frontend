import random
import uuid

from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .permissions import *
from .redis import session_storage
from .serializers import *
from .utils import identity_user, get_session


def get_draft_applicant(request):
    user = identity_user(request)

    if user is None:
        return None

    applicant = Applicant.objects.filter(owner=user).filter(status=1).first()

    return applicant


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'specialization_name',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        )
    ]
)
@api_view(["GET"])
def search_specializations(request):
    specialization_name = request.GET.get("specialization_name", "")

    specializations = Specialization.objects.filter(status=1)

    if specialization_name:
        specializations = specializations.filter(name__icontains=specialization_name)

    serializer = SpecializationsSerializer(specializations, many=True)

    draft_applicant = get_draft_applicant(request)

    resp = {
        "specializations": serializer.data,
        "specializations_count": SpecializationApplicant.objects.filter(applicant=draft_applicant).count() if draft_applicant else None,
        "draft_applicant_id": draft_applicant.pk if draft_applicant else None
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
@permission_classes([IsModerator])
def update_specialization(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)

    serializer = SpecializationSerializer(specialization, data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsModerator])
def create_specialization(request):
    serializer = SpecializationSerializer(data=request.data, partial=False)

    serializer.is_valid(raise_exception=True)

    Specialization.objects.create(**serializer.validated_data)

    specializations = Specialization.objects.filter(status=1)
    serializer = SpecializationSerializer(specializations, many=True)

    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsModerator])
def delete_specialization(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)
    specialization.status = 2
    specialization.save()

    specialization = Specialization.objects.filter(status=1)
    serializer = SpecializationSerializer(specialization, many=True)

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_specialization_to_applicant(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)

    draft_applicant = get_draft_applicant(request)

    if draft_applicant is None:
        draft_applicant = Applicant.objects.create()
        draft_applicant.date_created = timezone.now()
        draft_applicant.owner = identity_user(request)
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
@permission_classes([IsModerator])
def update_specialization_image(request, specialization_id):
    if not Specialization.objects.filter(pk=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    specialization = Specialization.objects.get(pk=specialization_id)

    image = request.data.get("image")

    if image is None:
        return Response(status.HTTP_400_BAD_REQUEST)

    specialization.image = image
    specialization.save()

    serializer = SpecializationSerializer(specialization)

    return Response(serializer.data)


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'status',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            'date_formation_start',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        ),
        openapi.Parameter(
            'date_formation_end',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        )
    ]
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_applicants(request):
    status_id = int(request.GET.get("status", 0))
    date_formation_start = request.GET.get("date_formation_start")
    date_formation_end = request.GET.get("date_formation_end")

    applicants = Applicant.objects.exclude(status__in=[1, 5])

    user = identity_user(request)
    if not user.is_superuser:
        applicants = applicants.filter(owner=user)

    if status_id > 0:
        applicants = applicants.filter(status=status_id)

    if date_formation_start and parse_datetime(date_formation_start):
        applicants = applicants.filter(date_formation__gte=parse_datetime(date_formation_start))

    if date_formation_end and parse_datetime(date_formation_end):
        applicants = applicants.filter(date_formation__lt=parse_datetime(date_formation_end))

    serializer = ApplicantsSerializer(applicants, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_applicant_by_id(request, applicant_id):
    user = identity_user(request)

    if not Applicant.objects.filter(pk=applicant_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)
    serializer = ApplicantSerializer(applicant)

    return Response(serializer.data)


@swagger_auto_schema(method='put', request_body=ApplicantSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_applicant(request, applicant_id):
    user = identity_user(request)

    if not Applicant.objects.filter(pk=applicant_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)
    serializer = ApplicantSerializer(applicant, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_status_user(request, applicant_id):
    user = identity_user(request)

    if not Applicant.objects.filter(pk=applicant_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)

    if applicant.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    applicant.status = 2
    applicant.date_formation = timezone.now()
    applicant.save()

    serializer = ApplicantSerializer(applicant)

    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsModerator])
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

    applicant.status = request_status
    applicant.date_complete = timezone.now()
    applicant.moderator = identity_user(request)
    applicant.save()

    serializer = ApplicantSerializer(applicant)

    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_applicant(request, applicant_id):
    user = identity_user(request)

    if not Applicant.objects.filter(pk=applicant_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    applicant = Applicant.objects.get(pk=applicant_id)

    if applicant.status != 1:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    applicant.status = 5
    applicant.save()

    return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_specialization_from_applicant(request, applicant_id, specialization_id):
    user = identity_user(request)

    if not Applicant.objects.filter(pk=applicant_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not SpecializationApplicant.objects.filter(applicant_id=applicant_id, specialization_id=specialization_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = SpecializationApplicant.objects.get(applicant_id=applicant_id, specialization_id=specialization_id)
    item.delete()

    applicant = Applicant.objects.get(pk=applicant_id)

    serializer = ApplicantSerializer(applicant)
    specializations = serializer.data["specializations"]

    return Response(specializations)


@swagger_auto_schema(method='PUT', request_body=SpecializationApplicantSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_specialization_in_applicant(request, applicant_id, specialization_id):
    user = identity_user(request)

    if not Applicant.objects.filter(pk=applicant_id, owner=user).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not SpecializationApplicant.objects.filter(specialization_id=specialization_id, applicant_id=applicant_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    item = SpecializationApplicant.objects.get(specialization_id=specialization_id, applicant_id=applicant_id)

    serializer = SpecializationApplicantSerializer(item, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@swagger_auto_schema(method='post', request_body=UserLoginSerializer)
@api_view(["POST"])
def login(request):
    user = identity_user(request)

    if user is not None:
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(**serializer.data)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    session_id = str(uuid.uuid4())
    session_storage.set(session_id, user.id)

    serializer = UserSerializer(user)
    response = Response(serializer.data, status=status.HTTP_200_OK)
    response.set_cookie("session_id", session_id, samesite="lax")

    return response


@swagger_auto_schema(method='post', request_body=UserRegisterSerializer)
@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    user = serializer.save()

    session_id = str(uuid.uuid4())
    session_storage.set(session_id, user.id)

    serializer = UserSerializer(user)
    response = Response(serializer.data, status=status.HTTP_201_CREATED)
    response.set_cookie("session_id", session_id, samesite="lax")

    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    session = get_session(request)
    session_storage.delete(session)

    response = Response(status=status.HTTP_200_OK)
    response.delete_cookie('session_id')

    return response


@swagger_auto_schema(method='PUT', request_body=UserProfileSerializer)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    if not User.objects.filter(pk=user_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = identity_user(request)

    if user.pk != user_id:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(status=status.HTTP_409_CONFLICT)

    serializer.save()

    password = request.data.get("password", None)
    if password is not None and not user.check_password(password):
        user.set_password(password)
        user.save()

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'faculty_name',
            openapi.IN_QUERY,
            type=openapi.TYPE_STRING
        )
    ]
)
@api_view(["GET"])
def search_faculties(request):
    faculty_name = request.GET.get("faculty_name", "")

    faculties = Faculty.objects.filter(status=1)

    if faculty_name:
        faculties = faculties.filter(name__icontains=faculty_name)

    serializer = FacultiesSerializer(faculties, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_faculty_by_id(request, faculty_id):
    if not Faculty.objects.filter(pk=faculty_id).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    faculty = Faculty.objects.get(pk=faculty_id)
    serializer = FacultySerializer(faculty)

    return Response(serializer.data)
