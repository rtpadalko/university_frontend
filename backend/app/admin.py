from django.contrib import admin

from .models import *

admin.site.register(Specialization)
admin.site.register(Applicant)
admin.site.register(SpecializationApplicant)
