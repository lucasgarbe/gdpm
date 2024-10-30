from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.owner == request.user

class IsSelf(permissions.BasePermission):
    """
    Custom permission to only allow users to edit themselves.
    """

    def has_object_permission(self, request, view, obj):
        return obj == request.user

class IsOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class ObjIsPublic(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS and obj.visibility == 'public'

# class IsAdminOrOwner(permissions.BasePermission):
#     """
#     Custom permission to only allow owners of an object to edit it.
#     """

#     def has_permission(self, request, view):
#         if request.user.is_authenticated:
#             return True

#     def has_object_permission(self, request, view, obj):
#         if request.user.is_staff:
#             return True

#         if obj.owner == request.user:
#             return True
