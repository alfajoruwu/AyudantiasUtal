# vistas/correoVistas.py

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..utils import enviar_correo  # Importa la función desde utils.py

class Correos(viewsets.GenericViewSet):
    permission_classes = []

    @action(detail=False, methods=['get'])
    def enviar(self, request, *args, **kwargs):
        destinatario = 'matias.camilla.dog@gmail.com'
        asunto = 'Verificacion de correo'
        mensaje = 'Este es un mensaje de prueba.'

        try:
            enviar_correo(destinatario, asunto, mensaje)
            return Response({"message": "Correo enviado"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
