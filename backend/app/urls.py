from django.urls import path
from .views import *

urlpatterns = [
    # Набор методов для услуг
    path('api/specializations/', search_specializations),  # GET
    path('api/specializations/<int:specialization_id>/', get_specialization_by_id),  # GET
    path('api/specializations/<int:specialization_id>/update/', update_specialization),  # PUT
    path('api/specializations/<int:specialization_id>/update_image/', update_specialization_image),  # POST
    path('api/specializations/<int:specialization_id>/delete/', delete_specialization),  # DELETE
    path('api/specializations/create/', create_specialization),  # POST
    path('api/specializations/<int:specialization_id>/add_to_applicant/', add_specialization_to_applicant),  # POST

    # Набор методов для заявок
    path('api/applicants/', search_applicants),  # GET
    path('api/applicants/<int:applicant_id>/', get_applicant_by_id),  # GET
    path('api/applicants/<int:applicant_id>/update/', update_applicant),  # PUT
    path('api/applicants/<int:applicant_id>/update_status_user/', update_status_user),  # PUT
    path('api/applicants/<int:applicant_id>/update_status_admin/', update_status_admin),  # PUT
    path('api/applicants/<int:applicant_id>/delete/', delete_applicant),  # DELETE

    # Набор методов для м-м
    path('api/applicants/<int:applicant_id>/update_specialization/<int:specialization_id>/', update_specialization_in_applicant),  # PUT
    path('api/applicants/<int:applicant_id>/delete_specialization/<int:specialization_id>/', delete_specialization_from_applicant),  # DELETE

    # Набор методов для аутентификации и авторизации
    path("api/users/register/", register),  # POST
    path("api/users/login/", login),  # POST
    path("api/users/logout/", logout),  # POST
    path("api/users/<int:user_id>/update/", update_user),  # PUT

    # Набор методов факультетов
    path('api/faculties/', search_faculties),  # GET
    path('api/faculties/<int:faculty_id>/', get_faculty_by_id),  # GET
]
