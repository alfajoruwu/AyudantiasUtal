from rest_framework import serializers

from api.models import Oferta


class OfertasEstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oferta
        exclude = ["ayudante", "resolucion"]

    def to_representation(self, instance):
        req = super().to_representation(instance)
        req["modulo"] = instance.modulo.__str__()
        req["profesor"] = instance.modulo.profesor_asignado.nombre_completo
        return req


class OfertasProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oferta
        fields = "__all__"

    def to_representation(self, instance):
        req = super().to_representation(instance)
        req["modulo"] = instance.modulo.__str__()
        req["postulantes"] = instance.postulacion_set.count()
        req["profesor"] = instance.modulo.profesor_asignado.nombre_completo
        req["año"] = instance.modulo.anio
        req["semestre"] = instance.modulo.semestre
        return req
