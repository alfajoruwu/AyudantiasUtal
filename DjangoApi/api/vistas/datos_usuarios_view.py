from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from api.serializadores.datos_usuarios_serializers import (
    DatosEstudianteSerializer,
    HorasEstudianteSerializer,
    DatosProfesorSerializer,
    NombresProfesorSerializer,
)
from usuarios.models import User


class DatosView(viewsets.GenericViewSet):
    def get_serializer_class(self):
        if self.request is None:
            return DatosEstudianteSerializer
        if self.request.user.groups.filter(name="Profesor").exists():
            return DatosProfesorSerializer
        return DatosEstudianteSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        return User.objects.filter(run=self.request.user.run)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data[0], status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = User.objects.get(run=self.request.user.run)
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class HorasEstudianteView(viewsets.GenericViewSet):
    serializer_class = HorasEstudianteSerializer

    def get_queryset(self):
        return User.objects.filter(run=self.request.user.run)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data[0])

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class NombresProfesorView(viewsets.GenericViewSet):
    serializer_class = NombresProfesorSerializer

    def get_queryset(self):
        return User.objects.filter(groups__name="Profesor")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class TipoUsuarioView(viewsets.GenericViewSet):
    def get_queryset(self):
        return User.objects.filter(run=self.request.user.run)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        print("tipo", queryset.first().groups.first().name)
        return Response(
            {"tipo": queryset.first().groups.first().name}, status=status.HTTP_200_OK
        )
