from django.forms import ValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response

from api.models import Resolucion
from api.serializadores.resoluciones_serializers import (
    ResolucionesCoordinadorSerializer,
)


class ResolucionesView(viewsets.GenericViewSet):
    def get_serializer_class(self):
        return ResolucionesCoordinadorSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        return Resolucion.objects.all()

    def list(self, request, *args, **kwargs):
        if not request.user.groups.filter(name="Coordinador").exists():
            return Response(
                {"detail": "No tienes permisos para realizar esta acción."},
                status=status.HTTP_403_FORBIDDEN,
            )
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.groups.filter(name="Coordinador").exists():
            return Response(
                {"detail": "No tienes permisos para realizar esta acción."},
                status=status.HTTP_403_FORBIDDEN,
            )
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({"detail": e.message}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        if not request.user.groups.filter(name="Coordinador").exists():
            return Response(
                {"detail": "No tienes permisos para realizar esta acción."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({"detail": e.message}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        if not request.user.groups.filter(name="Coordinador").exists():
            return Response(
                {"detail": "No tienes permisos para realizar esta acción."},
                status=status.HTTP_403_FORBIDDEN,
            )
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
