from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from api.serializadores.modulo_serializers import (
    ModuloSerializers,
)
from api.models import Modulo
from datetime import datetime


class ModulosView(viewsets.GenericViewSet):
    def get_serializer_class(self):
        return ModuloSerializers

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        if self.request.user.groups.filter(name="Profesor").exists():
            return Modulo.objects.filter(profesor_asignado__run=self.request.user)
        return Modulo.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        response_data = []

        # Función para calcular el semestre y el año actuales
        def calcular_semestre_y_anio():
            mes_actual = datetime.now().month
            anio_actual = datetime.now().year
            if 1 <= mes_actual <= 6:
                semestre = 1
            else:
                semestre = 2
            return semestre, anio_actual

        if isinstance(data, list):
            for item in data:
                print(item)

                # Calcular el semestre y año actuales
                semestre_actual, anio_actual = calcular_semestre_y_anio()

                modulo_data = {
                    'nombre': item['Curso'],
                    'seccion': item['Seccion'],
                    'horas_asignadas': item['Horas'],
                    'semestre': semestre_actual,
                    'anio': anio_actual,
                    'historial': item['historial'],
                }

                # Si el semestre y año están presentes en el item, usarlos
                if "semestre" in item:
                    modulo_data["semestre"] = item["semestre"]
                if "anio" in item:
                    modulo_data["anio"] = item["anio"]

                existing_modulo = Modulo.objects.filter(
                    nombre=item["Curso"], seccion=item["Seccion"], semestre=modulo_data["semestre"], anio=modulo_data["anio"]
                ).exists()

                if existing_modulo:
                    response_data.append(
                        {
                            "message": f"Módulo {item['Curso']}, {item['Seccion']} ya existe y se ha saltado."
                        }
                    )
                    continue

                serializer = ModuloSerializers(data=modulo_data)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    response_data.append(serializer.data)

        return Response(response_data, status=status.HTTP_200_OK)
    
    #funcion para eliminar un modulo
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
 