from rest_framework.permissions import BasePermission

from app.utils import identity_user


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        user = identity_user(request)

        if user is None:
            return False

        return user.is_active


class IsModerator(BasePermission):
    def has_permission(self, request, view):
        user = identity_user(request)

        if user is None:
            return False

        return user.is_superuser
