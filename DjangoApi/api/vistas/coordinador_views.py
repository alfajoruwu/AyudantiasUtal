from rest_framework import viewsets
from rest_framework.response import Response

from api.serializadores.coordinador_serializers import CoordinadorValorHoraAyudantiaSerializer
from api.models import Resolucion


class CoordinadorValorHoraAyudantiaView(viewsets.GenericViewSet):
    serializer_class = CoordinadorValorHoraAyudantiaSerializer

    def get_queryset(self):
        return Resolucion.objects.all()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.precio = request.data['precio']
        instance.save()
        return Response({'precio': instance.precio})