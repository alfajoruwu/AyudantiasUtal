from rest_framework import serializers
from django.db.models import Sum

from usuarios.models import User
from api.models import Oferta, Modulo


class DatosEstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "nombre_completo",
            "email",
            "otro_contacto",
            "matricula",
            "tipo_cuenta",
            "n_cuenta",
            "banco",
            "n_contacto",
            "riesgo_academico",
            "charla",
            "Promedio",
        ]

    # validar promedio
    def validate_Promedio(self, value):
        if value < 1.0 or value > 7.0:
            raise serializers.ValidationError("El promedio debe estar entre 1.0 y 7.0")
        return value


class HorasEstudianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "run",
        ]

    def to_representation(self, instance):
        anio_maximo = Modulo.objects.latest("anio").anio
        semestre_maximo = Modulo.objects.latest("semestre").semestre
        ret = super().to_representation(instance)
        horas = Oferta.objects.filter(
            ayudante=instance,
            modulo__anio=anio_maximo,
            modulo__semestre=semestre_maximo,
        ).aggregate(Sum("horas_ayudantia"))["horas_ayudantia__sum"]
        if horas is None:
            horas = 0
        ret["horas_aceptadas"] = horas
        return ret


class DatosProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "nombre_completo",
            "email",
            "otro_contacto",
        ]


class NombresProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "run",
            "nombre_completo",
            "email",
        ]
