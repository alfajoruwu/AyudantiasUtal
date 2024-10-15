from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db.models import Sum

from api.models import Postulacion, Oferta, Modulo
from api.serializadores.postulaciones_serializer import (
    PostulacionesProfesorSerializer,
    PostulacionesEstudianteSerializer,
    PostulacionesCoordinadorSerializer,
)


class PostulacionesView(viewsets.GenericViewSet):
    # retorna las postulaciones que ha hecho un estudiante
    # o las postulaciones a las ofertas de un profesor (cantidad de postulantes, etc.)

    def get_serializer_class(self):
        if self.request.user.groups.filter(name="Profesor").exists():
            return PostulacionesProfesorSerializer
        if self.request.user.groups.filter(name="Coordinador").exists():
            return PostulacionesCoordinadorSerializer
        return PostulacionesEstudianteSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        if self.request.user.groups.filter(name="Profesor").exists():
            return Postulacion.objects.filter(
                oferta__modulo__profesor_asignado__run=self.request.user
            )
        if self.request.user.groups.filter(name="Coordinador").exists():
            # retorna todas las postulaciones que pertenecen a una oferta
            postulaciones = Postulacion.objects.none()
            for oferta in Oferta.objects.filter(ayudante__isnull=False):
                postulaciones |= Postulacion.objects.filter(oferta=oferta, estado=True)
            return postulaciones
        else:
            return Postulacion.objects.filter(postulante=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        if request.user.groups.filter(name="Profesor").exists():
            instance = Postulacion.objects.filter(oferta=kwargs["pk"])
            serializer = self.get_serializer(instance, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"detail": "No tienes permisos para realizar esta acción."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def partial_update(self, request, *args, **kwargs):
        if request.user.groups.filter(name="Profesor").exists():
            anio_maximo = Modulo.objects.latest("anio").anio
            semestre_maximo = Modulo.objects.latest("semestre").semestre
            instance = self.get_object()
            nuevo_estado = not instance.estado
            if nuevo_estado is False:
                instance.estado = nuevo_estado
                instance.oferta.ayudante = None
                instance.postulante.save()
                instance.oferta.save()
                instance.save()
                return Response({"estado": instance.estado}, status=status.HTTP_200_OK)

            horas = Oferta.objects.filter(
                ayudante=instance.postulante,
                modulo__anio=anio_maximo,
                modulo__semestre=semestre_maximo,
            ).aggregate(Sum("horas_ayudantia"))["horas_ayudantia__sum"]
            if horas is None:
                horas = 0
            if horas + instance.oferta.horas_ayudantia > 24:
                return Response(
                    {"detail": "Excede el máximo de horas aceptadas (24)."},
                    status=status.HTTP_409_CONFLICT,
                )
            if instance.oferta.ayudante:
                Postulacion.objects.filter(oferta=instance.oferta, estado=True).update(
                    estado=False
                )
                instance.oferta.ayudante.save()

            instance.estado = nuevo_estado
            instance.save()
            instance.postulante.save()
            instance.oferta.ayudante = instance.postulante
            instance.oferta.save()
            return Response({"estado": instance.estado}, status=status.HTTP_200_OK)

        return Response(
            {"detail": "No tienes permisos para realizar esta acción."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def create(self, request, *args, **kwargs):
        if request.user.groups.filter(name="Estudiante").exists():
            promedio_estudiante = (
                request.user.Promedio
            )  # promedio del estudiante con p mayúscula porque el mati trollea
            request.data["promedio"] = promedio_estudiante
            serializer = self.get_serializer(data=request.data)
            try:
                serializer.is_valid(raise_exception=True)
                serializer.save(postulante=request.user)
            except Exception as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            {"detail": "No tienes permisos para realizar esta acción."},
            status=status.HTTP_403_FORBIDDEN,
        )
