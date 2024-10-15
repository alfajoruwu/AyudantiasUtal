from rest_framework import serializers

from api.models import Resolucion


class ResolucionesCoordinadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resolucion
        fields = "__all__"
