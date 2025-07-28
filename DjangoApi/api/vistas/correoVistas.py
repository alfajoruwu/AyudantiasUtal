# vistas/correoVistas.py

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..utils import enviar_correo  # Importa la función desde utils.py
from ..models import Postulacion, Oferta

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

    @action(detail=False, methods=['post'])
    def notificar_seleccion(self, request, *args, **kwargs):
        """
        Envía correos de notificación cuando se selecciona un ayudante.
        Envía correo de confirmación al seleccionado y de no selección a los demás.
        """
        try:
            oferta_id = request.data.get('oferta_id')
            postulante_seleccionado_id = request.data.get('postulante_id')
            
            if not oferta_id or not postulante_seleccionado_id:
                return Response(
                    {"error": "Se requieren oferta_id y postulante_id"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtener la oferta
            oferta = Oferta.objects.get(id=oferta_id)
            
            # Obtener todas las postulaciones para esta oferta
            postulaciones = Postulacion.objects.filter(oferta=oferta)
            
            # Información del módulo y profesor
            modulo_info = str(oferta.modulo)
            profesor_nombre = oferta.modulo.profesor_asignado.nombre_completo
            
            correos_enviados = 0
            
            for postulacion in postulaciones:
                estudiante = postulacion.postulante
                
                if postulacion.id == int(postulante_seleccionado_id):
                    # Correo de confirmación para el seleccionado
                    asunto = f"¡Felicitaciones! Has sido seleccionado como ayudante - {modulo_info}"
                    mensaje = f"""
Estimado/a {estudiante.nombre_completo},

¡Excelentes noticias! Has sido seleccionado/a como ayudante para el módulo {modulo_info}.

Detalles de la ayudantía:
- Módulo: {modulo_info}
- Profesor: {profesor_nombre}
- Horas semanales: {oferta.horas_ayudantia} horas

El profesor {profesor_nombre} se pondrá en contacto contigo pronto para coordinar los detalles y el inicio de tus funciones como ayudante.

¡Felicitaciones por esta oportunidad y éxito en tu nueva responsabilidad!

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
                else:
                    # Correo para los no seleccionados
                    asunto = f"Resultado de postulación - {modulo_info}"
                    mensaje = f"""
Estimado/a {estudiante.nombre_completo},

Gracias por tu interés en postular como ayudante para el módulo {modulo_info}.

Lamentablemente, en esta ocasión no has sido seleccionado/a para esta posición. El proceso de selección fue muy competitivo y hubo muchos candidatos calificados.

Te animamos a seguir postulando a futuras oportunidades de ayudantías. Tu interés y dedicación son valorados.

¡No te desanimes y sigue esforzándote!

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
                
                # Enviar el correo
                enviar_correo(estudiante.email, asunto, mensaje)
                correos_enviados += 1
            
            return Response({
                "message": f"Notificaciones enviadas exitosamente a {correos_enviados} postulantes",
                "correos_enviados": correos_enviados
            }, status=status.HTTP_200_OK)
            
        except Oferta.DoesNotExist:
            return Response(
                {"error": "Oferta no encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al enviar notificaciones: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
