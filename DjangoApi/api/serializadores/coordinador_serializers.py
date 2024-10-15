from rest_framework import serializers

from api.models import Resolucion

class CoordinadorValorHoraAyudantiaSerializer(serializers.ModelSerializer): # Serializer el valor de la hora de ayudantías
    class Meta:
        model = Resolucion
        fields = ['id', 'precio']

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'precio': instance.precio,
        }
