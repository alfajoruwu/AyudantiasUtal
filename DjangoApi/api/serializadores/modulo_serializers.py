from rest_framework import serializers

from api.models import Modulo


class ModuloSerializers(serializers.ModelSerializer):
    class Meta:
        model = Modulo
        fields = "__all__"

    def to_representation(self, instance):
        if instance.profesor_asignado is None:
            profesor_asignado = "No asignado"
        else:
            profesor_asignado = instance.profesor_asignado.nombre_completo
        return {
            "id": instance.id,
            "nombre": instance.__str__(),
            "horas_asignadas": instance.horas_asignadas,
            "semestre": instance.semestre,
            "anio": instance.anio,
            "profesor_asignado": profesor_asignado,
            "carrera": instance.carrera,
            "solicitud_horas": instance.solicitud_horas,
            "historial": instance.historial,
        }
